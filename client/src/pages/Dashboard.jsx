import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Moon, Heart, TrendingUp, Calendar, Award, Zap, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useHealth } from '../context/HealthContext';

const Dashboard = () => {
  const { getAnalytics } = useHealth();
  const [stats, setStats] = useState({
    diet: { streak: 0, totalLogs: 0, logs: [] },
    fitness: { streak: 0, totalLogs: 0, logs: [] },
    sleep: { streak: 0, totalLogs: 0, logs: [] },
    mood: { streak: 0, totalLogs: 0, logs: [] }
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const dietData = await getAnalytics('diet', 7);
      await delay(200);
      
      const fitnessData = await getAnalytics('fitness', 7);
      await delay(200);
      
      const sleepData = await getAnalytics('sleep', 7);
      await delay(200);
      
      const moodData = await getAnalytics('mood', 7);

      setStats({
        diet: dietData || { streak: 0, totalLogs: 0, logs: [] },
        fitness: fitnessData || { streak: 0, totalLogs: 0, logs: [] },
        sleep: sleepData || { streak: 0, totalLogs: 0, logs: [] },
        mood: moodData || { streak: 0, totalLogs: 0, logs: [] }
      });

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const chartDataMap = last7Days.map(date => {
        const dietLog = dietData?.logs?.find(log => log.date.split('T')[0] === date);
        const fitnessLog = fitnessData?.logs?.find(log => log.date.split('T')[0] === date);
        const sleepLog = sleepData?.logs?.find(log => log.date.split('T')[0] === date);

        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          calories: dietLog?.data?.calories || 0,
          steps: fitnessLog?.data?.steps || 0,
          sleep: sleepLog?.data?.hours || 0
        };
      });

      setChartData(chartDataMap);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const statCards = [
    {
      title: 'Diet Streak',
      value: stats.diet.streak,
      icon: Flame,
      color: '#f97316',
      total: stats.diet.totalLogs,
      emoji: '🍎'
    },
    {
      title: 'Fitness Streak',
      value: stats.fitness.streak,
      icon: Activity,
      color: '#22c55e',
      total: stats.fitness.totalLogs,
      emoji: '💪'
    },
    {
      title: 'Sleep Streak',
      value: stats.sleep.streak,
      icon: Moon,
      color: '#3b82f6',
      total: stats.sleep.totalLogs,
      emoji: '😴'
    },
    {
      title: 'Mood Streak',
      value: stats.mood.streak,
      icon: Heart,
      color: '#ec4899',
      total: stats.mood.totalLogs,
      emoji: '😊'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" size={24} />
        </div>
      </div>
    );
  }

  const maxStreak = Math.max(...Object.values(stats).map(s => s.streak));
  const totalLogs = Object.values(stats).reduce((acc, curr) => acc + curr.totalLogs, 0);

  return (
    <div className="space-y-6 pb-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 rounded-3xl shadow-2xl p-8"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-white" size={20} />
                <span className="text-white/80 text-sm font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-4xl font-black text-white mb-2">
                Your Health Dashboard
              </h1>
              <p className="text-white/90 text-lg">
                Track your wellness journey and celebrate your progress! 🎉
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
              <TrendingUp className="text-white" size={32} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Flame className="text-orange-500" size={24} />
                </div>
                <div>
                  <p className="text-white/80 text-xs font-medium">Best Streak</p>
                  <p className="text-white text-2xl font-bold">{maxStreak} days</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Target className="text-green-500" size={24} />
                </div>
                <div>
                  <p className="text-white/80 text-xs font-medium">Total Activities</p>
                  <p className="text-white text-2xl font-bold">{totalLogs}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Award className="text-yellow-500" size={24} />
                </div>
                <div>
                  <p className="text-white/80 text-xs font-medium">Consistency</p>
                  <p className="text-white text-2xl font-bold">
                    {totalLogs > 0 ? Math.round((totalLogs / 28) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-border group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted shadow-lg group-hover:scale-110 transition-transform duration-300">
                <stat.icon style={{ color: stat.color }} size={28} strokeWidth={2.5} />
              </div>
              <span className="text-3xl">{stat.emoji}</span>
            </div>
            
            <h3 className="text-sm font-bold text-muted-foreground mb-2">{stat.title}</h3>
            
            <div className="flex items-baseline gap-2 mb-3">
              <p className="text-5xl font-black text-foreground">{stat.value}</p>
              <span className="text-muted-foreground text-base font-semibold">days</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 size={14} />
              <p className="text-xs font-medium">{stat.total} total logs</p>
            </div>

            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-15">
              <stat.icon size={110} style={{ color: stat.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Weekly Activity</h3>
                <p className="text-xs text-muted-foreground">Last 7 days performance</p>
              </div>
            </div>
            <Zap className="text-yellow-500" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: `1px solid hsl(var(--border))`,
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="steps" fill="#22c55e" radius={[8, 8, 0, 0]} name="Steps" />
              <Bar dataKey="calories" fill="#f97316" radius={[8, 8, 0, 0]} name="Calories" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sleep Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <Moon className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Sleep Trend</h3>
                <p className="text-xs text-muted-foreground">Sleep hours tracking</p>
              </div>
            </div>
            <span className="text-2xl">😴</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: `1px solid hsl(var(--border))`,
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Sleep Hours"
                dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20 rounded-2xl shadow-lg p-6 border border-border"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI-Powered Insights</h3>
            <p className="text-sm text-muted-foreground">Personalized health recommendations</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎉</span>
              <h4 className="font-bold">Amazing Progress!</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              You're maintaining a <span className="font-bold text-primary text-lg">{maxStreak}-day streak</span> on your best category!
            </p>
          </div>
          
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔥</span>
              <h4 className="font-bold">Keep It Up!</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              You've logged <span className="font-bold text-success text-lg">{totalLogs} activities</span> this week. Outstanding!
            </p>
          </div>
          
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💡</span>
              <h4 className="font-bold">Pro Tip</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Consistency is key! Log at least one activity daily for optimal results.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
