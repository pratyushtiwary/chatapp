const { error, success } = require('../utils/message');
const { exists } = require("../utils");
const Users = require("../models/Users");
const { verify_password } = require("../utils/cipher");
const { generateToken } = require("../utils/auth");

module.exports = function(req,res){
    const params = req.body;
    if(exists(["email","password"],params)){
        const { email, password } = params;
        Users.findOne({
            attributes: ["password","id","username"],
            where: {
                email: email
            }
        })
        .then((c)=>{
            if(c){
                const userPassword = c.dataValues.password;
                const id = c.dataValues.id;
                const username = c.dataValues.username;
                if(verify_password(password,userPassword)){
                    const token = generateToken({
                        "id": id,
                        "email": email,
                        "username": username
                    });
                    success(res,{
                        token: token
                    });
                }
                else{
                    error(res,"Invalid Password!")
                }
            }
            else{
                error(res,"Invalid email");
            }
        })
        .catch((err)=>{
            console.log(err);
            error(res,"Internal Server error occured, Try Again after sometime")
        })
    }
    else{
        error(res,"Missing Params!");
    }
}