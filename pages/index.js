import Head from "next/head";
import { APPNAME } from "../globals";
import styles from "../styles/index.module.css";
import { useMediaQuery } from "@material-ui/core";
import { useState, useEffect } from "react";
import Chat from "../components/Chat";
import SideBar from "../components/SideBar";
import { motion, AnimatePresence } from "framer-motion";
import useStorage from "../components/useStorage";
import { verify_token, decrypt } from "../components/crypto";
import { search, unique } from "../components/helper";
import SocketContext, {socket} from "../components/Socket";
const io = require("socket.io-client");
const URL = "http://localhost:5000";

let TOKEN;

export default function Index(props){
    const maxWidth = useMediaQuery("(max-width: 679px)");
    const [currUser, setCurrUser] = useState(null);
    const storage = useStorage();
    const [visible,setVisible] = useState(false);
    const [isChatVisible,setChatVisible] = useState(false);
    const [socket,setSocket] = useState();
    const [users,setUsers] = useState([]);
    const [msgs,setMsgs] = useState([]);

    useEffect(()=>{
        let mySocket;
        let temp_token = storage.get("token");
        if(!verify_token(temp_token)){
            window.location.href = "/login";
        }
        else{
            TOKEN = JSON.parse(decrypt(temp_token));
            mySocket = io(URL,{
                transports: ["websocket"],
                query: {
                    email: TOKEN.email
                }
            });

            function join(){
                mySocket.emit("join",{
                    token: TOKEN.token
                })
            }

            function listUsers({users}){
                setUsers(users);
            }

            function listSingleUser({user}){
                setUsers([user]);
            }


            function logout(){
                storage.remove("token");
                window.location.href = "/";
            }
            
            const changeOnlineStatus = (online) => ({email}) => {
                setUsers((oldUsers)=>{
                    let temp = search(oldUsers,email,"email");
                    if(temp){
                        temp.isOnline = online;
                        let newUsers = unique(oldUsers,temp,"email");
                        return newUsers;
                    }
                    return oldUsers;
                });
                setCurrUser((cu)=>{
                    if(cu){
                        if(cu.email === email){
                            let temp = cu;
                            temp.isOnline = true;
                            return temp;
                        }
                    }
                    return cu;
                })
            }

            function appendMsg(msg){
                setMsgs((o)=>[...o,msg]);
                setCurrUser((c)=>{
                    if(c){
                        let temp = c;
                        if(
                            c.email === msg.to ||
                            c.email === msg.from
                        ){
                            temp.isOnline = true;
                            return temp;
                        }
                    }
                    return c;
                });
                setUsers((oldUsers)=>{
                    let temp = search(oldUsers,msg.from,"email");
                    let newUsers;
                    if(temp){
                        temp.recentMessage = msg.msg;
                        newUsers = unique(oldUsers,temp,"email");
                        return newUsers;
                    }
                    else{
                        temp = search(oldUsers,msg.to,"email");
                        if(temp){
                            temp.recentMessage = msg.msg;
                            newUsers = unique(oldUsers,temp,"email");
                            return newUsers;
                        }
                    }
                })
            }

            mySocket.on("connect",join);
            mySocket.on("illegal-access",logout);
            mySocket.on("user-connected",listUsers);
            mySocket.on("user-online",changeOnlineStatus(true));
            mySocket.on("user-offline",changeOnlineStatus(false));
            mySocket.on("receive-msg",appendMsg);
            mySocket.on("result",listSingleUser);
    
            window.socket = socket;
    
            setSocket(mySocket);
            setVisible(true);
        }
        return ()=>{
            if(mySocket){
                mySocket.off("connect",join);
                mySocket.off("illegal-access",logout);
                mySocket.off("user-connected",listUsers);
                mySocket.off("user-online",changeOnlineStatus(true));
                mySocket.off("user-offline",changeOnlineStatus(false));  
                mySocket.off("receive-msg",appendMsg);
                mySocket.off("result",listSingleUser);
                mySocket.close();
            }
        }
    },[props]);

    function goBack(){
        window.history.pushState(null,null,"/");
        setChatVisible(false);
        setMsgs([]);
    }

    function blockUser(user){
        setCurrUser(()=>{
            let temp = user;
            temp.isBlocked = true;
            return temp;
        });
        setUsers((oldUsers)=>{
            let temp = user;
            temp.isBlocked = true;
            let newUsers = unique(oldUsers,temp,"email");
            return newUsers
        })
    }

    function unblockUser(user){
        setCurrUser(()=>{
            let temp = user;
            temp.isBlocked = false;
            return temp;
        });
        setUsers((oldUsers)=>{
            let temp = user;
            temp.isBlocked = false;
            let newUsers = unique(oldUsers,temp,"email");
            return newUsers
        })
    }

    function changeCurrUser(index){
        setCurrUser(users[index]);
        setChatVisible(true);
    }

    function loadInitialChats(msgs){
        setMsgs(msgs);
    }

    function updateMsg(msg){
        setMsgs((o)=>[...o,msg]);
    }

    function Search(term){
        socket.emit("search",{
            term: term,
            token: TOKEN.token
        })
    }
    
    function resetSearch(){
        socket.emit("resetSearch",{
            token: TOKEN.token
        });
    }

    return (
        <>
            <Head>
                <title>{APPNAME}</title>
            </Head>
            {
                visible && (
                    <SocketContext.Provider value={socket}>
                        <div className={styles.cont}>
                            <div className={styles.main}>
                                <AnimatePresence>
                                    {
                                        isChatVisible && maxWidth && (
                                            <motion.div>
                                                <Chat
                                                    user = {currUser}
                                                    mobile={true}
                                                    onBack={goBack}
                                                    key={1}
                                                    token={TOKEN}
                                                    msgs={msgs}
                                                    onSendMsg={updateMsg}
                                                    initialChatLoad={loadInitialChats}
                                                    blockUser={blockUser}
                                                    unblockUser={unblockUser}
                                                />
                                            </motion.div>
                                        )
                                    }
                                    {
                                        maxWidth && (
                                            <motion.div>
                                                <SideBar
                                                    users={users}
                                                    key={2}
                                                    hide={isChatVisible}
                                                    onUserCardClick={changeCurrUser}
                                                    onSearch={Search}
                                                    onReset={resetSearch}
                                                />
                                            </motion.div>
                                        )
                                    }
                                    {
                                        !maxWidth && (
                                            <SideBar
                                                users={users}
                                                onUserCardClick={changeCurrUser}
                                                key={3}
                                                onSearch={Search}
                                                onReset={resetSearch}
                                            />
                                        )
                                    }
                                    {
                                        isChatVisible && !maxWidth && (
                                            <Chat
                                                user = {currUser}
                                                key={4}
                                                token={TOKEN}
                                                initialChatLoad={loadInitialChats}
                                                msgs={msgs}
                                                onSendMsg={updateMsg}
                                                blockUser={blockUser}
                                                unblockUser={unblockUser}
                                            />
                                        )
                                    }
                                </AnimatePresence>
                                
                            </div>
                        </div>
                    </SocketContext.Provider>
                )
            }
            
        </>
    )
}