// Workout planning and scheduling logic

const workoutTemplates = {
  strength: {
    name: '10-Minute Lower Body & Core',
    duration: 10,
    type: 'strength',
    exercises: [
      {
        name: 'Sumo Squats',
        sets: 3,
        reps: 15,
        rest: 30,
        focus: ['glutes', 'inner_thighs'],
        notes: 'Wide stance, toes out, focus on squeezing glutes'
      },
      {
        name: 'Side Lunges',
        sets: 3,
        reps: '12 each side',
        rest: 30,
        focus: ['inner_thighs', 'glutes'],
        notes: 'Step wide, sit back into hip, keep chest up'
      },
      {
        name: 'Romanian Deadlifts',
        sets: 3,
        reps: 12,
        rest: 30,
        focus: ['hamstrings', 'glutes', 'lower_back'],
        notes: 'Hinge at hips, keep knees soft, squeeze glutes up'
      },
      {
        name: 'Bent-over Rows',
        sets: 2,
        reps: 15,
        rest: 30,
        focus: ['back', 'posture'],
        notes: 'Squeeze shoulder blades, control the weight'
      },
      {
        name: 'Tibialis Raises',
        sets: 2,
        reps: 20,
        rest: 20,
        focus: ['shins', 'balance'],
        notes: 'Point toes up, slow and controlled'
      },
      {
        name: 'Reverse Crunches',
        sets: 3,
        reps: 15,
        rest: 30,
        focus: ['lower_abs'],
        notes: 'Focus on lower belly, slow controlled movement'
      }
    ],
    warmup: 'Light bodyweight squats and leg swings (2 minutes)',
    cooldown: 'Gentle stretching focusing on hips and hamstrings'
  },
  
  muay_thai: {
    name: 'Muay Thai Training',
    duration: 60,
    type: 'martial_arts',
    phases: [
      { name: 'Warm-up', duration: 10, activities: ['light cardio', 'dynamic stretching'] },
      { name: 'Technique', duration: 20, activities: ['pad work', 'bag work'] },
      { name: 'Sparring/Drills', duration: 20, activities: ['partner drills', 'conditioning'] },
      { name: 'Cool-down', duration: 10, activities: ['stretching', 'breathing'] }
    ],
    recovery: {
      immediate: 'Hydrate, light stretching',
      post: 'Ice bath or cold shower, protein within 30 minutes'
    }
  },
  
  recovery: {
    name: 'Active Recovery',
    duration: 30,
    type: 'recovery',
    activities: [
      {
        name: 'Gentle Stretching',
        duration: 15,
        focus: ['hip flexors', 'hamstrings', 'shoulders', 'neck'],
        notes: 'Hold each stretch 30-60 seconds'
      },
      {
        name: 'Self Massage',
        duration: 10,
        tools: ['foam roller', 'lacrosse ball'],
        focus: ['calves', 'IT band', 'glutes']
      },
      {
        name: 'Breathing Exercise',
        duration: 5,
        technique: '4-7-8 breathing',
        notes: 'Inhale 4, hold 7, exhale 8'
      }
    ]
  },
  
  running: {
    name: 'Running Session',
    duration: 45,
    type: 'cardio',
    phases: [
      { name: 'Warm-up', duration: 10, pace: 'easy', notes: 'Dynamic warm-up + easy pace' },
      { name: 'Main Set', duration: 25, pace: 'moderate', notes: 'Steady state or intervals' },
      { name: 'Cool-down', duration: 10, pace: 'easy', notes: 'Easy jog + walking' }
    ],
    recovery: {
      immediate: 'Walk 5 minutes, hydrate',
      post: 'Stretching focus on calves and hip flexors'
    }
  }
};

function getWorkoutPlan(type) {
  const template = workoutTemplates[type];
  if (!template) {
    return { error: 'Workout type not found' };
  }
  
  return {
    ...template,
    generatedAt: new Date().toISOString(),
    tips: getWorkoutTips(type)
  };
}

