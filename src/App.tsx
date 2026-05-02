/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Shield, Compass, Coffee, CheckCircle2, Crown, Zap, MessageCircle } from 'lucide-react';
import { AuthProvider, useAuth } from './components/FirebaseProvider';
import { Navbar } from './components/Navbar';
import { ProfileCard } from './components/ProfileCard';
import { auth, db } from './lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const MOCK_PROFILES = [
  {
    id: '1',
    name: 'Selam',
    age: 26,
    location: 'Addis Ababa',
    bio: 'Art lover and coffee enthusiast. Seeking someone who appreciates the beauty of Ethiopian heritage and simple moments.',
    photo: 'https://images.unsplash.com/photo-1523824921871-d6f1a3215111?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Elias',
    age: 29,
    location: 'Dire Dawa',
    bio: 'Architect, hiker, and amateur chef. Let\'s explore the hills and then share some Shiro together.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Marta',
    age: 24,
    location: 'Gondar',
    bio: 'History buff and traditional dancer. I value kindness and a good sense of humor above all.',
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800'
  }
];

function AppContent() {
  const { user, loading } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPremium, setShowPremium] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function checkProfile() {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setHasProfile(userDoc.exists());
      }
      setCheckingProfile(false);
    }
    checkProfile();
  }, [user]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error: any) {
      console.error('Auth error:', error);
      setAuthError(error.message || 'Failed to sign in');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentIndex > 1) {
      setShowPremium(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const createInitialProfile = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous Habesha',
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        bio: 'Just joined Ethiopian Hearts!',
        location: 'Addis Ababa',
        age: 25
      });
      setHasProfile(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || (user && checkingProfile)) {
    return (
      <div className="h-screen flex items-center justify-center bg-habesha-cream">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Heart className="text-habesha-red" size={48} fill="currentColor" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-habesha-cream selection:bg-habesha-gold/30">
      <Navbar />

      {!user ? (
        <main className="pt-24 px-6 pb-12">
          <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 py-12 lg:py-24">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-habesha-gold/10 text-habesha-gold text-sm font-medium mb-6">
                  <Sparkles size={14} />
                  <span>Ethio-Centric Connections</span>
                </div>
                <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.9] text-habesha-earth mb-8">
                  Find Love in the <br />
                  <span className="text-habesha-red italic">Ethiopian Heart</span>
                </h1>
                <p className="text-xl text-habesha-earth/70 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                  Join the premier community for Ethiopians worldwide. From the highlands of Gondar to the streets of Addis, connect with those who share your roots.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button 
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className="w-full sm:w-auto bg-habesha-earth text-habesha-cream px-8 py-4 rounded-full text-lg font-semibold shadow-xl shadow-habesha-earth/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSigningIn ? 'Connecting...' : 'Start Your Search'}
                  </button>
                  <button className="w-full sm:w-auto border border-habesha-earth/20 px-8 py-4 rounded-full text-lg font-medium hover:bg-habesha-earth hover:text-habesha-cream transition-all">
                    See How It Works
                  </button>
                </div>
                {authError && (
                  <p className="mt-4 text-habesha-red text-sm bg-habesha-red/5 p-3 rounded-lg border border-habesha-red/10 max-w-sm mx-auto lg:mx-0">
                    {authError}. Popups might be blocked!
                  </p>
                )}
              </motion.div>
            </div>
            
            <div className="flex-1 w-full max-w-sm lg:max-w-none relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-habesha-gold/20"
              >
                <img 
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800" 
                  alt="Ethiopian Love"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-habesha-earth/80 to-transparent flex flex-col justify-end p-8 text-habesha-cream">
                  <h3 className="text-2xl font-serif font-bold">Connecting Souls</h3>
                  <p className="text-sm opacity-80 mt-1">Join 50,000+ members today</p>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto py-24 border-t border-habesha-earth/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-habesha-green/10 flex items-center justify-center text-habesha-green mx-auto md:mx-0">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold font-serif">Verified Community</h3>
                <p className="text-habesha-earth/60">We ensure real people with shared cultural values, making safety our priority.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-habesha-gold/10 flex items-center justify-center text-habesha-gold mx-auto md:mx-0">
                  <Compass size={24} />
                </div>
                <h3 className="text-xl font-bold font-serif">Cultural Affinity</h3>
                <p className="text-habesha-earth/60">Filter by regional roots, language, and traditions to find your perfect match.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-habesha-red/10 flex items-center justify-center text-habesha-red mx-auto md:mx-0">
                  <Coffee size={24} />
                </div>
                <h3 className="text-xl font-bold font-serif">Meaningful Dates</h3>
                <p className="text-habesha-earth/60">From Jebena Buna meetups to traditional dinners, we facilitate real connection.</p>
              </div>
            </div>
          </section>
        </main>
      ) : !hasProfile ? (
        <main className="pt-32 pb-12 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-habesha-gold mb-6">
            <img src={user.photoURL || ''} alt="me" referrerPolicy="no-referrer" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Welcome to Ethiopian Hearts!</h2>
          <p className="text-habesha-earth/70 mb-8 leading-relaxed">
            Let's set up your profile so other Habesha members can find you. 
            By connecting, you join a supportive community looking for true love.
          </p>
          <button 
            onClick={createInitialProfile}
            className="w-full bg-habesha-earth text-habesha-cream py-4 rounded-xl font-bold shadow-xl hover:bg-habesha-earth/90 transition-all"
          >
            Create My Profile
          </button>
        </main>
      ) : (
        <main className="pt-24 pb-12 px-4 flex flex-col items-center">
          <div className="w-full max-w-sm mb-8">
            <div className="flex items-center justify-between px-2 text-sm text-habesha-earth/60 mb-2">
              <span>Discovery Room</span>
              <span>{MOCK_PROFILES.length - currentIndex} Profiles Nearby</span>
            </div>
            <div className="h-1 w-full bg-habesha-earth/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-habesha-gold"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentIndex + 1) / MOCK_PROFILES.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="relative w-full max-w-sm flex justify-center items-center h-[500px]">
            <AnimatePresence mode="wait">
              {currentIndex < MOCK_PROFILES.length ? (
                <ProfileCard 
                  key={MOCK_PROFILES[currentIndex].id}
                  profile={MOCK_PROFILES[currentIndex]}
                  onSwipe={handleSwipe}
                />
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-8 bg-white/50 rounded-3xl border border-habesha-earth/5"
                >
                  <Heart className="mx-auto text-habesha-red/20 mb-4" size={48} />
                  <h3 className="text-2xl font-serif font-bold">You've seen everyone!</h3>
                  <p className="text-habesha-earth/60 mt-2">Come back later for new Ethiopian hearts or expand your search area.</p>
                  <button 
                    onClick={() => setCurrentIndex(0)}
                    className="mt-6 text-habesha-gold font-medium hover:underline"
                  >
                    Reset Discovery
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showPremium && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-habesha-earth/40 backdrop-blur-sm"
              >
                <div className="bg-habesha-cream w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                  <button 
                    onClick={() => setShowPremium(false)}
                    className="absolute top-6 right-6 text-habesha-earth/40 hover:text-habesha-earth"
                  >
                    Close
                  </button>
                  <div className="p-8 pb-0 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-habesha-gold/10 text-habesha-gold mb-6">
                      <Crown size={32} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold mb-2">Upgrade to Gold</h2>
                    <p className="text-habesha-earth/60 mb-8">Unlock unlimited likes and see who liked you first.</p>
                  </div>
                  
                  <div className="space-y-4 px-8 mb-8">
                    <div className="flex items-center gap-4 bg-habesha-earth/[0.03] p-4 rounded-2xl">
                      <div className="text-habesha-red"><CheckCircle2 size={20} /></div>
                      <span className="text-sm font-medium">Unlimited Likes every day</span>
                    </div>
                    <div className="flex items-center gap-4 bg-habesha-earth/[0.03] p-4 rounded-2xl">
                      <div className="text-habesha-gold"><Zap size={20} /></div>
                      <span className="text-sm font-medium">5 Monthly Profile Boosts</span>
                    </div>
                    <div className="flex items-center gap-4 bg-habesha-earth/[0.03] p-4 rounded-2xl">
                      <div className="text-habesha-green"><MessageCircle size={20} /></div>
                      <span className="text-sm font-medium">Message before matching</span>
                    </div>
                  </div>

                  <div className="p-8 pt-0">
                    <button className="w-full bg-habesha-gold text-white py-4 rounded-2xl font-bold flex flex-col items-center shadow-lg shadow-habesha-gold/20 hover:scale-[1.02] transition-transform">
                      <span>Get Gold — 249 ETB / month</span>
                      <span className="text-[10px] opacity-80 uppercase tracking-widest font-normal">Most Popular Choice</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] habesha-pattern -z-10" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
