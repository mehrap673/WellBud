import { NavLink } from 'react-router-dom';
import { Home, Utensils, Dumbbell, Moon, Heart, User, X, ChevronRight, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const links = [
    { to: '/', icon: Home, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { to: '/insights', icon: Brain, label: 'AI Insights', color: 'from-teal-500 to-cyan-500' },
    { to: '/diet', icon: Utensils, label: 'Diet', color: 'from-orange-500 to-amber-500' },
    { to: '/fitness', icon: Dumbbell, label: 'Fitness', color: 'from-green-500 to-emerald-500' },
    { to: '/sleep', icon: Moon, label: 'Sleep', color: 'from-purple-500 to-indigo-500' },
    { to: '/mood', icon: Heart, label: 'Mood', color: 'from-pink-500 to-rose-500' },
    { to: '/profile', icon: User, label: 'Profile', color: 'from-indigo-500 to-purple-500' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col shadow-xl h-screen">
        <SidebarContent links={links} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 max-w-[85vw] bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col border-r border-gray-200 dark:border-gray-800 h-screen"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all z-10"
                aria-label="Close menu"
              >
                <X size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
              <SidebarContent links={links} onLinkClick={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarContent = ({ links, onLinkClick }) => {
  const { user } = useAuth();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length > 1) {
      return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2.5"
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
          >
            <img
              src="/WellBud.jpg"
              alt="WellBud Logo"
              className="w-10 h-10 object-cover rounded-xl"
            />
          </motion.div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              WellBud
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Wellness Tracker
            </p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label, color }, index) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `group flex items-center justify-between space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-gradient-to-r ' + color + ' text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center space-x-3 w-full"
              >
                <Icon
                  size={18}
                  className={isActive ? 'text-white' : ''}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`font-medium text-md ${isActive ? 'text-white' : ''}`}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NavLink
            to="/profile"
            onClick={onLinkClick}
            className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            {/* Avatar - Shows Google profile pic if available */}
            <div className="relative flex-shrink-0">
              {user?.avatar ? (
                // Google OAuth avatar
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover shadow-lg ring-2 ring-gray-200 dark:ring-gray-700"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}

              {/* Fallback initial avatar */}
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                style={{ display: user?.avatar ? 'none' : 'flex' }}
              >
                {getUserInitials()}
              </div>

              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.name || 'User Name'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'user@email.com'}
              </p>
            </div>

            {/* Arrow Icon */}
            <ChevronRight
              size={16}
              className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all"
            />
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;
