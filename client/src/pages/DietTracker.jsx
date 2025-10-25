import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Search, Utensils, Sparkles, X } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

const DietTracker = () => {
  const { fetchLogs, createLog, deleteLog, updateLog } = useHealth();
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMealSelector, setShowMealSelector] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mealSearchTerm, setMealSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    meal: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    water: '',
    notes: ''
  });

  // Predefined meals database with nutritional information
  const predefinedMeals = [
    // Indian Dishes
    { name: 'Chicken Biryani', calories: 253, protein: 12, carbs: 38, fats: 6, water: 200, category: 'Indian' },
    { name: 'Butter Chicken', calories: 168, protein: 15, carbs: 8, fats: 9, water: 150, category: 'Indian' },
    { name: 'Paneer Tikka', calories: 320, protein: 18, carbs: 12, fats: 22, water: 100, category: 'Indian' },
    { name: 'Dal Makhani', calories: 200, protein: 15, carbs: 25, fats: 5, water: 200, category: 'Indian' },
    { name: 'Chole Masala', calories: 180, protein: 21, carbs: 63, fats: 6, water: 150, category: 'Indian' },
    { name: 'Aloo Paratha', calories: 230, protein: 6, carbs: 32, fats: 9, water: 100, category: 'Indian' },
    { name: 'Masala Dosa', calories: 210, protein: 5, carbs: 38, fats: 4, water: 150, category: 'Indian' },
    { name: 'Idli Sambar', calories: 150, protein: 6, carbs: 28, fats: 2, water: 200, category: 'Indian' },
    { name: 'Rajma Curry', calories: 143, protein: 9, carbs: 22, fats: 3, water: 200, category: 'Indian' },
    { name: 'Chicken Tikka Masala', calories: 190, protein: 18, carbs: 10, fats: 8, water: 150, category: 'Indian' },
    
    // Breakfast Items
    { name: 'Oatmeal with Berries', calories: 180, protein: 7, carbs: 32, fats: 3, water: 200, category: 'Breakfast' },
    { name: 'Scrambled Eggs (2)', calories: 200, protein: 14, carbs: 2, fats: 15, water: 100, category: 'Breakfast' },
    { name: 'Greek Yogurt & Granola', calories: 280, protein: 15, carbs: 38, fats: 8, water: 150, category: 'Breakfast' },
    { name: 'Avocado Toast', calories: 250, protein: 8, carbs: 28, fats: 12, water: 100, category: 'Breakfast' },
    { name: 'Pancakes (3)', calories: 350, protein: 9, carbs: 58, fats: 9, water: 150, category: 'Breakfast' },
    { name: 'French Toast (2 slices)', calories: 280, protein: 10, carbs: 35, fats: 11, water: 100, category: 'Breakfast' },
    { name: 'Protein Smoothie', calories: 220, protein: 25, carbs: 28, fats: 4, water: 300, category: 'Breakfast' },
    { name: 'Poha', calories: 180, protein: 7, carbs: 34, fats: 2, water: 150, category: 'Breakfast' },
    
    // Lunch/Dinner
    { name: 'Grilled Chicken Breast', calories: 180, protein: 35, carbs: 0, fats: 4, water: 100, category: 'Lunch' },
    { name: 'Salmon with Vegetables', calories: 320, protein: 28, carbs: 12, fats: 18, water: 150, category: 'Lunch' },
    { name: 'Chicken Caesar Salad', calories: 350, protein: 25, carbs: 15, fats: 22, water: 200, category: 'Lunch' },
    { name: 'Pasta Carbonara', calories: 420, protein: 18, carbs: 48, fats: 18, water: 150, category: 'Lunch' },
    { name: 'Beef Stir Fry', calories: 380, protein: 28, carbs: 25, fats: 18, water: 150, category: 'Lunch' },
    { name: 'Vegetable Fried Rice', calories: 280, protein: 8, carbs: 48, fats: 6, water: 150, category: 'Lunch' },
    { name: 'Chicken Fried Rice', calories: 350, protein: 18, carbs: 45, fats: 10, water: 150, category: 'Lunch' },
    { name: 'Fish Tacos (2)', calories: 380, protein: 22, carbs: 42, fats: 14, water: 150, category: 'Lunch' },
    { name: 'Burrito Bowl', calories: 450, protein: 24, carbs: 52, fats: 16, water: 200, category: 'Lunch' },
    { name: 'Quinoa Buddha Bowl', calories: 380, protein: 15, carbs: 48, fats: 14, water: 200, category: 'Lunch' },
    
    // Fast Food
    { name: 'Cheeseburger', calories: 540, protein: 28, carbs: 44, fats: 28, water: 100, category: 'Fast Food' },
    { name: 'Chicken Sandwich', calories: 480, protein: 32, carbs: 42, fats: 20, water: 100, category: 'Fast Food' },
    { name: 'Margherita Pizza (2 slices)', calories: 500, protein: 20, carbs: 62, fats: 18, water: 150, category: 'Fast Food' },
    { name: 'French Fries (Medium)', calories: 380, protein: 4, carbs: 48, fats: 18, water: 100, category: 'Fast Food' },
    { name: 'Chicken Nuggets (10)', calories: 470, protein: 24, carbs: 32, fats: 28, water: 100, category: 'Fast Food' },
    
    // Asian Cuisine
    { name: 'Pad Thai', calories: 400, protein: 18, carbs: 52, fats: 14, water: 150, category: 'Asian' },
    { name: 'Chicken Chow Mein', calories: 380, protein: 20, carbs: 45, fats: 12, water: 150, category: 'Asian' },
    { name: 'Sushi Roll (8 pieces)', calories: 320, protein: 14, carbs: 48, fats: 8, water: 150, category: 'Asian' },
    { name: 'General Tso Chicken', calories: 480, protein: 22, carbs: 52, fats: 18, water: 150, category: 'Asian' },
    { name: 'Ramen Bowl', calories: 420, protein: 18, carbs: 58, fats: 12, water: 300, category: 'Asian' },
    { name: 'Spring Rolls (4)', calories: 280, protein: 8, carbs: 38, fats: 10, water: 100, category: 'Asian' },
    
    // Mexican Cuisine
    { name: 'Chicken Fajitas', calories: 380, protein: 28, carbs: 32, fats: 14, water: 150, category: 'Mexican' },
    { name: 'Bean Burrito', calories: 420, protein: 16, carbs: 58, fats: 12, water: 150, category: 'Mexican' },
    { name: 'Quesadilla', calories: 480, protein: 22, carbs: 42, fats: 24, water: 100, category: 'Mexican' },
    { name: 'Nachos with Cheese', calories: 520, protein: 18, carbs: 48, fats: 28, water: 100, category: 'Mexican' },
    
    // Healthy Options
    { name: 'Grilled Tofu Bowl', calories: 280, protein: 18, carbs: 32, fats: 10, water: 200, category: 'Healthy' },
    { name: 'Chickpea Salad', calories: 240, protein: 12, carbs: 35, fats: 6, water: 200, category: 'Healthy' },
    { name: 'Lentil Soup', calories: 180, protein: 12, carbs: 28, fats: 2, water: 300, category: 'Healthy' },
    { name: 'Grilled Vegetable Platter', calories: 220, protein: 8, carbs: 32, fats: 8, water: 200, category: 'Healthy' },
    { name: 'Tuna Salad', calories: 280, protein: 28, carbs: 12, fats: 14, water: 200, category: 'Healthy' },
    
    // Snacks
    { name: 'Protein Bar', calories: 200, protein: 20, carbs: 24, fats: 6, water: 50, category: 'Snacks' },
    { name: 'Banana & Peanut Butter', calories: 220, protein: 8, carbs: 32, fats: 8, water: 100, category: 'Snacks' },
    { name: 'Hummus & Veggies', calories: 180, protein: 6, carbs: 22, fats: 8, water: 150, category: 'Snacks' },
    { name: 'Mixed Nuts (1/4 cup)', calories: 200, protein: 6, carbs: 8, fats: 18, water: 50, category: 'Snacks' },
    { name: 'Apple with Cheese', calories: 180, protein: 8, carbs: 22, fats: 7, water: 100, category: 'Snacks' },
    
    // Desserts
    { name: 'Chocolate Cake (slice)', calories: 380, protein: 5, carbs: 52, fats: 18, water: 50, category: 'Dessert' },
    { name: 'Ice Cream (1 cup)', calories: 320, protein: 6, carbs: 42, fats: 16, water: 100, category: 'Dessert' },
    { name: 'Gulab Jamun (2)', calories: 280, protein: 4, carbs: 48, fats: 8, water: 50, category: 'Dessert' },
    { name: 'Fruit Salad', calories: 120, protein: 2, carbs: 28, fats: 1, water: 200, category: 'Dessert' }
  ];

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await fetchLogs('diet');
    setLogs(data);
  };

  const handleMealSelect = (meal) => {
    setFormData({
      meal: meal.name,
      calories: meal.calories.toString(),
      protein: meal.protein.toString(),
      carbs: meal.carbs.toString(),
      fats: meal.fats.toString(),
      water: meal.water.toString(),
      notes: `${meal.category} meal`
    });
    setShowMealSelector(false);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const logData = {
      meal: formData.meal,
      calories: parseInt(formData.calories),
      protein: parseInt(formData.protein),
      carbs: parseInt(formData.carbs),
      fats: parseInt(formData.fats),
      water: parseInt(formData.water),
      notes: formData.notes
    };

    if (editingLog) {
      await updateLog(editingLog._id, logData);
      setEditingLog(null);
    } else {
      await createLog('diet', logData);
    }

    setFormData({ meal: '', calories: '', protein: '', carbs: '', fats: '', water: '', notes: '' });
    setShowForm(false);
    loadLogs();
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setFormData({
      meal: log.data.meal,
      calories: log.data.calories.toString(),
      protein: log.data.protein.toString(),
      carbs: log.data.carbs.toString(),
      fats: log.data.fats.toString(),
      water: log.data.water.toString(),
      notes: log.data.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this meal?')) {
      await deleteLog(id);
      loadLogs();
    }
  };

  const filteredLogs = logs.filter(log =>
    log.data.meal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMeals = predefinedMeals.filter(meal =>
    meal.name.toLowerCase().includes(mealSearchTerm.toLowerCase()) ||
    meal.category.toLowerCase().includes(mealSearchTerm.toLowerCase())
  );

  const totalCalories = logs.reduce((sum, log) => sum + (log.data.calories || 0), 0);
  const totalProtein = logs.reduce((sum, log) => sum + (log.data.protein || 0), 0);
  const totalWater = logs.reduce((sum, log) => sum + (log.data.water || 0), 0);

  // Group meals by category
  const mealsByCategory = predefinedMeals.reduce((acc, meal) => {
    if (!acc[meal.category]) acc[meal.category] = [];
    acc[meal.category].push(meal);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Utensils className="text-orange-500" size={32} />
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">Diet Tracker</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your nutrition</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowMealSelector(true);
              setMealSearchTerm('');
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
              setFormData({ meal: '', calories: '', protein: '', carbs: '', fats: '', water: '', notes: '' });
            }}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            Custom Meal
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Calories', value: totalCalories, unit: 'kcal', color: 'orange', icon: '🔥' },
          { label: 'Total Protein', value: totalProtein, unit: 'g', color: 'green', icon: '💪' },
          { label: 'Water Intake', value: totalWater, unit: 'ml', color: 'blue', icon: '💧' }
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

      {/* Meal Selector Modal */}
      <AnimatePresence>
        {showMealSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMealSelector(false)}
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
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-5 flex items-center justify-between flex-shrink-0 rounded-t-3xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Quick Meal Selection</h2>
                      <p className="text-xs opacity-90">Choose from 50+ pre-configured meals</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMealSelector(false)}
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
                      value={mealSearchTerm}
                      onChange={(e) => setMealSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Search meals or categories..."
                      autoFocus
                    />
                  </div>
                </div>

                {/* Meals List */}
                <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-b-3xl">
                  {mealSearchTerm ? (
                    // Show filtered results
                    <div className="space-y-3">
                      {filteredMeals.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">No meals found</p>
                      ) : (
                        filteredMeals.map((meal, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => handleMealSelect(meal)}
                            className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 text-left"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg">{meal.name}</h3>
                              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 font-semibold">
                                {meal.category}
                              </span>
                            </div>
                            <div className="grid grid-cols-5 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Calories</p>
                                <p className="font-bold text-orange-600">{meal.calories}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Protein</p>
                                <p className="font-bold text-green-600">{meal.protein}g</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Carbs</p>
                                <p className="font-bold text-yellow-600">{meal.carbs}g</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Fats</p>
                                <p className="font-bold text-red-600">{meal.fats}g</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Water</p>
                                <p className="font-bold text-blue-600">{meal.water}ml</p>
                              </div>
                            </div>
                          </motion.button>
                        ))
                      )}
                    </div>
                  ) : (
                    // Show by category
                    <div className="space-y-6">
                      {Object.entries(mealsByCategory).map(([category, meals]) => (
                        <div key={category}>
                          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {category}
                            </span>
                            <span className="text-sm text-gray-500">({meals.length})</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {meals.map((meal, idx) => (
                              <motion.button
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.02 }}
                                onClick={() => handleMealSelect(meal)}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 text-left"
                              >
                                <h4 className="font-bold mb-2">{meal.name}</h4>
                                <div className="flex gap-3 text-xs">
                                  <span className="text-orange-600 font-semibold">{meal.calories} kcal</span>
                                  <span className="text-green-600">P: {meal.protein}g</span>
                                  <span className="text-yellow-600">C: {meal.carbs}g</span>
                                  <span className="text-red-600">F: {meal.fats}g</span>
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
          <h3 className="text-xl font-bold mb-6">{editingLog ? 'Edit Meal' : 'Add New Meal'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.meal}
                onChange={(e) => setFormData({ ...formData, meal: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="Meal Name"
                required
              />
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Calories"
                required
              />
              <input
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Protein (g)"
                required
              />
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Carbs (g)"
                required
              />
              <input
                type="number"
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Fats (g)"
                required
              />
              <input
                type="number"
                value={formData.water}
                onChange={(e) => setFormData({ ...formData, water: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Water (ml)"
                required
              />
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="3"
              placeholder="Notes (optional)"
            />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all">
                {editingLog ? 'Update' : 'Add'} Meal
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Search logged meals..."
        />
      </div>

      {/* Logs */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <Utensils className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
            <p className="text-gray-500">No meals logged yet. Start tracking!</p>
          </div>
        ) : (
          filteredLogs.map((log, idx) => (
            <motion.div
              key={log._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{log.data.meal}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[
                      { label: 'Calories', value: log.data.calories, unit: 'kcal', color: 'orange' },
                      { label: 'Protein', value: log.data.protein, unit: 'g', color: 'green' },
                      { label: 'Carbs', value: log.data.carbs, unit: 'g', color: 'yellow' },
                      { label: 'Fats', value: log.data.fats, unit: 'g', color: 'red' },
                      { label: 'Water', value: log.data.water, unit: 'ml', color: 'blue' }
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

export default DietTracker;
