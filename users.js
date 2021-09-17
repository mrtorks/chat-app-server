const users = [];
let usersInTheRoom = [];

const addUser = (data) => {
  let { id, name, room } = data;
  userName = name.trim().toLowerCase();
  usersRoom = room.trim().toLowerCase();
  const existingUser = users.find(
    (user) => user.room === usersRoom && user.name === userName
  );

  if (existingUser) {
    return { error: "Username is already taken" };
  }
  const user = { id, userName, usersRoom };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const currUserIndex = users.findIndex((user) => user.id === id);
  return currUserIndex !== -1 ? users.splice(currUserIndex, 1)[0] : null;
  //  if (currUserIndex !== -1) {
  //    return users.splice(currUserIndex, 1)[0];
  //  }
};

const getUser = (id) => {
  const userFound = users.find((user) => user.id === id);
  return userFound;
};

const getUsersInRoom = (room) => {
  usersInTheRoom = users
    .filter((user) => user.usersRoom === room)
    .map((n) => n.userName);
  return usersInTheRoom;
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
