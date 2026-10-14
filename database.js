
import * as SQLite from 'expo-sqlite';

export async function initDatabase() {
  const db = await SQLite.openDatabaseAsync('tasks.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0
    );
  `);

  return db;
}

export async function addTask(db, title) {
  await db.runAsync(
    'INSERT INTO tasks (title) VALUES (?)',
    title
  );
}

export async function getTasks(db) {
  return await db.getAllAsync(
    'SELECT * FROM tasks ORDER BY id DESC'
  );
}

export async function toggleTask(db, id, completed) {
  await db.runAsync(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    completed ? 0 : 1,
    id
  );
}

export async function deleteTask(db, id) {
  await db.runAsync(
    'DELETE FROM tasks WHERE id = ?',
    id
  );
}
