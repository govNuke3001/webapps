// userFunctions.js
import { fetchUsers, fetchUserById, fetchPostsByUserId } from './api.js';

export async function getActiveUsers() {
  try {
    const users = await fetchUsers();
    return users.filter(user => user.id % 2 === 0);
  } catch (error) {
    console.error('Failed to fetch active users:', error);
    return [];
  }
}

export async function getUserWithPosts(userId) {
  try {
    const [user, posts] = await Promise.all([
      fetchUserById(userId),
      fetchPostsByUserId(userId)
    ]);
    return { ...user, posts };
  } catch (error) {
    console.error(`Failed to fetch user ${userId} with posts:`, error);
    throw error;
  }
}

export async function findUserByEmail(email) {
  try {
    const users = await fetchUsers();
    return users.find(user => user.email === email) || null;
  } catch (error) {
    console.error('Failed to find user by email:', error);
    return null;
  }
}