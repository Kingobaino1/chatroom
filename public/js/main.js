const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
  outPutRoomName(room);
  outPutUsers(users);
})
socket.on('message', (message) => {
  console.log(message);
  outPutMessage(message)

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.msg.value;
  
  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

const outPutMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
		<p class="text">
      ${message.text}
		</p>
  `;
  chatMessages.appendChild(div);
};

const outPutRoomName = (room) => {
  roomName.innerText = room;
}

const outPutUsers = (users) => {
  userList.innerHTML = `
    ${users.map((user) => {
      return `<li>${user.username}</li>`
    }).join('')}  `
};
