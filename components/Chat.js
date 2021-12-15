import styles from "../styles/components/Chat.module.css";
import { useState, useEffect, useContext, useRef } from "react";
import InfoBox from "./InfoBox";
import ChatBubble from "./ChatBubble";
import Divider from "./Divider";
import { TextField, IconButton, Icon } from "@material-ui/core";
import Profile from "./Profile";
import SocketContext from "./Socket";

export default function Chat({ user, mobile, onBack, token, unblockUser, blockUser, onSendMsg, msgs, initialChatLoad }) {
    const [userMsg, setUserMsg] = useState("");
    const [openProfile, setOpenProfile] = useState(false);
    const socket = useContext(SocketContext);
    const chatElem = useRef(null);
    const [currUser,setCurrUser] = useState(null);

    useEffect(()=>{
        let cE = chatElem.current;
        if(cE){
            cE.scrollTo(0,cE.scrollHeight);
        }    
    },[msgs])

    useEffect(()=>{
        setCurrUser(user);
        function loadChats({chats}){
            initialChatLoad(chats);
        }

        socket.emit("fetch-chats",{
            email: user.email,
            token: token.token
        });

        socket.on("load-initial-chat",loadChats)
        return ()=>{
            socket.off("load-initial-chat",loadChats)
        }
    },[token,socket,user])

    function sendMsg(e){
        e.preventDefault();
        const date = new Date();
        const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let finalTime = date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-" + date.getFullYear() + " " + hours + ":"+minutes     
        if(userMsg!==""){
            if(socket){
                socket.emit("send-msg",{
                    to: user.email,
                    from: token.email,
                    msg: userMsg,
                    token: token.token
                })
            }
            let temp = {
                msg: userMsg,
                on: finalTime,
                byMe: true
            }
            onSendMsg(temp);
            setUserMsg("");
        }
    }

    function onBlock(){
        if(user && socket){
            socket.emit("blockUser",{
                token: token.token,
                to: user.email
            });
            blockUser(user);
        }
    }

    function onUnBlock(){
        if(user && socket){
            socket.emit("unblockUser",{
                token: token.token,
                to: user.email
            });
            unblockUser(user);
        }
    }

    function showProfile(){
        setOpenProfile(true);
    }

    return (
        <>
            <Profile
                data = {currUser}
                open={openProfile}
                onDismiss = {()=>setOpenProfile(false)}
                onBlock={onBlock}
                onUnBlock={onUnBlock}
            />
            <div
                className={styles.chat}
            >
                {
                    !mobile && (
                        <Divider vertical/>
                    )
                }
                <div className={styles.mainChat}>
                    <InfoBox
                        data={currUser||{}}
                        mobile={mobile}
                        onBack={onBack}
                        onClick={showProfile}
                    />
                    <Divider/>
                    <div className={styles.chats} ref={chatElem}>
                        {
                            msgs.map((e,i)=>(
                                <ChatBubble
                                    msg={e.msg}
                                    on={e.on}
                                    byMe={e.byMe}
                                    key={i}
                                    index={i}
                                />
                            ))
                        }
                    </div>
                    <form
                        className={styles.sendMsgForm}
                        onSubmit={sendMsg}
                    >
                        <TextField
                            type="text"
                            placeholder="Type your message..."
                            variant="outlined"
                            className={styles.msgInput}
                            value={userMsg}
                            onChange={(e)=>setUserMsg(e.target.value)}
                        />
                        <IconButton 
                            type="submit"
                            aria-label="Send Message"
                            className={styles.sendMsg}
                        >
                            <Icon>send</Icon>
                        </IconButton>
                    </form>
                </div>
            </div>
        </>
    )
}