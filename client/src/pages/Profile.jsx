import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Save, Target, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    goal: ''
  });
  const [message, setMessage] = useState('');

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        goal: user.goal || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await axios.put('/api/auth/profile', {
        name: formData.name,
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        goal: formData.goal
      });
      
      updateUser(data);
      setEditing(false);
      setMessage('Profile updated successfully! ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage(error.response?.data?.message || 'Failed to update profile ❌');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      label: 'Member Since', 
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A', 
      icon: Calendar, 
      color: 'blue' 
    },
    { 
      label: 'Goal', 
      value: formData.goal ? formData.goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not set', 
      icon: Target, 
      color: 'green' 
    },
    { 
      label: 'Current Weight', 
      value: formData.weight ? `${formData.weight} kg` : 'Not set', 
      icon: Award, 
      color: 'purple' 
    }
  ];

  // Get user initials or first letter
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length > 1) {
      return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="text-indigo-500" size={32} />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            My Profile
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings</p>
      </motion.div>

      {/* Success/Error Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            message.includes('✅') 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          } border px-4 py-3 rounded-xl`}
        >
          {message}
        </motion.div>
      )}

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar & Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            {/* Avatar - Shows Google profile pic if available */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover shadow-xl ring-4 ring-indigo-100 dark:ring-indigo-900"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback gradient avatar with initials */}
              <div 
                className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl"
                style={{ display: user?.avatar ? 'none' : 'flex' }}
              >
                {getUserInitials()}
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-1">{user?.name || 'User Name'}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{user?.email || 'user@email.com'}</p>

            {/* Stats */}
            <div className="space-y-3">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <stat.icon className={`text-${stat.color}-500`} size={20} />
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <span className="text-sm font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Profile Information</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User size={16} className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                {/* Email - Read only */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 opacity-60"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="25"
                    min="1"
                    max="120"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="70"
                    min="1"
                    max="300"
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-medium mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="175"
                    min="1"
                    max="300"
                  />
                </div>

                {/* Health Goal */}
                <div>
                  <label className="block text-sm font-medium mb-2">Health Goal</label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="">Select a goal</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="general-health">General Health</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              {editing && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </motion.button>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
