import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, User, MessageCircle, Settings, LogIn } from 'lucide-react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from './FirebaseProvider';

export const Navbar = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-habesha-cream/80 backdrop-blur-md border-b border-habesha-gold/20 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Heart className="text-habesha-red fill-habesha-red" size={24} />
        <span className="text-2xl font-serif font-bold tracking-tight text-habesha-earth">Ethiopian Hearts</span>
      </div>
      
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <button className="text-habesha-earth/70 hover:text-habesha-earth transition-colors"><MessageCircle size={22} /></button>
            <button className="text-habesha-earth/70 hover:text-habesha-earth transition-colors"><User size={22} /></button>
            <button onClick={() => signOut(auth)} className="text-sm font-medium border border-habesha-earth/20 rounded-full px-4 py-1.5 hover:bg-habesha-earth hover:text-habesha-cream transition-all">Sign Out</button>
          </>
        ) : (
          <button 
            disabled={loading}
            onClick={handleLogin}
            className="flex items-center gap-2 bg-habesha-earth text-habesha-cream px-5 py-2 rounded-full text-sm font-medium hover:bg-habesha-earth/90 transition-all shadow-lg disabled:opacity-50"
          >
            <LogIn size={18} />
            {loading ? 'Joining...' : 'Join Now'}
          </button>
        )}
      </div>
    </nav>
  );
};
