import { Sun, Moon, LogOut, Bell, Menu, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-30 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Menu Button + Greeting */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            {/* Hamburger Menu Button - Only visible on mobile */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-xl bg-muted hover:bg-accent transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} className="text-foreground" />
            </button>

            {/* Greeting */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-xl md:text-2xl font-bold text-foreground truncate flex items-center gap-2">
                Hi, <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
                <span className="text-2xl">👋</span>
              </h2>
              <p className="hidden sm:block text-sm text-muted-foreground mt-1 truncate">
                Let's crush your health goals today
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl bg-muted hover:bg-accent transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-muted hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-foreground" />
              ) : (
                <Sun size={20} className="text-foreground" />
              )}
            </motion.button>

            {/* Logout - Desktop */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all shadow-lg hover:shadow-xl text-sm font-semibold"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </motion.button>

            {/* Logout - Mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="sm:hidden p-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
