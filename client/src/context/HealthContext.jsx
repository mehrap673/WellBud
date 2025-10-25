import { createContext, useState, useContext } from 'react';
import axios from '../config/axios';

const HealthContext = createContext();

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) throw new Error('useHealth must be used within HealthProvider');
  return context;
};

export const HealthProvider = ({ children }) => {
  const [healthLogs, setHealthLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (type, startDate, endDate) => {
    setLoading(true);
    try {
      const params = {};
      if (type) params.type = type;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('📥 Fetching logs with params:', params);
      // Changed from /api/health/logs to /api/health
      const { data } = await axios.get('/api/health', { params });
      console.log('✅ Logs fetched:', data);
      
      setHealthLogs(data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching logs:', error.response?.data || error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createLog = async (type, logData, date) => {
    try {
      console.log('📝 Creating log:', { type, logData, date });
      
      const payload = {
        type,
        data: logData,
        date: date || new Date()
      };
      
      // Changed from /api/health/log to /api/health
      const { data } = await axios.post('/api/health', payload);
      console.log('✅ Log created:', data);
      
      setHealthLogs(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('❌ Error creating log:', error.response?.data || error.message);
      throw error;
    }
  };

  const updateLog = async (id, logData) => {
    try {
      console.log('✏️ Updating log:', id, logData);
      
      // Changed from /api/health/log/:id to /api/health/:id
      const { data } = await axios.put(`/api/health/${id}`, { data: logData });
      console.log('✅ Log updated:', data);
      
      setHealthLogs(prev => prev.map(log => log._id === id ? data : log));
      return data;
    } catch (error) {
      console.error('❌ Error updating log:', error.response?.data || error.message);
      throw error;
    }
  };

  const deleteLog = async (id) => {
    try {
      console.log('🗑️ Deleting log:', id);
      
      // Changed from /api/health/log/:id to /api/health/:id
      await axios.delete(`/api/health/${id}`);
      console.log('✅ Log deleted');
      
      setHealthLogs(prev => prev.filter(log => log._id !== id));
    } catch (error) {
      console.error('❌ Error deleting log:', error.response?.data || error.message);
      throw error;
    }
  };

  const getAnalytics = async (type, days = 7) => {
    try {
      console.log('📊 Fetching analytics:', { type, days });
      
      // This stays the same - /api/health/analytics
      const { data } = await axios.get('/api/health/analytics', {
        params: { type, days }
      });
      
      console.log('✅ Analytics fetched:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching analytics:', error.response?.data || error.message);
      
      // Return empty data structure instead of failing
      return { 
        streak: 0, 
        totalLogs: 0, 
        logs: [] 
      };
    }
  };

  return (
    <HealthContext.Provider value={{
      healthLogs,
      loading,
      fetchLogs,
      createLog,
      updateLog,
      deleteLog,
      getAnalytics
    }}>
      {children}
    </HealthContext.Provider>
  );
};
