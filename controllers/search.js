const Users = require("../models/Users");
const Messages = require("../models/Messages");
const sequelize = require("sequelize");
const { viewToken } = require("../utils/auth");
const { decrypt } = require("../utils/cipher");

function search(term,token,socket){
    const t = viewToken(token);
    const usrId = t.id;
    if(term === t.email){
        socket.emit("result",{
            "user": false
        })
    }
    else{
        Users.findOne({
            attributes: ["id","username","email"],
            where: {
                email: term
            },
            raw: true
        }).then((user)=>{
            if(user){
                Messages.findOne({
                    attributes: ["message"],
                    where: {
                        'sentTo': user.id,
                        'sentBy': usrId
                    },
                    order: [
                        ["id","DESC"]
                    ],
                    raw: true
                }).then((msg)=>{
                    if(msg){
                        let final = {
                            id: user.id,
                            name: user.username,
                            email: user.email,
                            avatar: user.username+".svg",
                            recentMessage: decrypt(msg.message)
                        }
                        socket.emit("result",{
                            "user": final
                        })
                    }
                    else{
                        let final = {
                            id: user.id,
                            name: user.username,
                            email: user.email,
                            avatar: user.username+".svg",
                            recentMessage: ""
                        }
                        socket.emit("result",{
                            "user": final
                        })
                    }
                }).catch((err)=>{
                    let final = {
                        id: user.id,
                        name: user.username,
                        email: user.email,
                        avatar: user.username+".svg",
                        recentMessage: ""
                    }
                    socket.emit("result",{
                        "user": final
                    })
                    console.log(err);
                })
            }
            else{
                socket.emit("result",{
                    "user": false
                })
            }
        }).catch((err)=>{
            socket.emit("result",{
                "user": false
            })
            console.log(err);
        })
    }
}

module.exports = search;