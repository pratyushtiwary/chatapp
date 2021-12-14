import Head from "next/head";
import { APPNAME } from "../globals";
import styles from "../styles/index.module.css";
import { useMediaQuery } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import Chat from "../components/Chat";
import SideBar from "../components/SideBar";
import { motion, AnimatePresence } from "framer-motion";
import useStorage from "../components/useStorage";
import { verify_token, decrypt } from "../components/crypto";
const io = require("socket.io-client");
let socket;
const URL = "https://chatappbackend123.herokuapp.com";

let TOKEN;
let unique = function(arr,newData){
    let newArr = arr.map((e)=>{
        if(e.id === newData.id){
            return newData;
        }
        else{
            return e;
        }
    });
    return newArr;
}
let search = function(arr,email){
    let temp = {};
    let found = 0;
    for(let i=0;i<arr.length;i++){
        if(arr[i].email===email){
            temp = arr[i];
            found = 1;
            break;
        }
    }
    if(found){
        return temp;
    }
    else{
        return -1;
    }
}
export default function Index(){
    const [users, setUsers] = useState([]);
    const chatElem = useRef(null);
    const [isChatVisible,setChatVisible] = useState(false);
    const [msgs,setMsgs] = useState([]);
    const maxWidth = useMediaQuery("(max-width: 679px)");
    const [currUser, setCurrUser] = useState(null);
    const storage = useStorage();
    const [visible,setVisible] = useState(false);
    const [usersLoaded,setUsersLoaded] = useState(false);

    useEffect(()=>{

        const token = storage.get("token");
        if(token===null){
            window.location.href="/login";
        }
        else if(verify_token(token)===false){
            window.location.href="/login";
        }
        else{
            TOKEN = JSON.parse(decrypt(token));
            setVisible(true);
            socket = io(URL,{
                transports: ["websocket"],
                query: {
                    token: TOKEN.token,
                    email: TOKEN.email
                }
            });
            window.socket = socket;
            socket.on("connect",function(){
                socket.emit("join",{
                    token: TOKEN.token
                });
            })
            socket.on("illegal-access",function(){
                socket.destroy();
                storage.remove("token");
                setVisible(false);
                window.location.href = "/login";
            });
            socket.on("user-connected",function(data){
                setUsers([...data.users]);
                setUsersLoaded(true);
            });
            socket.on("load-initial-chat",function(data){
                setMsgs(data.chats);
            });
            socket.on("result",function({user}){
                if(user){
                    setUsers([user]);
                }
                else{
                    setUsers(null);
                }
            });
            
            socket.on("user-blocked",function(data){
                setUsers((u)=>{
                    let temp = search(u,data.blocked);
                    temp.isBlocked = true;
                    const final = unique(u,temp);
                    return [...final]
                });
                setCurrUser((u)=>{
                    if(u.email === data.blocked){
                        let temp = u;
                        temp.isBlocked = true;
                        return temp;
                    }
                })
            })

            socket.on("user-unblocked",function(data){
                setUsers((u)=>{
                    let temp = search(u,data.blocked);
                    temp.isBlocked = false;
                    const final = unique(u,temp);
                    return [...final]
                });
                setCurrUser((u)=>{
                    if(u.email === data.blocked){
                        let temp = u;
                        temp.isBlocked = false;
                        return temp;
                    }
                })
            })
            
        }

        ()=>{
            socket.close();
        }
    },[]);

    useEffect(()=>{
        if(socket){
            function update(data){
                if(currUser){
                    if(currUser.email === data.from){
                        let d = {
                            msg: data.msg,
                            on: data.on,
                            byMe: false,
                        };
                        setMsgs((m)=>[...m,d]);
                    }
                    else if(data.byMe){
                        let d = {
                            msg: data.msg,
                            on: data.on,
                            byMe: true,
                        };
                        setMsgs((m)=>[...m,d]);
                    }
                    else{
                        setUsers((u)=>{
                            let d = data;
                            d.id = u.length;
                            d.recentMessage = data.msg;
                            d.avatar = d.name+".svg";
                            d.email = d.from;
                            let oldUsers = u;
                            let newUsers = []
                            if(oldUsers.length!==2){
                                newUsers = unique(oldUsers,data);
                            }
                            else{
                                newUsers = [d];
                            }
                            return newUsers;
                        });
                    }
                }
                else{
                    if(data.from !== TOKEN.email){
                        setUsers((u)=>{
                            let d = search(u,data.from);
                            if(d!==-1){
                                d.recentMessage = data.msg;
                                let oldUsers = u;
                                let newUsers = []
                                if(oldUsers.length>1){
                                    newUsers = unique(oldUsers,d);
                                }
                                else{
                                    newUsers = [d];
                                }
                                return newUsers;
                            }
                            else{
                                let temp = data;
                                data.email = data.to;
                                data.name = data.name;
                                data.avatar = data.name+".svg";
                                data.recentMessage = data.msg;
                                let newUsers = [...u,temp];
                                return newUsers;
                            }
                        });
                    }
                    else{
                        setUsers((u)=>{
                            let d = search(u,data.to);
                            if(d!==-1){
                                d.recentMessage = data.msg;
                                let oldUsers = u;
                                let newUsers = []
                                if(oldUsers.length>1){
                                    newUsers = unique(oldUsers,d);
                                }
                                else{
                                    newUsers = [d];
                                }
                                return newUsers;
                            }
                            else{
                                let temp = data;
                                data.email = data.to;
                                data.name = data.name;
                                data.avatar = data.name+".svg";
                                data.recentMessage = data.msg;
                                let newUsers = [...u,temp];
                                return newUsers;
                            }
                        });
                    }
                }
            }    
            socket.on("receive-msg",function(data){
                update(data);
            });
        }
    },[currUser]);


    useEffect(()=>{
        if(socket){
            socket.on("user-online", function(data){
                setUsers((u)=>{
                    let user = search(u,data.email);
                    user.isOnline = true;
                    let allUsers = u;
                    allUsers = unique(allUsers,user);
                    return allUsers;
                });
            });
            socket.on("user-offline", function(data){
                setUsers((u)=>{
                    let user = search(u,data.email);
                    user.isOnline = false;
                    let allUsers = u;
                    allUsers = unique(allUsers,user);
                    return allUsers;
                });
            })
        }
    },[socket]);

    useEffect(()=>{
        let chat = chatElem.current;
        if(chat){
            let k = setTimeout(()=>{
                chat.scrollTo(0,chat.scrollHeight);
                clearTimeout(k);
            },500);
        }
    },[msgs]);

    useEffect(()=>{
        const listener = window.addEventListener("popstate",(event)=>{
            if(event.state.index!==undefined){
                setCurrUser(users[event.state.index]);
                setChatVisible(true);
            }
            else{
                setChatVisible(false);
            }
        })

        return () => {
            window.removeEventListener("popstate", listener);
        }

    },[users,usersLoaded]);

    function sendMsg(msg){
        const elem = chatElem.current;
        let newMsg = {};
        const date = new Date();
        const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let finalTime = date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-" + date.getFullYear() + " " + hours + ":"+minutes 
        let newData = currUser;
        newData.recentMessage = msg;
        let newUsers = unique(users,newData)
        newMsg = {
            msg: msg,
            on: finalTime,
            byMe: true
        }
        setMsgs((oldMsgs)=>[...oldMsgs,newMsg]);
        setUsers(newUsers);
        socket.emit("send-msg",{
            to: currUser.email,
            from: TOKEN.email,
            msg: msg,
            token: TOKEN.token
        })
        if(elem){
            let k = setTimeout(()=>{
                elem.scrollTo(0,elem.scrollHeight);
                clearTimeout(k);
            },500);
        }
    }

    function searchUser(term){
        socket.emit("search",{
            term: term,
            token: TOKEN.token
        });
    }

    function resetSearch(){
        socket.emit("resetSearch",{
            token: TOKEN.token
        });
    }

    function changeChat(index){
        setCurrUser(users[index]);
        setMsgs((oldMsgs)=>[...oldMsgs]);
        if(socket){
            socket.emit("fetch-chats",{
                email: users[index].email,
                token: TOKEN.token
            });
        }
        setChatVisible(true);
    }

    function goBack(){
        window.history.pushState(null,null,"/");
        setChatVisible(false);
    }

    function blockUser(){
        if(currUser && socket){
            socket.emit("blockUser",{
                token: TOKEN.token,
                to: currUser.email
            });
        }
    }

    function unblockUser(){
        if(currUser && socket){
            socket.emit("unblockUser",{
                token: TOKEN.token,
                to: currUser.email
            });
        }
    }

    return (
        <>
            <Head>
                <title>{APPNAME}</title>
            </Head>
            {
                visible && (
                    <div className={styles.cont}>
                        <div className={styles.main}>
                            <AnimatePresence>
                                {
                                    isChatVisible && maxWidth && (
                                        <motion.div>
                                            <Chat
                                                msgs = {msgs}
                                                user = {currUser}
                                                onSend = {sendMsg}
                                                mobile={true}
                                                onBack={goBack}
                                                chatElemRef={chatElem}
                                                onBlock={blockUser}
                                                onUnBlock={unblockUser}
                                            />
                                        </motion.div>
                                    )
                                }
                                {
                                    !isChatVisible && maxWidth && (
                                        <motion.div>
                                            <SideBar
                                                users={users}
                                                onUserCardClick = {changeChat}
                                                onSearch={searchUser}
                                                onReset={resetSearch}
                                            />
                                        </motion.div>
                                    )
                                }
                                {
                                    !maxWidth && (
                                        <SideBar
                                            users={users}
                                            onUserCardClick = {changeChat}
                                            onSearch={searchUser}
                                            onReset={resetSearch}
                                        />
                                    )
                                }
                                {
                                    isChatVisible && !maxWidth && (
                                        <Chat
                                            msgs = {msgs}
                                            user = {currUser}
                                            onSend = {sendMsg}
                                            chatElemRef={chatElem}
                                            onBlock={blockUser}
                                            onUnBlock={unblockUser}
                                        />
                                    )
                                }
                            </AnimatePresence>
                            
                        </div>
                    </div>
                )
            }
            
        </>
    )
}