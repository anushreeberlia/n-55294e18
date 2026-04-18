// Friendly nutrition and meal planning

const mealDatabase = {
  breakfast: [
    {
      name: 'Morning Power Bowl',
      description: 'Creamy oats with fresh berries',
      protein: 25, carbs: 45, fat: 8, calories: 340,
      bloatRisk: 'low', prepTime: 5,
      mood: 'energizing',
      emoji: '🌅',
      ingredients: ['oats', 'protein powder', 'berries', 'almond milk']
    },
    {
      name: 'Sunshine Parfait',
      description: 'Greek yogurt layered with goodness',
      protein: 20, carbs: 25, fat: 12, calories: 260,
      bloatRisk: 'medium', prepTime: 3,
      mood: 'cheerful',
      emoji: '☀️',
      ingredients: ['greek yogurt', 'berries', 'nuts', 'honey']
    },
    {
      name: 'Cloud Nine Scramble',
      description: 'Fluffy eggs with fresh herbs',
      protein: 24, carbs: 8, fat: 2, calories: 145,
      bloatRisk: 'low', prepTime: 7,
      mood: 'satisfying',
      emoji: '☁️',
      ingredients: ['egg whites', 'spinach', 'tomatoes', 'herbs']
    },
    {
      name: 'Green Goddess Smoothie',
      description: 'Tropical blend of goodness',
      protein: 28, carbs: 35, fat: 6, calories: 295,
      bloatRisk: 'low', prepTime: 3,
      mood: 'refreshing',
      emoji: '🥤',
      ingredients: ['protein powder', 'banana', 'spinach', 'coconut water']
    }
  ],
  dinner: [
    {
      name: 'Ocean Delight',
      description: 'Grilled salmon with rainbow veggies',
      protein: 35, carbs: 20, fat: 18, calories: 365,
      bloatRisk: 'low', prepTime: 15,
      mood: 'nourishing',
      emoji: '🐟',
      ingredients: ['salmon', 'broccoli', 'sweet potato', 'olive oil']
    },
    {
      name: 'Garden Party Bowl',
      description: 'Chicken with colorful stir-fried veggies',
      protein: 32, carbs: 25, fat: 12, calories: 315,
      bloatRisk: 'low', prepTime: 12,
      mood: 'vibrant',
      emoji: '🌈',
      ingredients: ['chicken breast', 'mixed vegetables', 'ginger', 'coconut oil']
    },
    {
      name: 'Cozy Comfort Bowl',
      description: 'Lean beef with fluffy quinoa',
      protein: 30, carbs: 35, fat: 15, calories: 365,
      bloatRisk: 'medium', prepTime: 20,
      mood: 'comforting',
      emoji: '🍲',
      ingredients: ['lean beef', 'quinoa', 'asparagus', 'herbs']
    },
    {
      name: 'Italian Dreams',
      description: 'Turkey meatballs with zucchini noodles',
      protein: 28, carbs: 15, fat: 14, calories: 275,
      bloatRisk: 'low', prepTime: 18,
      mood: 'satisfying',
      emoji: '🍝',
      ingredients: ['ground turkey', 'zucchini noodles', 'herbs', 'tomato sauce']
    }
  ],
  snacks: [
    {
      name: 'Apple Hug',
      description: 'Crisp apple with almond butter',
      protein: 6, carbs: 25, fat: 16, calories: 245,
      bloatRisk: 'low', prepTime: 1,
      emoji: '🍎'
    },
    {
      name: 'Energy Boost Bar',
      description: 'Protein-packed goodness',
      protein: 20, carbs: 15, fat: 8, calories: 200,
      bloatRisk: 'low', prepTime: 0,
      emoji: '⚡'
    },
    {
      name: 'Perfect Eggs',
      description: 'Two hard-boiled eggs',
      protein: 12, carbs: 1, fat: 10, calories: 140,
      bloatRisk: 'low', prepTime: 0,
      emoji: '🥚'
    }
  ]
};

const foodWisdom = {
  // Feel-good foods
  feelGoodFoods: ['chicken breast', 'salmon', 'egg whites', 'spinach', 'berries', 'quinoa', 'sweet potato'],
  // Gentle on tummy
  gentleFoods: ['rice', 'chicken', 'fish', 'spinach', 'carrots', 'berries', 'banana'],
  // Power proteins
  powerProteins: ['chicken breast', 'salmon', 'egg whites', 'greek yogurt', 'protein powder', 'lean beef']
};

