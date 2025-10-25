import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
          console.error('OAuth error:', error);
          navigate('/login?error=' + error);
          return;
        }

        if (!token) {
          console.error('No token received');
          navigate('/login?error=no_token');
          return;
        }

        console.log('✅ Processing Google OAuth callback...');
        await handleGoogleCallback(token);
        
        navigate('/');
      } catch (error) {
        console.error('❌ Callback error:', error);
        navigate('/login?error=auth_failed');
      }
    };

    processCallback();
  }, [navigate, handleGoogleCallback]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6"
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
            <Heart size={40} className="text-white" fill="white" />
          </div>
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          Completing sign in...
        </h2>
        <p className="text-white/80">
          Please wait while we set up your account
        </p>
      </motion.div>
    </div>
  );
};

export default GoogleCallback;
