import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DoctorCard = ({ doctor, onPress, viewMode = 'list' }) => {
  const getAvatarColor = (name) => {
    const colors = [
      '#4CAF50',
      '#2196F3',
      '#9C27B0',
      '#FF9800',
      '#F44336',
      '#3F51B5',
      '#009688',
      '#E91E63',
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <View style={styles.starsContainer}>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '⭐'}
        {'☆'.repeat(emptyStars)}
      </View>
    );
  };

  const avatarColor = getAvatarColor(doctor.name);
  const initials = getInitials(doctor.name);

  if (viewMode === 'grid') {
    return (
      <TouchableOpacity 
        style={styles.gridCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Аватарка врача */}
        <View style={[styles.gridAvatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.gridAvatarText}>{initials}</Text>
        </View>

        {/* Имя и специальность */}
        <Text style={styles.gridName} numberOfLines={1}>{doctor.name}</Text>
        <Text style={styles.gridSpecialty} numberOfLines={1}>{doctor.specialty}</Text>

        {/* Рейтинг и опыт */}
        <View style={styles.gridRatingRow}>
          <View style={styles.gridRating}>
            <Text style={styles.gridRatingIcon}>⭐</Text>
            <Text style={styles.gridRatingText}>{doctor.rating.toFixed(1)}</Text>
          </View>
          
          <View style={styles.gridExperience}>
            <Text style={styles.gridExpIcon}>📅</Text>
            <Text style={styles.gridExpText}>{doctor.experience} лет</Text>
          </View>
        </View>

        {/* Цена и кнопка */}
        <View style={styles.gridBottomRow}>
          <Text style={styles.gridPrice}>{doctor.price} ₽</Text>
          <View style={styles.gridButton}>
            <Text style={styles.gridButtonText}>→</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.listCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Левая часть с аватаркой */}
      <View style={styles.listLeft}>
        <View style={[styles.listAvatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.listAvatarText}>{initials}</Text>
          {/* Бэдж проверенного врача */}
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        </View>
      </View>

      {/* Центральная часть с информацией */}
      <View style={styles.listCenter}>
        <View style={styles.listHeader}>
          <Text style={styles.listName} numberOfLines={1}>{doctor.name}</Text>
          <View style={[styles.specialtyBadge, { backgroundColor: `${avatarColor}20` }]}>
            <Text style={[styles.specialtyText, { color: avatarColor }]}>
              {doctor.specialty}
            </Text>
          </View>
        </View>

        <View style={styles.ratingRow}>
          {renderStars(doctor.rating)}
          <Text style={styles.ratingCount}>({doctor.reviewCount || 12} отзывов)</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>👨‍⚕️</Text>
            <Text style={styles.statValue}>{doctor.experience}</Text>
            <Text style={styles.statLabel}>лет опыта</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💼</Text>
            <Text style={styles.statValue}>Высшая</Text>
            <Text style={styles.statLabel}>категория</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🎓</Text>
            <Text style={styles.statValue}>15+</Text>
            <Text style={styles.statLabel}>курсов</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {doctor.description}
        </Text>
      </View>

      {/* Правая часть с ценой и действиями */}
      <View style={styles.listRight}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>от</Text>
          <Text style={styles.priceValue}>{doctor.price} ₽</Text>
          <Text style={styles.priceSuffix}>/прием</Text>
        </View>

        <TouchableOpacity style={[styles.bookButton, { backgroundColor: avatarColor }]}>
          <Text style={styles.bookButtonText}>Записаться</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reviewsButton}>
          <Text style={styles.reviewsButtonText}>Отзывы →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  starsContainer: {
    fontSize: 14,
    color: '#FFD700',
    letterSpacing: 1,
  },

  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 12,
  },
  gridAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gridAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gridName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
    width: '100%',
  },
  gridSpecialty: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
    width: '100%',
  },
  gridRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  gridRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
  },
  gridRatingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  gridRatingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
  gridExperience: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flex: 1,
  },
  gridExpIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  gridExpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0EA5E9',
  },
  gridBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  gridPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B82F6',
  },
  gridButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
  },

  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  listLeft: {
    marginRight: 16,
  },
  listAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  listAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listCenter: {
    flex: 1,
    marginRight: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  specialtyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingCount: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  listRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B82F6',
  },
  priceSuffix: {
    fontSize: 10,
    color: '#94A3B8',
  },
  bookButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8,
    minWidth: 100,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  reviewsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  reviewsButtonText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DoctorCard;