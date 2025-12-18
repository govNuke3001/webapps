
export const sampleReviews = [
  {
    id: '1',
    doctorId: '1',
    userId: 'user1',
    userName: 'Анна Смирнова',
    rating: 5,
    comment: 'Отличный врач, внимательный и профессиональный. Все объяснил доступным языком.',
    date: '2024-01-15',
    visitDate: '2024-01-10',
    likes: 12,
    dislikes: 0,
    isVerified: true,
  },
  {
    id: '2',
    doctorId: '1',
    userId: 'user2',
    userName: 'Игорь Петров',
    rating: 4,
    comment: 'Хороший специалист, но прием начался с задержкой в 20 минут.',
    date: '2024-01-12',
    visitDate: '2024-01-08',
    likes: 8,
    dislikes: 2,
    isVerified: false,
  },
  {
    id: '3',
    doctorId: '2',
    userId: 'user3',
    userName: 'Мария Козлова',
    rating: 5,
    comment: 'Лучший врач! Помог решить проблему, с которой другие не справились.',
    date: '2024-01-10',
    visitDate: '2024-01-05',
    likes: 15,
    dislikes: 0,
    isVerified: true,
  },
  {
    id: '4',
    doctorId: '3',
    userId: 'user4',
    userName: 'Сергей Новиков',
    rating: 3,
    comment: 'Нормальный врач, но слишком дорого для таких услуг.',
    date: '2024-01-08',
    visitDate: '2024-01-03',
    likes: 3,
    dislikes: 1,
    isVerified: false,
  },
];

export const getReviewsByDoctorId = (doctorId, page = 1, limit = 10, sortBy = 'date') => {
  let reviews = sampleReviews.filter(review => review.doctorId === doctorId);
  

  switch (sortBy) {
    case 'rating':
      reviews.sort((a, b) => b.rating - a.rating);
      break;
    case 'date':
    default:
      reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = reviews.slice(start, end);
  
  return {
    reviews: paginated,
    total: reviews.length,
    page,
    totalPages: Math.ceil(reviews.length / limit),
    hasMore: end < reviews.length,
  };
};

export const calculateDoctorRating = (doctorId) => {
  const doctorReviews = sampleReviews.filter(review => review.doctorId === doctorId);
  if (doctorReviews.length === 0) return 0;
  
  const sum = doctorReviews.reduce((total, review) => total + review.rating, 0);
  return (sum / doctorReviews.length).toFixed(1);
};

export const getRatingDistribution = (doctorId) => {
  const distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
  sampleReviews
    .filter(review => review.doctorId === doctorId)
    .forEach(review => {
      distribution[review.rating]++;
    });
  return distribution;
};

export const getTotalReviewsCount = (doctorId) => {
  return sampleReviews.filter(review => review.doctorId === doctorId).length;
};