// api.js
const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function fetchResource(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export async function fetchUsers() {
  return fetchResource('/users');
}

export async function fetchUserById(id) {
  return fetchResource(`/users/${id}`);
}

export async function fetchPosts() {
  return fetchResource('/posts');
}

export async function fetchPostsByUserId(userId) {
  return fetchResource(`/posts?userId=${userId}`);
}