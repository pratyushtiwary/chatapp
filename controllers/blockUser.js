const BlockedUsers = require("../models/BlockedUsers");
const Users = require("../models/Users");
const { viewToken } = require("../utils/auth");

function blockUser(to, token, socket) {
  const { id } = viewToken(token);

  Users.findOne({
    attributes: ["id"],
    where: {
      email: to,
    },
    raw: true,
  })
    .then((usr) => {
      if (usr) {
        const to_id = usr.id;

        BlockedUsers.create({
          blockedBy: id,
          blockedUser: to_id,
        })
          .then((c) => {
            if (c) {
              socket.emit("user-blocked", {
                blocked: to,
              });
            } else {
              console.log(c);
            }
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

module.exports = blockUser;
