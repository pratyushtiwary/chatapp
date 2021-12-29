import Head from "next/head";
import { APPNAME } from "../globals";
import styles from "../styles/index.module.css";
import { Typography, useMediaQuery } from "@material-ui/core";
import { useState, useEffect } from "react";
import Chat from "../components/Chat";
import SideBar from "../components/SideBar";
import { motion, AnimatePresence } from "framer-motion";
import useStorage from "../components/useStorage";
import { verify_token, decrypt } from "../components/crypto";
import { search, unique } from "../components/helper";
import MainLoader from "../components/MainLoader";
import ConnectError from "../components/ConnectError";
import SocketContext from "../components/Socket";
const io = require("socket.io-client");
const URL = "https://chatappbackend123.herokuapp.com";

let TOKEN;

export default function Index(props) {
  const maxWidth = useMediaQuery("(max-width: 679px)");
  const [currUser, setCurrUser] = useState(null);
  const storage = useStorage();
  const [visible, setVisible] = useState(false);
  const [isChatVisible, setChatVisible] = useState(false);
  const [socket, setSocket] = useState();
  const [users, setUsers] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mySocket;
    let temp_token = storage.get("token");
    if (!verify_token(temp_token)) {
      window.location.href = "/login";
    } else {
      TOKEN = JSON.parse(decrypt(temp_token));
      mySocket = io(URL, {
        transports: ["websocket"],
        query: {
          email: TOKEN.email,
        },
        ssl: true,
      });

      function connect_error() {
        setError(true);
      }

      function join() {
        mySocket.emit("join", {
          token: TOKEN.token,
        });
        setVisible(true);
        setError(false);
      }

      function listUsers({ users }) {
        setUsers(users);
      }

      function listSingleUser({ user }) {
        if (user) {
          setUsers([user]);
        } else {
          setUsers([undefined]);
        }
      }

      function logout() {
        storage.remove("token");
        window.location.href = "/";
      }

      const changeOnlineStatus =
        (online) =>
        ({ email }) => {
          setUsers((oldUsers) => {
            let temp = search(oldUsers, email, "email");
            if (temp) {
              temp.isOnline = online;
              let newUsers = unique(oldUsers, temp, "email");
              return newUsers;
            }
            return oldUsers;
          });
          setCurrUser((cu) => {
            if (cu) {
              if (cu.email === email) {
                let temp = cu;
                temp.isOnline = true;
                return temp;
              }
            }
            return cu;
          });
        };

      function appendMsg(msg) {
        setMsgs((o) => [...o, msg]);
        setCurrUser((c) => {
          if (c) {
            let temp = c;
            if (c.email === msg.to || c.email === msg.from) {
              temp.isOnline = true;
              return temp;
            }
          }
          return c;
        });
        setUsers((oldUsers) => {
          let temp = search(oldUsers, msg.from, "email");
          let newUsers;
          if (temp) {
            temp.recentMessage = msg.msg;
            newUsers = unique(oldUsers, temp, "email");
            return newUsers;
          } else {
            temp = search(oldUsers, msg.to, "email");
            if (temp) {
              temp.recentMessage = msg.msg;
              newUsers = unique(oldUsers, temp, "email");
              return newUsers;
            } else {
              let usr = {
                avatar: msg.name + ".svg",
                email: msg.from,
                id: 0,
                isBlocked: false,
                name: msg.name,
                recentMessage: msg.msg,
              };
              newUsers = [usr,...oldUsers];
              return [...newUsers];
            }
          }
        });
      }

      mySocket.on("connect", join);
      mySocket.on("connect_error", connect_error);
      mySocket.on("disconnect", connect_error);
      mySocket.on("illegal-access", logout);
      mySocket.on("user-connected", listUsers);
      mySocket.on("user-online", changeOnlineStatus(true));
      mySocket.on("user-offline", changeOnlineStatus(false));
      mySocket.on("receive-msg", appendMsg);
      mySocket.on("result", listSingleUser);

      window.socket = socket;

      setSocket(mySocket);
    }
    return () => {
      if (mySocket) {
        mySocket.off("connect", join);
        mySocket.off("connect_error", connect_error);
        mySocket.off("disconnect", connect_error);
        mySocket.off("illegal-access", logout);
        mySocket.off("user-connected", listUsers);
        mySocket.off("user-online", changeOnlineStatus(true));
        mySocket.off("user-offline", changeOnlineStatus(false));
        mySocket.off("receive-msg", appendMsg);
        mySocket.off("result", listSingleUser);
        mySocket.close();
      }
    };
  }, [props]);

  useEffect(() => {
    let listener = window.addEventListener("popstate", (event) => {
      const { index } = event.state;
      if (index !== undefined) {
        if (users.length > 0) {
          setCurrUser(users[index]);
          setChatVisible(true);
        }
      } else {
        setChatVisible(false);
      }
    });

    return () => {
      window.removeEventListener("popstate", listener);
    };
  }, [users]);

  function goBack() {
    window.history.pushState(null, null, "/");
    setChatVisible(false);
    setMsgs([]);
  }

  function blockUser(user) {
    setCurrUser(() => {
      let temp = user;
      temp.isBlocked = true;
      return temp;
    });
    setUsers((oldUsers) => {
      let temp = user;
      temp.isBlocked = true;
      let newUsers = unique(oldUsers, temp, "email");
      return newUsers;
    });
  }

  function unblockUser(user) {
    setCurrUser(() => {
      let temp = user;
      temp.isBlocked = false;
      return temp;
    });
    setUsers((oldUsers) => {
      let temp = user;
      temp.isBlocked = false;
      let newUsers = unique(oldUsers, temp, "email");
      return newUsers;
    });
  }

  function changeCurrUser(index) {
    setCurrUser(users[index]);
    setChatVisible(true);
  }

  function loadInitialChats(msgs) {
    setMsgs(msgs);
  }

  function updateMsg(msg) {
    setMsgs((o) => [...o, msg]);
  }

  function Search(term) {
    socket.emit("search", {
      term: term,
      token: TOKEN.token,
    });
  }

  function resetSearch() {
    socket.emit("resetSearch", {
      token: TOKEN.token,
    });
  }

  return (
    <>
      <Head>
        <title>{APPNAME}</title>
      </Head>
      <MainLoader open={!visible} />
      <ConnectError shown={error} />
      {visible && (
        <SocketContext.Provider value={socket}>
          <div className={styles.cont}>
            <div className={styles.main}>
              <AnimatePresence>
                {isChatVisible && maxWidth && (
                  <Chat
                    user={currUser}
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
                )}
                {maxWidth && (
                  <SideBar
                    users={users}
                    key={2}
                    hide={isChatVisible}
                    onUserCardClick={changeCurrUser}
                    onSearch={Search}
                    onReset={resetSearch}
                  />
                )}
                {!maxWidth && (
                  <SideBar
                    users={users}
                    onUserCardClick={changeCurrUser}
                    key={3}
                    onSearch={Search}
                    onReset={resetSearch}
                  />
                )}
                {!isChatVisible && users[0] !== undefined && !maxWidth && (
                  <div className={styles.chatInfo} key={5}>
                    <div className={styles.infoCont}>
                      <div className={styles.infoImg}></div>
                      <Typography variant="h5" className={styles.infoTxt}>
                        ◀️ Select a user from left to start chatting
                      </Typography>
                    </div>
                  </div>
                )}
                {isChatVisible && !maxWidth && (
                  <Chat
                    user={currUser}
                    key={4}
                    token={TOKEN}
                    initialChatLoad={loadInitialChats}
                    msgs={msgs}
                    onSendMsg={updateMsg}
                    blockUser={blockUser}
                    unblockUser={unblockUser}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </SocketContext.Provider>
      )}
    </>
  );
}
