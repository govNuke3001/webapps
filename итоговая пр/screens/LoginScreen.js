import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Ошибка', 'Некорректный email');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      Alert.alert('Успех', 'Вход выполнен');
      navigation.navigate('DoctorsList');
    } catch (error) {
      Alert.alert('Ошибка', 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleQuickLogin = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Вход</Text>
        <Text style={styles.subtitle}>Войдите в аккаунт</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Пароль</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.primaryButton, loading && styles.disabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? 'Вход...' : 'Войти'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>или</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.secondaryText}>Создать аккаунт</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Забыли пароль?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.testSection}>
        <Text style={styles.testTitle}>Тестовые данные:</Text>
        
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => handleQuickLogin('user@example.com', 'password')}
          disabled={loading}
        >
          <Text style={styles.testText}>👤 Основной аккаунт</Text>
          <Text style={styles.testDetails}>user@example.com / password</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => handleQuickLogin('doctor@example.com', 'doctor123')}
          disabled={loading}
        >
          <Text style={styles.testText}>👨‍⚕️ Аккаунт врача</Text>
          <Text style={styles.testDetails}>doctor@example.com / doctor123</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => handleQuickLogin('admin@example.com', 'admin123')}
          disabled={loading}
        >
          <Text style={styles.testText}>⚙️ Администратор</Text>
          <Text style={styles.testDetails}>admin@example.com / admin123</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Doctor Reviews</Text>
        <Text style={styles.infoText}>
          Платформа для поиска врачей и отзывов.
          Создавайте честные отзывы.
        </Text>
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
  primaryButton: {
    backgroundColor: '#2c80ff',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabled: {
    backgroundColor: '#aaa',
  },
  primaryText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#777',
    fontSize: 13,
  },
  secondaryButton: {
    backgroundColor: '#eee',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryText: {
    color: '#333',
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
  testSection: {
    backgroundColor: '#fff8e1',
    margin: 14,
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffecb3',
  },
  testTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#8d6e00',
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: '#fffdf6',
    padding: 10,
    borderRadius: 4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#ffecb3',
  },
  testText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8d6e00',
    marginBottom: 2,
  },
  testDetails: {
    fontSize: 11,
    color: '#8d6e00',
    opacity: 0.8,
  },
  infoSection: {
    backgroundColor: '#e8f5e8',
    margin: 14,
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 6,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#2e7d32',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;