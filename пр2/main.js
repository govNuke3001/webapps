// main.js
import { users, orders } from './data.js';
import { createUser, findUserById, updateUser } from './userFunctions.js';
import { getUserOrders, addProductToOrder, getOrderSummary } from './orderFunctions.js';
import { calculateTotal, formatUserInfo, logAllParams } from './utils.js';

console.log('=== ДЕМОНСТРАЦИЯ РАБОТЫ ВСЕХ ФУНКЦИЙ ===\n');

console.log('1. РАБОТА С ПОЛЬЗОВАТЕЛЯМИ');
console.log('Исходные пользователи:', users);

const newUser = createUser({ name: 'Екатерина', email: 'kate@yandex.ru' });
console.log('\nСоздан новый пользователь:', newUser);

const foundUser = findUserById(2);
console.log('Найден пользователь с ID 2:', foundUser);

const updatedUser = updateUser(1, { name: 'Алиса Петрова', isActive: false });
console.log('Обновлен пользователь с ID 1:', updatedUser);

console.log('\n2. РАБОТА С ЗАКАЗАМИ');

const userOrders = getUserOrders(1);
console.log('Заказы пользователя с ID 1:', userOrders);

const updatedOrder = addProductToOrder(101, 'Карандаш');
console.log('Добавлен товар в заказ 101:', updatedOrder);

const orderSummary = getOrderSummary(103);
console.log('Сводка по заказу 103:', orderSummary);

console.log('\n3. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ');

const total = calculateTotal(10.50, 5.75, 3.25, 15.00);
console.log('Общая сумма (10.50 + 5.75 + 3.25 + 15.00):', total);

const userInfo = formatUserInfo(users[0]);
console.log('Форматированная информация о пользователе:', userInfo);

console.log('\n4. ДЕМОНСТРАЦИЯ REST-ОПЕРАТОРА');
logAllParams('параметр1', 42, true, { key: 'value' }, ['массив']);

console.log('\n=== ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА ===');