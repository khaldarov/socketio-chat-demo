const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

outputRoomName(room);

const socket = io();

socket.emit('joinRoomRequest', {room, username});

socket.on('message', (message) => {
  console.log('A message is received', message);
  outputMessage(message);
  scrollDown();
});

socket.on('roomUsersUpdate', (users) => {
  console.log('roomUsersUpdate', users);
  outputUsers(users);
});

/**
* ? outputUsers(users); // renders the users list [ {username: string} ]
*
* ? outputMessage(message); // renders a message {username: string, text: string, time: string}
 *
 * ? scrollDown() // scroll down when a new message is inserted.
* */

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  /*
  * Implement logic
  * */
  socket.emit('message', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span class="msg-time">${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    li.classList.add('user-li');
    if (user.id === socket.id) {
      li.classList.add('online');
    }
    userList.appendChild(li);
  });
}

function scrollDown() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
