import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Dumbbell, Sparkles, X, Search } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

const FitnessTracker = () => {
  const { fetchLogs, createLog, deleteLog, updateLog } = useHealth();
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [workoutSearchTerm, setWorkoutSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    activity: '',
    duration: '',
    steps: '',
    distance: '',
    calories: '',
    notes: ''
  });

  // Predefined workouts database (30 min session for 70kg person)
  const predefinedWorkouts = [
    // Running & Cardio
    { name: 'Running (8 km/h)', duration: 30, steps: 3600, distance: 4.0, calories: 295, category: 'Cardio', intensity: 'Moderate' },
    { name: 'Running (10 km/h)', duration: 30, steps: 4200, distance: 5.0, calories: 372, category: 'Cardio', intensity: 'High' },
    { name: 'Running (12 km/h)', duration: 30, steps: 4800, distance: 6.0, calories: 465, category: 'Cardio', intensity: 'High' },
    { name: 'Sprinting', duration: 30, steps: 5400, distance: 6.5, calories: 640, category: 'Cardio', intensity: 'Very High' },
    { name: 'Jogging (6 km/h)', duration: 30, steps: 3000, distance: 3.0, calories: 246, category: 'Cardio', intensity: 'Light' },
    { name: 'Treadmill Walking (5 km/h)', duration: 30, steps: 2500, distance: 2.5, calories: 120, category: 'Cardio', intensity: 'Light' },
    { name: 'Treadmill Running', duration: 30, steps: 4000, distance: 5.0, calories: 350, category: 'Cardio', intensity: 'High' },
    
    // Cycling
    { name: 'Cycling (15 km/h)', duration: 30, steps: 0, distance: 7.5, calories: 240, category: 'Cycling', intensity: 'Moderate' },
    { name: 'Cycling (20 km/h)', duration: 30, steps: 0, distance: 10.0, calories: 360, category: 'Cycling', intensity: 'High' },
    { name: 'Cycling (25 km/h)', duration: 30, steps: 0, distance: 12.5, calories: 480, category: 'Cycling', intensity: 'Very High' },
    { name: 'Stationary Bike (Moderate)', duration: 30, steps: 0, distance: 8.0, calories: 260, category: 'Cycling', intensity: 'Moderate' },
    { name: 'Stationary Bike (Vigorous)', duration: 30, steps: 0, distance: 12.0, calories: 391, category: 'Cycling', intensity: 'High' },
    { name: 'Mountain Biking', duration: 30, steps: 0, distance: 6.0, calories: 316, category: 'Cycling', intensity: 'High' },
    
    // Swimming
    { name: 'Swimming (Freestyle Slow)', duration: 30, steps: 0, distance: 0.8, calories: 248, category: 'Swimming', intensity: 'Moderate' },
    { name: 'Swimming (Freestyle Fast)', duration: 30, steps: 0, distance: 1.2, calories: 372, category: 'Swimming', intensity: 'High' },
    { name: 'Swimming (Breaststroke)', duration: 30, steps: 0, distance: 0.7, calories: 310, category: 'Swimming', intensity: 'Moderate' },
    { name: 'Swimming (Backstroke)', duration: 30, steps: 0, distance: 0.8, calories: 298, category: 'Swimming', intensity: 'Moderate' },
    { name: 'Water Aerobics', duration: 30, steps: 0, distance: 0.0, calories: 186, category: 'Swimming', intensity: 'Light' },
    
    // HIIT & Training
    { name: 'HIIT Training', duration: 30, steps: 2000, distance: 0.0, calories: 353, category: 'HIIT', intensity: 'Very High' },
    { name: 'Circuit Training', duration: 30, steps: 1500, distance: 0.0, calories: 298, category: 'HIIT', intensity: 'High' },
    { name: 'Crossfit', duration: 30, steps: 1800, distance: 0.0, calories: 360, category: 'HIIT', intensity: 'Very High' },
    { name: 'Tabata Training', duration: 30, steps: 1200, distance: 0.0, calories: 330, category: 'HIIT', intensity: 'Very High' },
    { name: 'Boot Camp', duration: 30, steps: 2200, distance: 0.0, calories: 340, category: 'HIIT', intensity: 'High' },
    
    // Strength Training
    { name: 'Weight Lifting (Moderate)', duration: 30, steps: 800, distance: 0.0, calories: 112, category: 'Strength', intensity: 'Moderate' },
    { name: 'Weight Lifting (Vigorous)', duration: 30, steps: 1200, distance: 0.0, calories: 186, category: 'Strength', intensity: 'High' },
    { name: 'Bodyweight Exercises', duration: 30, steps: 1000, distance: 0.0, calories: 167, category: 'Strength', intensity: 'Moderate' },
    { name: 'Push-ups & Sit-ups', duration: 30, steps: 600, distance: 0.0, calories: 186, category: 'Strength', intensity: 'Moderate' },
    { name: 'Kettlebell Workout', duration: 30, steps: 1400, distance: 0.0, calories: 224, category: 'Strength', intensity: 'High' },
    { name: 'Dumbbell Training', duration: 30, steps: 900, distance: 0.0, calories: 167, category: 'Strength', intensity: 'Moderate' },
    
    // Aerobics & Dance
    { name: 'Aerobic Dance', duration: 30, steps: 2800, distance: 0.0, calories: 246, category: 'Dance', intensity: 'Moderate' },
    { name: 'Zumba', duration: 30, steps: 3200, distance: 0.0, calories: 298, category: 'Dance', intensity: 'High' },
    { name: 'Hip Hop Dance', duration: 30, steps: 3000, distance: 0.0, calories: 260, category: 'Dance', intensity: 'Moderate' },
    { name: 'Ballet', duration: 30, steps: 2000, distance: 0.0, calories: 179, category: 'Dance', intensity: 'Moderate' },
    
    // Sports
    { name: 'Basketball', duration: 30, steps: 3500, distance: 2.5, calories: 298, category: 'Sports', intensity: 'High' },
    { name: 'Football/Soccer', duration: 30, steps: 4000, distance: 3.5, calories: 334, category: 'Sports', intensity: 'High' },
    { name: 'Tennis (Singles)', duration: 30, steps: 2800, distance: 2.0, calories: 298, category: 'Sports', intensity: 'High' },
    { name: 'Badminton', duration: 30, steps: 2500, distance: 1.8, calories: 223, category: 'Sports', intensity: 'Moderate' },
    { name: 'Table Tennis', duration: 30, steps: 1800, distance: 1.0, calories: 149, category: 'Sports', intensity: 'Light' },
    { name: 'Volleyball', duration: 30, steps: 2200, distance: 1.5, calories: 186, category: 'Sports', intensity: 'Moderate' },
    { name: 'Cricket', duration: 30, steps: 1500, distance: 1.2, calories: 167, category: 'Sports', intensity: 'Light' },
    
    // Outdoor Activities
    { name: 'Hiking (Moderate)', duration: 30, steps: 2400, distance: 2.0, calories: 223, category: 'Outdoor', intensity: 'Moderate' },
    { name: 'Hiking (Steep)', duration: 30, steps: 2000, distance: 1.5, calories: 280, category: 'Outdoor', intensity: 'High' },
    { name: 'Rock Climbing', duration: 30, steps: 800, distance: 0.0, calories: 372, category: 'Outdoor', intensity: 'Very High' },
    { name: 'Trail Running', duration: 30, steps: 3800, distance: 4.0, calories: 335, category: 'Outdoor', intensity: 'High' },
    
    // Low Impact
    { name: 'Walking (4 km/h)', duration: 30, steps: 2000, distance: 2.0, calories: 100, category: 'Low Impact', intensity: 'Light' },
    { name: 'Walking (5 km/h)', duration: 30, steps: 2500, distance: 2.5, calories: 130, category: 'Low Impact', intensity: 'Light' },
    { name: 'Walking (6 km/h)', duration: 30, steps: 3000, distance: 3.0, calories: 167, category: 'Low Impact', intensity: 'Moderate' },
    { name: 'Yoga (Hatha)', duration: 30, steps: 400, distance: 0.0, calories: 112, category: 'Low Impact', intensity: 'Light' },
    { name: 'Yoga (Vinyasa)', duration: 30, steps: 600, distance: 0.0, calories: 186, category: 'Low Impact', intensity: 'Moderate' },
    { name: 'Pilates', duration: 30, steps: 500, distance: 0.0, calories: 130, category: 'Low Impact', intensity: 'Light' },
    { name: 'Stretching', duration: 30, steps: 300, distance: 0.0, calories: 93, category: 'Low Impact', intensity: 'Light' },
    { name: 'Tai Chi', duration: 30, steps: 800, distance: 0.0, calories: 149, category: 'Low Impact', intensity: 'Light' },
    
    // Machines
    { name: 'Elliptical (Moderate)', duration: 30, steps: 3000, distance: 3.0, calories: 298, category: 'Machines', intensity: 'Moderate' },
    { name: 'Elliptical (Vigorous)', duration: 30, steps: 3800, distance: 4.0, calories: 372, category: 'Machines', intensity: 'High' },
    { name: 'Rowing Machine (Moderate)', duration: 30, steps: 0, distance: 3.0, calories: 260, category: 'Machines', intensity: 'Moderate' },
    { name: 'Rowing Machine (Vigorous)', duration: 30, steps: 0, distance: 4.5, calories: 372, category: 'Machines', intensity: 'High' },
    { name: 'Stair Climber', duration: 30, steps: 2500, distance: 0.0, calories: 298, category: 'Machines', intensity: 'High' },
    
    // Other
    { name: 'Jump Rope', duration: 30, steps: 3600, distance: 0.0, calories: 300, category: 'Other', intensity: 'High' },
    { name: 'Boxing (Training)', duration: 30, steps: 2000, distance: 0.0, calories: 335, category: 'Other', intensity: 'High' },
    { name: 'Martial Arts', duration: 30, steps: 2200, distance: 0.0, calories: 372, category: 'Other', intensity: 'High' },
    { name: 'Calisthenics', duration: 30, steps: 1500, distance: 0.0, calories: 298, category: 'Other', intensity: 'High' }
  ];

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await fetchLogs('fitness');
    setLogs(data);
  };

  const handleWorkoutSelect = (workout) => {
    setFormData({
      activity: workout.name,
      duration: workout.duration.toString(),
      steps: workout.steps.toString(),
      distance: workout.distance.toString(),
      calories: workout.calories.toString(),
      notes: `${workout.category} - ${workout.intensity} intensity workout`
    });
    setShowWorkoutSelector(false);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const logData = {
      activity: formData.activity,
      duration: parseInt(formData.duration),
      steps: parseInt(formData.steps),
      distance: parseFloat(formData.distance),
      calories: parseInt(formData.calories),
      notes: formData.notes
    };

    if (editingLog) {
      await updateLog(editingLog._id, logData);
      setEditingLog(null);
    } else {
      await createLog('fitness', logData);
    }

    setFormData({ activity: '', duration: '', steps: '', distance: '', calories: '', notes: '' });
    setShowForm(false);
    loadLogs();
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setFormData({
      activity: log.data.activity,
      duration: log.data.duration.toString(),
      steps: log.data.steps.toString(),
      distance: log.data.distance.toString(),
      calories: log.data.calories.toString(),
      notes: log.data.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this workout?')) {
      await deleteLog(id);
      loadLogs();
    }
  };

  const filteredWorkouts = predefinedWorkouts.filter(workout =>
    workout.name.toLowerCase().includes(workoutSearchTerm.toLowerCase()) ||
    workout.category.toLowerCase().includes(workoutSearchTerm.toLowerCase()) ||
    workout.intensity.toLowerCase().includes(workoutSearchTerm.toLowerCase())
  );

  const totalSteps = logs.reduce((sum, log) => sum + (log.data.steps || 0), 0);
  const totalDistance = logs.reduce((sum, log) => sum + (log.data.distance || 0), 0);
  const totalCalories = logs.reduce((sum, log) => sum + (log.data.calories || 0), 0);

  // Group workouts by category
  const workoutsByCategory = predefinedWorkouts.reduce((acc, workout) => {
    if (!acc[workout.category]) acc[workout.category] = [];
    acc[workout.category].push(workout);
    return acc;
  }, {});

  const getIntensityColor = (intensity) => {
    const colors = {
      'Light': 'text-green-600 bg-green-100 dark:bg-green-900/30',
      'Moderate': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
      'High': 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
      'Very High': 'text-red-600 bg-red-100 dark:bg-red-900/30'
    };
    return colors[intensity] || colors['Moderate'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Dumbbell className="text-green-500" size={32} />
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Fitness Tracker</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your workouts</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowWorkoutSelector(true);
              setWorkoutSearchTerm('');
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
              setFormData({ activity: '', duration: '', steps: '', distance: '', calories: '', notes: '' });
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            Custom Workout
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Steps', value: totalSteps.toLocaleString(), unit: '', color: 'green', icon: '👟' },
          { label: 'Total Distance', value: totalDistance.toFixed(1), unit: 'km', color: 'blue', icon: '🏃' },
          { label: 'Calories Burned', value: totalCalories, unit: 'kcal', color: 'orange', icon: '🔥' }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{item.icon}</span>
              <span className={`text-${item.color}-500 text-sm font-medium`}>{item.label}</span>
            </div>
            <p className={`text-3xl font-bold text-${item.color}-600`}>
              {item.value} <span className="text-lg text-gray-500">{item.unit}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Workout Selector Modal */}
      <AnimatePresence>
        {showWorkoutSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWorkoutSelector(false)}
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
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-5 flex items-center justify-between flex-shrink-0 rounded-t-3xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Quick Workout Selection</h2>
                      <p className="text-xs opacity-90">Choose from 60+ pre-configured workouts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWorkoutSelector(false)}
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
                      value={workoutSearchTerm}
                      onChange={(e) => setWorkoutSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Search workouts, categories, or intensity..."
                      autoFocus
                    />
                  </div>
                </div>

                {/* Workouts List */}
                <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-b-3xl">
                  {workoutSearchTerm ? (
                    // Show filtered results
                    <div className="space-y-3">
                      {filteredWorkouts.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">No workouts found</p>
                      ) : (
                        filteredWorkouts.map((workout, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => handleWorkoutSelect(workout)}
                            className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 text-left"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg">{workout.name}</h3>
                              <div className="flex gap-2">
                                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 font-semibold">
                                  {workout.category}
                                </span>
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getIntensityColor(workout.intensity)}`}>
                                  {workout.intensity}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-5 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="font-bold text-purple-600">{workout.duration} min</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Steps</p>
                                <p className="font-bold text-green-600">{workout.steps.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Distance</p>
                                <p className="font-bold text-blue-600">{workout.distance} km</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Calories</p>
                                <p className="font-bold text-orange-600">{workout.calories}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Intensity</p>
                                <p className="font-bold text-red-600">{workout.intensity}</p>
                              </div>
                            </div>
                          </motion.button>
                        ))
                      )}
                    </div>
                  ) : (
                    // Show by category
                    <div className="space-y-6">
                      {Object.entries(workoutsByCategory).map(([category, workouts]) => (
                        <div key={category}>
                          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              {category}
                            </span>
                            <span className="text-sm text-gray-500">({workouts.length})</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {workouts.map((workout, idx) => (
                              <motion.button
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.02 }}
                                onClick={() => handleWorkoutSelect(workout)}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 text-left"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-bold">{workout.name}</h4>
                                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getIntensityColor(workout.intensity)}`}>
                                    {workout.intensity}
                                  </span>
                                </div>
                                <div className="flex gap-3 text-xs">
                                  <span className="text-purple-600 font-semibold">{workout.duration} min</span>
                                  <span className="text-green-600">{workout.steps} steps</span>
                                  <span className="text-orange-600">{workout.calories} cal</span>
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
          <h3 className="text-xl font-bold mb-6">{editingLog ? 'Edit Workout' : 'Add New Workout'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Activity Name"
                required
              />
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Duration (min)"
                required
              />
              <input
                type="number"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Steps"
                required
              />
              <input
                type="number"
                step="0.1"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Distance (km)"
                required
              />
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Calories Burned"
                required
              />
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="3"
              placeholder="Notes (optional)"
            />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all">
                {editingLog ? 'Update' : 'Add'} Workout
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
            <Dumbbell className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
            <p className="text-gray-500">No workouts logged yet. Start tracking!</p>
          </div>
        ) : (
          logs.map((log, idx) => (
            <motion.div
              key={log._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{log.data.activity}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Duration', value: log.data.duration, unit: 'min', color: 'purple' },
                      { label: 'Steps', value: log.data.steps.toLocaleString(), unit: '', color: 'green' },
                      { label: 'Distance', value: log.data.distance, unit: 'km', color: 'blue' },
                      { label: 'Calories', value: log.data.calories, unit: 'kcal', color: 'orange' }
                    ].map((item, i) => (
                      <div key={i}>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                        <p className={`font-bold text-${item.color}-600`}>{item.value}{item.unit}</p>
                      </div>
                    ))}
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
          ))
        )}
      </div>
    </div>
  );
};

export default FitnessTracker;
