import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Имя обязательно';
        if (value.trim().length < 2) return 'Минимум 2 символа';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email обязателен';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Некорректный email';
        return '';
      
      case 'password':
        if (!value) return 'Пароль обязателен';
        if (value.length < 6) return 'Минимум 6 символов';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Подтверждение обязательно';
        if (value !== formData.password) return 'Пароли не совпадают';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Ошибка', 'Исправьте ошибки');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      Alert.alert(
        'Успех', 
        'Регистрация завершена!',
        [{ text: 'OK', onPress: () => navigation.navigate('DoctorsList') }]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '#ddd' };
    
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;

    const strengthMap = {
      1: { text: 'Слабый', color: '#ff4444' },
      2: { text: 'Слабый', color: '#ff4444' },
      3: { text: 'Средний', color: '#ff9500' },
      4: { text: 'Хороший', color: '#34c759' },
    };

    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Регистрация</Text>
        <Text style={styles.subtitle}>Создайте аккаунт</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Имя и фамилия</Text>
          <TextInput
            style={[styles.input, errors.name && styles.error]}
            placeholder="Введите ваше имя"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            editable={!loading}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.error]}
            placeholder="Введите ваш email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Пароль</Text>
          <TextInput
            style={[styles.input, errors.password && styles.error]}
            placeholder="Придумайте пароль"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            secureTextEntry
            editable={!loading}
          />
          
          {formData.password ? (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                {[1, 2, 3, 4].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.segment,
                      {
                        backgroundColor: level <= passwordStrength.strength 
                          ? passwordStrength.color 
                          : '#ddd'
                      }
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                {passwordStrength.text}
              </Text>
            </View>
          ) : null}
          
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          
          <View style={styles.hints}>
            <Text style={styles.hintTitle}>Пароль должен содержать:</Text>
            <Text style={[styles.hint, formData.password.length >= 6 && styles.valid]}>
              ✓ Минимум 6 символов
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Подтверждение пароля</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.error]}
            placeholder="Повторите пароль"
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            secureTextEntry
            editable={!loading}
          />
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <Text style={styles.successText}>✅ Пароли совпадают</Text>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.disabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.link}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.benefits}>
        <Text style={styles.benefitsTitle}>Преимущества регистрации</Text>
        
        <View style={styles.benefit}>
          <Text style={styles.benefitIcon}>💾</Text>
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>Сохранение отзывов</Text>
            <Text style={styles.benefitDesc}>Ваши отзывы сохраняются</Text>
          </View>
        </View>
        
        <View style={styles.benefit}>
          <Text style={styles.benefitIcon}>⭐</Text>
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>Рейтинг доверия</Text>
            <Text style={styles.benefitDesc}>Повышайте рейтинг</Text>
          </View>
        </View>
        
        <View style={styles.benefit}>
          <Text style={styles.benefitIcon}>🔔</Text>
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>Уведомления</Text>
            <Text style={styles.benefitDesc}>Получайте ответы</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 36,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 22,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 15,
    color: '#333',
  },
  error: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 4,
    marginLeft: 4,
  },
  successText: {
    fontSize: 12,
    color: '#34c759',
    marginTop: 4,
    marginLeft: 4,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthBar: {
    flex: 1,
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    height: 4,
    marginHorizontal: 1,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  hints: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  hint: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  valid: {
    color: '#34c759',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2c80ff',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  link: {
    padding: 14,
    alignItems: 'center',
  },
  linkText: {
    color: '#2c80ff',
    fontSize: 15,
  },
  benefits: {
    backgroundColor: '#e8f4fd',
    margin: 14,
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b6def7',
  },
  benefitsTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2c80ff',
    marginBottom: 14,
    textAlign: 'center',
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 11,
    color: '#666',
    lineHeight: 15,
  },
});

export default RegisterScreen;