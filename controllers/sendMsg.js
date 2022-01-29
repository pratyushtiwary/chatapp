const Messages = require("../models/Messages");
const Users = require("../models/Users");
const BlockedUsers = require("../models/BlockedUsers");
const Sequelize = require("sequelize");
const { encrypt } = require("../utils/cipher");

function sendMsg(token, to, msg, clients, socket, onlineUsers, from) {
  const time = new Date();
  const month =
    time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
  const hours = time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
  const minutes =
    time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
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
  Users.findOne({
    attributes: ["id"],
    where: {
      email: to,
    },
    raw: true,
  }).then((c) => {
    if (clients[token.email]) {
      if (clients[token.email].length > 0) {
        if (onlineUsers[from] !== 3) {
          socket.broadcast.emit("user-online", {
            email: token.email,
          });
          onlineUsers[token.email] = 3;
        }
      }
    }
    let to_id = c.id;
    Users.findOne({
      attributes: ["id"],
      where: {
        email: from,
      },
      raw: true,
    }).then((c) => {
      let from_id = c.id;

      BlockedUsers.findOne({
        where: Sequelize.and(
          Sequelize.or({ blockedBy: from_id }, { blockedUser: from_id }),
          Sequelize.or({ blockedBy: to_id }, { blockedUser: to_id })
        ),
      })
        .then((c) => {
          if (!c) {
            Messages.create({
              id: null,
              message: encrypt(msg),
              sentBy: from_id,
              sentTo: to_id,
              forwarded: false,
              forwardedFrom: null,
              read: false,
            })
              .then((c) => {
                console.log(clients);
                if (clients[to]) {
                  clients[to].forEach(function (id) {
                    if (id !== socket.id) {
                      socket.broadcast.to(id).emit("receive-msg", {
                        msg,
                        on: finalTime,
                        from: from,
                        to: to,
                        name: token.username,
                      });
                    }
                  });
                }
                if (clients[from]) {
                  clients[from].forEach(function (id) {
                    if (id != socket.id) {
                      socket.broadcast.to(id).emit("receive-msg", {
                        msg,
                        on: finalTime,
                        byMe: true,
                        from: from,
                        to: to,
                        name: token.username,
                      });
                    }
                  });
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
}

module.exports = sendMsg;
