const db = require('./db');
const server = require('./server');
const login  = require('./controllers/login');
const register  = require('./controllers/register');
const { viewToken, verifyToken } = require("./utils/auth");
const getUsersList = require("./controllers/getUsersList");
const fetchChats = require("./controllers/fetchChats");
const sendMsg = require('./controllers/sendMsg');
const search = require('./controllers/search');
const blockUser = require('./controllers/blockUser');
const unblockUser = require('./controllers/unblockUser');

db.sync()
.then(function(){
    console.log("DB Synced");
     
    server.app.use(function(req, res, next){
      res.append("Access-Control-Allow-Origin","*")
      res.append("Access-Control-Allow-Headers","*")
      next();
    })

    server.app.post("/login",login)
    server.app.post("/register",register)
     
    const clients = {};
    const onlineUsers = {};
     
   server.onConnect = function(socket) {
      let userEmail = socket.handshake.query.email;
      console.log('A user connected');
      socket.isOnline = {};
      socket.on('join', function(data) {
         if(verifyToken(data.token)){
            let {id, email} = viewToken(data.token);
            if(clients[email]) {
               clients[email].push(socket.id);
               clients[email] = new Set(clients[email]);
               clients[email] = new Array(...clients[email]);
            }
            else{
               clients[email] = [socket.id];
            }
            socket.broadcast.emit("user-online",{
               "email": email
            });
            if(!socket.haveUsersList){
               getUsersList(id).then((usersList)=>{
                  socket.emit("user-connected",{
                     "users": usersList
                  });
               }).catch((err)=>console.log(err));
               socket.haveUsersList = true;
            }
            if(!onlineUsers[email]){
               socket.broadcast.emit("user-online",{
                  email: email
               });
               onlineUsers[email] = true
            }
         }
         else{
            socket.emit("illegal-access",{});
         }
      });
   
      socket.on("fetch-chats",function(data){
         const {email,token} = data;
         const from_id = viewToken(token).id;
         onlineUsers[email] = undefined;
         fetchChats(email,from_id, socket, clients, onlineUsers);
      })

      socket.on("send-msg", function(data){
         const {to,from,msg} = data;
         const token = viewToken(data.token);
         sendMsg(token,to,msg,clients,socket,onlineUsers,from);
      });

      socket.on("search", function(data){
         const { term, token } = data;
         search(term,token,socket)
      })

      socket.on("resetSearch",function({token}){
         const {id} = viewToken(token);
         getUsersList(id).then((usersList)=>{
            socket.emit("user-connected",{
               "users": usersList
            });
         }).catch((err)=>{
            console.log(err);
         })
      });

      socket.on("blockUser", function(data){
         const {to,token} = data;
         blockUser(to,token,socket);
      })
      
      socket.on("unblockUser", function(data){
         const {to,token} = data;
         unblockUser(to,token,socket);
      })

      //Whenever someone disconnects this piece of code executed
      socket.on('disconnect', function () {
         let temp = clients[userEmail];
         if(temp){
            temp = temp.filter(function(id) {
               return id != socket.id;
            });
            clients[userEmail] = temp;
            if(temp.length == 0){
               onlineUsers[userEmail] = 0;
               socket.broadcast.emit("user-offline",{
                  "email": userEmail
               })
            }

         }
         console.log('A user disconnected');
      });
   };
   server.init();
})
.catch(function(err){
    console.log(err);
})