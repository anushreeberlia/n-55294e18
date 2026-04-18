// Friendly workout planning with positive vibes

const workoutTemplates = {
  strength: {
    name: 'Power & Grace Session',
    tagline: 'Short, sweet, and strong! 💪',
    duration: 10,
    type: 'strength',
    vibe: 'empowering',
    exercises: [
      {
        name: 'Sumo Squats',
        friendlyName: 'Queen Squats',
        sets: 3,
        reps: 15,
        rest: 30,
        focus: ['glutes', 'inner thighs'],
        tips: 'Wide stance, toes out - you\'re a warrior! Feel that power! 👑',
        emoji: '👸'
      },
      {
        name: 'Side Lunges',
        friendlyName: 'Graceful Lunges',
        sets: 3,
        reps: '12 each side',
        rest: 30,
        focus: ['inner thighs', 'balance'],
        tips: 'Flow like a dancer - step wide, sit back, feel elegant! 💃',
        emoji: '💃'
      },
      {
        name: 'Romanian Deadlifts',
        friendlyName: 'Hip Hinge Heroes',
        sets: 3,
        reps: 12,
        rest: 30,
        focus: ['hamstrings', 'glutes', 'posture'],
        tips: 'Hinge at hips, imagine pushing the floor away - you\'re building strength! 🌟',
        emoji: '🌟'
      },
      {
        name: 'Bent-over Rows',
        friendlyName: 'Posture Perfectors',
        sets: 2,
        reps: 15,
        rest: 30,
        focus: ['back', 'shoulders'],
        tips: 'Squeeze those shoulder blades - building a strong, confident back! 🦋',
        emoji: '🦋'
      },
      {
        name: 'Reverse Crunches',
        friendlyName: 'Core Confidence',
        sets: 3,
        reps: 15,
        rest: 30,
        focus: ['lower abs'],
        tips: 'Slow and controlled - your core is getting stronger every rep! ✨',
        emoji: '✨'
      }
    ],
    warmup: 'Dance it out for 2 minutes - get your body happy and ready! 💃',
    cooldown: 'Gentle stretches and deep breaths - you did amazing! 🧘‍♀️',
    motivation: 'Every rep makes you stronger! You\'re incredible! 🌈'
  },
  
  muay_thai: {
    name: 'Warrior Training',
    tagline: 'Channel your inner fighter! 🥊',
    duration: 60,
    type: 'martial_arts',
    vibe: 'fierce',
    phases: [
      { 
        name: 'Wake Up', 
        duration: 10, 
        activities: ['gentle cardio', 'dynamic flow'],
        vibe: 'Get your warrior spirit ready! 🔥'
      },
      { 
        name: 'Skill Building', 
        duration: 20, 
        activities: ['pad work magic', 'bag work power'],
        vibe: 'Perfect your craft - you\'re getting better every session! ⚡'
      },
      { 
        name: 'Warrior Flow', 
        duration: 20, 
        activities: ['partner drills', 'conditioning'],
        vibe: 'You\'re in the zone - fierce and focused! 🎯'
      },
      { 
        name: 'Peaceful Warrior', 
        duration: 10, 
        activities: ['stretching', 'mindful breathing'],
        vibe: 'From warrior to zen - balance achieved! 🧘‍♀️'
      }
    ],
    recovery: {
      immediate: 'Hydrate like a champion, stretch with love',
      post: 'Cool shower, protein fuel, and celebrate your strength!'
    },
    motivation: 'You\'re not just training your body, you\'re building unstoppable confidence! 🌟'
  },
  
  recovery: {
    name: 'Self-Care Session',
    tagline: 'Rest is productive too! 🌸',
    duration: 30,
    type: 'recovery',
    vibe: 'nurturing',
    activities: [
      {
        name: 'Gentle Flow',
        duration: 15,
        focus: ['hip flexors', 'shoulders', 'neck', 'heart'],
        tips: 'Hold each stretch like a warm hug - 30-60 seconds of self-love 💕',
        emoji: '🤗'
      },
      {
        name: 'Massage Magic',
        duration: 10,
        tools: ['foam roller', 'tennis ball'],
        focus: ['calves', 'IT band', 'glutes'],
        tips: 'Be gentle with yourself - this is healing time! 🌟',
        emoji: '✨'
      },
      {
        name: 'Breathing Bliss',
        duration: 5,
        technique: '4-7-8 breathing',
        tips: 'Inhale peace (4), hold love (7), exhale stress (8) 💙',
        emoji: '🌸'
      }
    ],
    motivation: 'Taking care of yourself is the most productive thing you can do! 💖'
  },
  
  running: {
    name: 'Freedom Run',
    tagline: 'Run free, run strong! 🏃‍♀️',
    duration: 45,
    type: 'cardio',
    vibe: 'liberating',
    phases: [
      { 
        name: 'Gentle Start', 
        duration: 10, 
        pace: 'easy', 
        vibe: 'Wake up those muscles with love! 🌅' 
      },
      { 
        name: 'Find Your Flow', 
        duration: 25, 
        pace: 'steady joy', 
        vibe: 'This is your time to shine - find your rhythm! ✨' 
      },
      { 
        name: 'Cool Celebration', 
        duration: 10, 
        pace: 'victory lap', 
        vibe: 'You did it! Walk it out like the champion you are! 🏆' 
      }
    ],
    recovery: {
      immediate: 'Walk tall for 5 minutes - you\'re amazing!',
      post: 'Stretch those beautiful legs and celebrate your strength!'
    },
    motivation: 'Every step is a celebration of what your body can do! 🌈'
  }
};

