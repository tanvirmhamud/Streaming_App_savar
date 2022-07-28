const { Socket } = require("socket.io");

const io = require('socket.io')(3000)



io.on("connect", (socket)=>{
    socket.emit('request', /* … */); // emit an event to the socket
    io.emit('broadcast', /* … */); // emit an event to all connected sockets
    socket.on('reply', () => { /* … */ }); // listen to the event
})



module.exports = io