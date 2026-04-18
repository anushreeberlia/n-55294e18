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
  res.json({ status: 'ok', message: 'Fitness Buddy API - Ready to help! 🌟' });
});

// Initialize default profile if not exists
function ensureDefaultProfile() {
  let profile = db.getById('users', 1);
  if (!profile) {
    profile = {
      id: 1,
      name: 'Friend',
      age: 28,
      weight: 65,
      height: 165,
      activityLevel: 'very_active',
      goals: ['feel_amazing', 'build_confidence', 'boost_energy'],
      restrictions: [],
      targetDate: null,
      programStartDate: new Date().toISOString().split('T')[0],
      streakDays: 0,
      totalWorkouts: 0,
      createdAt: new Date().toISOString()
    };
    db.insert('users', profile);
    console.log('✨ Created your friendly profile:', profile.name);
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
    res.status(500).json({ error: 'Oops! Something went wrong getting your profile' });
  }
});

app.put('/api/profile', (req, res) => {
  try {
    const updated = db.update('users', 1, req.body);
    console.log('✅ Profile updated successfully:', updated.name);
    res.json(updated);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Could not update your profile right now' });
  }
});

// Daily plan endpoint
app.post('/api/daily-plan', (req, res) => {
  try {
    const { activityType, energyLevel, targetDate, mood } = req.body;
    const profile = ensureDefaultProfile();
    
    if (!profile || typeof profile.weight !== 'number' || typeof profile.height !== 'number' || typeof profile.age !== 'number') {
      console.error('Invalid profile data:', profile);
      return res.status(400).json({ error: 'Let\'s update your profile first to create the perfect plan for you! 😊' });
    }
    
    const recentProgress = db.getAll('progress').slice(-7);

    console.log(`🎯 Creating an amazing plan for ${profile.name}!`);

    const plan = generateDailyPlan({
      profile,
      activityType,
      energyLevel,
      mood: mood || 'good',
      recentProgress,
      date: targetDate || new Date().toISOString().split('T')[0]
    });

    db.insert('daily_plans', {
      ...plan,
      targetDate,
      createdAt: new Date().toISOString()
    });
    
    res.json(plan);
  } catch (error) {
    console.error('Daily plan error:', error);
    res.status(500).json({ error: 'Had trouble creating your plan. Let\'s try again! 🌟' });
  }
});

// Activity logging endpoints
app.get('/api/activity-log', (req, res) => {
  try {
    const { date } = req.query;
    const allLogs = db.getAll('activity_logs');
    const dateLogs = date ? allLogs.filter(log => log.date === date) : allLogs.slice(-20);
    console.log(`📋 Found ${dateLogs.length} activities for you!`);
    res.json(dateLogs);
  } catch (error) {
    console.error('Activity log fetch error:', error);
    res.status(500).json({ error: 'Trouble loading your activities' });
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
    console.log('🎉 Great job logging:', saved.name);
    res.json(saved);
  } catch (error) {
    console.error('Activity log error:', error);
    res.status(500).json({ error: 'Could not save that activity' });
  }
});

app.delete('/api/activity-log/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.remove('activity_logs', parseFloat(id));
    if (deleted) {
      console.log('🗑️ Removed activity:', id);
      res.json({ success: true, message: 'All good! Activity removed' });
    } else {
      res.status(404).json({ error: 'Could not find that activity' });
    }
  } catch (error) {
    console.error('Delete activity log error:', error);
    res.status(500).json({ error: 'Had trouble deleting that' });
  }
});

// Get activity history
app.get('/api/activity-history', (req, res) => {
  try {
    const allLogs = db.getAll('activity_logs');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLogs = allLogs
      .filter(log => new Date(log.date) >= sevenDaysAgo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`📈 Your week looks amazing! ${recentLogs.length} activities`);
    res.json(recentLogs);
  } catch (error) {
    console.error('Activity history error:', error);
    res.status(500).json({ error: 'Could not load your activity history' });
  }
});

// Motivational quotes endpoint
app.get('/api/motivation', (req, res) => {
  const quotes = [
    "You're doing amazing! Every step counts 🌟",
    "Your body can do it. It's your mind you need to convince! 💪",
    "Progress, not perfection. You've got this! 🎯",
    "Strong is the new beautiful, and you're glowing! ✨",
    "Every workout is a gift to your future self 🎁",
    "You're not just changing your body, you're changing your life! 🌈",
    "Believe in yourself as much as we believe in you! 💝"
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote: randomQuote, emoji: '🌟' });
});

// Lunch options endpoint
app.get('/api/lunch-options', (req, res) => {
  try {
    const lunchOptions = [
      {
        id: 1,
        name: 'Sunshine Chicken Bowl',
        description: 'Grilled chicken with colorful veggies',
        protein: 35,
        carbs: 20,
        fat: 12,
        calories: 310,
        bloatRisk: 'low',
        mood: 'energizing',
        emoji: '🌞'
      },
      {
        id: 2,
        name: 'Ocean Power Bowl',
        description: 'Fresh salmon with quinoa goodness',
        protein: 32,
        carbs: 28,
        fat: 16,
        calories: 360,
        bloatRisk: 'low',
        mood: 'satisfying',
        emoji: '🌊'
      },
      {
        id: 3,
        name: 'Garden Wrap Delight',
        description: 'Turkey, avocado & fresh greens',
        protein: 28,
        carbs: 35,
        fat: 14,
        calories: 350,
        bloatRisk: 'medium',
        mood: 'refreshing',
        emoji: '🌿'
      },
      {
        id: 4,
        name: 'Mediterranean Magic',
        description: 'Greek bowl with tender chicken',
        protein: 30,
        carbs: 25,
        fat: 18,
        calories: 345,
        bloatRisk: 'medium',
        mood: 'comforting',
        emoji: '🍅'
      }
    ];
    res.json(lunchOptions);
  } catch (error) {
    console.error('Lunch options error:', error);
    res.status(500).json({ error: 'Could not load lunch options' });
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
    res.status(500).json({ error: 'Could not get your workout schedule' });
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
    console.log('🎉 Amazing progress logged!');
    res.json({ ...saved, message: 'Way to go! Progress saved! 🌟' });
  } catch (error) {
    console.error('Progress save error:', error);
    res.status(500).json({ error: 'Could not save your progress right now' });
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
    res.status(500).json({ error: 'Could not load your progress' });
  }
});

// Celebration endpoint for achievements
app.post('/api/celebrate', (req, res) => {
  const { achievement } = req.body;
  const celebrations = {
    'first_log': '🎉 First activity logged! You\'re on fire!',
    'week_streak': '🔥 7 days in a row! You\'re unstoppable!',
    'goal_reached': '🌟 Goal achieved! You\'re amazing!',
    'workout_completed': '💪 Workout done! You\'re getting stronger!'
  };
  
  const message = celebrations[achievement] || '🎊 Great job! Keep it up!';
  res.json({ message, celebration: true });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unexpected error:', error);
  res.status(500).json({ error: 'Oops! Something went wrong, but we\'re here to help! 💙' });
});

// Initialize default profile on startup
ensureDefaultProfile();

app.listen(PORT, () => {
  console.log(`🚀 Fitness Buddy API is ready to help on port ${PORT}!`);
});