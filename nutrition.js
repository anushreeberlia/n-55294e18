// Nutrition and meal planning logic

const mealDatabase = {
  breakfast: [
    {
      name: 'Protein Oats with Berries',
      protein: 25, carbs: 45, fat: 8, calories: 340,
      bloatRisk: 'low', prepTime: 5,
      ingredients: ['oats', 'protein powder', 'berries', 'almond milk']
    },
    {
      name: 'Greek Yogurt Parfait',
      protein: 20, carbs: 25, fat: 12, calories: 260,
      bloatRisk: 'medium', prepTime: 3,
      ingredients: ['greek yogurt', 'berries', 'nuts', 'honey']
    },
    {
      name: 'Egg White Scramble',
      protein: 24, carbs: 8, fat: 2, calories: 145,
      bloatRisk: 'low', prepTime: 7,
      ingredients: ['egg whites', 'spinach', 'tomatoes', 'herbs']
    },
    {
      name: 'Protein Smoothie',
      protein: 28, carbs: 35, fat: 6, calories: 295,
      bloatRisk: 'low', prepTime: 3,
      ingredients: ['protein powder', 'banana', 'spinach', 'almond milk']
    }
  ],
  dinner: [
    {
      name: 'Grilled Salmon with Vegetables',
      protein: 35, carbs: 20, fat: 18, calories: 365,
      bloatRisk: 'low', prepTime: 15,
      ingredients: ['salmon', 'broccoli', 'sweet potato', 'olive oil']
    },
    {
      name: 'Chicken Stir-fry',
      protein: 32, carbs: 25, fat: 12, calories: 315,
      bloatRisk: 'low', prepTime: 12,
      ingredients: ['chicken breast', 'mixed vegetables', 'ginger', 'coconut oil']
    },
    {
      name: 'Lean Beef with Quinoa',
      protein: 30, carbs: 35, fat: 15, calories: 365,
      bloatRisk: 'medium', prepTime: 20,
      ingredients: ['lean beef', 'quinoa', 'asparagus', 'herbs']
    },
    {
      name: 'Turkey Meatballs with Zucchini',
      protein: 28, carbs: 15, fat: 14, calories: 275,
      bloatRisk: 'low', prepTime: 18,
      ingredients: ['ground turkey', 'zucchini noodles', 'herbs', 'tomato sauce']
    }
  ],
  snacks: [
    {
      name: 'Apple with Almond Butter',
      protein: 6, carbs: 25, fat: 16, calories: 245,
      bloatRisk: 'low', prepTime: 1
    },
    {
      name: 'Protein Bar',
      protein: 20, carbs: 15, fat: 8, calories: 200,
      bloatRisk: 'low', prepTime: 0
    },
    {
      name: 'Hard-boiled Eggs',
      protein: 12, carbs: 1, fat: 10, calories: 140,
      bloatRisk: 'low', prepTime: 0
    }
  ]
};

const foodIntelligence = {
  // Fat loss friendly foods
  fatLossFriendly: ['chicken breast', 'salmon', 'egg whites', 'spinach', 'broccoli', 'quinoa', 'berries'],
  // Bloat risk categorization
  highBloat: ['beans', 'dairy', 'wheat', 'cabbage', 'onions', 'garlic'],
  mediumBloat: ['nuts', 'seeds', 'whole grains', 'apples'],
  lowBloat: ['rice', 'chicken', 'fish', 'spinach', 'carrots', 'berries'],
  // High protein density
  highProtein: ['chicken breast', 'salmon', 'egg whites', 'greek yogurt', 'protein powder', 'lean beef']
};

function generateDailyPlan({ profile, activityType, energyLevel, recentProgress, date }) {
  const baseCalories = calculateBaseCalories(profile, activityType);
  const adjustment = profile.calorieAdjustment || 0;
  const targetCalories = baseCalories + adjustment;
  
  const proteinTarget = Math.max(80, Math.min(110, profile.weight * 1.6));
  const carbTarget = activityType === 'rest' ? targetCalories * 0.3 / 4 : targetCalories * 0.4 / 4;
  const fatTarget = targetCalories * 0.25 / 9;
  
  const hydrationTarget = activityType === 'muay_thai' ? 3.5 : 2.5;
  
  const trainingRecommendation = getTrainingRecommendation(activityType, energyLevel, date);
  
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
    training: trainingRecommendation,
    gutHealth: {
      fiberTarget: 25,
      probioticRecommended: true,
      avoidFoods: ['dairy', 'processed foods'] // Based on user sensitivity
    }
  };
}

function calculateBaseCalories(profile, activityType) {
  // BMR calculation (Mifflin-St Jeor for women)
  const bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
  
  const activityMultipliers = {
    'muay_thai': 1.9,
    'running': 1.8,
    'soccer': 1.8,
    'strength': 1.6,
    'rest': 1.4
  };
  
  const tdee = bmr * (activityMultipliers[activityType] || 1.6);
  
  // 20% deficit for fat loss
  return Math.round(tdee * 0.8);
}

