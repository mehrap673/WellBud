import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, TrendingUp, Target, Award, AlertCircle, 
  CheckCircle, Loader, RefreshCw, Heart, Activity, Moon, 
  Smile, Lightbulb, Calendar, Flame, BookOpen, Trophy,
  ArrowRight, Star, Zap
} from 'lucide-react';
import axios from '../config/axios';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get('/api/health/ai-insights');
      setInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setError(error.response?.data?.message || 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" size={32} />
        </div>
        <p className="text-lg font-semibold text-foreground">Analyzing your health journey...</p>
        <p className="text-sm text-muted-foreground mt-2">Dr. Wellness is reviewing your data 🤖✨</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <AlertCircle className="text-destructive mb-4" size={64} />
        <h2 className="text-2xl font-bold mb-2">Unable to Load Insights</h2>
        <p className="text-muted-foreground mb-6 text-center">{error}</p>
        <button
          onClick={fetchInsights}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={20} />
          Try Again
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('thriving') || statusLower.includes('excellent')) {
      return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30';
    }
    if (statusLower.includes('strong') || statusLower.includes('good')) {
      return 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30';
    }
    if (statusLower.includes('developing') || statusLower.includes('fair')) {
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    }
    if (statusLower.includes('needs')) {
      return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
    }
    return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': 
        return 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 border-red-200 dark:border-red-800';
      case 'medium': 
        return 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50 border-yellow-200 dark:border-yellow-800';
      case 'low': 
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800';
      default: 
        return 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/50 dark:to-slate-950/50 border-gray-200 dark:border-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      diet: Heart,
      fitness: Activity,
      sleep: Moon,
      mood: Smile,
      'mental wellbeing': Smile,
      lifestyle: Lightbulb,
      wellness: Sparkles
    };
    return icons[category?.toLowerCase()] || Target;
  };

  const categoryConfig = {
    diet: { emoji: '🍎', gradient: 'from-green-500 to-emerald-500', icon: Heart },
    fitness: { emoji: '💪', gradient: 'from-orange-500 to-red-500', icon: Activity },
    sleep: { emoji: '😴', gradient: 'from-indigo-500 to-purple-500', icon: Moon },
    mood: { emoji: '😊', gradient: 'from-pink-500 to-rose-500', icon: Smile }
  };

  return (
    <div className="space-y-6 pb-6 max-w-7xl mx-auto px-4">
      {/* Hero Header with Personal Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900 rounded-3xl shadow-2xl p-8"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Brain className="text-white" size={28} />
              </div>
              <div>
                <span className="text-white/80 text-sm font-medium">AI-Powered Analysis by Dr. Wellness</span>
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  Your Health Story
                </h1>
              </div>
            </div>
            <button
              onClick={fetchInsights}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all"
              title="Refresh insights"
            >
              <RefreshCw className="text-white" size={20} />
            </button>
          </div>

          {insights?.personalGreeting && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <p className="text-white text-lg leading-relaxed">
                {insights.personalGreeting}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Overview Section - Enhanced Narrative */}
      {insights?.overview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={26} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{insights.overview.headline}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(insights.overview.consistency)}`}>
                  {insights.overview.consistency}
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Story */}
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-6 mb-6 border border-border/50">
            <p className="text-base leading-relaxed whitespace-pre-line">
              {insights.overview.narrative}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Wins */}
            {insights.overview.keyWins?.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-5 border border-green-200 dark:border-green-800/50">
                <h4 className="font-bold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Trophy size={20} />
                  Your Wins 🎉
                </h4>
                <ul className="space-y-3">
                  {insights.overview.keyWins.map((win, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" size={18} />
                      <span className="text-green-900 dark:text-green-100">{win}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Growth Areas */}
            {insights.overview.growthAreas?.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-5 border border-amber-200 dark:border-amber-800/50">
                <h4 className="font-bold mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Target size={20} />
                  Growth Opportunities 🌱
                </h4>
                <ul className="space-y-3">
                  {insights.overview.growthAreas.map((area, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Zap className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" size={18} />
                      <span className="text-amber-900 dark:text-amber-100">{area}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Interesting Patterns */}
          {insights.overview.interestingPatterns?.length > 0 && (
            <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-5 border border-purple-200 dark:border-purple-800/50">
              <h4 className="font-bold mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-400">
                <Lightbulb size={20} />
                Fascinating Patterns 🔍
              </h4>
              <ul className="space-y-3">
                {insights.overview.interestingPatterns.map((pattern, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Star className="text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-purple-900 dark:text-purple-100">{pattern}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Category Insights - Enhanced with Story Titles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {['diet', 'fitness', 'sleep', 'mood'].map((category, index) => {
          const categoryData = insights?.[category];
          if (!categoryData) return null;

          const config = categoryConfig[category];
          const Icon = config.icon;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card p-6 hover:shadow-xl transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold capitalize">{category}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusColor(categoryData.status)}`}>
                      {categoryData.status}
                    </span>
                  </div>
                </div>
                <span className="text-4xl">{config.emoji}</span>
              </div>

              {/* Story Title */}
              {categoryData.storyTitle && (
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-primary">
                    {categoryData.storyTitle}
                  </h4>
                </div>
              )}

              {/* Deep Insight */}
              <div className="bg-muted/50 rounded-xl p-4 mb-4 border border-border/50">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {categoryData.deepInsight || categoryData.insights}
                </p>
              </div>

              {/* What's Working Well */}
              {categoryData.whatIsWorkingWell?.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <CheckCircle size={14} />
                    What's Working Well
                  </h5>
                  <ul className="space-y-2">
                    {categoryData.whatIsWorkingWell.map((item, idx) => (
                      <li key={idx} className="text-sm text-foreground/80 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-green-500">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Opportunities for Growth */}
              {categoryData.opportunitiesForGrowth?.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <Target size={14} />
                    Opportunities for Growth
                  </h5>
                  <ul className="space-y-2">
                    {categoryData.opportunitiesForGrowth.map((item, idx) => (
                      <li key={idx} className="text-sm text-foreground/80 pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-amber-500">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legacy fields support */}
              {categoryData.strengths?.length > 0 && !categoryData.whatIsWorkingWell && (
                <div className="mb-4">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle size={14} />
                    Strengths
                  </h5>
                  <ul className="space-y-1">
                    {categoryData.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground pl-5">• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {categoryData.improvements?.length > 0 && !categoryData.opportunitiesForGrowth && (
                <div className="mb-4">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                    <Target size={14} />
                    Improvements
                  </h5>
                  <ul className="space-y-1">
                    {categoryData.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground pl-5">• {improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Other fields */}
              {categoryData.emotionalPatterns?.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-bold mb-2">Emotional Patterns</h5>
                  <ul className="space-y-1">
                    {categoryData.emotionalPatterns.map((pattern, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground pl-5">• {pattern}</li>
                    ))}
                  </ul>
                </div>
              )}

              {categoryData.strengthsAndResilience?.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-bold mb-2">Strengths & Resilience</h5>
                  <ul className="space-y-1">
                    {categoryData.strengthsAndResilience.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground pl-5">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {categoryData.supportiveSuggestions?.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-bold mb-2">Supportive Suggestions</h5>
                  <ul className="space-y-1">
                    {categoryData.supportiveSuggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground pl-5">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Connection to other metrics */}
              {categoryData.connectionToOtherMetrics && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground italic">
                    💡 {categoryData.connectionToOtherMetrics}
                  </p>
                </div>
              )}

              {categoryData.connectionToPhysicalHealth && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground italic">
                    💡 {categoryData.connectionToPhysicalHealth}
                  </p>
                </div>
              )}

              {/* Did You Know */}
              {categoryData.didYouKnow && (
                <div className="mt-4 bg-primary/5 rounded-lg p-3 border border-primary/10">
                  <p className="text-xs font-medium text-primary flex items-start gap-2">
                    <Lightbulb size={14} className="mt-0.5 flex-shrink-0" />
                    <span><strong>Did you know?</strong> {categoryData.didYouKnow}</span>
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* The Big Picture */}
      {insights?.theBigPicture && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6 md:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="text-white" size={26} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">The Big Picture</h2>
              <p className="text-sm text-muted-foreground">How everything connects</p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-6 mb-6">
            <p className="text-base leading-relaxed whitespace-pre-line">
              {insights.theBigPicture.holisticSummary}
            </p>
          </div>

          {insights.theBigPicture.keyCorrelations?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp size={20} />
                Key Correlations
              </h4>
              <ul className="space-y-2">
                {insights.theBigPicture.keyCorrelations.map((correlation, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="text-indigo-500 mt-0.5 flex-shrink-0" size={18} />
                    <span>{correlation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights.theBigPicture.momentumCheck && (
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
              <p className="text-sm font-medium">
                <Flame className="inline mr-2 text-orange-500" size={16} />
                {insights.theBigPicture.momentumCheck}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Action Plan */}
      {insights?.yourActionPlan?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="text-white" size={26} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Your Action Plan</h2>
              <p className="text-sm text-muted-foreground">Personalized steps for this week</p>
            </div>
          </div>

          <div className="space-y-4">
            {insights.yourActionPlan.map((action, index) => {
              const CategoryIcon = getCategoryIcon(action.category);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`border-2 rounded-2xl p-6 ${getPriorityColor(action.priority)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/80 dark:bg-black/20 rounded-xl flex items-center justify-center">
                        <CategoryIcon size={20} className="text-foreground" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          {action.category}
                        </span>
                        <h4 className="font-bold text-lg">{action.title}</h4>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-foreground/10 font-bold uppercase">
                        {action.priority}
                      </span>
                      {action.difficulty && (
                        <span className="text-xs text-muted-foreground">
                          {action.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  {action.why && (
                    <div className="mb-4 bg-white/50 dark:bg-black/20 rounded-lg p-3">
                      <p className="text-sm font-semibold mb-1">Why this matters:</p>
                      <p className="text-sm opacity-90">{action.why}</p>
                    </div>
                  )}

                  {action.what && (
                    <div className="mb-4">
                      <p className="text-sm leading-relaxed">{action.what}</p>
                    </div>
                  )}

                  {action.description && !action.what && (
                    <p className="text-sm mb-4 leading-relaxed">{action.description}</p>
                  )}

                  {action.how && (
                    <div className="mb-4">
                      <h5 className="text-sm font-bold mb-2 flex items-center gap-2">
                        <CheckCircle size={16} />
                        How to do it:
                      </h5>
                      <p className="text-sm whitespace-pre-line opacity-90 pl-6">
                        {action.how}
                      </p>
                    </div>
                  )}

                  {action.actionSteps?.length > 0 && !action.how && (
                    <div className="mb-4">
                      <h5 className="text-sm font-bold mb-2 flex items-center gap-2">
                        <CheckCircle size={16} />
                        Action Steps:
                      </h5>
                      <ol className="space-y-2 pl-6">
                        {action.actionSteps.map((step, idx) => (
                          <li key={idx} className="text-sm opacity-90 list-decimal">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {action.expectedOutcome && (
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        <Trophy className="inline mr-2" size={14} />
                        Expected outcome: {action.expectedOutcome}
                      </p>
                    </div>
                  )}

                  {action.timeCommitment && (
                    <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar size={14} />
                      Time commitment: {action.timeCommitment}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Weekly Focus */}
      {insights?.weeklyFocus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card p-6 md:p-8 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-teal-200 dark:border-teal-800/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Flame className="text-white" size={26} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">This Week's Focus</h2>
              <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                {insights.weeklyFocus.theme}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 border border-teal-200 dark:border-teal-800">
              <h4 className="text-sm font-bold mb-2 text-teal-700 dark:text-teal-400">
                Daily Micro-Habit
              </h4>
              <p className="text-sm">{insights.weeklyFocus.dailyMicroHabit}</p>
            </div>

            <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 border border-teal-200 dark:border-teal-800">
              <h4 className="text-sm font-bold mb-2 text-teal-700 dark:text-teal-400">
                Weekly Challenge
              </h4>
              <p className="text-sm">{insights.weeklyFocus.weeklyChallenge}</p>
            </div>

            <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 border border-teal-200 dark:border-teal-800">
              <h4 className="text-sm font-bold mb-2 text-teal-700 dark:text-teal-400">
                Tracking Tip
              </h4>
              <p className="text-sm">{insights.weeklyFocus.trackingTip}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Motivational Close */}
      {insights?.motivationalClose && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card p-6 md:p-8 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-rose-500" size={32} />
            <h3 className="text-xl font-bold">Keep Going! 💪</h3>
          </div>
          <p className="text-base leading-relaxed whitespace-pre-line">
            {insights.motivationalClose}
          </p>
        </motion.div>
      )}

      {/* Fun Fact */}
      {insights?.funFact && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="card p-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200 dark:border-yellow-800/50"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-400 dark:bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h4 className="font-bold mb-1 text-yellow-900 dark:text-yellow-100">
                Fun Health Fact
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {insights.funFact}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Insights;