function getWorkoutPlan(type) {
  const template = workoutTemplates[type];
  if (!template) {
    return { 
      error: 'Oops! That workout type isn\'t ready yet',
      suggestion: 'Try strength, muay_thai, recovery, or running! 💪'
    };
  }
  
  return {
    ...template,
    generatedAt: new Date().toISOString(),
    encouragement: getWorkoutEncouragement(type),
    tips: getWorkoutWisdom(type)
  };
}

function getWorkoutEncouragement(type) {
  const encouragements = {
    strength: [
      'You\'re building more than muscle - you\'re building confidence! 💪',
      'Every rep is an investment in your amazing future! ✨',
      'Strong body, strong mind, strong heart! 💖',
      'You\'re not just working out, you\'re glowing up! 🌟'
    ],
    muay_thai: [
      'Channel your inner warrior - you\'re fierce and unstoppable! 🥊',
      'Every punch is powered by your determination! 🔥',
      'You\'re not just training - you\'re transforming! ⚡',
      'Martial arts is meditation in motion - find your flow! 🧘‍♀️'
    ],
    recovery: [
      'Self-care isn\'t selfish - it\'s essential! You deserve this! 💕',
      'Rest days are glow-up days - embrace the healing! 🌸',
      'Your body is saying thank you with every stretch! 🙏',
      'Recovery is where the magic happens - you\'re getting stronger! ✨'
    ],
    running: [
      'Every step is freedom, every breath is power! 🏃‍♀️',
      'You\'re not just running - you\'re flying! 🌟',
      'The finish line is just the beginning of your greatness! 🏆',
      'Your pace is perfect because it\'s yours! 💫'
    ]
  };
  
  return encouragements[type] || ['You\'re amazing and we believe in you! 🌈'];
}

function getWorkoutWisdom(type) {
  const wisdom = {
    strength: [
      'Quality over quantity - perfect form creates perfect results! 🎯',
      'Breathe with purpose - exhale power, inhale confidence! 💨',
      'Listen to your body - it\'s your wisest teacher! 🧘‍♀️',
      'Progress over perfection - you\'re already winning! 🏆'
    ],
    muay_thai: [
      'Hydration is your superpower - drink up, warrior! 💧',
      'Technique beats power - be graceful, be deadly! 🦢',
      'Your energy is precious - use it wisely! ⚡',
      'Fuel your fire 1-2 hours before training! 🔥'
    ],
    recovery: [
      'This isn\'t "just rest" - this is active healing! 🌱',
      'Rate your soreness 1-10 before and after - track your glow-up! 📈',
      'Focus on what needs love - your body knows best! 💖',
      'Mental recovery is just as important - let your mind rest too! 🧠'
    ],
    running: [
      'Run by feel, not by pace - your body is wise! 🧘‍♀️',
      'Land softly, like you\'re dancing on clouds! ☁️',
      'Your heart rate tells your story - listen to it! 💓',
      'Fuel longer runs with love and carbs! 🍌'
    ]
  };
  
  return wisdom[type] || ['Trust yourself - you\'re stronger than you know! 💪'];
}

