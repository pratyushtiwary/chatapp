const Messages = require("../models/Messages");
const Users = require("../models/Users");
const Sequelize = require("sequelize");
const { decrypt } = require("../utils/cipher");

function fetchChat(email, from_id, socket, clients, onlineUsers) {
  Users.findOne({
    attributes: ["id"],
    where: {
      email: email,
    },
    raw: true,
  })
    .then((c) => {
      if (from_id === c.id) {
        socket.emit("load-initial-chat", {
          chats: [],
        });
      } else {
        Messages.findAll({
          where: Sequelize.and(
            Sequelize.or({ sentBy: from_id }, { sentTo: from_id }),
            Sequelize.or({ sentTo: c.id }, { sentBy: c.id })
          ),
          raw: true,
        })
          .then((msgs) => {
            let finalMsgs = msgs.map((e) => {
              let time = e.createdAt;
              const month =
                time.getMonth() + 1 > 9
                  ? time.getMonth() + 1
                  : "0" + (time.getMonth() + 1);
              const hours =
                time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
              const minutes =
                time.getMinutes() > 9
                  ? time.getMinutes()
                  : "0" + time.getMinutes();
              let finalTime =
                time.getFullYear() +
                "-" +
                month +
                "-" +
                time.getUTCDate() +
                "T" +
                hours +
                ":" +
                minutes +
                ":00Z";
              if (e.sentBy === from_id) {
                return {
                  msg: decrypt(e.message),
                  on: finalTime,
                  byMe: true,
                };
              }
              return {
                msg: decrypt(e.message),
                on: finalTime,
                byMe: false,
              };
            });
            if (clients[email]) {
              if (clients[email].length > 0) {
                if (!onlineUsers[email]) {
                  socket.broadcast.emit("user-online", {
                    email: email,
                  });
                  onlineUsers[email] = true;
                }
              }
            }
            socket.emit("load-initial-chat", {
              chats: finalMsgs,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = fetchChat;
