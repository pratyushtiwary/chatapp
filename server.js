const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const server = {};

server.port = 8080;

app.use(express.json());

server.app = app;

server.io = io;

io.on("connection",function(socket){
   server.onConnect && server.onConnect(socket);
});

server.init = function(){
   http.listen(server.port, function(){
      console.log('listening on *:' + server.port);
   });
}

module.exports = server;