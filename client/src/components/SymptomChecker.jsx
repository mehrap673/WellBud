import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, Plus, AlertTriangle, CheckCircle, Info, Sparkles } from 'lucide-react';
import axios from '../config/axios';

const SymptomChecker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Sore Throat',
    'Body Ache', 'Nausea', 'Diarrhea', 'Runny Nose', 'Chills'
  ];

  const addSymptom = (symptom) => {
    if (symptom && !symptoms.includes(symptom.toLowerCase())) {
      setSymptoms([...symptoms, symptom.toLowerCase()]);
      setInputValue('');
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) return;

    setLoading(true);
    try {
      const { data } = await axios.post('/api/symptoms/analyze', { symptoms });
      setResult(data);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      alert('Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSymptoms([]);
    setResult(null);
    setInputValue('');
  };

  // Format message to render properly
  const formatAdvice = (text) => {
    if (!text) return '';
    
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
      .replace(/\* /g, '• ')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('<br /><br />');
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      high: {
        bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30',
        border: 'border-red-300 dark:border-red-600',
        text: 'text-red-800 dark:text-red-200',
        icon: <AlertTriangle className="text-red-600 dark:text-red-400" size={28} />,
        badge: 'bg-red-600 dark:bg-red-500',
        title: 'High Priority',
        emoji: '🚨',
        desc: 'Seek medical attention soon'
      },
      medium: {
        bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30',
        border: 'border-yellow-300 dark:border-yellow-600',
        text: 'text-yellow-800 dark:text-yellow-200',
        icon: <Info className="text-yellow-600 dark:text-yellow-400" size={28} />,
        badge: 'bg-yellow-600 dark:bg-yellow-500',
        title: 'Moderate Priority',
        emoji: 'ℹ️',
        desc: 'Monitor symptoms closely'
      },
      low: {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30',
        border: 'border-green-300 dark:border-green-600',
        text: 'text-green-800 dark:text-green-200',
        icon: <CheckCircle className="text-green-600 dark:text-green-400" size={28} />,
        badge: 'bg-green-600 dark:bg-green-500',
        title: 'Low Priority',
        emoji: '✅',
        desc: 'Usually manageable at home'
      }
    };
    return configs[severity] || configs.low;
  };

  return (
    <>
      {/* Symptom Checker Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-2xl z-40 flex items-center justify-center"
        aria-label="Symptom Checker"
      >
        <Activity size={24} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            {/* Modal Container */}
            <div className="fixed inset-0 z-[70] flex items-center rounded-xl justify-center p-4 pointer-events-none overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-3xl my-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white p-5 flex items-center justify-between flex-shrink-0 rounded-t-3xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">AI Symptom Checker</h2>
                      <p className="text-xs opacity-90">Powered by HealthyBuddy AI</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                  {!result ? (
                    <div className="space-y-5">
                      {/* Info Banner */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 flex items-start gap-3">
                        <Sparkles className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-blue-900 dark:text-blue-200">
                          Describe your symptoms and our AI will analyze them to provide personalized health insights.
                        </p>
                      </div>

                      {/* Input Section */}
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
                          Enter Your Symptoms
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addSymptom(inputValue)}
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="e.g., fever, headache..."
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addSymptom(inputValue)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl transition-all shadow-lg"
                          >
                            <Plus size={20} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Common Symptoms */}
                      <div>
                        <p className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">Quick Select:</p>
                        <div className="flex flex-wrap gap-2">
                          {commonSymptoms.map(symptom => (
                            <motion.button
                              key={symptom}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => addSymptom(symptom)}
                              disabled={symptoms.includes(symptom.toLowerCase())}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                symptoms.includes(symptom.toLowerCase())
                                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 border border-blue-200 dark:border-blue-700'
                              }`}
                            >
                              {symptom}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Selected Symptoms */}
                      {symptoms.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">
                            Selected Symptoms ({symptoms.length}):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {symptoms.map((symptom, idx) => (
                              <motion.div
                                key={symptom}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow-lg font-medium"
                              >
                                <span className="capitalize">{symptom}</span>
                                <button
                                  onClick={() => removeSymptom(symptom)}
                                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Analyze Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={analyzeSymptoms}
                        disabled={symptoms.length === 0 || loading}
                        className="w-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-base shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Analyzing Your Symptoms...
                          </>
                        ) : (
                          <>
                            <Sparkles size={20} />
                            Analyze with AI
                          </>
                        )}
                      </motion.button>
                    </div>
                  ) : (
                    /* Results */
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-5"
                    >
                      {/* Severity Alert */}
                      {(() => {
                        const config = getSeverityConfig(result.severity);
                        return (
                          <div className={`${config.bg} ${config.border} border-2 p-5 rounded-2xl`}>
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                {config.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className={`font-bold text-lg ${config.text}`}>
                                    {config.emoji} {config.title}
                                  </h3>
                                  <span className={`${config.badge} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
                                    {result.severity.toUpperCase()}
                                  </span>
                                </div>
                                <p className={`text-sm ${config.text}`}>{config.desc}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Possible Conditions */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Activity className="text-indigo-600 dark:text-indigo-400" size={22} />
                          Possible Conditions
                        </h3>
                        <div className="space-y-3">
                          {result.possibleDiseases.map((disease, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                                  {idx + 1}
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{disease.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                    style={{ width: `${disease.confidence}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 min-w-[50px]">
                                  {disease.confidence}%
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* AI Recommendations */}
                      {(result.aiAdvice || result.advice) && (
                        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-blue-900/30 p-5 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 shadow-lg">
                          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Sparkles className="text-purple-600 dark:text-purple-400" size={22} />
                            AI-Powered Recommendations
                          </h3>
                          <div 
                            className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3"
                            dangerouslySetInnerHTML={{ __html: formatAdvice(result.aiAdvice || result.advice) }}
                          />
                        </div>
                      )}

                      {/* Disclaimer */}
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-300 dark:border-yellow-700 p-4 rounded-xl">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                          <p className="text-sm text-yellow-900 dark:text-yellow-200 font-medium">
                            {result.disclaimer}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={reset}
                          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-xl font-bold transition-all"
                        >
                          ← Check Again
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsOpen(false)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
                        >
                          Close
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SymptomChecker;
