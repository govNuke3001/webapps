import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ReviewItem = ({ 
  review, 
  onPress, 
  onEdit,
  onDelete,
  showActions = false 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.doctorName}>{review.doctorName}</Text>
          <Text style={styles.specialty}>{review.doctorSpecialty}</Text>
        </View>
        {review.isEdited && (
          <Text style={styles.edited}>ред.</Text>
        )}
      </View>
      
      <View style={styles.rating}>
        <Text style={styles.stars}>{renderStars(review.rating)}</Text>
        <Text style={styles.date}>{formatDate(review.date)}</Text>
      </View>
      
      <Text style={styles.comment} numberOfLines={3}>
        {review.comment}
      </Text>
      
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.action} onPress={onEdit}>
            <Text style={styles.actionText}>✏️ Редактировать</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.action, styles.delete]} 
            onPress={onDelete}
          >
            <Text style={[styles.actionText, styles.deleteText]}>🗑️ Удалить</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 13,
    color: '#2c80ff',
    marginTop: 2,
  },
  edited: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    fontSize: 13,
  },
  date: {
    fontSize: 11,
    color: '#666',
  },
  comment: {
    fontSize: 13,
    lineHeight: 18,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  action: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 11,
    color: '#2c80ff',
  },
  delete: {
    marginLeft: 10,
  },
  deleteText: {
    color: '#ff4444',
  },
});

export default ReviewItem;