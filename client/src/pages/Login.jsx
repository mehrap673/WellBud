import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, Heart, Activity, Zap, Stars } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6bS0yOCAwYzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6bTE0IDE0YzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 bg-[length:60px_60px]"
        />
      </div>

      {/* Floating Animated Elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-300/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 right-1/4 w-24 h-24 bg-emerald-300/10 rounded-full blur-2xl"
      />

      {/* Floating Health Icons */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 360],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-20 opacity-20"
      >
        <Activity size={40} className="text-white" />
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -360],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 left-20 opacity-20"
      >
        <Zap size={35} className="text-white" />
      </motion.div>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/4 opacity-15"
      >
        <Stars size={30} className="text-white" />
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-full max-w-md z-10"
      >
        {/* Glass Card */}
        <motion.div
          variants={itemVariants}
          className="relative backdrop-blur-2xl bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 sm:p-10"
        >
          {/* Animated Gradient Border Effect */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl opacity-20 blur-xl -z-10"
          />

          {/* Logo Section */}
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ scale: 1.15, rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="relative mb-6 cursor-pointer"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart size={40} className="text-white" fill="white" />
                </motion.div>
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl opacity-50 blur-xl"
              />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl font-black mb-3 tracking-tight"
            >
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                style={{ letterSpacing: '-0.02em' }}
              >
                Well
              </motion.span>
              <motion.span
                animate={{
                  backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                style={{ letterSpacing: '-0.02em' }}
              >
                Bud
              </motion.span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-300 font-semibold text-lg flex items-center gap-2"
            >
              Welcome back!
              <motion.div
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={18} className="text-emerald-500" />
              </motion.div>
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium"
            >
              Continue your wellness journey
            </motion.p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 text-sm font-semibold flex items-center gap-3"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold mb-2.5 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Mail size={18} className="text-emerald-500" />
                </motion.div>
                <span className="tracking-wide">Email Address</span>
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all backdrop-blur-sm text-gray-800 dark:text-gray-200 font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="your@email.com"
                required
              />
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold mb-2.5 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Lock size={18} className="text-teal-500" />
                </motion.div>
                <span className="tracking-wide">Password</span>
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 pr-14 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all backdrop-blur-sm text-gray-800 dark:text-gray-200 font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="••••••••"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-500 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200% 100%' }}
                />
                <span className="relative flex items-center justify-center gap-2.5">
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                      />
                      <span className="tracking-wide">Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wide">Login to WellBud</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight size={22} />
                      </motion.div>
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/95 dark:bg-gray-900/95 text-gray-500 dark:text-gray-400 font-bold tracking-wide">
                Or continue with
              </span>
            </div>
          </motion.div>

          {/* Google Login Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white/70 dark:bg-gray-800/70 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-all backdrop-blur-sm shadow-lg hover:shadow-xl group"
            >
              <motion.svg
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </motion.svg>
              <span className="font-bold text-gray-700 dark:text-gray-300 text-base tracking-wide">
                Continue with Google
              </span>
            </motion.button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent hover:from-emerald-700 hover:to-cyan-700 transition-all inline-flex items-center gap-1 group"
            >
              Sign up free
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </Link>
          </motion.p>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <motion.p
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-base text-white/90 dark:text-white/70 font-bold tracking-wide flex items-center justify-center gap-2"
          >
            Your wellness journey starts here
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              💚
            </motion.span>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