function generateDailyPlan({ profile, activityType, energyLevel, mood, recentProgress, date }) {
  const baseCalories = calculateFriendlyCalories(profile, activityType);
  const adjustment = profile.calorieAdjustment || 0;
  const targetCalories = baseCalories + adjustment;
  
  const proteinTarget = Math.max(80, Math.min(110, profile.weight * 1.6));
  const carbTarget = activityType === 'rest' ? targetCalories * 0.3 / 4 : targetCalories * 0.4 / 4;
  const fatTarget = targetCalories * 0.25 / 9;
  
  const hydrationTarget = activityType === 'muay_thai' ? 3.5 : 2.5;
  
  const workoutVibes = getWorkoutVibes(activityType, energyLevel, mood, date);
  
  const encouragement = getEncouragement(profile, activityType, energyLevel);
  
  return {
    date,
    calories: {
      min: targetCalories - 50,
      max: targetCalories + 50,
      target: targetCalories
    },
    macros: {
      protein: proteinTarget,
      carbs: carbTarget,
      fat: fatTarget
    },
    hydration: hydrationTarget,
    workout: workoutVibes,
    encouragement,
    mood: mood || 'amazing',
    wellness: {
      fiberGoal: 25,
      positiveVibes: true,
      selfCare: ['stay hydrated', 'celebrate small wins', 'be kind to yourself']
    }
  };
}

function calculateFriendlyCalories(profile, activityType) {
  // BMR calculation for women (Mifflin-St Jeor)
  const bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
  
  const activityVibes = {
    'muay_thai': 1.9,  // High energy warrior mode!
    'running': 1.8,    // Runner's high!
    'soccer': 1.8,     // Team spirit energy!
    'strength': 1.6,   // Building strength!
    'rest': 1.4        // Recovery & self-care
  };
  
  const tdee = bmr * (activityVibes[activityType] || 1.6);
  
  // Gentle deficit for sustainable progress
  return Math.round(tdee * 0.85);
}

function getWorkoutVibes(activityType, energyLevel, mood, date) {
  const dayOfWeek = new Date(date).getDay();
  
  if (activityType === 'muay_thai') {
    return {
      type: 'muay_thai',
      name: 'Warrior Training',
      duration: 60,
      intensity: energyLevel === 'high' ? 'powerful' : 'steady',
      vibe: 'You\'re a warrior! 🥊',
      recovery: 'Stretch and hydrate like a champion!',
      emoji: '🥊'
    };
  }
  
  if (dayOfWeek === 3) { // Wednesday wellness
    return {
      type: 'recovery',
      name: 'Self-Care Wednesday',
      duration: 30,
      intensity: 'gentle',
      vibe: 'Rest is productive too! 🧘‍♀️',
      recovery: 'Gentle stretches, deep breaths, early bedtime',
      emoji: '🌸'
    };
  }
  
  if ([1, 3, 5].includes(dayOfWeek) && activityType !== 'muay_thai') {
    return {
      type: 'strength',
      name: 'Power Building',
      duration: 10,
      intensity: 'focused',
      vibe: 'Short and strong! You\'ve got this! 💪',
      focus: ['lower body love', 'core confidence'],
      exercises: ['sumo squats', 'side lunges', 'feel-good deadlifts'],
      emoji: '💪'
    };
  }
  
  return {
    type: 'active_recovery',
    name: 'Gentle Movement',
    duration: 20,
    intensity: 'peaceful',
    vibe: 'Movement is medicine! 🌿',
    recovery: 'Light walk or flowing yoga',
    emoji: '🌿'
  };
}

function getEncouragement(profile, activityType, energyLevel) {
  const encouragements = {
    'muay_thai': 'Channel your inner warrior today! You\'re stronger than you know! 🥊✨',
    'running': 'Every step is a victory! You\'re amazing! 🏃‍♀️💫',
    'soccer': 'Play with joy and passion! You\'re a star! ⚽🌟',
    'strength': 'Building strength inside and out! You\'re incredible! 💪🌈',
    'rest': 'Rest days are glow-up days! You\'re taking great care of yourself! 🛋️💕'
  };
  
  const baseMsg = encouragements[activityType] || 'You\'re doing amazing! Keep shining! ✨';
  
  if (energyLevel === 'low') {
    return baseMsg + ' Take it easy today - progress comes in all forms! 💙';
  } else if (energyLevel === 'high') {
    return baseMsg + ' Your energy is contagious! Let\'s make today incredible! 🚀';
  }
  
  return baseMsg;
}

function selectFriendlyMeal(category, criteria) {
  const options = mealDatabase[category].filter(meal => {
    if (criteria.minProtein && meal.protein < criteria.minProtein) return false;
    if (criteria.maxCalories && meal.calories > criteria.maxCalories) return false;
    if (criteria.gentleOnly && meal.bloatRisk === 'high') return false;
    return true;
  });
  
  if (options.length === 0) {
    return mealDatabase[category][0]; // Fallback with love
  }
  
  // Prioritize mood and nutrition balance
  return options.sort((a, b) => {
    const aScore = (a.protein * 2) + (a.bloatRisk === 'low' ? 15 : 0) + (a.mood === 'energizing' ? 10 : 0);
    const bScore = (b.protein * 2) + (b.bloatRisk === 'low' ? 15 : 0) + (b.mood === 'energizing' ? 10 : 0);
    return bScore - aScore;
  })[0];
}

