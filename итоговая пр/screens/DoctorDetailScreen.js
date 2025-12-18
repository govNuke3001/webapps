import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { simpleDoctorsData } from '../utils/simpleData';
import { sampleReviews } from '../utils/reviewData';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';

const DoctorDetailScreen = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    visitDate: '',
  });

  useEffect(() => {
    const foundDoctor = simpleDoctorsData.find(d => d.id === doctorId);
    setDoctor(foundDoctor);

    const doctorReviews = sampleReviews.filter(review => review.doctorId === doctorId);
    setReviews(doctorReviews);
  }, [doctorId]);

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

  const handleAddReview = () => {
    setReviewModalVisible(true);
  };

  const handleSubmitReview = () => {
    if (newReview.comment.trim().length < 10) {
      Alert.alert('Ошибка', 'Минимум 10 символов');
      return;
    }

    const review = {
      id: Date.now().toString(),
      doctorId: doctorId,
      userId: 'currentUser',
      userName: 'Иван Иванов',
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      date: new Date().toISOString().split('T')[0],
      visitDate: newReview.visitDate || null,
      likes: 0,
      dislikes: 0,
    };

    setReviews(prev => [review, ...prev]);
    setReviewModalVisible(false);
    setNewReview({ rating: 5, comment: '', visitDate: '' });

    Alert.alert('Успех', 'Отзыв добавлен!');
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Врач не найден</Text>
      </View>
    );
  }

  const avatarColor = getAvatarColor(doctor.name);
  const initials = getInitials(doctor.name);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Верхняя карточка с информацией о враче */}
        <View style={styles.mainCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarText}>{initials}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            </View>
          </View>

          <Text style={styles.doctorName}>{doctor.name}</Text>
          
          <View style={styles.specialtyContainer}>
            <View style={[styles.specialtyBadge, { backgroundColor: `${avatarColor}20` }]}>
              <Text style={[styles.specialtyText, { color: avatarColor }]}>
                {doctor.specialty}
              </Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              <StarRating rating={doctor.rating} size={20} />
            </View>
            <Text style={styles.ratingText}>
              {doctor.rating.toFixed(1)} • {reviews.length} отзывов
            </Text>
          </View>

          {/* Статистика в строку */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: `${avatarColor}15` }]}>
                <Text style={[styles.statIcon, { color: avatarColor }]}>📅</Text>
              </View>
              <Text style={styles.statValue}>{doctor.experience}</Text>
              <Text style={styles.statLabel}>лет опыта</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: `${avatarColor}15` }]}>
                <Text style={[styles.statIcon, { color: avatarColor }]}>💼</Text>
              </View>
              <Text style={styles.statValue}>Высшая</Text>
              <Text style={styles.statLabel}>категория</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: `${avatarColor}15` }]}>
                <Text style={[styles.statIcon, { color: avatarColor }]}>🎓</Text>
              </View>
              <Text style={styles.statValue}>15+</Text>
              <Text style={styles.statLabel}>курсов</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Консультация от</Text>
            <Text style={styles.priceValue}>{doctor.price} ₽</Text>
          </View>
        </View>

        {/* Карточка "О враче" */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>О враче</Text>
          <Text style={styles.description}>{doctor.description}</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🎓</Text>
              <View>
                <Text style={styles.detailTitle}>Образование</Text>
                <Text style={styles.detailValue}>Высшее медицинское</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🏥</Text>
              <View>
                <Text style={styles.detailTitle}>Место работы</Text>
                <Text style={styles.detailValue}>Городская больница №1</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>⭐</Text>
              <View>
                <Text style={styles.detailTitle}>Категория</Text>
                <Text style={styles.detailValue}>Высшая категория</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📅</Text>
              <View>
                <Text style={styles.detailTitle}>График</Text>
                <Text style={styles.detailValue}>Пн-Пт: 9:00-18:00</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Карточка "Услуги и цены" */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Услуги и цены</Text>
          <View style={styles.servicesList}>
            <View style={styles.serviceItem}>
              <View>
                <Text style={styles.serviceName}>Первичная консультация</Text>
                <Text style={styles.serviceDesc}>Диагностика и рекомендации</Text>
              </View>
              <Text style={styles.servicePrice}>{doctor.price} ₽</Text>
            </View>
            
            <View style={styles.serviceDivider} />
            
            <View style={styles.serviceItem}>
              <View>
                <Text style={styles.serviceName}>Повторная консультация</Text>
                <Text style={styles.serviceDesc}>Контрольный осмотр</Text>
              </View>
              <Text style={styles.servicePrice}>1500 ₽</Text>
            </View>
            
            <View style={styles.serviceDivider} />
            
            <View style={styles.serviceItem}>
              <View>
                <Text style={styles.serviceName}>Расширенная диагностика</Text>
                <Text style={styles.serviceDesc}>Полное обследование</Text>
              </View>
              <Text style={styles.servicePrice}>3500 ₽</Text>
            </View>
          </View>
        </View>

        {/* Карточка "Отзывы" */}
        <View style={styles.infoCard}>
          <View style={styles.reviewsHeader}>
            <View>
              <Text style={styles.cardTitle}>Отзывы пациентов</Text>
              <Text style={styles.reviewsCount}>{reviews.length} отзывов</Text>
            </View>
            <TouchableOpacity 
              style={[styles.addReviewButton, { backgroundColor: avatarColor }]}
              onPress={handleAddReview}
            >
              <Text style={styles.addReviewButtonText}>✏️ Оставить отзыв</Text>
            </TouchableOpacity>
          </View>

          {displayedReviews.length > 0 ? (
            <>
              <View style={styles.reviewsList}>
                {displayedReviews.map(review => (
                  <View key={review.id} style={styles.reviewItem}>
                    <ReviewCard
                      review={review}
                      currentUserId="currentUser"
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  </View>
                ))}
              </View>
              
              {reviews.length > 3 && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={() => setShowAllReviews(!showAllReviews)}
                >
                  <Text style={styles.showMoreText}>
                    {showAllReviews ? 'Свернуть отзывы' : `Показать все отзывы (${reviews.length})`}
                  </Text>
                  <Text style={styles.showMoreIcon}>{showAllReviews ? '↑' : '↓'}</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.noReviews}>
              <View style={[styles.noReviewsIcon, { backgroundColor: `${avatarColor}15` }]}>
                <Text style={[styles.noReviewsIconText, { color: avatarColor }]}>✏️</Text>
              </View>
              <Text style={styles.noReviewsTitle}>Отзывов пока нет</Text>
              <Text style={styles.noReviewsText}>Будьте первым, кто оставит отзыв об этом враче</Text>
              <TouchableOpacity 
                style={[styles.firstReviewButton, { backgroundColor: avatarColor }]}
                onPress={handleAddReview}
              >
                <Text style={styles.firstReviewButtonText}>Оставить первый отзыв</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Отступ для нижней кнопки */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Фиксированная кнопка записи */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity 
          style={[styles.bookButton, { backgroundColor: avatarColor }]}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonIcon}>📅</Text>
          <Text style={styles.bookButtonText}>Записаться на прием</Text>
          <Text style={styles.bookButtonPrice}>от {doctor.price} ₽</Text>
        </TouchableOpacity>
      </View>

      {/* Модальное окно для отзыва */}
      <Modal
        visible={reviewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Новый отзыв</Text>
              <Text style={styles.modalSubtitle}>Оцените врача {doctor.name}</Text>
            </View>

            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Ваша оценка:</Text>
              <View style={styles.starsContainer}>
                <StarRating
                  rating={newReview.rating}
                  onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  editable={true}
                  size={32}
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Комментарий:</Text>
              <TextInput
                style={styles.commentInput}
                multiline
                numberOfLines={4}
                placeholder="Опишите ваш опыт общения с врачом..."
                placeholderTextColor="#94A3B8"
                value={newReview.comment}
                onChangeText={(text) => setNewReview(prev => ({ ...prev, comment: text }))}
              />
              <Text style={styles.inputHint}>Минимум 10 символов</Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Дата посещения:</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="ГГГГ-ММ-ДД (необязательно)"
                placeholderTextColor="#94A3B8"
                value={newReview.visitDate}
                onChangeText={(text) => setNewReview(prev => ({ ...prev, visitDate: text }))}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setReviewModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: avatarColor }]}
                onPress={handleSubmitReview}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Опубликовать отзыв</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  verifiedText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  doctorName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  specialtyContainer: {
    marginBottom: 16,
  },
  specialtyBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: '700',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stars: {
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  priceContainer: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3B82F6',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  servicesList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    overflow: 'hidden',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  serviceDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 13,
    color: '#64748B',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3B82F6',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewsCount: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  addReviewButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  reviewsList: {
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 12,
  },
  showMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  showMoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3B82F6',
    marginRight: 8,
  },
  showMoreIcon: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noReviewsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  noReviewsIconText: {
    fontSize: 28,
  },
  noReviewsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  noReviewsText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  firstReviewButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  firstReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  bookButtonIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  bookButtonPrice: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },
  ratingSection: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  starsContainer: {
    alignItems: 'center',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1E293B',
    textAlignVertical: 'top',
    minHeight: 100,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  inputHint: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    marginLeft: 4,
  },
  dateInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  error: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
});

export default DoctorDetailScreen;