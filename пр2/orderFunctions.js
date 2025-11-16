// orderFunctions.js
import { orders } from './data.js';

export const getUserOrders = (userId) => {
  return orders.filter(order => order.userId === userId);
};

export const addProductToOrder = (orderId, newProduct) => {
  const order = orders.find(order => order.id === orderId);
  if (!order) return null;
  
  order.products = [...order.products, newProduct];
  return order;
};

export const getOrderSummary = (orderId) => {
  const order = orders.find(order => order.id === orderId);
  if (!order) return null;
  
  const { products, total, status, userId } = order;
  return {
    productsCount: products.length,
    total: `$${total.toFixed(2)}`,
    status: status.toUpperCase(),
    userId
  };
};