const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const db = require('./db');
const { generateDailyPlan, adjustMacros, getFoodIntelligence } = require('./nutrition');
const { getWorkoutPlan, scheduleStrengthWorkouts } = require('./workouts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/', (req, res) => {  
  res.json({ status: 'ok', message: 'Athlete Fitness API' });
});

// Initialize default profile if not exists
function ensureDefaultProfile() {
  let profile = db.getById('users', 1);
  if (!profile) {
    profile = {
      id: 1,
      name: 'Athlete',
      age: 28,
      weight: 65,
      height: 165,
      activityLevel: 'very_active',
      goals: ['fat_loss', 'muscle_tone', 'reduce_bloating'],
      restrictions: ['dairy_sensitive'],
      targetDate: new Date('2024-12-31').toISOString().split('T')[0], // Default target
      programStartDate: new Date('2024-01-01').toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    db.insert('users', profile);
  }
  return profile;
}

// User profile endpoints
app.get('/api/profile', (req, res) => {
  try {
    const profile = ensureDefaultProfile();
    res.json(profile);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

app.put('/api/profile', (req, res) => {
  try {
    const updated = db.update('users', 1, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Daily plan endpoint
app.post('/api/daily-plan', (req, res) => {
  try {
    const { activityType, energyLevel, targetDate } = req.body;
    const profile = ensureDefaultProfile(); // Always ensure profile exists
    const recentProgress = db.getAll('progress').slice(-7);

    console.log('Generating plan for profile:', profile?.name, 'weight:', profile?.weight);

    const plan = generateDailyPlan({
      profile,
      activityType,
      energyLevel,
      recentProgress,
      date: targetDate || new Date().toISOString().split('T')[0]
    });

    // Save the plan
    db.insert('daily_plans', {
      ...plan,
      targetDate,
      createdAt: new Date().toISOString()
    });
    
    res.json(plan);
  } catch (error) {
    console.error('Daily plan error:', error);
    res.status(500).json({ error: 'Failed to generate daily plan: ' + error.message });
  }
});

// Activity logging endpoints
app.get('/api/activity-log', (req, res) => {
  try {
    const { date } = req.query;
    const allLogs = db.getAll('activity_logs');
    const dateLogs = date ? allLogs.filter(log => log.date === date) : allLogs.slice(-20);
    res.json(dateLogs);
  } catch (error) {
    console.error('Activity log fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

app.post('/api/activity-log', (req, res) => {
  try {
    const { activityType, name, calories, notes, portion } = req.body;
    const today = new Date().toISOString().split('T')[0];
    
    const logEntry = {
      activityType: activityType || 'food',
      name,
      calories: calories || 0,
      notes,
      portion: portion || 1,
      date: today,
      createdAt: new Date().toISOString()
    };
    
    const saved = db.insert('activity_logs', logEntry);
    res.json(saved);
  } catch (error) {
    console.error('Activity log error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

app.delete('/api/activity-log/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.remove('activity_logs', parseFloat(id));
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Activity log not found' });
    }
  } catch (error) {
    console.error('Delete activity log error:', error);
    res.status(500).json({ error: 'Failed to delete activity log' });
  }
});

// Lunch options endpoint (mock data)
app.get('/api/lunch-options', (req, res) => {
  try {
    const lunchOptions = [
      {
        id: 1,
        name: 'Grilled Chicken Salad Bowl',
        protein: 35,
        carbs: 20,
        fat: 12,
        calories: 310,
        bloatRisk: 'low',
        source: 'uber_cafe'
      },
      {
        id: 2,
        name: 'Salmon Quinoa Power Bowl',
        protein: 32,
        carbs: 28,
        fat: 16,
        calories: 360,
        bloatRisk: 'low',
        source: 'uber_cafe'
      },
      {
        id: 3,
        name: 'Turkey & Avocado Wrap',
        protein: 28,
        carbs: 35,
        fat: 14,
        calories: 350,
        bloatRisk: 'medium',
        source: 'uber_cafe'
      },
      {
        id: 4,
        name: 'Greek Bowl with Chicken',
        protein: 30,
        carbs: 25,
        fat: 18,
        calories: 345,
        bloatRisk: 'medium',
        source: 'uber_cafe'
      }
    ];
    res.json(lunchOptions);
  } catch (error) {
    console.error('Lunch options error:', error);
    res.status(500).json({ error: 'Failed to get lunch options' });
  }
});

// Meal generation endpoint
app.post('/api/generate-meals', (req, res) => {
  try {
    const { lunchChoice, dailyTargets, preferences } = req.body;
    const profile = ensureDefaultProfile();
    
    const mealPlan = adjustMacros({
      lunch: lunchChoice,
      targets: dailyTargets,
      profile,
      preferences
    });
    
    res.json(mealPlan);
  } catch (error) {
    console.error('Meal generation error:', error);
    res.status(500).json({ error: 'Failed to generate meals' });
  }
});

// Food intelligence endpoint
app.post('/api/food-intelligence', (req, res) => {
  try {
    const { foodName } = req.body;
    const intelligence = getFoodIntelligence(foodName);
    res.json(intelligence);
  } catch (error) {
    console.error('Food intelligence error:', error);
    res.status(500).json({ error: 'Failed to analyze food' });
  }
});

// Workout endpoints
app.get('/api/workout-schedule', (req, res) => {
  try {
    const { date } = req.query;
    const schedule = scheduleStrengthWorkouts(date || new Date().toISOString().split('T')[0]);
    res.json(schedule);
  } catch (error) {
    console.error('Workout schedule error:', error);
    res.status(500).json({ error: 'Failed to get workout schedule' });
  }
});

app.get('/api/workout/:type', (req, res) => {
  try {
    const { type } = req.params;
    const workout = getWorkoutPlan(type);
    res.json(workout);
  } catch (error) {
    console.error('Workout error:', error);
    res.status(500).json({ error: 'Failed to get workout' });
  }
});

// Progress tracking endpoints
app.post('/api/progress', (req, res) => {
  try {
    const progressData = {
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    const saved = db.insert('progress', progressData);
    res.json(saved);
  } catch (error) {
    console.error('Progress save error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.get('/api/progress', (req, res) => {
  try {
    const { days = 30 } = req.query;
    const allProgress = db.getAll('progress');
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    const recentProgress = allProgress
      .filter(p => new Date(p.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    res.json(recentProgress);
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Gut health endpoints
app.post('/api/gut-health', (req, res) => {
  try {
    const gutHealthData = {
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    const saved = db.insert('gut_health', gutHealthData);
    res.json(saved);
  } catch (error) {
    console.error('Gut health save error:', error);
    res.status(500).json({ error: 'Failed to save gut health data' });
  }
});

app.get('/api/gut-health/analysis', (req, res) => {
  try {
    const recentData = db.getAll('gut_health').slice(-14);
    
    if (recentData.length === 0) {
      return res.json({
        avgBloating: null,
        constipationDays: 0,
        recommendation: 'Start logging gut health data to get personalized insights'
      });
    }
    
    const avgBloating = recentData.reduce((sum, d) => sum + (d.bloatingLevel || 5), 0) / recentData.length;
    const constipationDays = recentData.filter(d => d.constipated).length;
    
    let recommendation = 'Keep up the good work!';
    if (avgBloating > 7) {
      recommendation = 'Consider reducing dairy and processed foods for a few days';
    } else if (constipationDays > 3) {
      recommendation = 'Increase fiber intake and ensure adequate hydration';
    }
    
    res.json({
      avgBloating,
      constipationDays,
      recommendation
    });
  } catch (error) {
    console.error('Gut health analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze gut health' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize default profile on startup
ensureDefaultProfile();

app.listen(PORT, () => {
  console.log(`Athlete Fitness API running on port ${PORT}`);
});