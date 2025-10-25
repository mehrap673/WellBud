import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export default function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        proxy: true  // ⚠️ IMPORTANT: Required for Vercel to work with HTTPS
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('🔐 Google OAuth callback received');
          console.log('Profile:', profile.displayName, profile.emails[0].value);

          // Check if user exists with googleId
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            console.log('✅ Existing user found');
            return done(null, user);
          }

          // Check if email exists
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            console.log('✅ Linking Google to existing account');
            user.googleId = profile.id;
            user.avatar = profile.photos[0]?.value;
            await user.save();
            return done(null, user);
          }

          // Create new user
          console.log('📝 Creating new user');
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value
          });

          console.log('✅ User created');
          done(null, user);
        } catch (error) {
          console.error('❌ Google OAuth error:', error);
          done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password');
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
