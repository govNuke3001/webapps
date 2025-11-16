// main.js
import { getActiveUsers, getUserWithPosts, findUserByEmail } from './userFunctions.js';
import { getRecentPosts, getPostsByTitleSearch, getPostsStats } from './orderFunctions.js';
import { simulateLoading, withTimeout, retryOperation } from './utils.js';

async function main() {
  console.log('=== ASYNC OPERATIONS DEMO ===\n');

  try {
    await simulateLoading(1000);

    console.log('\n1. Fetching active users...');
    const activeUsers = await getActiveUsers();
    console.log(`Active users: ${activeUsers.map(u => u.name).join(', ')}`);

    await simulateLoading(500);

    if (activeUsers.length > 0) {
      console.log('\n2. Fetching user with posts...');
      const userWithPosts = await getUserWithPosts(activeUsers[0].id);
      console.log(`User: ${userWithPosts.name}, Posts: ${userWithPosts.posts.length}`);
    }

    console.log('\n3. Parallel data loading...');
    const [posts, stats] = await Promise.all([
      getRecentPosts(3),
      getPostsStats()
    ]);
    console.log('Recent posts:', posts.map(p => p.title));
    console.log('Stats:', stats);

    await simulateLoading(500);

    console.log('\n4. Searching posts...');
    const searchResults = await getPostsByTitleSearch('aut');
    console.log(`Found ${searchResults.length} posts`);

    console.log('\n5. Testing timeout...');
    try {
      const slowRequest = fetch('https://httpstat.us/200?sleep=2000');
      await withTimeout(slowRequest, 1000);
    } catch (err) {
      console.log('Timeout handled:', err.message);
    }

  } catch (error) {
    console.error('Execution failed:', error);
  } finally {
    console.log('\n=== DEMO COMPLETED ===');
  }
}

main();