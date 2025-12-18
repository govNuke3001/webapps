import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2c80ff',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 4,
  },
  disabled: {
    backgroundColor: '#aaa',
  },
  text: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default Button;