function scheduleStrengthWorkouts(date) {
  const startDate = new Date(date);
  const schedule = [];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dayOfWeek = currentDate.getDay();
    const dateStr = currentDate.toISOString().split('T')[0];
    
    let plannedWorkout = null;
    
    if ([1, 3, 5].includes(dayOfWeek)) {
      if (dayOfWeek === 3) { // Wednesday wellness
        plannedWorkout = {
          type: 'recovery',
          name: 'Self-Care Wednesday',
          priority: 'high',
          reason: 'Your weekly dose of self-love! 💕',
          vibe: 'nurturing',
          emoji: '🌸'
        };
      } else {
        plannedWorkout = {
          type: 'strength',
          name: 'Power & Grace',
          priority: 'high',
          reason: 'Building confidence from the inside out! 💪',
          vibe: 'empowering',
          emoji: '💪'
        };
      }
    }
    else if ([2, 4].includes(dayOfWeek)) {
      plannedWorkout = {
        type: 'muay_thai',
        name: 'Warrior Training',
        priority: 'high',
        reason: 'Channel your inner fighter! 🥊',
        vibe: 'fierce',
        emoji: '🥊'
      };
    }
    else {
      plannedWorkout = {
        type: dayOfWeek === 6 ? 'running' : 'active_recovery',
        name: dayOfWeek === 6 ? 'Freedom Run' : 'Gentle Movement',
        priority: 'medium',
        reason: dayOfWeek === 6 ? 'Run free and strong! 🏃‍♀️' : 'Gentle love for your body! 🌿',
        vibe: dayOfWeek === 6 ? 'liberating' : 'peaceful',
        emoji: dayOfWeek === 6 ? '🏃‍♀️' : '🌿'
      };
    }
    
    schedule.push({
      date: dateStr,
      dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
      workout: plannedWorkout,
      completed: false,
      dailyAffirmation: getDailyAffirmation(dayOfWeek)
    });
  }
  
  return {
    weekStart: startDate.toISOString().split('T')[0],
    schedule,
    weeklyMessage: 'This week is going to be amazing! You\'ve got the perfect balance of strength, power, and self-care! 🌈✨',
    tips: [
      '💪 Strength 3x/week - building your confidence!',
      '🌸 Wednesday is self-care day - you deserve it!',
      '⚡ Listen to your energy - adjust as needed!',
      '💖 Rest when tired - it\'s productive too!'
    ]
  };
}

function getDailyAffirmation(dayOfWeek) {
  const affirmations = {
    0: 'Sunday: I rest and recharge with love 💕',
    1: 'Monday: I start this week with strength and confidence 💪',
    2: 'Tuesday: I am a warrior, fierce and focused 🥊',
    3: 'Wednesday: I choose self-care and healing 🌸',
    4: 'Thursday: I embrace my power and grace ⚡',
    5: 'Friday: I celebrate how far I\'ve come 🎉',
    6: 'Saturday: I move with joy and freedom 🏃‍♀️'
  };
  
  return affirmations[dayOfWeek] || 'Today I choose to love and honor my body! 💖';
}

function getMotivationalCheck(recentWorkouts, currentEnergy) {
  const lastWeek = recentWorkouts.filter(w => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  });
  
  const highIntensityCount = lastWeek.filter(w => 
    w.type === 'muay_thai' || w.type === 'running'
  ).length;
  
  if (highIntensityCount >= 6 && currentEnergy <= 3) {
    return {
      level: 'time_to_rest',
      message: 'Your body is asking for extra love right now 💕',
      suggestions: [
        'Take 1-2 complete rest days - you\'ve earned them! 🛋️',
        'Try gentle yoga or a peaceful walk instead 🌸',
        'Focus on sleep and nourishing meals 😴',
        'Book that massage you\'ve been wanting! 💆‍♀️'
      ],
      vibe: 'nurturing',
      emoji: '🤗'
    };
  }
  
  if (highIntensityCount >= 5 && currentEnergy <= 5) {
    return {
      level: 'gentle_reminder',
      message: 'You\'re doing amazing! Let\'s make sure you\'re taking care of yourself 💖',
      suggestions: [
        'Prioritize 8+ hours of beautiful sleep 😴',
        'Add extra carbs around training days 🍌',
        'Spend extra time warming up - your body will thank you! 🔥',
        'Scale back one session if you\'re feeling tired 💕'
      ],
      vibe: 'caring',
      emoji: '💝'
    };
  }
  
  return {
    level: 'thriving',
    message: 'You\'re in perfect balance - keep shining! ✨',
    suggestions: [
      'You\'re doing everything right - trust yourself! 🌟',
      'Keep listening to your amazing body 💖',
      'Celebrate every single victory, big and small! 🎉',
      'You\'re an inspiration! 🌈'
    ],
    vibe: 'celebratory',
    emoji: '🎊'
  };
}

module.exports = {
  getWorkoutPlan,
  scheduleStrengthWorkouts,
  getMotivationalCheck
};