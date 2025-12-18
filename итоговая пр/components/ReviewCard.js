import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StarRating from './StarRating';

const ReviewCard = ({ review, currentUserId, onEdit, onDelete }) => {
  const isCurrentUserReview = review.userId === currentUserId;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{review.userName}</Text>
          {review.isVerified && (
            <Text style={styles.verified}>✅ Проверен</Text>
          )}
        </View>
        <Text style={styles.date}>{formatDate(review.date)}</Text>
      </View>
      
      <View style={styles.ratingContainer}>
        <StarRating rating={review.rating} size={18} />
        {review.visitDate && (
          <Text style={styles.visitDate}>Посещение: {review.visitDate}</Text>
        )}
      </View>
      
      <Text style={styles.comment}>{review.comment}</Text>
      
      <View style={styles.footer}>
        <View style={styles.likes}>
          <TouchableOpacity style={styles.likeButton}>
            <Text style={styles.likeText}>👍 {review.likes || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton}>
            <Text style={styles.likeText}>👎 {review.dislikes || 0}</Text>
          </TouchableOpacity>
        </View>
        
        {isCurrentUserReview && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onEdit && onEdit(review)}
            >
              <Text style={styles.actionText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onDelete && onDelete(review.id)}
            >
              <Text style={styles.actionText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  verified: {
    fontSize: 11,
    color: '#34c759',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  visitDate: {
    fontSize: 12,
    color: '#888',
  },
  comment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  likes: {
    flexDirection: 'row',
  },
  likeButton: {
    marginRight: 12,
  },
  likeText: {
    fontSize: 13,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
  },
  actionText: {
    fontSize: 16,
  },
});

export default ReviewCard;