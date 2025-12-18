import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import ReviewCard from '../components/ReviewCard';

const MyReviewsScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    lastMonth: 0,
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const userReviews = [
        {
          id: '1',
          doctorId: '1',
          doctorName: 'Александр Иванов',
          doctorSpecialty: 'Терапевт',
          rating: 5,
          comment: 'Отличный врач, помог с лечением',
          date: '2024-01-15',
          likes: 5,
          dislikes: 0,
        },
        {
          id: '2',
          doctorId: '2',
          doctorName: 'Мария Петрова',
          doctorSpecialty: 'Кардиолог',
          rating: 4,
          comment: 'Хороший специалист, но долгое ожидание',
          date: '2024-01-10',
          likes: 3,
          dislikes: 1,
        },
      ];
      
      setReviews(userReviews);
      calculateStats(userReviews);
      setLoading(false);
    }, 500);
  };

  const calculateStats = (reviewsList) => {
    const total = reviewsList.length;
    const averageRating = total > 0 
      ? (reviewsList.reduce((sum, review) => sum + review.rating, 0) / total).toFixed(1)
      : 0;
    
    const lastMonth = reviewsList.filter(review => {
      const reviewDate = new Date(review.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return reviewDate > monthAgo;
    }).length;

    setStats({ total, averageRating, lastMonth });
  };

  const handleEditReview = (review) => {
    navigation.navigate('AddEditReview', {
      doctorId: review.doctorId,
      review: review,
      mode: 'edit'
    });
  };

  const handleDeleteReview = (reviewId) => {
    Alert.alert(
      'Удалить отзыв?',
      'Действие необратимо',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            const updatedReviews = reviews.filter(review => review.id !== reviewId);
            setReviews(updatedReviews);
            calculateStats(updatedReviews);
            Alert.alert('Успех', 'Отзыв удален');
          }
        }
      ]
    );
  };

  const handleDoctorPress = (doctorId, doctorName) => {
    navigation.navigate('DoctorDetail', { 
      doctorId,
      doctor: { id: doctorId, name: doctorName }
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2c80ff" />
        <Text style={styles.loading}>Загрузка отзывов...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Мои отзывы</Text>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Всего отзывов</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{stats.averageRating}</Text>
              <Text style={styles.statLabel}>Средняя оценка</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{stats.lastMonth}</Text>
              <Text style={styles.statLabel}>За месяц</Text>
            </View>
          </View>
        </View>

        <View style={styles.reviews}>
          {reviews.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                Ваши отзывы ({reviews.length})
              </Text>
              
              {reviews.map(review => (
                <View key={review.id} style={styles.reviewContainer}>
                  <TouchableOpacity 
                    style={styles.doctorHeader}
                    onPress={() => handleDoctorPress(review.doctorId, review.doctorName)}
                  >
                    <Text style={styles.doctorName}>{review.doctorName}</Text>
                    <Text style={styles.specialty}>{review.doctorSpecialty}</Text>
                    <Text style={styles.link}>👁 Посмотреть врача →</Text>
                  </TouchableOpacity>
                  
                  <ReviewCard
                    review={review}
                    currentUserId="current"
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                    navigation={navigation}
                  />
                </View>
              ))}
            </>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emoji}>📝</Text>
              <Text style={styles.emptyTitle}>Нет отзывов</Text>
              <Text style={styles.emptyText}>
                Оставляйте отзывы о врачах, чтобы помочь другим
              </Text>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('DoctorsList')}
              >
                <Text style={styles.buttonText}>Найти врачей</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scroll: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    marginTop: 14,
    fontSize: 15,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    padding: 18,
    borderRadius: 10,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c80ff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#ddd',
  },
  reviews: {
    flex: 1,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  reviewContainer: {
    marginBottom: 16,
  },
  doctorHeader: {
    backgroundColor: 'white',
    padding: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  doctorName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 13,
    color: '#2c80ff',
    marginBottom: 6,
  },
  link: {
    fontSize: 13,
    color: '#2c80ff',
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 36,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2c80ff',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default MyReviewsScreen;