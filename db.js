const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || '/data/data.json';

// Ensure data directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Initialize database
function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [],
      daily_plans: [],
      progress: [],
      gut_health: [],
      workouts: [],
      activity_logs: [],
      achievements: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    console.log('💾 Database initialized with love!');
  }
}

function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    initDB();
    return readDB();
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function getAll(collection) {
  const data = readDB();
  return data[collection] || [];
}

function getById(collection, id) {
  const items = getAll(collection);
  return items.find(item => item.id === id);
}

function insert(collection, item) {
  const data = readDB();
  if (!data[collection]) data[collection] = [];
  
  const newItem = {
    ...item,
    id: Date.now() + Math.random(),
    createdAt: item.createdAt || new Date().toISOString()
  };
  
  data[collection].push(newItem);
  writeDB(data);
  return newItem;
}

function update(collection, id, updates) {
  const data = readDB();
  if (!data[collection]) data[collection] = [];
  
  const index = data[collection].findIndex(item => item.id === id);
  if (index === -1) {
    const newItem = { ...updates, id, updatedAt: new Date().toISOString() };
    data[collection].push(newItem);
    writeDB(data);
    return newItem;
  }
  
  data[collection][index] = {
    ...data[collection][index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  writeDB(data);
  return data[collection][index];
}

function remove(collection, id) {
  const data = readDB();
  if (!data[collection]) return false;
  
  const index = data[collection].findIndex(item => item.id === id);
  if (index === -1) return false;
  
  data[collection].splice(index, 1);
  writeDB(data);
  return true;
}

// Initialize on startup
initDB();

module.exports = {
  getAll,
  getById,
  insert,
  update,
  remove
};