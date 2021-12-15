const Users = require('../models/Users');
const Messages = require('../models/Messages');
const BlockedUsers = require('../models/BlockedUsers');
const Sequelize = require('sequelize');
const sequelize = require('../db');
const Unique = require("../utils/Unique");

async function getUsersList(userId){
    return await new Promise((res,rej)=>{
        let usersList = [];

        function appendList(user){
            usersList.push(user);
        }

        function final(){
            res(usersList);
        }
        allUsers = Unique.init();
        sequelize.query(`
            SELECT
                m.id,
                m."sentBy",
                m."sentTo",
                m."message"
            FROM
                messages m
            INNER JOIN(
                SELECT MAX(id) "id", "sentBy", "sentTo"
                FROM messages 
                WHERE "sentTo" = ${userId} OR "sentBy" = ${userId}
                GROUP BY
                    "sentBy",
                    "sentTo"
                HAVING
                    "sentBy" != ${userId} OR "sentTo" != ${userId}
            ) l
            ON
                m.id = l.id
            ORDER BY
                id
            DESC;
        `,{ 
            type: Sequelize.QueryTypes.SELECT 
        })
        .then((msgs)=>{
            if(msgs){
                msgs.forEach((e,i)=>{
                   allUsers.add([e.sentBy,e.sentTo,e.id,e.message]) 
                })
                let users = allUsers.fetchVals();
                let otherUsers = allUsers.whereNot(userId);
                otherUsers.map((uId,i)=>{
                    Users.findOne({
                        attributes: ["id","username","email"],
                        where: {
                            "id": uId
                        },
                        raw: true
                    }).then((user)=>{
                        if(user){
                            let temp = {
                                id: user.id,
                                name: user.username,
                                email: user.email,
                                avatar: user.username+".svg",
                                recentMessage: users[i][3]
                            }

                            BlockedUsers.findOne({
                                where: {
                                    blockedBy: userId,
                                    blockedUser: user.id
                                }
                            })
                            .then((c)=>{
                                if(c){
                                    temp.isBlocked = true;
                                    appendList(temp);
    
                                    if(i === otherUsers.length-1){
                                        final();
                                    }
                                }
                                else{
                                    temp.isBlocked = false;
                                    appendList(temp);
    
                                    if(i === otherUsers.length-1){
                                        final();
                                    }
                                }
                                
                            }).catch((err)=>{
                                temp.isBlocked = false;
                                appendList(temp);

                                if(i === otherUsers.length-1){
                                    final();
                                }
                                console.log(err);
                            })
                        }
                    }).catch(err=>{
                        console.log(err);
                    })
                })
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    });
}

module.exports = getUsersList;