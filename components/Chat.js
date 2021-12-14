import styles from "../styles/components/Chat.module.css";
import { useState } from "react";
import InfoBox from "./InfoBox";
import ChatBubble from "./ChatBubble";
import Divider from "./Divider";
import { TextField, IconButton, Icon } from "@material-ui/core";
import Profile from "./Profile";

export default function Chat({ msgs, user, onSend, mobile, onBack, chatElemRef, onBlock, onUnBlock }) {
    const [userMsg, setUserMsg] = useState("");
    const [openProfile, setOpenProfile] = useState(false);

    function sendMsg(e){
        e.preventDefault();
        if(userMsg!==""){
            onSend(userMsg);
            setUserMsg("");
        }
    }

    function showProfile(){
        setOpenProfile(true);
    }

    return (
        <>
            <Profile
                data = {user}
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
                        data={user}
                        mobile={mobile}
                        onBack={onBack}
                        onClick={showProfile}
                    />
                    <Divider/>
                    <div className={styles.chats} ref={chatElemRef}>
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