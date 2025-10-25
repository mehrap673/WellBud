import HealthLog from '../models/HealthLog.js';
import User from '../models/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const createHealthLog = async (req, res) => {
  try {
    const { type, data, date } = req.body;

    const healthLog = await HealthLog.create({
      userId: req.user._id,
      type,
      data,
      date: date || new Date()
    });

    res.status(201).json(healthLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHealthLogs = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    const query = { userId: req.user._id };

    if (type) query.type = type;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const logs = await HealthLog.find(query).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHealthLog = async (req, res) => {
  try {
    const log = await HealthLog.findOne({ _id: req.params.id, userId: req.user._id });

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    if (req.body.data) log.data = req.body.data;
    if (req.body.date) log.date = req.body.date;

    const updatedLog = await log.save();
    res.json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHealthLog = async (req, res) => {
  try {
    const log = await HealthLog.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { type, days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const query = {
      userId: req.user._id,
      date: { $gte: startDate }
    };

    if (type) query.type = type;

    const logs = await HealthLog.find(query).sort({ date: 1 });

    // Calculate streaks
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const hasToday = logs.some(log => new Date(log.date).toDateString() === today);
    const hasYesterday = logs.some(log => new Date(log.date).toDateString() === yesterday);

    let streak = 0;
    if (hasToday || hasYesterday) {
      let currentDate = new Date();
      while (true) {
        const dateStr = currentDate.toDateString();
        const hasLog = logs.some(log => new Date(log.date).toDateString() === dateStr);
        if (!hasLog) break;
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }

    res.json({
      logs,
      streak,
      totalLogs: logs.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// AI-Powered Insights using Gemini Flash 2.0
export const getAIInsights = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user profile
    const user = await User.findById(userId);

    // Get all logs from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const allLogs = await HealthLog.find({
      userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    // Separate logs by type
    const dietLogs = allLogs.filter(log => log.type === 'diet');
    const fitnessLogs = allLogs.filter(log => log.type === 'fitness');
    const sleepLogs = allLogs.filter(log => log.type === 'sleep');
    const moodLogs = allLogs.filter(log => log.type === 'mood');

    // Calculate detailed analytics
    const analytics = calculateDetailedAnalytics(dietLogs, fitnessLogs, sleepLogs, moodLogs);

    // Prepare data for AI analysis
    const userData = {
      name: user.name,
      age: user.age,
      weight: user.weight,
      height: user.height,
      goal: user.goal,
      preferences: user.preferences,
      totalLogs: allLogs.length,
      ...analytics
    };

    // Generate AI insights using Gemini
    const insights = await generateGeminiInsights(userData);

    res.json(insights);
  } catch (error) {
    console.error('AI Insights error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Enhanced analytics calculation with trends and patterns
function calculateDetailedAnalytics(dietLogs, fitnessLogs, sleepLogs, moodLogs) {
  return {
    diet: calculateEnhancedDietSummary(dietLogs),
    fitness: calculateEnhancedFitnessSummary(fitnessLogs),
    sleep: calculateEnhancedSleepSummary(sleepLogs),
    mood: calculateEnhancedMoodSummary(moodLogs),
    correlations: calculateCorrelations(dietLogs, fitnessLogs, sleepLogs, moodLogs)
  };
}

function calculateEnhancedDietSummary(dietLogs) {
  if (dietLogs.length === 0) return { logged: false };

  const avgCalories = dietLogs.reduce((sum, log) => sum + (log.data.calories || 0), 0) / dietLogs.length;
  const avgProtein = dietLogs.reduce((sum, log) => sum + (log.data.protein || 0), 0) / dietLogs.length;
  const avgCarbs = dietLogs.reduce((sum, log) => sum + (log.data.carbs || 0), 0) / dietLogs.length;
  const avgFats = dietLogs.reduce((sum, log) => sum + (log.data.fats || 0), 0) / dietLogs.length;

  // Calculate trends (last 7 days vs previous 7 days)
  const recentLogs = dietLogs.slice(0, 7);
  const previousLogs = dietLogs.slice(7, 14);
  
  const recentAvgCalories = recentLogs.length > 0 
    ? recentLogs.reduce((sum, log) => sum + (log.data.calories || 0), 0) / recentLogs.length 
    : 0;
  const previousAvgCalories = previousLogs.length > 0 
    ? previousLogs.reduce((sum, log) => sum + (log.data.calories || 0), 0) / previousLogs.length 
    : 0;

  const calorieTrend = previousAvgCalories > 0 
    ? ((recentAvgCalories - previousAvgCalories) / previousAvgCalories * 100).toFixed(1)
    : 0;

  // Meal timing analysis
  const mealTimes = dietLogs.map(log => ({
    hour: new Date(log.date).getHours(),
    type: log.data.mealType
  }));

  // Consistency score (how regular are meal timings)
  const loggingDays = new Set(dietLogs.map(log => new Date(log.date).toDateString())).size;
  const consistencyScore = Math.min(100, (loggingDays / 30 * 100)).toFixed(0);

  return {
    logged: true,
    totalEntries: dietLogs.length,
    loggingDays,
    consistencyScore: parseInt(consistencyScore),
    avgCalories: Math.round(avgCalories),
    avgProtein: Math.round(avgProtein),
    avgCarbs: Math.round(avgCarbs),
    avgFats: Math.round(avgFats),
    calorieTrend: parseFloat(calorieTrend),
    macroRatio: {
      protein: Math.round((avgProtein * 4 / avgCalories) * 100),
      carbs: Math.round((avgCarbs * 4 / avgCalories) * 100),
      fats: Math.round((avgFats * 9 / avgCalories) * 100)
    },
    recentMeals: dietLogs.slice(0, 7).map(log => ({
      date: log.date,
      calories: log.data.calories,
      protein: log.data.protein,
      carbs: log.data.carbs,
      fats: log.data.fats,
      mealType: log.data.mealType || 'not specified'
    })),
    mealPatterns: analyzeMealPatterns(mealTimes)
  };
}

function calculateEnhancedFitnessSummary(fitnessLogs) {
  if (fitnessLogs.length === 0) return { logged: false };

  const avgSteps = fitnessLogs.reduce((sum, log) => sum + (log.data.steps || 0), 0) / fitnessLogs.length;
  const totalWorkouts = fitnessLogs.filter(log => log.data.duration > 0).length;
  const avgDuration = fitnessLogs.reduce((sum, log) => sum + (log.data.duration || 0), 0) / fitnessLogs.length;
  const avgCaloriesBurned = fitnessLogs.reduce((sum, log) => sum + (log.data.caloriesBurned || 0), 0) / fitnessLogs.length;

  // Workout type distribution
  const workoutTypes = {};
  fitnessLogs.forEach(log => {
    const type = log.data.type || 'general';
    workoutTypes[type] = (workoutTypes[type] || 0) + 1;
  });

  // Activity days
  const activeDays = new Set(fitnessLogs.map(log => new Date(log.date).toDateString())).size;
  
  // Weekly average
  const weeksLogged = Math.max(1, fitnessLogs.length / 7);
  const workoutsPerWeek = (totalWorkouts / weeksLogged).toFixed(1);

  // Recent trend
  const recentLogs = fitnessLogs.slice(0, 7);
  const previousLogs = fitnessLogs.slice(7, 14);
  
  const recentAvgSteps = recentLogs.length > 0 
    ? recentLogs.reduce((sum, log) => sum + (log.data.steps || 0), 0) / recentLogs.length 
    : 0;
  const previousAvgSteps = previousLogs.length > 0 
    ? previousLogs.reduce((sum, log) => sum + (log.data.steps || 0), 0) / previousLogs.length 
    : 0;

  const stepsTrend = previousAvgSteps > 0 
    ? ((recentAvgSteps - previousAvgSteps) / previousAvgSteps * 100).toFixed(1)
    : 0;

  return {
    logged: true,
    totalEntries: fitnessLogs.length,
    activeDays,
    avgSteps: Math.round(avgSteps),
    totalWorkouts,
    workoutsPerWeek: parseFloat(workoutsPerWeek),
    avgDuration: Math.round(avgDuration),
    avgCaloriesBurned: Math.round(avgCaloriesBurned),
    stepsTrend: parseFloat(stepsTrend),
    workoutTypes,
    recentWorkouts: fitnessLogs.slice(0, 7).map(log => ({
      date: log.date,
      type: log.data.type || 'general',
      duration: log.data.duration,
      intensity: log.data.intensity,
      caloriesBurned: log.data.caloriesBurned
    }))
  };
}

function calculateEnhancedSleepSummary(sleepLogs) {
  if (sleepLogs.length === 0) return { logged: false };

  const avgHours = sleepLogs.reduce((sum, log) => sum + (log.data.hours || 0), 0) / sleepLogs.length;
  const avgQuality = sleepLogs.reduce((sum, log) => sum + (log.data.quality || 0), 0) / sleepLogs.length;

  // Sleep consistency (how regular is bedtime)
  const sleepTimes = sleepLogs.map(log => new Date(log.date).getHours());
  const sleepTimeVariance = calculateVariance(sleepTimes);
  const sleepConsistency = sleepTimeVariance < 2 ? 'excellent' : sleepTimeVariance < 4 ? 'good' : 'irregular';

  // Recent trend
  const recentLogs = sleepLogs.slice(0, 7);
  const previousLogs = sleepLogs.slice(7, 14);
  
  const recentAvgHours = recentLogs.length > 0 
    ? recentLogs.reduce((sum, log) => sum + (log.data.hours || 0), 0) / recentLogs.length 
    : 0;
  const previousAvgHours = previousLogs.length > 0 
    ? previousLogs.reduce((sum, log) => sum + (log.data.hours || 0), 0) / previousLogs.length 
    : 0;

  const sleepTrend = previousAvgHours > 0 
    ? ((recentAvgHours - previousAvgHours) / previousAvgHours * 100).toFixed(1)
    : 0;

  // Quality distribution
  const qualityDistribution = {
    excellent: sleepLogs.filter(log => log.data.quality >= 4).length,
    good: sleepLogs.filter(log => log.data.quality === 3).length,
    poor: sleepLogs.filter(log => log.data.quality <= 2).length
  };

  return {
    logged: true,
    totalEntries: sleepLogs.length,
    avgHours: parseFloat(avgHours.toFixed(1)),
    avgQuality: parseFloat(avgQuality.toFixed(1)),
    sleepConsistency,
    sleepTrend: parseFloat(sleepTrend),
    qualityDistribution,
    recentSleep: sleepLogs.slice(0, 7).map(log => ({
      date: log.date,
      hours: log.data.hours,
      quality: log.data.quality,
      notes: log.data.notes
    }))
  };
}

function calculateEnhancedMoodSummary(moodLogs) {
  if (moodLogs.length === 0) return { logged: false };

  const avgMood = moodLogs.reduce((sum, log) => sum + (log.data.rating || 0), 0) / moodLogs.length;

  const moodCounts = {};
  moodLogs.forEach(log => {
    const mood = log.data.mood || 'unknown';
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  // Mood trend
  const recentLogs = moodLogs.slice(0, 7);
  const previousLogs = moodLogs.slice(7, 14);
  
  const recentAvgMood = recentLogs.length > 0 
    ? recentLogs.reduce((sum, log) => sum + (log.data.rating || 0), 0) / recentLogs.length 
    : 0;
  const previousAvgMood = previousLogs.length > 0 
    ? previousLogs.reduce((sum, log) => sum + (log.data.rating || 0), 0) / previousLogs.length 
    : 0;

  const moodTrend = previousAvgMood > 0 
    ? ((recentAvgMood - previousAvgMood) / previousAvgMood * 100).toFixed(1)
    : 0;

  // Mood volatility (how much mood swings)
  const moodRatings = moodLogs.map(log => log.data.rating || 0);
  const moodVariance = calculateVariance(moodRatings);
  const moodStability = moodVariance < 0.5 ? 'very stable' : moodVariance < 1 ? 'stable' : moodVariance < 1.5 ? 'moderate' : 'volatile';

  // Common triggers from notes
  const allNotes = moodLogs
    .filter(log => log.data.notes)
    .map(log => log.data.notes.toLowerCase());

  return {
    logged: true,
    totalEntries: moodLogs.length,
    avgMood: parseFloat(avgMood.toFixed(1)),
    moodTrend: parseFloat(moodTrend),
    moodStability,
    moodDistribution: moodCounts,
    recentMoods: moodLogs.slice(0, 7).map(log => ({
      date: log.date,
      mood: log.data.mood,
      rating: log.data.rating,
      notes: log.data.notes
    })),
    notesAvailable: allNotes.length > 0
  };
}

// Calculate correlations between different health metrics
function calculateCorrelations(dietLogs, fitnessLogs, sleepLogs, moodLogs) {
  const correlations = {
    sleepFitnessCorrelation: null,
    sleepMoodCorrelation: null,
    dietMoodCorrelation: null,
    fitnessStressCorrelation: null
  };

  // Simple correlation: days with good sleep vs good mood
  if (sleepLogs.length >= 7 && moodLogs.length >= 7) {
    const goodSleepDays = new Set(
      sleepLogs
        .filter(log => log.data.hours >= 7 && log.data.quality >= 3)
        .map(log => new Date(log.date).toDateString())
    );
    
    const goodMoodDays = new Set(
      moodLogs
        .filter(log => log.data.rating >= 4)
        .map(log => new Date(log.date).toDateString())
    );

    const overlappingDays = [...goodSleepDays].filter(day => goodMoodDays.has(day)).length;
    const sleepMoodCorrelation = goodSleepDays.size > 0 
      ? (overlappingDays / goodSleepDays.size * 100).toFixed(0)
      : null;

    correlations.sleepMoodCorrelation = sleepMoodCorrelation ? parseInt(sleepMoodCorrelation) : null;
  }

  // Workout days vs mood
  if (fitnessLogs.length >= 7 && moodLogs.length >= 7) {
    const workoutDays = new Set(
      fitnessLogs
        .filter(log => log.data.duration > 0)
        .map(log => new Date(log.date).toDateString())
    );
    
    const goodMoodDays = new Set(
      moodLogs
        .filter(log => log.data.rating >= 4)
        .map(log => new Date(log.date).toDateString())
    );

    const overlappingDays = [...workoutDays].filter(day => goodMoodDays.has(day)).length;
    const fitnessStressCorrelation = workoutDays.size > 0 
      ? (overlappingDays / workoutDays.size * 100).toFixed(0)
      : null;

    correlations.fitnessStressCorrelation = fitnessStressCorrelation ? parseInt(fitnessStressCorrelation) : null;
  }

  return correlations;
}

// Helper functions
function analyzeMealPatterns(mealTimes) {
  if (mealTimes.length === 0) return { regular: false };

  const hourCounts = {};
  mealTimes.forEach(({ hour }) => {
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const mostCommonHour = Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)[0];

  return {
    regular: mostCommonHour && mostCommonHour[1] >= 3,
    mostCommonHour: mostCommonHour ? parseInt(mostCommonHour[0]) : null,
    frequency: mostCommonHour ? mostCommonHour[1] : 0
  };
}

function calculateVariance(numbers) {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
  return Math.sqrt(variance);
}

// Enhanced Gemini prompt for richer insights
async function generateGeminiInsights(userData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are Dr. Wellness, a compassionate and knowledgeable health coach with expertise in nutrition, fitness, sleep science, and mental wellbeing. You combine data-driven insights with emotional intelligence to provide personalized, actionable, and encouraging health guidance.

**USER PROFILE**
Name: ${userData.name || 'there'}
Age: ${userData.age || 'Not provided'}
Weight: ${userData.weight ? userData.weight + ' kg' : 'Not provided'}
Height: ${userData.height ? userData.height + ' cm' : 'Not provided'}
Primary Goal: ${userData.goal || 'general-health'}
${userData.preferences ? 'Preferences: ' + JSON.stringify(userData.preferences) : ''}

**HEALTH DATA ANALYSIS (Last 30 Days)**
Total Health Entries: ${userData.totalLogs}

**DIET INSIGHTS**
${JSON.stringify(userData.diet, null, 2)}

**FITNESS INSIGHTS**
${JSON.stringify(userData.fitness, null, 2)}

**SLEEP INSIGHTS**
${JSON.stringify(userData.sleep, null, 2)}

**MOOD & MENTAL HEALTH**
${JSON.stringify(userData.mood, null, 2)}

**CORRELATIONS & PATTERNS**
${JSON.stringify(userData.correlations, null, 2)}

**YOUR TASK**
Provide a deeply personalized health analysis that goes beyond statistics. Focus on:

1. **Celebrate Wins**: Recognize positive patterns and achievements, no matter how small
2. **Identify Patterns**: Connect the dots between diet, fitness, sleep, and mood
3. **Root Cause Analysis**: Look deeper than surface metrics (e.g., "low energy might be from inadequate sleep + low protein intake")
4. **Personalized Context**: Consider their age, goal, and lifestyle patterns
5. **Actionable Wisdom**: Provide specific, realistic steps they can take this week
6. **Emotional Support**: Be encouraging, understanding, and motivating
7. **Holistic View**: Show how different aspects of health interconnect
8. **Future Vision**: Help them see where they're heading and what's possible

**OUTPUT FORMAT (JSON)**
{
  "personalGreeting": "Warm, personalized opening message addressing ${userData.name || 'you'} by name and acknowledging their journey",
  
  "overview": {
    "headline": "Engaging one-line summary of their health journey",
    "narrative": "2-3 paragraph story of their health patterns, connecting diet, fitness, sleep, and mood. Use their actual data to tell their story.",
    "consistency": "excellent|good|moderate|needs-improvement",
    "keyWins": [
      "Specific achievement with context (e.g., 'Your 85% meal logging consistency shows real commitment to understanding your nutrition')",
      "Another specific win with encouragement"
    ],
    "growthAreas": [
      "Constructive observation with explanation (not criticism)",
      "Another area framed as opportunity"
    ],
    "interestingPatterns": [
      "Fascinating connection discovered in their data (e.g., 'On days you workout before noon, your mood ratings average 0.8 points higher')",
      "Another pattern that reveals insights"
    ]
  },

  "diet": {
    "status": "thriving|strong|developing|needs-attention",
    "storyTitle": "Creative, engaging title (e.g., 'The Protein Powerhouse', 'The Calorie Balancing Act')",
    "deepInsight": "Detailed analysis that explains WHY their diet matters for their ${userData.goal} goal. Connect to energy, mood, performance. Use their actual numbers.",
    "whatIsWorkingWell": [
      "Specific strength with explanation and impact",
      "Another strength with context"
    ],
    "opportunitiesForGrowth": [
      "Specific, actionable suggestion with rationale and expected benefit",
      "Another opportunity with clear reasoning"
    ],
    "didYouKnow": "Fascinating nutrition science fact relevant to their patterns"
  },

  "fitness": {
    "status": "thriving|strong|developing|needs-attention",
    "storyTitle": "Creative, engaging title",
    "deepInsight": "Analysis of their activity patterns, what it means for their ${userData.goal}, and how it affects their overall wellbeing",
    "whatIsWorkingWell": [
      "Specific achievement with impact on health/goals",
      "Another success with context"
    ],
    "opportunitiesForGrowth": [
      "Specific suggestion with reasoning and expected outcomes",
      "Another opportunity"
    ],
    "didYouKnow": "Interesting fitness science fact relevant to their data"
  },

  "sleep": {
    "status": "thriving|strong|developing|needs-attention",
    "storyTitle": "Creative, engaging title",
    "deepInsight": "Sleep quality analysis and its ripple effects on mood, energy, fitness, and diet",
    "whatIsWorkingWell": [
      "Sleep pattern that's serving them well",
      "Another positive aspect"
    ],
    "opportunitiesForGrowth": [
      "Specific sleep optimization suggestion with science-backed reasoning",
      "Another opportunity for better rest"
    ],
    "connectionToOtherMetrics": "How their sleep affects/is affected by diet, fitness, and mood",
    "didYouKnow": "Sleep science fact relevant to their patterns"
  },

  "mood": {
    "status": "thriving|strong|developing|needs-attention",
    "storyTitle": "Creative, engaging title",
    "deepInsight": "Mental health and emotional wellbeing analysis with compassion and understanding",
    "emotionalPatterns": [
      "Pattern observed with empathy and context",
      "Another pattern with understanding"
    ],
    "strengthsAndResilience": [
      "Mental/emotional strength they demonstrate",
      "Another positive pattern"
    ],
    "supportiveSuggestions": [
      "Gentle, supportive suggestion for emotional wellbeing",
      "Another caring recommendation"
    ],
    "connectionToPhysicalHealth": "How their physical health (sleep, diet, fitness) relates to their mood",
    "didYouKnow": "Mental health fact relevant to their experience"
  },

  "theBigPicture": {
    "holisticSummary": "2-3 paragraphs connecting ALL four pillars (diet, fitness, sleep, mood) and showing how they create a complete picture of wellbeing",
    "keyCorrelations": [
      "Significant pattern discovered across multiple health dimensions",
      "Another meaningful connection"
    ],
    "momentumCheck": "Where they have momentum and what to do with it"
  },

  "yourActionPlan": [
    {
      "category": "Diet|Fitness|Sleep|Mental Wellbeing|Lifestyle",
      "priority": "high|medium",
      "title": "Clear, action-oriented title",
      "why": "Why this matters for their ${userData.goal} goal and overall wellbeing",
      "what": "Detailed explanation of the recommendation with context",
      "how": "Step-by-step actionable instructions they can start this week",
      "expectedOutcome": "What positive changes they can expect and when",
      "difficulty": "easy|moderate|challenging",
      "timeCommitment": "Realistic time estimate"
    }
  ],

  "weeklyFocus": {
    "theme": "One clear theme to focus on this week",
    "dailyMicroHabit": "One tiny, achievable daily action",
    "weeklyChallenge": "One stretch goal for the week",
    "trackingTip": "How to measure progress"
  },

  "motivationalClose": "Warm, personalized closing message that acknowledges their effort, celebrates their progress, and inspires continued commitment. Make ${userData.name || 'them'} feel seen, supported, and capable.",

  "funFact": "Light-hearted, interesting health fact unrelated to their data—just something cool to know"
}

**IMPORTANT GUIDELINES**
- Use their actual data points throughout (numbers, trends, patterns)
- Be specific, not generic (bad: "eat better", good: "increase protein to 120g/day by adding Greek yogurt at breakfast")
- Show empathy and understanding, especially around mood and challenges
- Connect the dots between different health aspects
- Frame everything in context of their ${userData.goal} goal
- Use encouraging, supportive language—never judgmental
- Provide 4-6 action items maximum (prioritize quality over quantity)
- Make recommendations realistic and achievable
- Celebrate effort and consistency, not just outcomes
- Use their name (${userData.name || 'friend'}) naturally throughout

Generate your response as pure JSON (no markdown, no code blocks).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    let jsonText = text;
    const codeBlockMarker = '```';
    const jsonMarker = codeBlockMarker + 'json';

    if (text.includes(jsonMarker)) {
      const parts = text.split(jsonMarker);
      if (parts.length > 1) {
        jsonText = parts[1].split(codeBlockMarker)[0].trim();
      }
    } else if (text.includes(codeBlockMarker)) {
      const parts = text.split(codeBlockMarker);
      if (parts.length > 1) {
        jsonText = parts[1].split(codeBlockMarker)[0].trim();
      }
    }

    jsonText = jsonText.trim();
    const insights = JSON.parse(jsonText);

    return insights;
  } catch (error) {
    console.error('Gemini AI error:', error);
    return generateEnhancedFallbackInsights(userData);
  }
}

// Enhanced fallback with personality
function generateEnhancedFallbackInsights(userData) {
  const name = userData.name || 'friend';
  const totalLogs = userData.totalLogs;
  
  return {
    personalGreeting: `Hey ${name}! 👋 I've been looking at your health journey over the last 30 days, and I'm excited to share what I've discovered.`,
    
    overview: {
      headline: totalLogs >= 30 
        ? "You're building an impressive health tracking habit!" 
        : "Your health journey is just beginning—and that's exciting!",
      narrative: `Over the past month, you've logged ${totalLogs} health entries, which shows you're taking your wellbeing seriously. ${
        totalLogs >= 60 ? "Your consistency is outstanding—you're tracking almost every day!" :
        totalLogs >= 30 ? "You're developing a solid tracking routine." :
        totalLogs >= 15 ? "You're starting to build momentum with your tracking." :
        "Every entry is a step toward better health awareness."
      } The fact that you're here, reviewing your insights, proves you're committed to growth.`,
      consistency: totalLogs >= 60 ? 'excellent' : totalLogs >= 30 ? 'good' : totalLogs >= 15 ? 'moderate' : 'needs-improvement',
      keyWins: [
        `You've taken the crucial first step: tracking your health data`,
        `You're ${totalLogs} entries closer to understanding your body's patterns`
      ],
      growthAreas: [
        totalLogs < 30 ? "More consistent tracking will reveal powerful patterns" : "Keep this momentum going!",
        "The more data you log, the better your insights become"
      ],
      interestingPatterns: [
        "Your tracking behavior itself is a form of self-care",
        "Awareness is the first step to transformation"
      ]
    },

    diet: {
      status: userData.diet?.logged ? 'developing' : 'needs-attention',
      storyTitle: userData.diet?.logged ? 'Building Nutritional Awareness' : 'Your Diet Adventure Awaits',
      deepInsight: userData.diet?.logged 
        ? `You're averaging ${userData.diet.avgCalories} calories daily. Understanding your nutrition is foundational to achieving your ${userData.goal} goal.`
        : `Diet is one of the most powerful levers for your ${userData.goal} goal. Once you start tracking, you'll discover patterns you never knew existed.`,
      whatIsWorkingWell: userData.diet?.logged 
        ? [`You're actively tracking what you eat—that's huge!`, `You're building data to make informed decisions`]
        : [`You have a fresh start to build great habits`, `No previous patterns to break—just positive ones to build`],
      opportunitiesForGrowth: [
        `Track every meal for 7 days to establish your baseline`,
        `Pay attention to how different foods affect your energy and mood`
      ],
      didYouKnow: `Your gut produces 95% of your body's serotonin—food directly impacts your mood!`
    },

    fitness: {
      status: userData.fitness?.logged ? 'developing' : 'needs-attention',
      storyTitle: userData.fitness?.logged ? 'Movement Matters' : 'Your Fitness Journey Begins',
      deepInsight: userData.fitness?.logged
        ? `You're averaging ${userData.fitness.avgSteps} steps daily with ${userData.fitness.totalWorkouts} workouts logged. Movement is medicine for both body and mind.`
        : `Physical activity is a game-changer for your ${userData.goal} goal. Even 10 minutes a day creates measurable benefits.`,
      whatIsWorkingWell: userData.fitness?.logged
        ? [`You're moving and tracking it—double win!`, `Each workout is an investment in your future self`]
        : [`You have endless possibilities ahead`, `Starting fresh means no limits on what you can achieve`],
      opportunitiesForGrowth: [
        `Start with 10-minute daily movement sessions`,
        `Track your steps to see your baseline activity level`
      ],
      didYouKnow: `Just 20 minutes of cardio can boost your mood for up to 12 hours!`
    },

    sleep: {
      status: userData.sleep?.logged ? 'developing' : 'needs-attention',
      storyTitle: userData.sleep?.logged ? 'The Sleep Story' : 'Unlocking Sleep Power',
      deepInsight: userData.sleep?.logged
        ? `You're averaging ${userData.sleep.avgHours} hours per night with a ${userData.sleep.avgQuality}/5 quality rating. Sleep is when your body repairs and your mind consolidates memories.`
        : `Quality sleep is non-negotiable for your ${userData.goal} goal. It affects everything: energy, mood, metabolism, and recovery.`,
      whatIsWorkingWell: userData.sleep?.logged
        ? [`You're paying attention to your sleep—most people don't!`, `Tracking sleep helps you understand your recovery patterns`]
        : [`You can start fresh with healthy sleep habits`, `Sleep tracking reveals powerful insights quickly`],
      opportunitiesForGrowth: [
        `Aim for 7-9 hours nightly and track how you feel`,
        `Notice how sleep quality affects your next-day performance`
      ],
      connectionToOtherMetrics: `Good sleep amplifies your fitness results and improves your dietary choices. Poor sleep does the opposite.`,
      didYouKnow: `Your brain clears out toxins during deep sleep—it's literally a nightly detox!`
    },

    mood: {
      status: userData.mood?.logged ? 'developing' : 'needs-attention',
      storyTitle: userData.mood?.logged ? 'Emotional Intelligence Building' : 'Your Mental Wellness Matters',
      deepInsight: userData.mood?.logged
        ? `Your average mood rating is ${userData.mood.avgMood}/5. Tracking your emotional state helps you identify triggers and patterns.`
        : `Mental wellbeing is just as important as physical health. Tracking mood helps you understand what lifts you up and what brings you down.`,
      emotionalPatterns: userData.mood?.logged
        ? [`You're developing emotional awareness`, `Each mood entry is data that helps you understand yourself better`]
        : [`You have the opportunity to start noticing patterns`, `Mood tracking can be surprisingly revealing`],
      strengthsAndResilience: [
        `You're taking steps to improve your health—that takes courage`,
        `Self-awareness is a superpower you're developing`
      ],
      supportiveSuggestions: [
        `Journal briefly when logging mood to identify triggers`,
        `Celebrate small wins daily—they compound!`
      ],
      connectionToPhysicalHealth: `Your physical health (diet, exercise, sleep) directly impacts your mood. They're all connected in a beautiful feedback loop.`,
      didYouKnow: `Gratitude journaling for 2 weeks can increase happiness levels for up to 6 months!`
    },

    theBigPicture: {
      holisticSummary: `${name}, here's the truth: your health is an interconnected system. Sleep affects your food choices. Exercise influences your mood. Good nutrition fuels better workouts. And your mental state impacts everything. Right now, you're at the beginning of discovering YOUR unique patterns. The data you're collecting isn't just numbers—it's a map to understanding yourself better. Every entry is progress. Every day tracking is a victory. You're not just logging data; you're investing in self-knowledge.`,
      keyCorrelations: [
        `The more consistently you track, the clearer your patterns become`,
        `Small daily actions compound into major transformations`
      ],
      momentumCheck: `You've started something important. The key now is consistency over intensity. Small, daily efforts beat sporadic perfection every time.`
    },

    yourActionPlan: [
      {
        category: 'Lifestyle',
        priority: 'high',
        title: 'Build Your Tracking Habit',
        why: `Consistent data collection is the foundation of personalized insights. Without it, we're guessing. With it, we're optimizing.`,
        what: `Commit to logging at least one entry per day across all categories (diet, fitness, sleep, mood) for the next 14 days.`,
        how: `1. Set a daily reminder for 9 PM\n2. Spend 5 minutes reviewing your day\n3. Log one entry in each category\n4. Note one thing you're grateful for\n5. Plan one healthy action for tomorrow`,
        expectedOutcome: `In 2 weeks, you'll have 56+ data points revealing your unique patterns. You'll start seeing connections between your behaviors and how you feel.`,
        difficulty: 'easy',
        timeCommitment: '5-10 minutes daily'
      },
      {
        category: 'Mental Wellbeing',
        priority: 'high',
        title: 'Start Your Self-Discovery Journey',
        why: `Understanding yourself is the key to sustainable health improvement. Generic advice fails; personalized insight transforms.`,
        what: `As you track, notice patterns: Which meals give you energy? When do you sleep best? What makes your mood soar? This awareness is gold.`,
        how: `1. Keep a simple note with each entry\n2. Look for patterns weekly\n3. Test hypotheses (e.g., "Does morning exercise improve my mood?")\n4. Adjust based on what you learn`,
        expectedOutcome: `You'll become the expert on YOUR body. You'll make decisions based on data, not guesswork.`,
        difficulty: 'moderate',
        timeCommitment: '10 minutes weekly'
      }
    ],

    weeklyFocus: {
      theme: 'Consistency Over Perfection',
      dailyMicroHabit: 'Log one entry every day, no matter what',
      weeklyChallenge: 'Achieve 7 consecutive days of complete logging (all 4 categories)',
      trackingTip: 'Set phone reminders and celebrate each day you complete your tracking'
    },

    motivationalClose: `${name}, you're not just tracking health data—you're becoming someone who invests in themselves. That's powerful. Every entry you log is a vote for the person you're becoming. Some days will be perfect, others messy. That's life. What matters is that you keep showing up. Your future self is cheering for you right now. Let's make this journey amazing together! 🌟`,

    funFact: `The average person makes 35,000 decisions per day. By tracking your health, you're making those decisions more intentionally!`
  };
}
