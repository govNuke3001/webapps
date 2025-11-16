// userFunctions.js
import { users } from './data.js';

export const createUser = ({ name, email, isActive = true }) => {
  const maxId = Math.max(...users.map(user => user.id));
  const newUser = { id: maxId + 1, name, email, isActive };
  users.push(newUser);
  return newUser;
};

export const findUserById = (id) => {
  const user = users.find(user => user.id === id);
  return user ? { name: user.name, email: user.email } : null;
};

export const updateUser = (id, updatedFields) => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) return null;
  
  users[userIndex] = { ...users[userIndex], ...updatedFields };
  return users[userIndex];
};