import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const FilterButtons = ({ specialties, selectedSpecialty, onSpecialtyChange }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {specialties.map((specialty) => (
        <TouchableOpacity
          key={specialty}
          style={[
            styles.button,
            selectedSpecialty === specialty && styles.buttonActive
          ]}
          onPress={() => onSpecialtyChange(specialty)}
        >
          <Text style={[
            styles.text,
            selectedSpecialty === specialty && styles.textActive
          ]}>
            {specialty}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: 'white',
  },
  buttonActive: {
    backgroundColor: '#2c80ff',
    borderColor: '#2c80ff',
  },
  text: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  textActive: {
    color: 'white',
  },
});

export default FilterButtons;