function getWorkoutTips(type) {
  const tips = {
    strength: [
      'Focus on form over speed',
      'Engage core throughout all movements',
      'Breathe out on exertion',
      'Rest 48 hours before training same muscle groups'
    ],
    muay_thai: [
      'Stay hydrated throughout session',
      'Focus on technique over power',
      'Listen to your body - rest if overly fatigued',
      'Fuel with carbs 1-2 hours before training'
    ],
    recovery: [
      'Don\'t skip this - recovery is when you get stronger',
      'Rate your soreness 1-10 before and after',
      'Focus on problem areas that feel tight',
      'Use this time to mentally reset'
    ],
    running: [
      'Monitor heart rate if possible',
      'Land midfoot to reduce impact',
      'Run by feel - adjust pace based on energy',
      'Fuel longer runs with carbs'
    ]
  };
  
  return tips[type] || [];
}

function scheduleStrengthWorkouts(date) {
  const startDate = new Date(date);
  const schedule = [];
  
  // Generate 7-day schedule
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dayOfWeek = currentDate.getDay();
    const dateStr = currentDate.toISOString().split('T')[0];
    
    let plannedWorkout = null;
    
    // Monday, Wednesday, Friday - Strength
    if ([1, 3, 5].includes(dayOfWeek)) {
      if (dayOfWeek === 3) { // Wednesday is recovery focus
        plannedWorkout = {
          type: 'recovery',
          priority: 'high',
          reason: 'Mid-week recovery to prevent overtraining'
        };
      } else {
        plannedWorkout = {
          type: 'strength',
          priority: 'high',
          reason: 'Lower body and core focus for body composition goals'
        };
      }
    }
    // Tuesday, Thursday - Muay Thai (assumed)
    else if ([2, 4].includes(dayOfWeek)) {
      plannedWorkout = {
        type: 'muay_thai',
        priority: 'high',
        reason: 'Regular Muay Thai schedule'
      };
    }
    // Weekend - Running/Soccer or active recovery
    else {
      plannedWorkout = {
        type: dayOfWeek === 6 ? 'running' : 'active_recovery',
        priority: 'medium',
        reason: dayOfWeek === 6 ? 'Cardio session' : 'Active rest'
      };
    }
    
    schedule.push({
      date: dateStr,
      dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
      workout: plannedWorkout,
      completed: false
    });
  }
  
  return {
    weekStart: startDate.toISOString().split('T')[0],
    schedule,
    notes: [
      'Strength training 3x/week focusing on lower body and core',
      'Wednesday prioritizes recovery to prevent overtraining',
      'Adjust based on energy levels and Muay Thai intensity',
      'Rest completely if experiencing high fatigue or soreness'
    ]
  };
}

function getOvertrainingWarning(recentWorkouts, currentFatigue) {
  // Simple overtraining detection
  const lastWeek = recentWorkouts.filter(w => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  });
  
  const highIntensityCount = lastWeek.filter(w => 
    w.type === 'muay_thai' || w.type === 'running'
  ).length;
  
  if (highIntensityCount >= 6 && currentFatigue >= 7) {
    return {
      level: 'high',
      message: 'High overtraining risk detected',
      recommendations: [
        'Take 1-2 complete rest days',
        'Reduce Muay Thai intensity this week',
        'Focus on sleep and nutrition',
        'Consider massage or light stretching only'
      ]
    };
  }
  
  if (highIntensityCount >= 5 && currentFatigue >= 6) {
    return {
      level: 'moderate',
      message: 'Monitor fatigue levels closely',
      recommendations: [
        'Prioritize sleep quality',
        'Increase carb intake around training',
        'Add 10 minutes to warm-up routines',
        'Scale back one session if fatigue increases'
      ]
    };
  }
  
  return {
    level: 'low',
    message: 'Training load looks sustainable',
    recommendations: [
      'Maintain current training schedule',
      'Continue monitoring energy levels',
      'Stay consistent with recovery practices'
    ]
  };
}

module.exports = {
  getWorkoutPlan,
  scheduleStrengthWorkouts,
  getOvertrainingWarning
};