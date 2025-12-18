export const currentUser = {
  id: 'user123',
  name: 'Иван Иванов',
  email: 'user@example.com',
  phone: '+7 (999) 123-45-67',
  avatar: null,
  registrationDate: '2024-01-01',
  reviewsCount: 5,
  averageRating: 4.2,
  lastLogin: '2024-01-20',
};

export const userReviews = [
  {
    id: 'user_review1',
    doctorId: '1',
    doctorName: 'Александр Иванов',
    doctorSpecialty: 'Терапевт',
    rating: 5,
    comment: 'Отличный врач, помог с лечением простуды. Очень внимательный и профессиональный.',
    date: '2024-01-15',
    visitDate: '2024-01-10',
    likes: 5,
    dislikes: 0,
    isEdited: false,
  },
  {
    id: 'user_review2',
    doctorId: '2',
    doctorName: 'Мария Петрова',
    doctorSpecialty: 'Кардиолог',
    rating: 4,
    comment: 'Хороший специалист, провела полное обследование. Но приём начался с задержкой.',
    date: '2024-01-10',
    visitDate: '2024-01-05',
    likes: 3,
    dislikes: 1,
    isEdited: true,
  },
  {
    id: 'user_review3',
    doctorId: '4',
    doctorName: 'Елена Кузнецова',
    doctorSpecialty: 'Педиатр',
    rating: 5,
    comment: 'Замечательный детский врач! Ребёнок не боится к ней ходить. Всегда всё объясняет.',
    date: '2023-12-28',
    visitDate: '2023-12-25',
    likes: 8,
    dislikes: 0,
    isEdited: false,
  },
];

export const updateUserProfile = (userData) => {
  Object.assign(currentUser, userData);
  return currentUser;
};

export const deleteUserReview = (reviewId) => {
  const index = userReviews.findIndex(review => review.id === reviewId);
  if (index !== -1) {
    userReviews.splice(index, 1);
    currentUser.reviewsCount = userReviews.length;
  }
};

export const getUserStats = () => {
  const total = userReviews.length;
  const averageRating = total > 0 
    ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / total).toFixed(1)
    : 0;
  
  const lastMonth = userReviews.filter(review => {
    const reviewDate = new Date(review.date);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return reviewDate > monthAgo;
  }).length;

  return {
    total,
    averageRating,
    lastMonth,
  };
};