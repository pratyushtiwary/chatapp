import styles from "../styles/components/Chat.module.css";
import { useState, useEffect, useContext, useRef } from "react";
import InfoBox from "./InfoBox";
import ChatBubble from "./ChatBubble";
import Divider from "./Divider";
import {
  TextField,
  IconButton,
  Icon,
  CircularProgress,
} from "@material-ui/core";
import Profile from "./Profile";
import SocketContext from "./Socket";

export default function Chat({
  user,
  mobile,
  onBack,
  token,
  unblockUser,
  blockUser,
  onSendMsg,
  msgs,
  initialChatLoad,
}) {
  const [userMsg, setUserMsg] = useState("");
  const [openProfile, setOpenProfile] = useState(false);
  const socket = useContext(SocketContext);
  const chatElem = useRef(null);
  const [currUser, setCurrUser] = useState(null);
  const [beingSend, setBeingSend] = useState(false);

  useEffect(() => {
    let cE = chatElem.current;
    if (cE) {
      cE.scrollTo(0, cE.scrollHeight);
    }
  }, [msgs]);

  useEffect(() => {
    setCurrUser(user);
    function loadChats({ chats }) {
      initialChatLoad(chats);
    }

    socket.emit("fetch-chats", {
      email: user.email,
      token: token.token,
    });

    socket.on("load-initial-chat", loadChats);
    return () => {
      socket.off("load-initial-chat", loadChats);
    };
  }, [token, socket, user]);

  function sendMsg(e) {
    e.preventDefault();
    setBeingSend(true);
    const time = new Date();
    const month =
      time.getUTCMonth() + 1 > 9
        ? time.getUTCMonth() + 1
        : "0" + (time.getUTCMonth() + 1);
    const hours =
      time.getUTCHours() > 9 ? time.getUTCHours() : "0" + time.getUTCHours();
    const day =
      time.getUTCDate() > 9 ? time.getUTCDate() : "0" + time.getUTCDate();
    const minutes =
      time.getUTCMinutes() > 9
        ? time.getUTCMinutes()
        : "0" + time.getUTCMinutes();
    let finalTime =
      time.getFullYear() +
      "-" +
      month +
      "-" +
      day +
      "T" +
      hours +
      ":" +
      minutes +
      ":00Z";
    if (userMsg !== "") {
      if (socket) {
        socket.emit("send-msg", {
          to: user.email,
          from: token.email,
          msg: userMsg,
          token: token.token,
        });
      }

      function genMsg({ sentimentScore }) {
        console.log(finalTime);
        let temp = {
          msg: userMsg,
          on: finalTime,
          byMe: true,
          sentimentScore: sentimentScore,
        };
        onSendMsg(temp);
        setBeingSend(false);
        setUserMsg("");
        socket.off("msg-sentiment", genMsg);
      }

      socket.on("msg-sentiment", genMsg);
    }
  }

  function onBlock() {
    if (user && socket) {
      socket.emit("blockUser", {
        token: token.token,
        to: user.email,
      });
      blockUser(user);
    }
  }

  function onUnBlock() {
    if (user && socket) {
      socket.emit("unblockUser", {
        token: token.token,
        to: user.email,
      });
      unblockUser(user);
    }
  }

  function showProfile() {
    setOpenProfile(true);
  }

  return (
    <>
      <Profile
        data={currUser}
        open={openProfile}
        onDismiss={() => setOpenProfile(false)}
        onBlock={onBlock}
        onUnBlock={onUnBlock}
      />
      <div className={styles.chat}>
        {!mobile && <Divider vertical />}
        <div className={styles.mainChat}>
          <InfoBox
            data={currUser || {}}
            mobile={mobile}
            onBack={onBack}
            onClick={showProfile}
          />
          <Divider />
          <div className={styles.chats} ref={chatElem}>
            {msgs.map((e, i) => (
              <ChatBubble
                msg={e.msg}
                on={e.on}
                byMe={e.byMe}
                key={i}
                index={i}
                sentimentScore={e.sentimentScore}
              />
            ))}
          </div>
          <form className={styles.sendMsgForm} onSubmit={sendMsg}>
            <TextField
              type="text"
              placeholder="Type your message..."
              variant="outlined"
              className={styles.msgInput}
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              disabled={beingSend}
            />
            <div className={styles.sendMsgSec}>
              <IconButton
                type="submit"
                aria-label="Send Message"
                className={
                  styles.sendMsg + " " + (beingSend && styles.beingSend)
                }
                disabled={beingSend}
              >
                <Icon>send</Icon>
              </IconButton>
              {beingSend && (
                <div className={styles.sendMsgProgress}>
                  <CircularProgress
                    size={50}
                    color="primary"
                    className={styles.progress}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
