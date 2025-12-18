import React, { useState } from 'react';
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
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    name: 'Иван Иванов',
    email: 'user@example.com',
    phone: '+7 (999) 123-45-67',
    avatar: null,
    registrationDate: '2024-01-01',
    reviewsCount: 5,
    averageRating: 4.2,
  });
  
  const [editModalVisible, setEditModalVisible] = useState(true);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleEditProfile = () => {
    setEditedUser({ ...user });
    setEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (!editedUser.name.trim()) {
      Alert.alert('Ошибка', 'Введите имя');
      return;
    }

    if (!editedUser.email.trim()) {
      Alert.alert('Ошибка', 'Введите email');
      return;
    }

    setUser(editedUser);
    setEditModalVisible(false);
    Alert.alert('Успех', 'Профиль обновлен');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const recentReviews = [
    { id: 1, doctor: 'Др. Петрова', rating: 5, date: '2024-03-15' },
    { id: 2, doctor: 'Др. Сидоров', rating: 4, date: '2024-03-10' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Clean Header */}
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => Alert.alert('Смена аватара', 'Вы можете изменить фото профиля в настройках')}
              style={styles.avatarTouchable}
            >
              <View style={styles.avatarContainer}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                      {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'П'}
                    </Text>
                  </View>
                )}
                <View style={styles.editAvatarBadge}>
                  <Text style={styles.cameraIcon}>📷</Text>
                </View>
              </View>
            </TouchableOpacity>
            
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
            
            <View style={styles.editButtonContainer}>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={handleEditProfile}
                activeOpacity={0.8}
              >
                <Text style={styles.editButtonText}>✎ Редактировать профиль</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Personal Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Личная информация</Text>
            <View style={styles.cardHeaderLine} />
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📧</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📱</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Телефон</Text>
                <Text style={styles.infoValue}>{user.phone || 'Не указан'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📅</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Дата регистрации</Text>
                <Text style={styles.infoValue}>{formatDate(user.registrationDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Card - Moved from header */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Статистика</Text>
            <View style={styles.cardHeaderLine} />
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIconCircle, { backgroundColor: '#EEF2FF' }]}>
                <Text style={styles.statIcon}>📝</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{user.reviewsCount}</Text>
                <Text style={styles.statLabel}>Отзывов</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconCircle, { backgroundColor: '#F0F9FF' }]}>
                <Text style={styles.statIcon}>⭐</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{user.averageRating}</Text>
                <Text style={styles.statLabel}>Рейтинг</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FEF7FF' }]}>
                <Text style={styles.statIcon}>🏆</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>
                  {Math.round(user.reviewsCount * user.averageRating)}
                </Text>
                <Text style={styles.statLabel}>Всего оценок</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Быстрые действия</Text>
            <View style={styles.cardHeaderLine} />
          </View>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('MyReviews')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.actionIconText}>📝</Text>
              </View>
              <Text style={styles.actionButtonText}>Мои отзывы</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('DoctorsList')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Text style={styles.actionIconText}>👨‍⚕️</Text>
              </View>
              <Text style={styles.actionButtonText}>Найти врача</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Уведомления', 'Раздел в разработке')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.actionIconText}>🔔</Text>
              </View>
              <Text style={styles.actionButtonText}>Уведомления</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Настройки', 'Раздел в разработке')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.actionIconText}>⚙️</Text>
              </View>
              <Text style={styles.actionButtonText}>Настройки</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Reviews */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Недавние отзывы</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('MyReviews')}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>Все отзывы →</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewsList}>
            {recentReviews.map((review) => (
              <TouchableOpacity 
                key={review.id}
                style={styles.reviewItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('MyReviews')}
              >
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewDoctor}>{review.doctor}</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingStar}>⭐</Text>
                    <Text style={styles.ratingValue}>{review.rating}.0</Text>
                  </View>
                </View>
                <Text style={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString('ru-RU')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Редактировать профиль</Text>
              <TouchableOpacity 
                onPress={() => setEditModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseIcon}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.modalAvatarSection}>
                <TouchableOpacity style={styles.modalAvatarContainer}>
                  {user.avatar ? (
                    <Image source={{ uri: user.avatar }} style={styles.modalAvatar} />
                  ) : (
                    <View style={styles.modalAvatarPlaceholder}>
                      <Text style={styles.modalAvatarText}>
                        {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'П'}
                      </Text>
                    </View>
                  )}
                  <View style={styles.modalAvatarEdit}>
                    <Text style={styles.cameraIconSmall}>📷</Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.modalAvatarHint}>Нажмите для смены фото</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Имя и фамилия *</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.name}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, name: text }))}
                  placeholder="Введите ваше имя"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.email}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, email: text }))}
                  placeholder="Введите ваш email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Телефон</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.phone}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, phone: text }))}
                  placeholder="+7 (999) 123-45-67"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Отменить</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveProfile}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveButtonText}>Сохранить изменения</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  scroll: {
    flex: 1,
  },
  header: {
    height: 240,
    position: 'relative',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#4F46E5',
  },
  headerContent: {
    paddingTop: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  avatarTouchable: {
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  cameraIcon: {
    fontSize: 16,
    color: 'white',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  editButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 200,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardHeaderLine: {
    height: 3,
    width: 40,
    backgroundColor: '#4F46E5',
    borderRadius: 2,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    width: (width - 80) / 2,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconText: {
    fontSize: 22,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  reviewsList: {
    gap: 12,
  },
  reviewItem: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewDoctor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingStar: {
    fontSize: 12,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
  },
  reviewDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseIcon: {
    fontSize: 24,
    color: '#6B7280',
    lineHeight: 24,
  },
  modalScroll: {
    paddingHorizontal: 24,
  },
  modalAvatarSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  modalAvatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  modalAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  modalAvatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  modalAvatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4F46E5',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  cameraIconSmall: {
    fontSize: 12,
    color: 'white',
  },
  modalAvatarHint: {
    fontSize: 14,
    color: '#6B7280',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 30,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default ProfileScreen;