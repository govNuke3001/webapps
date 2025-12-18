export const testDoctors = [
  {
    id: 'test1',
    name: 'Тест Врач 1',
    specialty: 'Терапевт',
    rating: 4.5,
    experience: 5,
    price: 1500,
    description: 'Тестовый врач для разработки интерфейса.',
    photoUrl: null,
    reviewCount: 10,
  },
  {
    id: 'test2',
    name: 'Тест Врач 2',
    specialty: 'Кардиолог',
    rating: 4.8,
    experience: 8,
    price: 2500,
    description: 'Еще один тестовый врач для проверки функционала.',
    photoUrl: null,
    reviewCount: 15,
  },
];

export const testReviews = [
  {
    id: 'test_review1',
    doctorId: 'test1',
    userId: 'test_user',
    userName: 'Тест Пользователь',
    rating: 5,
    comment: 'Тестовый отзыв для проверки отображения. Врач очень внимательный и профессиональный.',
    date: '2024-01-20',
    visitDate: '2024-01-15',
    likes: 5,
    dislikes: 0,
    isVerified: true,
  },
  {
    id: 'test_review2',
    doctorId: 'test1',
    userId: 'test_user2',
    userName: 'Тест Пользователь 2',
    rating: 4,
    comment: 'Хороший врач, но мог бы быть более внимательным к деталям.',
    date: '2024-01-18',
    visitDate: '2024-01-12',
    likes: 3,
    dislikes: 1,
    isVerified: false,
  },
];

export const testUser = {
  id: 'test_user',
  name: 'Тестовый Пользователь',
  email: 'test@example.com',
  phone: '+7 (999) 123-45-67',
  registrationDate: '2024-01-01',
  reviewsCount: 5,
  averageRating: 4.5,
};

export const testCredentials = [
  {
    email: 'user@example.com',
    password: 'password',
    name: 'Обычный пользователь',
  },
  {
    email: 'doctor@example.com',
    password: 'doctor123',
    name: 'Аккаунт врача',
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Администратор',
  },
];