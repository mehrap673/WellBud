import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Moon, Sparkles, X, Search } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

const SleepTracker = () => {
  const { fetchLogs, createLog, deleteLog, updateLog } = useHealth();
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSleepSelector, setShowSleepSelector] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [sleepSearchTerm, setSleepSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    hours: '',
    quality: 'good',
    bedTime: '',
    wakeTime: '',
    notes: ''
  });

  // Predefined sleep patterns
  const predefinedSleepPatterns = [
    // Optimal Sleep (7-9 hours)
    { name: 'Standard 8 Hours', hours: 8.0, quality: 'excellent', bedTime: '22:00', wakeTime: '06:00', category: 'Optimal', description: 'Recommended sleep duration' },
    { name: 'Early Bird (8h)', hours: 8.0, quality: 'excellent', bedTime: '21:00', wakeTime: '05:00', category: 'Optimal', description: 'Early sleeper schedule' },
    { name: 'Night Owl (8h)', hours: 8.0, quality: 'good', bedTime: '23:30', wakeTime: '07:30', category: 'Optimal', description: 'Late sleeper schedule' },
    { name: '7.5 Hours Sleep', hours: 7.5, quality: 'good', bedTime: '22:30', wakeTime: '06:00', category: 'Optimal', description: '5 complete sleep cycles' },
    { name: '9 Hours Sleep', hours: 9.0, quality: 'excellent', bedTime: '21:30', wakeTime: '06:30', category: 'Optimal', description: '6 complete sleep cycles' },
    { name: 'Professional (7h)', hours: 7.0, quality: 'good', bedTime: '23:00', wakeTime: '06:00', category: 'Optimal', description: 'Working professional schedule' },
    
    // Short Sleep (5-6.5 hours)
    { name: 'Short Sleep (6h)', hours: 6.0, quality: 'good', bedTime: '00:00', wakeTime: '06:00', category: 'Short', description: 'Minimal rest period' },
    { name: 'Late Night Study', hours: 5.5, quality: 'poor', bedTime: '01:00', wakeTime: '06:30', category: 'Short', description: 'Student schedule' },
    { name: 'Shift Worker (6h)', hours: 6.0, quality: 'good', bedTime: '22:00', wakeTime: '04:00', category: 'Short', description: 'Early shift schedule' },
    { name: 'Party Night', hours: 5.0, quality: 'poor', bedTime: '02:00', wakeTime: '07:00', category: 'Short', description: 'Social event schedule' },
    { name: 'Busy Day (6.5h)', hours: 6.5, quality: 'good', bedTime: '23:30', wakeTime: '06:00', category: 'Short', description: 'Hectic schedule' },
    
    // Extended Sleep (9-10 hours)
    { name: 'Recovery Sleep', hours: 10.0, quality: 'excellent', bedTime: '21:00', wakeTime: '07:00', category: 'Extended', description: 'Post-workout recovery' },
    { name: 'Weekend Sleep-In', hours: 9.5, quality: 'excellent', bedTime: '23:00', wakeTime: '08:30', category: 'Extended', description: 'Weekend relaxation' },
    { name: 'Catch-up Sleep', hours: 10.0, quality: 'good', bedTime: '22:00', wakeTime: '08:00', category: 'Extended', description: 'Sleep debt recovery' },
    { name: 'Lazy Sunday', hours: 9.0, quality: 'excellent', bedTime: '23:00', wakeTime: '08:00', category: 'Extended', description: 'Leisurely morning' },
    
    // Biphasic Sleep (Siesta Pattern)
    { name: 'Mediterranean Siesta', hours: 7.0, quality: 'good', bedTime: '23:00', wakeTime: '06:00', category: 'Biphasic', description: 'Night sleep + afternoon nap' },
    { name: 'Corporate Nap', hours: 6.5, quality: 'good', bedTime: '23:30', wakeTime: '06:00', category: 'Biphasic', description: 'Power nap included' },
    { name: 'Student Siesta', hours: 7.5, quality: 'good', bedTime: '00:00', wakeTime: '07:30', category: 'Biphasic', description: 'Study break nap' },
    
    // Work Schedule Patterns
    { name: 'Night Shift (Day Sleep)', hours: 7.0, quality: 'good', bedTime: '08:00', wakeTime: '15:00', category: 'Shift Work', description: 'Night shift worker' },
    { name: 'Evening Shift', hours: 8.0, quality: 'good', bedTime: '02:00', wakeTime: '10:00', category: 'Shift Work', description: 'Evening shift schedule' },
    { name: 'Rotating Shift', hours: 6.5, quality: 'poor', bedTime: '23:00', wakeTime: '05:30', category: 'Shift Work', description: 'Variable schedule' },
    { name: 'Graveyard Shift', hours: 7.0, quality: 'good', bedTime: '09:00', wakeTime: '16:00', category: 'Shift Work', description: 'Late night work' },
    
    // Student Patterns
    { name: 'College Student', hours: 6.5, quality: 'good', bedTime: '01:00', wakeTime: '07:30', category: 'Student', description: 'Late night study' },
    { name: 'Exam Week', hours: 5.0, quality: 'poor', bedTime: '02:00', wakeTime: '07:00', category: 'Student', description: 'Intensive study period' },
    { name: 'Summer Break', hours: 9.0, quality: 'excellent', bedTime: '00:00', wakeTime: '09:00', category: 'Student', description: 'Vacation schedule' },
    
    // Lifestyle Patterns
    { name: 'Gym Morning Routine', hours: 7.0, quality: 'good', bedTime: '22:00', wakeTime: '05:00', category: 'Fitness', description: 'Early workout schedule' },
    { name: 'Meditation Practice', hours: 8.0, quality: 'excellent', bedTime: '21:30', wakeTime: '05:30', category: 'Wellness', description: 'Morning meditation' },
    { name: 'Freelancer Schedule', hours: 7.5, quality: 'good', bedTime: '01:00', wakeTime: '08:30', category: 'Flexible', description: 'Flexible work hours' },
    { name: 'Remote Worker', hours: 8.0, quality: 'excellent', bedTime: '23:00', wakeTime: '07:00', category: 'Flexible', description: 'Work from home' },
    { name: 'Parent Schedule', hours: 6.0, quality: 'good', bedTime: '23:00', wakeTime: '05:00', category: 'Family', description: 'Early child care' },
    
    // Special Occasions
    { name: 'New Year Party', hours: 4.0, quality: 'poor', bedTime: '04:00', wakeTime: '08:00', category: 'Special', description: 'Celebration night' },
    { name: 'Travel Recovery', hours: 9.0, quality: 'good', bedTime: '20:00', wakeTime: '05:00', category: 'Special', description: 'Jet lag adjustment' },
    { name: 'Festival Night', hours: 5.5, quality: 'poor', bedTime: '02:30', wakeTime: '08:00', category: 'Special', description: 'Religious/cultural event' },
    { name: 'Movie Marathon', hours: 6.0, quality: 'good', bedTime: '01:00', wakeTime: '07:00', category: 'Special', description: 'Entertainment night' }
  ];

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await fetchLogs('sleep');
    setLogs(data);
  };

  const handleSleepSelect = (pattern) => {
    setFormData({
      hours: pattern.hours.toString(),
      quality: pattern.quality,
      bedTime: pattern.bedTime,
      wakeTime: pattern.wakeTime,
      notes: pattern.description
    });
    setShowSleepSelector(false);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const logData = {
      hours: parseFloat(formData.hours),
      quality: formData.quality,
      bedTime: formData.bedTime,
      wakeTime: formData.wakeTime,
      notes: formData.notes
    };

    if (editingLog) {
      await updateLog(editingLog._id, logData);
      setEditingLog(null);
    } else {
      await createLog('sleep', logData);
    }

    setFormData({ hours: '', quality: 'good', bedTime: '', wakeTime: '', notes: '' });
    setShowForm(false);
    loadLogs();
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setFormData({
      hours: log.data.hours.toString(),
      quality: log.data.quality,
      bedTime: log.data.bedTime,
      wakeTime: log.data.wakeTime,
      notes: log.data.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this sleep log?')) {
      await deleteLog(id);
      loadLogs();
    }
  };

  const filteredPatterns = predefinedSleepPatterns.filter(pattern =>
    pattern.name.toLowerCase().includes(sleepSearchTerm.toLowerCase()) ||
    pattern.category.toLowerCase().includes(sleepSearchTerm.toLowerCase()) ||
    pattern.description.toLowerCase().includes(sleepSearchTerm.toLowerCase())
  );

  const avgHours = logs.length > 0
    ? (logs.reduce((sum, log) => sum + log.data.hours, 0) / logs.length).toFixed(1)
    : 0;

  const qualityCounts = logs.reduce((acc, log) => {
    acc[log.data.quality] = (acc[log.data.quality] || 0) + 1;
    return acc;
  }, {});

  // Group patterns by category
  const patternsByCategory = predefinedSleepPatterns.reduce((acc, pattern) => {
    if (!acc[pattern.category]) acc[pattern.category] = [];
    acc[pattern.category].push(pattern);
    return acc;
  }, {});

  const getQualityColor = (quality) => {
    const colors = {
      'poor': 'text-red-600 bg-red-100 dark:bg-red-900/30',
      'good': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
      'excellent': 'text-green-600 bg-green-100 dark:bg-green-900/30'
    };
    return colors[quality] || colors['good'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Moon className="text-blue-500" size={32} />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Sleep Tracker</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your sleep patterns</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowSleepSelector(true);
              setSleepSearchTerm('');
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
              setFormData({ hours: '', quality: 'good', bedTime: '', wakeTime: '', notes: '' });
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
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
            <span className="text-3xl">😴</span>
            <span className="text-blue-500 text-sm font-medium">Average Sleep</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {avgHours} <span className="text-lg text-gray-500">hrs</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">🌙</span>
            <span className="text-purple-500 text-sm font-medium">Total Nights</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{logs.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">⭐</span>
            <span className="text-yellow-500 text-sm font-medium">Quality</span>
          </div>
          <div className="flex gap-3 mt-2">
            <div className="text-center">
              <p className="text-2xl">😴</p>
              <p className="text-xs text-gray-500">{qualityCounts.poor || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">😊</p>
              <p className="text-xs text-gray-500">{qualityCounts.good || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">⭐</p>
              <p className="text-xs text-gray-500">{qualityCounts.excellent || 0}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sleep Pattern Selector Modal */}
      <AnimatePresence>
        {showSleepSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSleepSelector(false)}
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
                <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white p-5 flex items-center justify-between flex-shrink-0 rounded-t-3xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Quick Sleep Pattern Selection</h2>
                      <p className="text-xs opacity-90">Choose from 30+ pre-configured sleep schedules</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSleepSelector(false)}
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
                      value={sleepSearchTerm}
                      onChange={(e) => setSleepSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search sleep patterns, categories, or descriptions..."
                      autoFocus
                    />
                  </div>
                </div>

                {/* Patterns List */}
                <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-b-3xl">
                  {sleepSearchTerm ? (
                    // Show filtered results
                    <div className="space-y-3">
                      {filteredPatterns.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">No sleep patterns found</p>
                      ) : (
                        filteredPatterns.map((pattern, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => handleSleepSelect(pattern)}
                            className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-left"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg">{pattern.name}</h3>
                              <div className="flex gap-2">
                                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 font-semibold">
                                  {pattern.category}
                                </span>
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getQualityColor(pattern.quality)}`}>
                                  {pattern.quality}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{pattern.description}</p>
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="font-bold text-blue-600">{pattern.hours} hrs</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Bed Time</p>
                                <p className="font-bold text-indigo-600">{pattern.bedTime}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Wake Time</p>
                                <p className="font-bold text-purple-600">{pattern.wakeTime}</p>
                              </div>
                            </div>
                          </motion.button>
                        ))
                      )}
                    </div>
                  ) : (
                    // Show by category
                    <div className="space-y-6">
                      {Object.entries(patternsByCategory).map(([category, patterns]) => (
                        <div key={category}>
                          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              {category}
                            </span>
                            <span className="text-sm text-gray-500">({patterns.length})</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {patterns.map((pattern, idx) => (
                              <motion.button
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.02 }}
                                onClick={() => handleSleepSelect(pattern)}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-left"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-bold">{pattern.name}</h4>
                                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getQualityColor(pattern.quality)}`}>
                                    {pattern.quality}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{pattern.description}</p>
                                <div className="flex gap-3 text-xs">
                                  <span className="text-blue-600 font-semibold">{pattern.hours}h</span>
                                  <span className="text-indigo-600">{pattern.bedTime} - {pattern.wakeTime}</span>
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
          <h3 className="text-xl font-bold mb-6">{editingLog ? 'Edit Sleep Log' : 'Log Sleep'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                step="0.5"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sleep Hours"
                required
              />
              <select
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="poor">😴 Poor</option>
                <option value="good">😊 Good</option>
                <option value="excellent">⭐ Excellent</option>
              </select>
              <input
                type="time"
                value={formData.bedTime}
                onChange={(e) => setFormData({ ...formData, bedTime: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="time"
                value={formData.wakeTime}
                onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Notes (optional)"
            />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all">
                {editingLog ? 'Update' : 'Log'} Sleep
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
            <Moon className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
            <p className="text-gray-500">No sleep logs yet. Start tracking!</p>
          </div>
        ) : (
          logs.map((log, idx) => {
            const qualityEmoji = { poor: '😴', good: '😊', excellent: '⭐' }[log.data.quality];
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
                      <span className="text-3xl">{qualityEmoji}</span>
                      <div>
                        <h3 className="text-xl font-bold">{log.data.hours} hours</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Quality</p>
                        <p className="font-bold capitalize text-blue-600">{log.data.quality}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Bed Time</p>
                        <p className="font-bold text-indigo-600">{log.data.bedTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Wake Time</p>
                        <p className="font-bold text-purple-600">{log.data.wakeTime}</p>
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

export default SleepTracker;
