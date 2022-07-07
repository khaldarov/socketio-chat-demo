const path = require("path");
const http = require("http");
const moment = require('moment');
const express = require("express");
const socketio = require("socket.io");
require("dotenv").config();

const ChatMessage = require('./utils/messages');
const Users = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const users = new Users();

io.on('connection', (socket) => {
    console.log('A client is connected', socket.id);

//    emit, sending an event
//    on, listening to an event

    socket.on('joinRoomRequest', ({username, room}) => {
        socket.join(room);

        socket.emit('chatMessage', new ChatMessage(`Welcome ${username}, to this room!`,
            'Chat Bot!',),);

        /*users.push({
            id: socket.id,
            username: username,
            room: room
        });*/
        users.addUser({
            id: socket.id,
            username: username,
            room: room
        });

        io.in(room).emit('roomUsersUpdated', users.getUsers());

        socket.broadcast.to(room).emit('chatMessage', {
            text: `${username} has just joined the room!`,
            username: 'Chat Bot!',
            time: moment().format('h:mm a')
        });
    });

    socket.on('chatMessage', (data) => {
        const {text, username, room} = data;

        io.in(room).emit('chatMessage', {
            text: text,
            username: username,
            time: moment().format('h:mm a')
        });
    });

    socket.on('disconnect', () => {
        console.log('the client has disconnected ');
        const user = users.getUserById(socket.id);

        users.removeUserById(socket.id);

        if (user) {
            io.in(user.room).emit('roomUsersUpdated', users.getUsers());
        }

        io.in(user.room).emit('chatMessage', {
            text: `${user.username} has just left the room!`,
            username: 'Chat Bot!',
            time: moment().format('h:mm a')
        });
    });

});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
