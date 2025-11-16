// utils.js
export const calculateTotal = (...prices) => {
  return prices.reduce((sum, price) => sum + price, 0);
};

export const formatUserInfo = (user) => {
  const { name, email, isActive } = user;
  const status = isActive ? 'Active' : 'Inactive';
  return `Пользователь: ${name} (${email}). Status: ${status}`;
};

export const logAllParams = (...params) => {
  console.log('Все переданные параметры:', params);
  console.log('Количество параметров:', params.length);
};