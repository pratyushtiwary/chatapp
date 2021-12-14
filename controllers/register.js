const { error, success } = require("../utils/message");
const { exists } = require("../utils");
const { hash_password } = require("../utils/cipher");
const Users = require("../models/Users");

module.exports = function(req,res){
    const params = req.body;
    if(exists(["username","email","password"],params)){
        const { username, email, password } = params;
        if(username.match(/^[0-9A-Za-z\#\!]*$/)){
            Users.create({
                "id": null,
                "username": username,
                "email": email,
                "password": hash_password(password)
            })
            .then((c)=>{
                success(res,"User Created Successfully!")
            })
            .catch((err)=>{
                if(err.original.errno===1062){
                    const msg = err.original.sqlMessage;
                    if(msg.match("username")){
                        error(res,"User with that username already exists!")
                    }
                    else{
                        error(res,"User with that email already exists!")
                    }
                }
                else{
                    error(res,"Internal Server error occured, Try Again after sometime")
                }
            })    
        }
        else{
            error(res,"Invalid Username!");
        }
    }
    else{
        error(res,"Missing params!");
    }
}