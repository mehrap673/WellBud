import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Heart, Sparkles, X, Search } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

const MoodTracker = () => {
  const { fetchLogs, createLog, deleteLog, updateLog } = useHealth();
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [moodSearchTerm, setMoodSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    mood: 'happy',
    energy: '5',
    stress: '5',
    activities: '',
    notes: ''
  });

  const moods = [
    { value: 'excellent', label: 'Excellent', emoji: '😄', color: 'green' },
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'blue' },
    { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'gray' },
    { value: 'sad', label: 'Sad', emoji: '😢', color: 'indigo' },
    { value: 'stressed', label: 'Stressed', emoji: '😰', color: 'red' }
  ];

  // Predefined mood scenarios
  const predefinedMoodScenarios = [
    // Excellent Mood
    { name: 'Perfect Morning', mood: 'excellent', energy: 9, stress: 2, activities: 'Morning meditation, yoga, healthy breakfast', category: 'Morning Routine', description: 'Started day with wellness activities' },
    { name: 'Workout Achievement', mood: 'excellent', energy: 10, stress: 1, activities: 'Gym workout, personal record, protein shake', category: 'Fitness', description: 'Hit new fitness goals' },
    { name: 'Social Gathering', mood: 'excellent', energy: 8, stress: 2, activities: 'Friends meetup, dinner, laughter', category: 'Social', description: 'Quality time with friends' },
    { name: 'Creative Success', mood: 'excellent', energy: 9, stress: 1, activities: 'Project completion, creative work, achievement', category: 'Work', description: 'Accomplished creative goals' },
    { name: 'Nature Walk', mood: 'excellent', energy: 8, stress: 1, activities: 'Hiking, fresh air, photography', category: 'Outdoor', description: 'Peaceful time in nature' },
    { name: 'Family Time', mood: 'excellent', energy: 7, stress: 1, activities: 'Quality family time, games, cooking together', category: 'Family', description: 'Bonding with loved ones' },
    
    // Happy Mood
    { name: 'Productive Day', mood: 'happy', energy: 8, stress: 3, activities: 'Work tasks completed, organization, planning', category: 'Work', description: 'Got things done efficiently' },
    { name: 'Learning Session', mood: 'happy', energy: 7, stress: 3, activities: 'Online course, reading, skill building', category: 'Learning', description: 'Gained new knowledge' },
    { name: 'Hobby Time', mood: 'happy', energy: 7, stress: 2, activities: 'Painting, music, crafting', category: 'Hobbies', description: 'Enjoyed personal interests' },
    { name: 'Movie Night', mood: 'happy', energy: 6, stress: 2, activities: 'Streaming movies, popcorn, relaxation', category: 'Entertainment', description: 'Relaxing entertainment' },
    { name: 'Shopping Day', mood: 'happy', energy: 7, stress: 3, activities: 'Shopping, browsing, purchases', category: 'Leisure', description: 'Retail therapy session' },
    { name: 'Cooking Adventure', mood: 'happy', energy: 7, stress: 4, activities: 'Trying new recipes, meal prep, kitchen creativity', category: 'Home', description: 'Culinary experimentation' },
    { name: 'Game Night', mood: 'happy', energy: 8, stress: 2, activities: 'Video games, board games, fun', category: 'Entertainment', description: 'Playful recreation' },
    { name: 'Reading Session', mood: 'happy', energy: 6, stress: 2, activities: 'Books, literature, quiet time', category: 'Leisure', description: 'Peaceful reading' },
    
    // Neutral Mood
    { name: 'Regular Workday', mood: 'neutral', energy: 6, stress: 5, activities: 'Office work, meetings, routine tasks', category: 'Work', description: 'Standard work routine' },
    { name: 'House Chores', mood: 'neutral', energy: 5, stress: 4, activities: 'Cleaning, laundry, organizing', category: 'Home', description: 'Necessary household tasks' },
    { name: 'Commute Time', mood: 'neutral', energy: 5, stress: 6, activities: 'Travel, commuting, transit', category: 'Travel', description: 'Regular transportation' },
    { name: 'Errands Day', mood: 'neutral', energy: 6, stress: 5, activities: 'Groceries, banking, appointments', category: 'Tasks', description: 'Running necessary errands' },
    { name: 'Study Session', mood: 'neutral', energy: 6, stress: 6, activities: 'Studying, homework, assignments', category: 'Learning', description: 'Academic responsibilities' },
    { name: 'Waiting Period', mood: 'neutral', energy: 4, stress: 5, activities: 'Appointments, queues, waiting', category: 'Downtime', description: 'Idle waiting time' },
    
    // Sad Mood  
    { name: 'Lonely Evening', mood: 'sad', energy: 3, stress: 6, activities: 'Alone time, reflection, solitude', category: 'Emotional', description: 'Feeling isolated' },
    { name: 'Disappointment', mood: 'sad', energy: 4, stress: 7, activities: 'Processing emotions, coping, rest', category: 'Emotional', description: 'Dealing with letdown' },
    { name: 'Rainy Day Blues', mood: 'sad', energy: 4, stress: 5, activities: 'Indoor activities, low energy, rest', category: 'Weather', description: 'Weather affecting mood' },
    { name: 'Missing Someone', mood: 'sad', energy: 3, stress: 6, activities: 'Nostalgia, memories, emotional processing', category: 'Emotional', description: 'Feeling of absence' },
    { name: 'Health Concerns', mood: 'sad', energy: 3, stress: 7, activities: 'Rest, medical attention, recovery', category: 'Health', description: 'Not feeling well' },
    
    // Stressed Mood
    { name: 'Deadline Pressure', mood: 'stressed', energy: 7, stress: 9, activities: 'Urgent work, tight deadlines, pressure', category: 'Work', description: 'High-pressure situation' },
    { name: 'Exam Preparation', mood: 'stressed', energy: 6, stress: 9, activities: 'Intensive study, cramming, anxiety', category: 'Learning', description: 'Test-related stress' },
    { name: 'Financial Worry', mood: 'stressed', energy: 4, stress: 8, activities: 'Budgeting, planning, concern', category: 'Life', description: 'Money-related anxiety' },
    { name: 'Conflict Resolution', mood: 'stressed', energy: 5, stress: 9, activities: 'Difficult conversations, tension, resolution', category: 'Social', description: 'Interpersonal challenges' },
    { name: 'Overwhelming Schedule', mood: 'stressed', energy: 5, stress: 8, activities: 'Multiple commitments, rushed, packed schedule', category: 'Time', description: 'Too many obligations' },
    { name: 'Technical Issues', mood: 'stressed', energy: 6, stress: 8, activities: 'Problem-solving, troubleshooting, frustration', category: 'Work', description: 'Technology problems' },
    { name: 'Sleep Deprived', mood: 'stressed', energy: 2, stress: 7, activities: 'Fatigue, exhaustion, low energy', category: 'Health', description: 'Lack of proper rest' },
    { name: 'Traffic Stress', mood: 'stressed', energy: 4, stress: 8, activities: 'Commute delays, stuck in traffic, frustration', category: 'Travel', description: 'Transportation delays' }
  ];

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await fetchLogs('mood');
    setLogs(data);
  };

  const handleMoodSelect = (scenario) => {
    setFormData({
      mood: scenario.mood,
      energy: scenario.energy.toString(),
      stress: scenario.stress.toString(),
      activities: scenario.activities,
      notes: scenario.description
    });
    setShowMoodSelector(false);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const logData = {
      mood: formData.mood,
      energy: parseInt(formData.energy),
      stress: parseInt(formData.stress),
      activities: formData.activities,
      notes: formData.notes
    };

    if (editingLog) {
      await updateLog(editingLog._id, logData);
      setEditingLog(null);
    } else {
      await createLog('mood', logData);
    }

    setFormData({ mood: 'happy', energy: '5', stress: '5', activities: '', notes: '' });
    setShowForm(false);
    loadLogs();
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setFormData({
      mood: log.data.mood,
      energy: log.data.energy.toString(),
      stress: log.data.stress.toString(),
      activities: log.data.activities,
      notes: log.data.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this mood log?')) {
      await deleteLog(id);
      loadLogs();
    }
  };

  const filteredScenarios = predefinedMoodScenarios.filter(scenario =>
    scenario.name.toLowerCase().includes(moodSearchTerm.toLowerCase()) ||
    scenario.category.toLowerCase().includes(moodSearchTerm.toLowerCase()) ||
    scenario.activities.toLowerCase().includes(moodSearchTerm.toLowerCase()) ||
    scenario.description.toLowerCase().includes(moodSearchTerm.toLowerCase())
  );

  const avgEnergy = logs.length > 0
    ? (logs.reduce((sum, log) => sum + log.data.energy, 0) / logs.length).toFixed(1)
    : 0;

  const avgStress = logs.length > 0
    ? (logs.reduce((sum, log) => sum + log.data.stress, 0) / logs.length).toFixed(1)
    : 0;

  const moodCounts = logs.reduce((acc, log) => {
    acc[log.data.mood] = (acc[log.data.mood] || 0) + 1;
    return acc;
  }, {});

  // Group scenarios by category
  const scenariosByCategory = predefinedMoodScenarios.reduce((acc, scenario) => {
    if (!acc[scenario.category]) acc[scenario.category] = [];
    acc[scenario.category].push(scenario);
    return acc;
  }, {});

  const getMoodColor = (moodValue) => {
    const mood = moods.find(m => m.value === moodValue);
    return mood ? mood.color : 'gray';
  };

  const getMoodEmoji = (moodValue) => {
    const mood = moods.find(m => m.value === moodValue);
    return mood ? mood.emoji : '😐';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Heart className="text-pink-500" size={32} />
            <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">Mood Tracker</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your emotional wellbeing</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowMoodSelector(true);
              setMoodSearchTerm('');
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles size={20} />
            Quick Add
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingLog(null);
              setFormData({ mood: 'happy', energy: '5', stress: '5', activities: '', notes: '' });
            }}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            Custom Log
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">⚡</span>
            <span className="text-yellow-500 text-sm font-medium">Avg Energy</span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {avgEnergy}<span className="text-lg text-gray-500">/10</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">😌</span>
            <span className="text-blue-500 text-sm font-medium">Avg Stress</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {avgStress}<span className="text-lg text-gray-500">/10</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">📊</span>
            <span className="text-pink-500 text-sm font-medium">Total Logs</span>
          </div>
          <p className="text-3xl font-bold text-pink-600">{logs.length}</p>
        </motion.div>
      </div>

      {/* Mood Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Mood Distribution</h3>
        <div className="flex flex-wrap gap-3">
          {moods.map(mood => (
            <div
              key={mood.value}
              className={`flex-1 min-w-[120px] bg-${mood.color}-50 dark:bg-${mood.color}-900/20 rounded-xl p-4 text-center`}
            >
              <p className="text-3xl mb-2">{mood.emoji}</p>
              <p className="text-sm font-medium">{mood.label}</p>
              <p className={`text-2xl font-bold text-${mood.color}-600`}>{moodCounts[mood.value] || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Selector Modal */}
      <AnimatePresence>
        {showMoodSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoodSelector(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-4xl my-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white p-5 flex items-center justify-between flex-shrink-0 rounded-t-3xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Quick Mood Selection</h2>
                      <p className="text-xs opacity-90">Choose from 30+ common mood scenarios</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMoodSelector(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Search */}
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={moodSearchTerm}
                      onChange={(e) => setMoodSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Search mood scenarios, activities, or categories..."
                      autoFocus
                    />
                  </div>
                </div>

                {/* Scenarios List */}
                <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-b-3xl">
                  {moodSearchTerm ? (
                    // Show filtered results
                    <div className="space-y-3">
                      {filteredScenarios.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">No mood scenarios found</p>
                      ) : (
                        filteredScenarios.map((scenario, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => handleMoodSelect(scenario)}
                            className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 text-left"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{getMoodEmoji(scenario.mood)}</span>
                                <h3 className="font-bold text-lg">{scenario.name}</h3>
                              </div>
                              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 text-pink-700 dark:text-pink-300 font-semibold">
                                {scenario.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{scenario.description}</p>
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Energy</p>
                                <p className="font-bold text-yellow-600">{scenario.energy}/10</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Stress</p>
                                <p className="font-bold text-blue-600">{scenario.stress}/10</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Mood</p>
                                <p className={`font-bold capitalize text-${getMoodColor(scenario.mood)}-600`}>{scenario.mood}</p>
                              </div>
                            </div>
                          </motion.button>
                        ))
                      )}
                    </div>
                  ) : (
                    // Show by category
                    <div className="space-y-6">
                      {Object.entries(scenariosByCategory).map(([category, scenarios]) => (
                        <div key={category}>
                          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                              {category}
                            </span>
                            <span className="text-sm text-gray-500">({scenarios.length})</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {scenarios.map((scenario, idx) => (
                              <motion.button
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.02 }}
                                onClick={() => handleMoodSelect(scenario)}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 text-left"
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-2xl">{getMoodEmoji(scenario.mood)}</span>
                                  <h4 className="font-bold">{scenario.name}</h4>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{scenario.description}</p>
                                <div className="flex gap-3 text-xs">
                                  <span className="text-yellow-600 font-semibold">⚡ {scenario.energy}/10</span>
                                  <span className="text-blue-600 font-semibold">😌 {scenario.stress}/10</span>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold mb-6">{editingLog ? 'Edit Mood Log' : 'Log Your Mood'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">How are you feeling?</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {moods.map(mood => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood: mood.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.mood === mood.value
                        ? `border-${mood.color}-500 bg-${mood.color}-50 dark:bg-${mood.color}-900/20`
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-3xl mb-1">{mood.emoji}</p>
                    <p className="text-sm font-medium">{mood.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Energy Level: {formData.energy}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.energy}
                  onChange={(e) => setFormData({ ...formData, energy: e.target.value })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stress Level: {formData.stress}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.stress}
                  onChange={(e) => setFormData({ ...formData, stress: e.target.value })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            <input
              type="text"
              value={formData.activities}
              onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Activities (e.g., yoga, reading, work)"
              required
            />

            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows="3"
              placeholder="Notes (optional)"
            />

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all">
                {editingLog ? 'Update' : 'Log'} Mood
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingLog(null);
                }}
                className="px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Logs */}
      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <Heart className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
            <p className="text-gray-500">No mood logs yet. Start tracking!</p>
          </div>
        ) : (
          logs.map((log, idx) => {
            const moodData = moods.find(m => m.value === log.data.mood);
            return (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{moodData?.emoji}</span>
                      <div>
                        <h3 className="text-xl font-bold capitalize">{log.data.mood}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Energy</p>
                        <p className="font-bold text-yellow-600">{log.data.energy}/10</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Stress</p>
                        <p className="font-bold text-blue-600">{log.data.stress}/10</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Activities</p>
                        <p className="font-bold text-pink-600">{log.data.activities}</p>
                      </div>
                    </div>
                    {log.data.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">{log.data.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(log)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(log._id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