function getTrainingRecommendation(activityType, energyLevel, date) {
  const dayOfWeek = new Date(date).getDay();
  
  if (activityType === 'muay_thai') {
    return {
      type: 'muay_thai',
      duration: 60,
      intensity: energyLevel === 'high' ? 'high' : 'moderate',
      recovery: 'stretching + hydration'
    };
  }
  
  if (dayOfWeek === 3) { // Wednesday
    return {
      type: 'recovery',
      duration: 30,
      intensity: 'low',
      recovery: 'gentle stretching, massage, early sleep'
    };
  }
  
  if ([1, 3, 5].includes(dayOfWeek) && activityType !== 'muay_thai') {
    return {
      type: 'strength',
      duration: 10,
      intensity: 'moderate',
      focus: ['lower_body', 'core'],
      exercises: ['sumo_squats', 'side_lunges', 'rdl', 'reverse_crunches']
    };
  }
  
  return {
    type: 'active_recovery',
    duration: 20,
    intensity: 'low',
    recovery: 'light walking or yoga'
  };
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
  
  // Select breakfast (higher protein to kickstart day)
  const breakfast = selectMeal('breakfast', {
    minProtein: Math.max(20, remaining.protein * 0.4),
    maxCalories: remaining.calories * 0.35,
    avoidBloating: preferences.lowBloat
  });
  
  const afterBreakfast = {
    protein: remaining.protein - breakfast.protein,
    carbs: remaining.carbs - breakfast.carbs,
    fat: remaining.fat - breakfast.fat,
    calories: remaining.calories - breakfast.calories
  };
  
  // Select dinner
  const dinner = selectMeal('dinner', {
    minProtein: Math.max(25, afterBreakfast.protein * 0.8),
    maxCalories: afterBreakfast.calories * 0.85,
    avoidBloating: preferences.lowBloat
  });
  
  const afterDinner = {
    protein: afterBreakfast.protein - dinner.protein,
    calories: afterBreakfast.calories - dinner.calories
  };
  
  // Optional snack if significant calories remain
  let snack = null;
  if (afterDinner.calories > 150 && afterDinner.protein > 5) {
    snack = selectMeal('snacks', {
      maxCalories: afterDinner.calories,
      minProtein: 5,
      avoidBloating: preferences.lowBloat
    });
  }
  
  return {
    breakfast: {
      ...breakfast,
      timing: '7:00 AM',
      notes: 'High protein to support morning training'
    },
    lunch: {
      ...lunch,
      timing: '12:30 PM',
      source: 'uber_cafe'
    },
    dinner: {
      ...dinner,
      timing: '7:00 PM',
      notes: 'Light and digestible for evening'
    },
    snack: snack ? {
      ...snack,
      timing: '3:30 PM',
      optional: true
    } : null,
    totals: {
      protein: breakfast.protein + lunchMacros.protein + dinner.protein + (snack?.protein || 0),
      carbs: breakfast.carbs + lunchMacros.carbs + dinner.carbs + (snack?.carbs || 0),
      fat: breakfast.fat + lunchMacros.fat + dinner.fat + (snack?.fat || 0),
      calories: breakfast.calories + lunchMacros.calories + dinner.calories + (snack?.calories || 0)
    }
  };
}

function selectMeal(category, criteria) {
  const options = mealDatabase[category].filter(meal => {
    if (criteria.minProtein && meal.protein < criteria.minProtein) return false;
    if (criteria.maxCalories && meal.calories > criteria.maxCalories) return false;
    if (criteria.avoidBloating && meal.bloatRisk === 'high') return false;
    return true;
  });
  
  if (options.length === 0) {
    return mealDatabase[category][0]; // Fallback
  }
  
  // Prefer low bloat, high protein options
  return options.sort((a, b) => {
    const aScore = (a.protein * 2) + (a.bloatRisk === 'low' ? 10 : 0);
    const bScore = (b.protein * 2) + (b.bloatRisk === 'low' ? 10 : 0);
    return bScore - aScore;
  })[0];
}

function getFoodIntelligence(foodName) {
  const food = foodName.toLowerCase();
  
  return {
    name: foodName,
    fatLossFriendly: foodIntelligence.fatLossFriendly.some(f => food.includes(f)),
    bloatRisk: getBloatRisk(food),
    proteinDensity: getProteinDensity(food),
    athleteFriendly: isAthleteFriendly(food),
    flags: getFlags(food)
  };
}

function getBloatRisk(food) {
  if (foodIntelligence.highBloat.some(f => food.includes(f))) return 'high';
  if (foodIntelligence.mediumBloat.some(f => food.includes(f))) return 'medium';
  return 'low';
}

function getProteinDensity(food) {
  if (foodIntelligence.highProtein.some(f => food.includes(f))) return 'high';
  return 'medium';
}

function isAthleteFriendly(food) {
  const athleteFriendly = ['chicken', 'fish', 'eggs', 'quinoa', 'sweet potato', 'berries', 'spinach'];
  return athleteFriendly.some(f => food.includes(f));
}

function getFlags(food) {
  const flags = [];
  if (food.includes('dairy') || food.includes('milk') || food.includes('cheese')) {
    flags.push('dairy_sensitivity_risk');
  }
  if (food.includes('processed') || food.includes('packaged')) {
    flags.push('ultra_processed');
  }
  if (food.includes('salt') || food.includes('sodium')) {
    flags.push('high_sodium');
  }
  return flags;
}

module.exports = {
  generateDailyPlan,
  adjustMacros,
  getFoodIntelligence
};