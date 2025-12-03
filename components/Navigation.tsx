
import React from 'react';
import { HeartPulse, CalendarClock, BookOpenText, Settings, X, Home } from 'lucide-react';
import { Page } from '../types';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose, onNavigate }) => {
  const menuItems = [
    { icon: <Home size={22} />, label: 'Home', id: Page.HOME },
    { icon: <HeartPulse size={22} />, label: 'Emotional Fluctuations', id: Page.EMOTIONAL_FLUCTUATIONS },
    { icon: <CalendarClock size={22} />, label: 'Timeline (Year /Month)', id: Page.TIMELINE },
    { icon: <BookOpenText size={22} />, label: 'Relationship Ledger', id: Page.RELATIONSHIP_LEDGER },
    { icon: <Settings size={22} />, label: 'Settings', id: Page.SETTINGS },
  ];

  const handleItemClick = (pageId: Page) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer - Red Envelope Style */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[#cf1515] z-50 shadow-[10px_0_30px_rgba(0,0,0,0.5)] transform transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Envelope Flap (Top Section) */}
        <div className="relative w-full h-[220px]">
            {/* Lighter Red Background */}
            <div className="absolute inset-0 bg-[#ff5e57]"></div>
            
            {/* The Curve - Creating the flap shape */}
            <div className="absolute bottom-[-30px] left-0 w-full h-[60px] bg-[#ff5e57] rounded-b-[100%] shadow-sm z-10"></div>
            
            {/* Close Button */}
            <button 
                onClick={onClose} 
                className="absolute top-6 left-6 text-white/70 hover:text-white hover:rotate-90 transition-all z-50"
            >
                <X size={28} />
            </button>
        </div>

        {/* The Seal (Circle) */}
        <div className="absolute top-[210px] left-1/2 -translate-x-1/2 w-20 h-20 bg-[#b01010] rounded-full shadow-[0_6px_12px_rgba(0,0,0,0.2)] z-20 flex items-center justify-center border border-[#d11515]">
           {/* Subtle Inner Highlight */}
           <div className="w-16 h-16 rounded-full bg-[#c21414] opacity-30"></div>
        </div>

        {/* Menu Items Container */}
        <div className="mt-20 px-10 flex flex-col gap-8">
            {menuItems.map((item, index) => (
              <button 
                key={index}
                onClick={() => handleItemClick(item.id)}
                className="group flex items-center gap-4 text-white hover:translate-x-2 transition-transform duration-300 w-full text-left"
              >
                 {/* Icon - Slightly transparent, becomes solid on hover */}
                 <span className="opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.icon}
                 </span>
                 {/* Label - Bold Serif */}
                 <span className="font-serif font-bold text-lg tracking-wide group-hover:text-[#ffd700] transition-colors drop-shadow-sm">
                    {item.label}
                 </span>
              </button>
            ))}
        </div>

        {/* Bottom Decorative Gradient */}
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};
