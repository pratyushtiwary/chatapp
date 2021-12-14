const BlockedUsers = require("../models/BlockedUsers");
const Users = require("../models/Users");
const { viewToken } = require("../utils/auth");

function unblockUser(to,token,socket){
    const {id} = viewToken(token);

    Users.findOne({
        attributes: ["id"],
        where: {
            "email": to
        },
        raw: true
    }).then((usr)=>{
        if(usr){
            const to_id = usr.id;
            
            BlockedUsers.destroy({
                where: {
                    blockedBy: id,
                    blockedUser: to_id
                }
            }).then((c)=>{
                if(c){
                    socket.emit("user-unblocked",{
                        blocked: to
                    });
                }
            }).catch((err)=>{
                console.log(err);
            })

        }
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = unblockUser