function adjustMacros({ lunch, targets, profile, preferences = {} }) {
  const lunchMacros = {
    protein: lunch.protein || 0,
    carbs: lunch.carbs || 0,
    fat: lunch.fat || 0,
    calories: lunch.calories || 0
  };
  
  const remaining = {
    protein: targets.protein - lunchMacros.protein,
    carbs: targets.carbs - lunchMacros.carbs,
    fat: targets.fat - lunchMacros.fat,
    calories: targets.calories - lunchMacros.calories
  };
  
  const breakfast = selectFriendlyMeal('breakfast', {
    minProtein: Math.max(20, remaining.protein * 0.4),
    maxCalories: remaining.calories * 0.35,
    gentleOnly: preferences.gentleTummy
  });
  
  const afterBreakfast = {
    protein: remaining.protein - breakfast.protein,
    carbs: remaining.carbs - breakfast.carbs,
    fat: remaining.fat - breakfast.fat,
    calories: remaining.calories - breakfast.calories
  };
  
  const dinner = selectFriendlyMeal('dinner', {
    minProtein: Math.max(25, afterBreakfast.protein * 0.8),
    maxCalories: afterBreakfast.calories * 0.85,
    gentleOnly: preferences.gentleTummy
  });
  
  const afterDinner = {
    protein: afterBreakfast.protein - dinner.protein,
    calories: afterBreakfast.calories - dinner.calories
  };
  
  let snack = null;
  if (afterDinner.calories > 150 && afterDinner.protein > 5) {
    snack = selectFriendlyMeal('snacks', {
      maxCalories: afterDinner.calories,
      minProtein: 5,
      gentleOnly: preferences.gentleTummy
    });
  }
  
  return {
    breakfast: {
      ...breakfast,
      timing: '7:00 AM',
      message: 'Start your day with sunshine! 🌅'
    },
    lunch: {
      ...lunch,
      timing: '12:30 PM',
      source: 'uber_cafe',
      message: 'Midday fuel for your amazing self! 🌟'
    },
    dinner: {
      ...dinner,
      timing: '7:00 PM',
      message: 'Evening nourishment to end your day right! 🌙'
    },
    snack: snack ? {
      ...snack,
      timing: '3:30 PM',
      optional: true,
      message: 'A little extra love for your day! 💕'
    } : null,
    totals: {
      protein: breakfast.protein + lunchMacros.protein + dinner.protein + (snack?.protein || 0),
      carbs: breakfast.carbs + lunchMacros.carbs + dinner.carbs + (snack?.carbs || 0),
      fat: breakfast.fat + lunchMacros.fat + dinner.fat + (snack?.fat || 0),
      calories: breakfast.calories + lunchMacros.calories + dinner.calories + (snack?.calories || 0)
    },
    dailyMessage: 'You\'re nourishing your body beautifully! 🌈✨'
  };
}

function getFoodWisdom(foodName) {
  const food = foodName.toLowerCase();
  
  const isFeelGood = foodWisdom.feelGoodFoods.some(f => food.includes(f));
  const isGentle = foodWisdom.gentleFoods.some(f => food.includes(f));
  const isPowerProtein = foodWisdom.powerProteins.some(f => food.includes(f));
  
  let message = 'Great choice! ';
  let emoji = '👍';
  
  if (isFeelGood && isPowerProtein) {
    message = 'Superstar food choice! This will fuel your amazing day! ';
    emoji = '⭐';
  } else if (isGentle) {
    message = 'Gentle and nourishing - your body will thank you! ';
    emoji = '🌸';
  } else if (isPowerProtein) {
    message = 'Protein power! Building strength from the inside out! ';
    emoji = '💪';
  }
  
  return {
    name: foodName,
    message,
    emoji,
    feelGoodFood: isFeelGood,
    gentleFood: isGentle,
    powerProtein: isPowerProtein,
    vibe: getHealthVibe(food)
  };
}

function getHealthVibe(food) {
  if (food.includes('berries') || food.includes('fruits')) return 'antioxidant boost';
  if (food.includes('salmon') || food.includes('fish')) return 'omega-3 goodness';
  if (food.includes('spinach') || food.includes('greens')) return 'vitamin powerhouse';
  if (food.includes('yogurt') || food.includes('kefir')) return 'gut health hero';
  return 'nourishing choice';
}

module.exports = {
  generateDailyPlan,
  adjustMacros,
  getFoodWisdom
};