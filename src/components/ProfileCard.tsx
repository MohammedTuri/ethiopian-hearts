import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, MapPin, Info } from 'lucide-react';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    location: string;
    bio: string;
    photo: string;
  };
  onSwipe: (direction: 'left' | 'right') => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSwipe }) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
      className="relative w-full max-w-sm aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl bg-habesha-earth"
    >
      <img 
        src={profile.photo} 
        alt={profile.name}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
        <div className="text-white">
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-serif font-bold">{profile.name}</h3>
            <span className="text-xl font-light opacity-90">{profile.age}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 opacity-80 text-sm">
            <MapPin size={14} />
            <span>{profile.location}</span>
          </div>
          <p className="mt-3 text-sm line-clamp-2 opacity-90 leading-relaxed font-light">
            {profile.bio}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button 
            onClick={() => onSwipe('left')}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <X size={28} />
          </button>
          <button 
            onClick={() => onSwipe('right')}
            className="w-16 h-16 rounded-full bg-habesha-red flex items-center justify-center text-white shadow-lg shadow-habesha-red/40 hover:scale-110 transition-all"
          >
            <Heart size={32} fill="currentColor" />
          </button>
          <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <Info size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
