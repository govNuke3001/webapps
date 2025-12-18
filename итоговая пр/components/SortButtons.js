import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const SortButtons = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { key: 'rating', label: 'По рейтингу' },
    { key: 'name', label: 'По имени' },
    { key: 'experience', label: 'По опыту' },
    { key: 'price', label: 'По цене' },
  ];

  return (
    <View style={styles.container}>
      {sortOptions.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.button,
            sortBy === option.key && styles.buttonActive
          ]}
          onPress={() => onSortChange(option.key)}
        >
          <Text style={[
            styles.text,
            sortBy === option.key && styles.textActive
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  buttonActive: {
    backgroundColor: '#2c80ff',
    borderColor: '#2c80ff',
  },
  text: {
    fontSize: 13,
    color: '#666',
  },
  textActive: {
    color: 'white',
    fontWeight: '500',
  },
});

export default SortButtons;