import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';

const ReviewsScreen = ({ route, navigation }) => {
  const { doctorId, doctorName } = route.params;
  
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(false);
  const [doctorRating, setDoctorRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [doctorId]);

  const loadStats = () => {
    const rating = 4.5;
    const distribution = {5: 12, 4: 8, 3: 3, 2: 1, 1: 1};
    const total = 25;
    
    setDoctorRating(rating);
    setRatingDistribution(distribution);
    setTotalReviews(total);
  };

  const loadReviews = async () => {
    setLoading(true);

    setTimeout(() => {
      const data = [
        {
          id: '1',
          doctorId: doctorId,
          userId: 'user1',
          userName: 'Анна Смирнова',
          rating: 5,
          comment: 'Отличный врач, внимательный и профессиональный',
          date: '2024-01-15',
          likes: 5,
          dislikes: 0,
          isVerified: true,
        },
        {
          id: '2',
          doctorId: doctorId,
          userId: 'user2',
          userName: 'Игорь Петров',
          rating: 4,
          comment: 'Хороший специалист, все объяснил',
          date: '2024-01-10',
          likes: 3,
          dislikes: 1,
          isVerified: false,
        },
      ];
      
      setReviews(data);
      setLoading(false);
    }, 500);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const calculatePercentage = (count) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  const renderRatingBar = (stars, count) => {
    const percentage = calculatePercentage(count);
    return (
      <View style={styles.ratingBar}>
        <Text style={styles.stars}>{stars} ⭐</Text>
        <View style={styles.barContainer}>
          <View 
            style={[
              styles.bar, 
              { width: `${percentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.count}>({count})</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2c80ff" />
        <Text style={styles.loading}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Отзывы о враче</Text>
          <Text style={styles.doctorName}>{doctorName}</Text>
          
          <View style={styles.ratingOverview}>
            <View style={styles.overall}>
              <Text style={styles.ratingNumber}>{doctorRating}</Text>
              <StarRating rating={parseFloat(doctorRating)} size={18} />
              <Text style={styles.total}>Всего отзывов: {totalReviews}</Text>
            </View>
            
            <View style={styles.bars}>
              {[5, 4, 3, 2, 1].map(stars => (
                <View key={stars}>
                  {renderRatingBar(stars, ratingDistribution[stars] || 0)}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.sortSection}>
          <Text style={styles.sortLabel}>Сортировка:</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'date' && styles.active
              ]}
              onPress={() => handleSortChange('date')}
            >
              <Text style={[
                styles.sortText,
                sortBy === 'date' && styles.activeText
              ]}>
                По дате
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'rating' && styles.active
              ]}
              onPress={() => handleSortChange('rating')}
            >
              <Text style={[
                styles.sortText,
                sortBy === 'rating' && styles.activeText
              ]}>
                По оценке
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>
            Отзывы ({reviews.length})
          </Text>
          
          {reviews.length > 0 ? (
            <>
              {reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId="currentUser"
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </>
          ) : (
            <View style={styles.noReviews}>
              <Text style={styles.noReviewsText}>Отзывов пока нет</Text>
              <Text style={styles.noReviewsSubtext}>
                Будьте первым
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.fixedButton}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEditReview', { 
            doctorId, 
            doctorName 
          })}
        >
          <Text style={styles.addButtonText}>✏️ Написать отзыв</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 6,
  },
  doctorName: {
    fontSize: 17,
    color: '#2c80ff',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  ratingOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overall: {
    alignItems: 'center',
    flex: 1,
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  total: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },
  bars: {
    flex: 1,
    paddingLeft: 18,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  stars: {
    fontSize: 13,
    width: 36,
    color: '#666',
  },
  barContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#ff9500',
    borderRadius: 3,
  },
  count: {
    fontSize: 11,
    color: '#666',
    width: 26,
    textAlign: 'right',
  },
  sortSection: {
    backgroundColor: 'white',
    padding: 14,
    marginTop: 8,
  },
  sortLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  active: {
    backgroundColor: '#2c80ff',
    borderColor: '#2c80ff',
  },
  sortText: {
    fontSize: 13,
    color: '#666',
  },
  activeText: {
    color: 'white',
  },
  reviewsSection: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 14,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noReviewsText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 6,
  },
  noReviewsSubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  fixedButton: {
    backgroundColor: 'white',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#2c80ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ReviewsScreen;