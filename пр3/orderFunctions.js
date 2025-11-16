// orderFunctions.js
import { fetchPosts, fetchUsers } from './api.js';

export async function getRecentPosts(limit = 5) {
  try {
    const posts = await fetchPosts();
    return posts
      .sort((a, b) => b.id - a.id)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch recent posts:', error);
    return [];
  }
}

export async function getPostsByTitleSearch(searchTerm) {
  try {
    const posts = await fetchPosts();
    const term = searchTerm.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Failed to search posts:', error);
    return [];
  }
}

export async function getPostsStats() {
  try {
    const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);
    return {
      totalPosts: posts.length,
      totalUsers: users.length,
      avgPostsPerUser: (posts.length / users.length).toFixed(2)
    };
  } catch (error) {
    console.error('Failed to get posts stats:', error);
    return {};
  }
}