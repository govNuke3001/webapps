import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UserAvatar = ({ 
  userName, 
  size = 80, 
  onPress,
  showEdit = false 
}) => {
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 }
      ]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={[styles.text, { fontSize: size * 0.3 }]}>
        {getInitials(userName)}
      </Text>
      
      {showEdit && (
        <View style={styles.edit}>
          <Text style={styles.editText}>✏️</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2c80ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  edit: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2c80ff',
  },
  editText: {
    fontSize: 12,
  },
});

export default UserAvatar;