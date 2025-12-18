import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import DoctorCard from '../components/DoctorCard';
import { simpleDoctorsData, simpleSpecialties } from '../utils/simpleData';

const { width } = Dimensions.get('window');

const DoctorsListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Все');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('list'); 
  const [showFilters, setShowFilters] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleFilters = () => {
    if (showFilters) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setShowFilters(false));
    } else {
      setShowFilters(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleDoctorPress = (doctor) => {
    navigation.navigate('DoctorDetail', {
      doctorId: doctor.id,
      doctor: doctor
    });
  };

  const filteredDoctors = simpleDoctorsData
    .filter(doctor => {
      const matchesSearch = 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'Все' || doctor.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'name': return a.name.localeCompare(b.name);
        case 'experience': return b.experience - a.experience;
        case 'price': return a.price - b.price;
        default: return 0;
      }
    });

  const specialtyIcons = {
    'Все': '👨‍⚕️',
    'Терапевт': '🩺',
    'Кардиолог': '❤️',
    'Невролог': '🧠',
    'Педиатр': '👶',
    'Хирург': '🔪',
    'Офтальмолог': '👁️',
    'Отоларинголог': '👂',
    'Дерматолог': '🧴',
    'Гинеколог': '🌸',
  };

  const sortOptions = [
    { id: 'rating', label: 'Рейтинг', icon: '⭐' },
    { id: 'name', label: 'Имя', icon: '👤' },
    { id: 'experience', label: 'Опыт', icon: '📅' },
    { id: 'price', label: 'Цена', icon: '💰' },
  ];

  const getSpecialtyColor = (specialty) => {
    const colors = {
      'Терапевт': '#4CAF50',
      'Кардиолог': '#F44336',
      'Невролог': '#2196F3',
      'Педиатр': '#FF9800',
      'Хирург': '#9C27B0',
      'Все': '#607D8B',
    };
    return colors[specialty] || '#607D8B';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Найдите своего врача</Text>
            <Text style={styles.subGreeting}>Здоровье начинается здесь</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileIcon}>👤</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Поиск */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <Text>🔍</Text>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск врачей, симптомов, специальностей..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Быстрые действия */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>
                {viewMode === 'list' ? '◼◼' : '☰'}
              </Text>
            </View>
            <Text style={styles.actionText}>
              {viewMode === 'list' ? 'Сетка' : 'Список'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={toggleFilters}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>⚙️</Text>
            </View>
            <Text style={styles.actionText}>Фильтры</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('MyReviews')}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📝</Text>
            </View>
            <Text style={styles.actionText}>Мои отзывы</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Специальности */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.specialtiesScroll}
        contentContainerStyle={styles.specialtiesContainer}
      >
        {simpleSpecialties.map((specialty) => (
          <TouchableOpacity
            key={specialty}
            style={[
              styles.specialtyButton,
              selectedSpecialty === specialty && {
                backgroundColor: getSpecialtyColor(specialty),
                borderColor: getSpecialtyColor(specialty),
              }
            ]}
            onPress={() => setSelectedSpecialty(specialty)}
          >
            <Text style={styles.specialtyIcon}>{specialtyIcons[specialty] || '👨‍⚕️'}</Text>
            <Text style={[
              styles.specialtyText,
              selectedSpecialty === specialty && styles.specialtyTextActive
            ]}>
              {specialty}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Сортировка */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Сортировка:</Text>
        <View style={styles.sortButtons}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sortButton,
                sortBy === option.id && styles.sortButtonActive
              ]}
              onPress={() => setSortBy(option.id)}
            >
              <Text style={[
                styles.sortButtonIcon,
                sortBy === option.id && styles.sortButtonIconActive
              ]}>
                {option.icon}
              </Text>
              <Text style={[
                styles.sortButtonText,
                sortBy === option.id && styles.sortButtonTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Результаты */}
      <ScrollView style={styles.doctorsScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            Найдено врачей: <Text style={styles.resultsCount}>{filteredDoctors.length}</Text>
          </Text>
          <View style={styles.viewModeButtons}>
            <TouchableOpacity onPress={() => setViewMode('list')}>
              <Text style={[
                styles.viewModeIcon,
                viewMode === 'list' && styles.viewModeActive
              ]}>☰</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewMode('grid')}>
              <Text style={[
                styles.viewModeIcon,
                viewMode === 'grid' && styles.viewModeActive
              ]}>◼◼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {filteredDoctors.length > 0 ? (
          viewMode === 'list' ? (
            <View style={styles.listContainer}>
              {filteredDoctors.map(doctor => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onPress={() => handleDoctorPress(doctor)}
                  viewMode="list"
                />
              ))}
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {filteredDoctors.map(doctor => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onPress={() => handleDoctorPress(doctor)}
                  viewMode="grid"
                />
              ))}
            </View>
          )
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>Врачи не найдены</Text>
            <Text style={styles.emptyText}>
              Попробуйте изменить параметры поиска
            </Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedSpecialty('Все');
              }}
            >
              <Text style={styles.resetButtonText}>Сбросить фильтры</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Панель фильтров (выдвижная) */}
      {showFilters && (
        <Animated.View style={[
          styles.filterPanel,
          { transform: [{ translateX: slideAnim }], opacity: fadeAnim }
        ]}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Фильтры</Text>
            <TouchableOpacity onPress={toggleFilters}>
              <Text style={styles.closeFilters}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Специальность</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterSpecialties}>
                {simpleSpecialties.map((specialty) => (
                  <TouchableOpacity
                    key={specialty}
                    style={[
                      styles.filterSpecialty,
                      selectedSpecialty === specialty && {
                        backgroundColor: getSpecialtyColor(specialty)
                      }
                    ]}
                    onPress={() => setSelectedSpecialty(specialty)}
                  >
                    <Text style={[
                      styles.filterSpecialtyText,
                      selectedSpecialty === specialty && styles.filterSpecialtyTextActive
                    ]}>
                      {specialty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Цена за прием</Text>
            <View style={styles.priceRange}>
              <Text style={styles.priceText}>от 1000 ₽ до 10000 ₽</Text>
            </View>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Опыт работы</Text>
            <View style={styles.experienceRange}>
              <Text style={styles.experienceText}>от 1 года до 30 лет</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={toggleFilters}
          >
            <Text style={styles.applyButtonText}>Применить фильтры</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Плавающая кнопка добавления отзыва */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('DoctorsList')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  profileCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  clearSearch: {
    fontSize: 18,
    color: '#94A3B8',
    padding: 5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    marginBottom: 5,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  specialtiesScroll: {
    marginTop: 15,
  },
  specialtiesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  specialtyButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    minWidth: 100,
  },
  specialtyIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  specialtyTextActive: {
    color: '#FFFFFF',
  },
  sortContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  sortButtonIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  sortButtonIconActive: {
    color: '#FFFFFF',
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },
  doctorsScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  resultsCount: {
    color: '#3B82F6',
  },
  viewModeButtons: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
  },
  viewModeIcon: {
    fontSize: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#94A3B8',
  },
  viewModeActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    color: '#3B82F6',
  },
  listContainer: {
    paddingBottom: 30,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  filterPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.85,
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  filterTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  closeFilters: {
    fontSize: 24,
    color: '#94A3B8',
  },
  filterSection: {
    marginBottom: 25,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 15,
  },
  filterSpecialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterSpecialty: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterSpecialtyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterSpecialtyTextActive: {
    color: '#FFFFFF',
  },
  priceRange: {
    backgroundColor: '#F1F5F9',
    padding: 15,
    borderRadius: 15,
  },
  priceText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
  },
  experienceRange: {
    backgroundColor: '#F1F5F9',
    padding: 15,
    borderRadius: 15,
  },
  experienceText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});

export default DoctorsListScreen;