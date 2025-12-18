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
  FlatList,
} from 'react-native';
import DoctorCard from '../components/DoctorCard';
import { simpleDoctorsData, simpleSpecialties } from '../utils/simpleData';

const { width } = Dimensions.get('window');

const DoctorsListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Все');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  
  const scrollX = useRef(new Animated.Value(0)).current;

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
  };

  const getSpecialtyColor = (specialty) => {
    const colors = {
      'Терапевт': '#4CAF50',
      'Кардиолог': '#F44336',
      'Невролог': '#2196F3',
      'Педиатр': '#FF9800',
      'Хирург': '#9C27B0',
      'Все': '#3B82F6',
    };
    return colors[specialty] || '#3B82F6';
  };

  const specialtyTabs = [
    { id: 'Все', label: 'Все врачи', icon: '👨‍⚕️' },
    { id: 'Терапевт', label: 'Терапевт', icon: '🩺' },
    { id: 'Кардиолог', label: 'Кардиолог', icon: '❤️' },
    { id: 'Невролог', label: 'Невролог', icon: '🧠' },
    { id: 'Педиатр', label: 'Педиатр', icon: '👶' },
    { id: 'Хирург', label: 'Хирург', icon: '🔪' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Фиксированный верхний блок */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Найдите врача</Text>
            <Text style={styles.subGreeting}>Забота о вашем здоровье</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileIcon}>👤</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Поиск */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск врачей..."
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

        {/* Вкладки специальностей */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContainer}
        >
          {specialtyTabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                selectedSpecialty === tab.id && [styles.tabActive, { borderBottomColor: getSpecialtyColor(tab.id) }]
              ]}
              onPress={() => setSelectedSpecialty(tab.id)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[
                styles.tabLabel,
                selectedSpecialty === tab.id && styles.tabLabelActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Панель управления */}
        <View style={styles.controls}>
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Сортировка:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.sortScroll}
            >
              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'rating' && styles.sortChipActive]}
                onPress={() => setSortBy('rating')}
              >
                <Text style={[styles.sortChipText, sortBy === 'rating' && styles.sortChipTextActive]}>
                  По рейтингу
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'name' && styles.sortChipActive]}
                onPress={() => setSortBy('name')}
              >
                <Text style={[styles.sortChipText, sortBy === 'name' && styles.sortChipTextActive]}>
                  По имени
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'experience' && styles.sortChipActive]}
                onPress={() => setSortBy('experience')}
              >
                <Text style={[styles.sortChipText, sortBy === 'experience' && styles.sortChipTextActive]}>
                  По опыту
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'price' && styles.sortChipActive]}
                onPress={() => setSortBy('price')}
              >
                <Text style={[styles.sortChipText, sortBy === 'price' && styles.sortChipTextActive]}>
                  По цене
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.viewControls}>
            <Text style={styles.resultsCount}>
              {filteredDoctors.length} врачей
            </Text>
            <View style={styles.viewToggle}>
              <TouchableOpacity 
                style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
                onPress={() => setViewMode('list')}
              >
                <Text style={[styles.viewIcon, viewMode === 'list' && styles.viewIconActive]}>☰</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
                onPress={() => setViewMode('grid')}
              >
                <Text style={[styles.viewIcon, viewMode === 'grid' && styles.viewIconActive]}>◼◼</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>


{/* Список врачей с единым скроллом */}
<FlatList
  data={filteredDoctors}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <DoctorCard
      doctor={item}
      onPress={() => handleDoctorPress(item)}
      viewMode={viewMode}
    />
  )}
  ListEmptyComponent={
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>👨‍⚕️</Text>
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
  }
  contentContainerStyle={[
    styles.listContent,
    viewMode === 'grid' && styles.gridListContent
  ]}
  showsVerticalScrollIndicator={false}
  style={styles.doctorsList}
  numColumns={viewMode === 'grid' ? 2 : 1}
  columnWrapperStyle={viewMode === 'grid' && styles.gridColumnWrapper}
/>


gridListContent: {
  paddingHorizontal: 10,
  paddingTop: 15,
  paddingBottom: 30,
},
gridColumnWrapper: {
  justifyContent: 'space-between',
  paddingHorizontal: 10,
  marginBottom: 12,
},

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  subGreeting: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    padding: 0,
  },
  clearSearch: {
    fontSize: 16,
    color: '#94A3B8',
    padding: 5,
  },
  tabsScroll: {
    maxHeight: 60,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#1E293B',
    fontWeight: '700',
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sortContainer: {
    marginBottom: 15,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  sortScroll: {
    flexGrow: 0,
  },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  sortChipText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  sortChipTextActive: {
    color: '#FFFFFF',
  },
  viewControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewIcon: {
    fontSize: 16,
    color: '#94A3B8',
  },
  viewIconActive: {
    color: '#3B82F6',
  },
  doctorsList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DoctorsListScreen;