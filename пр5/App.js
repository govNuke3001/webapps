import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';

export default function TaskManager() {
  // Состояния
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  // Ключ для AsyncStorage
  const STORAGE_KEY = '@taskmanager_tasks';

  // Загрузка задач из AsyncStorage
  const loadTasksFromStorage = async () => {
    try {
      setIsLoading(true);
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
        setSaveStatus('Данные загружены');
      } else {
        setSaveStatus('Нет сохраненных данных');
      }
      
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setSaveStatus('Ошибка загрузки данных');
      Alert.alert('Ошибка', 'Не удалось загрузить задачи');
    } finally {
      setIsLoading(false);
    }
  };

  // Сохранение задач в AsyncStorage
  const saveTasksToStorage = async (tasksToSave) => {
    try {
      setSaveStatus('Сохранение...');
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
      setSaveStatus('Сохранено');
      
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setSaveStatus('Ошибка сохранения');
      Alert.alert('Ошибка', 'Не удалось сохранить задачи');
    }
  };

  // Эффект для загрузки задач при старте приложения
  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  // Эффект для сохранения задач при их изменении
  useEffect(() => {
    if (!isLoading) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, isLoading]);

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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks(prevTasks => [newTask, ...prevTasks]);
    setInputText('');
    Keyboard.dismiss();
  };

  // Переключение статуса выполнения
  const toggleTask = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { 
          ...task, 
          completed: !task.completed,
          updatedAt: new Date().toISOString()
        } : task
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
        task.id === id ? { 
          ...task, 
          text: newText.trim(),
          updatedAt: new Date().toISOString()
        } : task
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

  // Очистка выполненных задач
  const clearCompleted = () => {
    const completedTasks = tasks.filter(task => task.completed);
    
    if (completedTasks.length === 0) {
      Alert.alert('Информация', 'Нет выполненных задач для очистки');
      return;
    }

    Alert.alert(
      'Очистка задач',
      `Удалить ${completedTasks.length} выполнен${completedTasks.length === 1 ? 'ную' : 'ных'} задач?`,
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

    const getTaskAge = () => {
      const created = new Date(task.createdAt);
      const now = new Date();
      const diffHours = Math.floor((now - created) / (1000 * 60 * 60));
      
      if (diffHours < 1) return 'только что';
      if (diffHours < 24) return `${diffHours} ч. назад`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} д. назад`;
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
            <>
              <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
                {task.text}
              </Text>
              <Text style={styles.taskDate}>{getTaskAge()}</Text>
            </>
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

  // Компонент статистики
  const TaskStatistics = ({ 
    tasks, 
    filter, 
    onFilterChange, 
    onClearCompleted, 
    saveStatus 
  }) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const getStatusColor = () => {
      if (saveStatus.includes('Ошибка')) return '#e74c3c';
      if (saveStatus.includes('Сохранение')) return '#f39c12';
      if (saveStatus.includes('Сохранено') || saveStatus.includes('загружены')) return '#27ae60';
      return '#7f8c8d';
    };

    return (
      <View style={styles.statisticsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Всего</Text>
            <Text style={styles.statValue}>{total}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Активные</Text>
            <Text style={[styles.statValue, styles.statActive]}>{active}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Выполнено</Text>
            <Text style={[styles.statValue, styles.statCompleted]}>{completed}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Прогресс</Text>
            <Text style={styles.statValue}>{completionRate}%</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${completionRate}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => onFilterChange('all')}
          >
            <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
              Все ({total})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
            onPress={() => onFilterChange('active')}
          >
            <Text style={[styles.filterButtonText, filter === 'active' && styles.filterButtonTextActive]}>
              Активные ({active})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
            onPress={() => onFilterChange('completed')}
          >
            <Text style={[styles.filterButtonText, filter === 'completed' && styles.filterButtonTextActive]}>
              Выполненные ({completed})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClearCompleted}
            disabled={completed === 0}
          >
            <Text style={[
              styles.clearButtonText,
              completed === 0 && styles.clearButtonDisabled
            ]}>
              Очистить выполненные ({completed})
            </Text>
          </TouchableOpacity>
        </View>

        {saveStatus ? (
          <View style={styles.saveStatusContainer}>
            <Text style={[styles.saveStatusText, { color: getStatusColor() }]}>
              ● {saveStatus}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const filteredTasks = getFilteredTasks();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Загрузка задач...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      {/* Верхняя панель */}
      <View style={styles.header}>
        <Text style={styles.title}>📋 Менеджер задач</Text>
        <Text style={styles.subtitle}>Задачи сохраняются автоматически</Text>
      </View>

      {/* Поиск */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Поиск задач..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Добавление задачи */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="✏️ Введите новую задачу..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => addTask(inputText)}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addTask(inputText)}
          disabled={inputText.trim().length === 0}
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
        ListHeaderComponent={
          <Text style={styles.listHeader}>
            {filteredTasks.length === 0 
              ? 'Нет задач' 
              : `Найдено задач: ${filteredTasks.length}`}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>
              {searchText ? 'Задачи не найдены' : 'Начните добавлять задачи!'}
            </Text>
          </View>
        }
      />

      {/* Компонент статистики */}
      <TaskStatistics
        tasks={tasks}
        filter={filter}
        onFilterChange={setFilter}
        onClearCompleted={clearCompleted}
        saveStatus={saveStatus}
      />
    </View>
  );
}