require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {}

io.on('connection', socket =>{
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
})

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.vwan4.mongodb.net/ommnistack8?retryWrites=true&w=majority`,{
    useNewUrlParser: true
})


app.use((req, res, next) =>{
    req.io = io;
    req.connectedUsers = connectedUsers;
    return next();
})

app.use(cors());
app.use(express.json());
app.use(routes);

var port = process.env.PORT || 8080;
server.listen(port);