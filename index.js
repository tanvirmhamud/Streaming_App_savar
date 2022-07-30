const dbconnect = require('./Middleware/mongoos_connect.js')
const useraccount = require('./Api/useraccount.js')
const agora = require('./Api/agora.js')
const express = require('express')
var cors = require('cors')

const app = express()
app.use(cors())
app.use(useraccount)
app.use(agora)






// io.on("connect", (socket)=>{
//     console.log("a user connect")
//     socket.emit('request', /* … */); // emit an event to the socket
//     io.emit('broadcast', /* … */); // emit an event to all connected sockets
//     socket.on('reply', () => { /* … */ }); // listen to the event
// })

app.use(express.json())

// app.listen(4000,()=>{
//   console.log('this server port is ' + 4000)
// })

app.listen()