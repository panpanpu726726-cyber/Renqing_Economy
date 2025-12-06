
import React, { useState } from 'react';
import { X, Bell, Settings as SettingsIcon, Star, Banknote, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [rating, setRating] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [currency, setCurrency] = useState('CNY');

  const handleRating = (score: number) => {
    setRating(score);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 2000);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer - "Open Red Envelope" Style */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[#cf1515] z-[70] shadow-[10px_0_40px_rgba(0,0,0,0.6)] transform transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* --- Top Flap (Simulating an open envelope interior) --- */}
        <div className="relative h-48 bg-[#b91c1c] overflow-hidden shrink-0">
             {/* The inner lining pattern */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-200 to-transparent"></div>
             
             {/* The "Open" Flap Shape (Triangle pointing up/out visually) */}
             <div className="absolute -bottom-10 left-0 w-full h-20 bg-[#cf1515] rounded-t-[50%] shadow-[0_-5px_15px_rgba(0,0,0,0.2)]"></div>

             {/* Header Content */}
             <div className="relative z-10 p-6 pt-10 flex flex-col items-center">
                 <div className="w-16 h-16 bg-gold-coin rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-[#cf1515]">
                    <SettingsIcon className="text-[#8B0000]" size={32} />
                 </div>
                 <h2 className="font-serif font-bold text-xl text-white tracking-widest uppercase text-shadow-sm">Settings</h2>
             </div>

             {/* Close Button - Added rotation animation */}
             <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-white/60 hover:text-white hover:rotate-90 transition-all z-50 p-2 hover:bg-white/10 rounded-full"
             >
                <X size={24} />
             </button>
        </div>

        {/* --- Content Area --- */}
        <div className="p-6 space-y-6 relative">
            
            {/* 1. Daily Reminder */}
            <div 
                className="bg-black/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-black/20 transition-colors border border-white/5"
                onClick={() => setReminderEnabled(!reminderEnabled)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold-coin">
                        <Bell size={16} />
                    </div>
                    <span className="font-serif text-white font-bold text-sm tracking-wide">Daily Reminder</span>
                </div>
                <button className={`transition-colors ${reminderEnabled ? 'text-green-400' : 'text-white/30'}`}>
                    {reminderEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
            </div>

            {/* 2. Preferences */}
            <div className="bg-black/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-black/20 transition-colors border border-white/5 group">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold-coin">
                        <SettingsIcon size={16} />
                    </div>
                    <span className="font-serif text-white font-bold text-sm tracking-wide">Preferences</span>
                </div>
                <ChevronRight size={20} className="text-white/30 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* 3. Rating */}
            <div className="bg-black/10 rounded-xl p-4 space-y-2 border border-white/5 relative overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold-coin">
                        <Star size={16} />
                    </div>
                    <span className="font-serif text-white font-bold text-sm tracking-wide">Rating</span>
                </div>
                <div className="flex gap-1 pl-11">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star} 
                            size={18} 
                            onClick={() => handleRating(star)}
                            className={`cursor-pointer transition-all hover:scale-110 ${star <= rating ? 'text-gold-coin fill-gold-coin' : 'text-white/30 hover:text-white'}`} 
                        />
                    ))}
                </div>
                
                {/* Thank You Animation Overlay */}
                {showThankYou && (
                    <div className="absolute inset-0 bg-[#cf1515]/95 flex items-center justify-center z-10 animate-in fade-in duration-300">
                        <span className="font-serif font-bold text-gold-coin tracking-widest text-sm animate-bounce">
                            THANK YOU!
                        </span>
                    </div>
                )}
            </div>

            {/* 4. Default Currency */}
            <div className="bg-black/10 rounded-xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold-coin">
                        <Banknote size={16} />
                    </div>
                    <span className="font-serif text-white font-bold text-sm tracking-wide">Currency</span>
                </div>
                <div className="relative">
                    <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="font-mono font-bold text-gold-coin bg-black/20 pl-3 pr-2 py-1 rounded text-xs border-none outline-none cursor-pointer hover:bg-black/30 transition-colors text-right appearance-none"
                    >
                        <option value="CNY">CNY (¥)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="HKD">HKD ($)</option>
                    </select>
                </div>
            </div>

        </div>

        {/* Decorative Bottom */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

      </div>
    </>
  );
};
