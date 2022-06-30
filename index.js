const path = require('path')
import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import formatMessage from './utils/messages';
import * as users from './utils/users';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')))
const botName = 'chat-bot'

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = users.userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit('message', formatMessage(botName,'Welcome to our chat app'));

    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chart`));
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: users.getRoomUsers(user.room)
    })
  })

  socket.on('chatMessage', (msg) => {
    const user = users.getCurrentUser(socket.id)
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = users.userLeave(socket.id)
    if(user){
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
      console.log(user.room, user.username)
      io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: users.getRoomUsers(user.room),
    })
    }
  });
});

server.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});
