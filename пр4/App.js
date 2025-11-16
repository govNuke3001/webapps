import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert,
  StatusBar
} from 'react-native';
import { styles } from './styles';

export default function TaskManager() {
  // Состояния
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Добавление новой задачи
  const addTask = (text) => {
    if (text.trim().length === 0) {
      Alert.alert('Ошибка', 'Введите текст задачи');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks(prevTasks => [newTask, ...prevTasks]);
    setInputText('');
    Keyboard.dismiss();
  };

  // Переключение статуса выполнения
  const toggleTask = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Удаление задачи
  const deleteTask = (id) => {
    Alert.alert(
      'Удаление задачи',
      'Вы уверены, что хотите удалить эту задачу?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
          }
        }
      ]
    );
  };

  // Редактирование задачи
  const editTask = (id, newText) => {
    if (newText.trim().length === 0) {
      Alert.alert('Ошибка', 'Текст задачи не может быть пустым');
      return;
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, text: newText.trim() } : task
      )
    );
  };

  // Фильтрация задач
  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // Применяем фильтр по статусу
    if (filter === 'active') {
      filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    }

    // Применяем поиск
    if (searchText.trim().length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filteredTasks;
  };

  // Статистика задач
  const getTasksStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;

    return { total, completed, active };
  };

  // Очистка выполненных задач
  const clearCompleted = () => {
    if (tasks.some(task => task.completed)) {
      Alert.alert(
        'Очистка задач',
        'Удалить все выполненные задачи?',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Очистить',
            style: 'destructive',
            onPress: () => {
              setTasks(prevTasks => prevTasks.filter(task => !task.completed));
            }
          }
        ]
      );
    } else {
      Alert.alert('Информация', 'Нет выполненных задач для очистки');
    }
  };

  // Компонент задачи
  const TaskItem = ({ task }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);

    const handleEdit = () => {
      if (isEditing) {
        editTask(task.id, editText);
      }
      setIsEditing(!isEditing);
    };

    const handleCancelEdit = () => {
      setEditText(task.text);
      setIsEditing(false);
    };

    return (
      <View style={[styles.taskItem, task.completed && styles.taskCompleted]}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => toggleTask(task.id)}
        >
          <View style={[styles.checkboxInner, task.completed && styles.checkboxChecked]}>
            {task.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.taskContent}>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              autoFocus
              onSubmitEditing={handleEdit}
            />
          ) : (
            <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
              {task.text}
            </Text>
          )}
        </View>

        <View style={styles.taskActions}>
          {isEditing ? (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
                <Text style={styles.actionText}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleCancelEdit}>
                <Text style={styles.actionText}>✕</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.actionText}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => deleteTask(task.id)}>
                <Text style={styles.actionText}>🗑</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  const filteredTasks = getFilteredTasks();
  const stats = getTasksStats();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      {/* Верхняя панель */}
      <View style={styles.header}>
        <Text style={styles.title}>Менеджер задач</Text>
        <View style={styles.stats}>
          <Text style={styles.statsText}>Всего: {stats.total}</Text>
          <Text style={styles.statsText}>Активные: {stats.active}</Text>
          <Text style={styles.statsText}>Выполненные: {stats.completed}</Text>
        </View>
      </View>

      {/* Поиск */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск задач..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Добавление задачи */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Введите новую задачу..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => addTask(inputText)}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addTask(inputText)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Список задач */}
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => <TaskItem task={item} />}
        keyExtractor={item => item.id}
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText ? 'Задачи не найдены' : 'Нет задач'}
          </Text>
        }
      />

      {/* Панель управления */}
      <View style={styles.controls}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
              Все
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
            onPress={() => setFilter('active')}
          >
            <Text style={[styles.filterButtonText, filter === 'active' && styles.filterButtonTextActive]}>
              Активные
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterButtonText, filter === 'completed' && styles.filterButtonTextActive]}>
              Выполненные
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearCompleted}
        >
          <Text style={styles.clearButtonText}>Очистить выполненные</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}