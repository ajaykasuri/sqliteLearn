
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  initDatabase,
  addTask,
  getTasks,
    toggleTask,
  deleteTask,
} from './database';

export default function App() {
  const [db, setDb] = useState(null);
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function setup() {
      try {
        const database = await initDatabase();
        setDb(database);

        const savedTasks = await getTasks(database);
        setTasks(savedTasks);
      } catch (error) {
        console.error('Database setup failed:', error);
      }
    }

    setup();
  }, []);

  async function handleAddTask() {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task');
      return;
    }

    try {
      await addTask(db, title.trim());

      const savedTasks = await getTasks(db);
      setTasks(savedTasks);
      setTitle('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  }

  if (!db) {
    return <Text>Loading database...</Text>;
  }
  
async function handleToggleTask(task) {
  await toggleTask(db, task.id, task.completed);
  const updatedTasks = await getTasks(db);
  setTasks(updatedTasks);
}

async function handleDeleteTask(id) {
  await deleteTask(db, id);
  const updatedTasks = await getTasks(db);
  setTasks(updatedTasks);
}


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Tasks</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={title}
        onChangeText={setTitle}
      />

      <Button title="Add Task" onPress={handleAddTask} />

     
<FlatList
  data={tasks}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => (
    <View style={styles.taskRow}>
      <Text
        onPress={() => handleToggleTask(item)}
        style={[
          styles.task,
          item.completed === 1 && styles.completedTask,
        ]}
      >
        {item.completed === 1 ? '✅ ' : '⬜ '}
        {item.title}
      </Text>

      <Button
        title="Delete"
        onPress={() => handleDeleteTask(item.id)}
        color="red"
      />
    </View>
  )}
  ListEmptyComponent={<Text>No tasks yet.</Text>}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  task: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
  },
  taskRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottomWidth: 1,
  borderBottomColor: '#ddd',
},
completedTask: {
  textDecorationLine: 'line-through',
  color: 'gray',
},
});
