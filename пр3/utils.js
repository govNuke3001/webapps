// utils.js
export function simulateLoading(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Loading completed after ${delay}ms`);
      resolve();
    }, delay);
  });
}

export async function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
  );
  return Promise.race([promise, timeout]);
}

export async function retryOperation(operation, maxRetries = 3) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries) throw error;
      const delay = 1000 * Math.pow(2, i - 1);
      console.log(`Retry ${i} failed, waiting ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}