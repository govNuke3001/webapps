
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import StarRating from '../components/StarRating';
import { simpleDoctorsData } from '../utils/simpleData';

const AddEditReviewScreen = ({ route, navigation }) => {
  const { doctorId, review: existingReview, mode = 'add' } = route.params;
  
  const [doctor, setDoctor] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentInputRef = useRef(null);
  const dateInputRef = useRef(null);

  const isAuthenticated = true; 
  const currentUser = {
    id: 'user123',
    name: 'Иван Иванов'
  };

  useEffect(() => {
    const foundDoctor = simpleDoctorsData.find(d => d.id === doctorId);
    setDoctor(foundDoctor);

    if (mode === 'edit' && existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
      setVisitDate(existingReview.visitDate || '');
    }

    const backHandler = navigation.addListener('beforeRemove', (e) => {
      Keyboard.dismiss();
    });

    return () => {
      backHandler();
    };
  }, [doctorId, existingReview, mode, navigation]);

  const validateForm = () => {
    if (!isAuthenticated) {
      Alert.alert('Ошибка', 'Требуется авторизация');
      return false;
    }

    if (rating === 0) {
      Alert.alert('Ошибка', 'Укажите оценку');
      return false;
    }

    if (comment.trim().length < 10) {
      Alert.alert('Ошибка', 'Минимум 10 символов');
      return false;
    }

    if (comment.trim().length > 1000) {
      Alert.alert('Ошибка', 'Максимум 1000 символов');
      return false;
    }

    if (visitDate && !isValidDate(visitDate)) {
      Alert.alert('Ошибка', 'Формат даты: ГГГГ-ММ-ДД');
      return false;
    }

    return true;
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss(); 
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const reviewData = {
        id: mode === 'edit' ? existingReview.id : Date.now().toString(),
        doctorId,
        userId: currentUser.id,
        userName: currentUser.name,
        rating,
        comment: comment.trim(),
        visitDate: visitDate.trim() || null,
        date: new Date().toISOString().split('T')[0],
        likes: mode === 'edit' ? existingReview.likes : 0,
        dislikes: mode === 'edit' ? existingReview.dislikes : 0,
        helpful: mode === 'edit' ? existingReview.helpful : 0,
      };

      Alert.alert(
        'Успех',
        mode === 'edit' ? 'Отзыв обновлен!' : 'Отзыв добавлен!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      Alert.alert('Ошибка', 'Ошибка сохранения');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Удалить отзыв?',
      'Действие необратимо',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await new Promise(resolve => setTimeout(resolve, 500));
              Alert.alert(
                'Успех',
                'Отзыв удален',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить');
            }
          }
        }
      ]
    );
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text>Врач не найден</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.authRequired}>
          <Text style={styles.authTitle}>🔒 Требуется вход</Text>
          <Text style={styles.authText}>
            Авторизуйтесь для оставления отзывов
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>Войти</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <View>
                <View style={styles.header}>
                  <Text style={styles.title}>
                    {mode === 'edit' ? 'Редактировать отзыв' : 'Новый отзыв'}
                  </Text>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.specialty}>{doctor.specialty}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Оценка *</Text>
                  <View style={styles.ratingContainer}>
                    <StarRating
                      rating={rating}
                      onRatingChange={setRating}
                      editable={true}
                      size={34}
                    />
                    <Text style={styles.ratingText}>
                      {rating === 5 ? 'Отлично' : 
                      rating === 4 ? 'Хорошо' : 
                      rating === 3 ? 'Нормально' : 
                      rating === 2 ? 'Плохо' : 
                      'Ужасно'}
                    </Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Комментарий * {comment.length}/1000
                  </Text>
                  <TextInput
                    ref={commentInputRef}
                    style={[
                      styles.commentInput,
                      comment.length > 1000 && styles.inputError
                    ]}
                    multiline
                    numberOfLines={6}
                    placeholder="Опишите ваш опыт..."
                    value={comment}
                    onChangeText={setComment}
                    maxLength={1000}
                    textAlignVertical="top"
                    blurOnSubmit={true}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                  />
                  <Text style={styles.hint}>
                    Минимум 10 символов. Будьте объективны.
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Дата посещения</Text>
                  <TextInput
                    ref={dateInputRef}
                    style={styles.dateInput}
                    placeholder="2024-01-15 (необязательно)"
                    value={visitDate}
                    onChangeText={setVisitDate}
                    blurOnSubmit={true}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                  />
                  <Text style={styles.hint}>
                    Поможет оценить актуальность отзыва
                  </Text>
                </View>

                <View style={styles.tips}>
                  <Text style={styles.tipsTitle}>Рекомендации:</Text>
                  <View style={styles.tip}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Опишите реальный опыт</Text>
                  </View>
                  <View style={styles.tip}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Отметьте плюсы и минусы</Text>
                  </View>
                  <View style={styles.tip}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Избегайте оскорблений</Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>

          <View style={styles.footer}>
            {mode === 'edit' && (
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDelete}
                disabled={isSubmitting}
              >
                <Text style={styles.deleteText}>🗑 Удалить</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.buttons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  Keyboard.dismiss();
                  navigation.goBack();
                }}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelText}>Отмена</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!rating || comment.trim().length < 10 || isSubmitting) && styles.disabled
                ]}
                onPress={handleSubmit}
                disabled={!rating || comment.trim().length < 10 || isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={styles.submitText}>Сохранение...</Text>
                ) : (
                  <Text style={styles.submitText}>
                    {mode === 'edit' ? 'Обновить' : 'Опубликовать'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
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
    fontWeight: '600',
  },
  specialty: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 15,
    color: '#666',
    marginTop: 10,
    fontWeight: '500',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 14,
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 110,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 14,
    fontSize: 15,
    backgroundColor: 'white',
  },
  hint: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
    fontStyle: 'italic',
  },
  tips: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 18,
    marginBottom: 90,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tip: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  tipBullet: {
    fontSize: 15,
    color: '#2c80ff',
    marginRight: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 6,
    backgroundColor: '#2c80ff',
  },
  disabled: {
    backgroundColor: '#aaa',
  },
  submitText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  authRequired: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  authText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#2c80ff',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 6,
  },
  loginText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default AddEditReviewScreen;