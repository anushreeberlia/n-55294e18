const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const db = require('./db');
const { generateDailyPlan, adjustMacros, getFoodIntelligence } = require('./nutrition');
const { getWorkoutPlan, scheduleStrengthWorkouts } = require('./workouts');

const app = express();
app.use(require("express").static(require("path").join(__dirname, "public")));
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

// User profile endpoints
app.get('/api/profile', (req, res) => {
  try {
    const profile = db.getById('users', 1) || {
      id: 1,
      name: 'Athlete',
      age: 28,
      weight: 65,
      height: 165,
      activityLevel: 'very_active',
      goals: ['fat_loss', 'muscle_tone', 'reduce_bloating'],
      restrictions: ['dairy_sensitive'],
      createdAt: new Date().toISOString()
    };
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
    const { activityType, energyLevel, date } = req.body;
    const profile = db.getById('users', 1);
    const recentProgress = db.getAll('progress').slice(-7);
    
    const plan = generateDailyPlan({
      profile,
      activityType,
      energyLevel,
      recentProgress,
      date
    });
    
    // Save the plan
    db.insert('daily_plans', {
      ...plan,
      date,
      createdAt: new Date().toISOString()
    });
    
    res.json(plan);
  } catch (error) {
    console.error('Daily plan error:', error);
    res.status(500).json({ error: 'Failed to generate daily plan' });
  }
});

// Meal planning endpoints
app.get('/api/lunch-options', async (req, res) => {
  try {
    // Simulate fetching from Uber cafe menu
    // In production, this would call the actual API
    const mockLunchOptions = [
      {
        id: 1,
        name: 'Grilled Chicken Bowl',
        protein: 35,
        carbs: 45,
        fat: 12,
        calories: 410,
        bloatRisk: 'low',
        ingredients: ['grilled chicken', 'quinoa', 'vegetables']
      },
      {
        id: 2,
        name: 'Salmon Salad',
        protein: 32,
        carbs: 15,
        fat: 18,
        calories: 320,
        bloatRisk: 'low',
        ingredients: ['salmon', 'mixed greens', 'avocado']
      },
      {
        id: 3,
        name: 'Turkey Wrap',
        protein: 28,
        carbs: 38,
        fat: 15,
        calories: 380,
        bloatRisk: 'medium',
        ingredients: ['turkey', 'whole wheat wrap', 'vegetables']
      }
    ];
    
    res.json(mockLunchOptions);
  } catch (error) {
    console.error('Lunch options error:', error);
    res.status(500).json({ error: 'Failed to get lunch options' });
  }
});

app.post('/api/generate-meals', (req, res) => {
  try {
    const { lunchChoice, dailyTargets, preferences } = req.body;
    const profile = db.getById('users', 1);
    
    const meals = adjustMacros({
      lunch: lunchChoice,
      targets: dailyTargets,
      profile,
      preferences
    });
    
    res.json(meals);
  } catch (error) {
    console.error('Meal generation error:', error);
    res.status(500).json({ error: 'Failed to generate meals' });
  }
});

// Food intelligence
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
    const schedule = scheduleStrengthWorkouts(date);
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
    console.error('Workout plan error:', error);
    res.status(500).json({ error: 'Failed to get workout plan' });
  }
});

// Progress tracking
app.post('/api/progress', (req, res) => {
  try {
    const progress = {
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    const saved = db.insert('progress', progress);
    res.json(saved);
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.get('/api/progress', (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(days));
    
    const progress = db.getAll('progress')
      .filter(p => new Date(p.date) >= cutoff)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(progress);
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Gut health tracking
app.post('/api/gut-health', (req, res) => {
  try {
    const entry = {
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    const saved = db.insert('gut_health', entry);
    res.json(saved);
  } catch (error) {
    console.error('Gut health error:', error);
    res.status(500).json({ error: 'Failed to save gut health data' });
  }
});

app.get('/api/gut-health/analysis', (req, res) => {
  try {
    const recentEntries = db.getAll('gut_health').slice(-14);
    const analysis = {
      avgBloating: recentEntries.reduce((sum, e) => sum + (e.bloatingLevel || 0), 0) / recentEntries.length,
      constipationDays: recentEntries.filter(e => e.constipation).length,
      triggerFoods: recentEntries.flatMap(e => e.triggerFoods || []),
      recommendation: 'Increase fiber intake and hydration'
    };
    
    res.json(analysis);
  } catch (error) {
    console.error('Gut health analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze gut health' });
  }
});

// Weekly adaptation
cron.schedule('0 6 * * 1', () => {
  console.log('Running weekly adaptation...');
  try {
    const profile = db.getById('users', 1);
    const recentProgress = db.getAll('progress').slice(-14);
    
    // Simple adaptation logic
    if (recentProgress.length >= 7) {
      const avgWeight = recentProgress.reduce((sum, p) => sum + (p.weight || 0), 0) / recentProgress.length;
      const lastWeight = recentProgress[0].weight;
      
      if (Math.abs(avgWeight - lastWeight) < 0.5) {
        // No significant change, reduce calories slightly
        const updatedProfile = {
          ...profile,
          calorieAdjustment: (profile.calorieAdjustment || 0) - 50
        };
        db.update('users', 1, updatedProfile);
        console.log('Reduced calories by 50 due to plateau');
      }
    }
  } catch (error) {
    console.error('Weekly adaptation error:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});