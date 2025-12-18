import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ProtectedRoute = ({ children, navigation }) => {
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔒 Требуется вход</Text>
        <Text style={styles.text}>
          Для доступа к этому разделу необходимо войти в аккаунт
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#2c80ff',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ProtectedRoute;