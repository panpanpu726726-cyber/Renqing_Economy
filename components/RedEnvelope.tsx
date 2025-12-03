import React from 'react';
import { GiftEvent, TransactionType } from '../types';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface RedEnvelopeProps {
  event: GiftEvent;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  angle: number; // Position on circle in degrees (0-360)
}

export const RedEnvelope: React.FC<RedEnvelopeProps> = ({ event, isHovered, onHover, angle }) => {
  const isIncome = event.type === TransactionType.INCOME;
  
  // Radius calculations
  // Table size is 480px diameter -> 240px radius
  
  // Dish (w-20/80px): Center at 48.
  const dishRadius = 48; 
  
  // Plate (w-24/96px): Center at 132.
  const plateRadius = 132;

  // Logic to detect side of table for tooltip positioning
  
  // Right Side (approx 3 o'clock, angle 0). Range: 330 to 360 OR 0 to 30.
  const isRightSide = angle < 30 || angle > 330;

  // Left Side (approx 9 o'clock to 11 o'clock). Range includes 180 (Odd Classmate) and 240 (Colleague Jen).
  const isLeftSide = angle > 150 && angle < 260;

  // Deterministically select food type based on ID
  const getFoodContent = (id: string) => {
    const num = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variant = num % 4;
  
    switch (variant) {
      case 0: // Dumplings / Buns
         return (
           <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute top-3 left-4 w-6 h-6 bg-[#fdfbf7] rounded-full border border-gray-200 shadow-sm"></div>
              <div className="absolute top-7 left-3 w-6 h-6 bg-[#fdfbf7] rounded-full border border-gray-200 shadow-sm"></div>
              <div className="absolute top-5 left-9 w-6 h-6 bg-[#fdfbf7] rounded-full border border-gray-200 shadow-sm"></div>
           </div>
         );
      case 1: // Spicy Fish/Meat (Red/Orange)
         return (
           <div className="w-full h-full bg-[#e85d04] rounded-full overflow-hidden border-2 border-white/50 relative">
              <div className="absolute top-3 left-4 w-5 h-5 bg-[#ffba08] rounded-full blur-[2px] opacity-80"></div>
              <div className="absolute bottom-3 right-5 w-8 h-3 bg-[#9d0208] rotate-12 rounded-full"></div>
              <div className="absolute top-3 right-4 w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="absolute bottom-5 left-4 w-2 h-2 bg-green-400 rounded-full"></div>
           </div>
         );
      case 2: // Greens (Green)
         return (
            <div className="w-full h-full flex flex-wrap gap-1 justify-center items-center p-2">
               <div className="w-7 h-4 bg-[#38b000] rounded-full rotate-45 border border-green-800/10"></div>
               <div className="w-6 h-6 bg-[#70e000] rounded-full border border-green-800/10"></div>
               <div className="w-7 h-4 bg-[#008000] rounded-full -rotate-12 border border-green-800/10"></div>
            </div>
         );
      case 3: // Tofu / Scrambled Eggs (Yellow/White)
          return (
            <div className="w-full h-full bg-[#fff3b0] rounded-full overflow-hidden border border-yellow-200/50 relative">
               <div className="absolute top-4 left-3 w-6 h-6 bg-[#ffea00] rounded opacity-60"></div>
               <div className="absolute bottom-4 right-4 w-8 h-4 bg-white rounded-md shadow-sm"></div>
               <div className="absolute top-3 right-5 w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          )
      default:
         return null;
    }
  }

  // Determine transform style for tooltip based on position
  const getTooltipTransform = () => {
    let baseTransform = `translate(${plateRadius}px, 0) rotate(-${angle}deg)`;
    
    if (isLeftSide) {
      // Move further left (-165px) to clear the envelope (fixes Colleague Jen overlap)
      // Vertical shift (-25%) to center-align roughly with envelope
      return `${baseTransform} translateX(-165px) translateY(-25%)`;
    } 
    
    if (isRightSide) {
      // Move to the right (155px) to sit next to envelope (fixes Cousin Li)
      // Vertical shift (-25%)
      return `${baseTransform} translateX(155px) translateY(-25%)`;
    }

    // Default (Top)
    return baseTransform;
  };

  return (
    <div 
      // Dynamic Z-index ensures the hovered item is always on top of others
      className={`absolute top-1/2 left-1/2 w-0 h-0 transition-all ${isHovered ? 'z-50' : 'z-20'}`}
      style={{
        transform: `rotate(${angle}deg)`,
      }}
      onMouseEnter={() => onHover(event.id)}
      onMouseLeave={() => onHover(null)}
    >
        {/* The Shared Dish (Placed closer to center) 
            Size: w-20 h-20 (80px). Centered via -ml-10 -mt-10.
        */}
        <div 
            className="absolute top-1/2 left-1/2 transition-transform duration-300 origin-center pointer-events-none"
            style={{ 
                transform: `translate(${dishRadius}px, 0) rotate(90deg)`,
            }}
        >
            <div className="w-20 h-20 -ml-10 -mt-10 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100">
                {/* Food Content Container */}
                <div className="w-16 h-16">
                    {getFoodContent(event.id)}
                </div>
            </div>
        </div>

        {/* 
            Container for the Place Setting (User's Plate & Envelope).
            Size: w-24 h-24 (96px). Centered via -ml-12 -mt-12.
        */}
        <div 
            className="absolute top-1/2 left-1/2 transition-transform duration-300 origin-center"
            style={{ 
                transform: `translate(${plateRadius}px, 0) rotate(90deg) scale(${isHovered ? 1.1 : 1})`,
            }}
        >
            {/* Wrapper to center the 96x96 place setting on the radius point */}
            <div className="relative w-24 h-24 -ml-12 -mt-12">
            
              {/* Plate (Center of this component) - w-24 h-24 */}
              <div className="relative w-24 h-24 rounded-full bg-[#f0f0f0] shadow-md flex items-center justify-center border border-gray-200 z-10">
                  {/* Inner rim */}
                  <div className="w-16 h-16 rounded-full border border-gray-300/50"></div>
                  
                  {/* Decoration: Rice grains / Crumbs */}
                  <div className="absolute top-6 left-6 w-1 h-1.5 bg-white rounded-full opacity-60 rotate-45"></div>
                  <div className="absolute bottom-5 right-7 w-1 h-1.5 bg-white rounded-full opacity-60 -rotate-12"></div>

                  {/* The Red Envelope (Placed on plate) */}
                  <div className="absolute w-11 h-16 bg-[#d11515] rounded shadow-[1px_2px_5px_rgba(0,0,0,0.3)] transform -rotate-6 border border-[#b91c1c] flex flex-col items-center pt-2 z-10 transition-transform hover:rotate-0">
                      {/* Gold Coin/Seal */}
                      <div className="w-3 h-3 rounded-full bg-[#FFD700] border border-yellow-200 shadow-sm"></div>
                      {/* Flap line */}
                      <div className="w-8 h-[1px] bg-black/20 mt-1"></div>
                  </div>
              </div>

              {/* Chopsticks (Right side) */}
              <div className="absolute top-0 right-[-14px] h-24 w-3 flex gap-0.5 justify-center rotate-6 opacity-90 z-20">
                  <div className="w-1 h-full bg-[#ddd] rounded-full shadow-[1px_1px_2px_rgba(0,0,0,0.1)]"></div>
                  <div className="w-1 h-full bg-[#ddd] rounded-full shadow-[1px_1px_2px_rgba(0,0,0,0.1)] mt-1.5"></div>
              </div>

              {/* Spoon/Bowl (Top Left) */}
              <div className="absolute -top-3 -left-4 z-20">
                  <div className="w-8 h-8 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#e6bf83] border-[1.5px] border-white opacity-80"></div>
                  </div>
                  {/* Spoon handle */}
                  <div className="absolute top-1.5 left-5 w-6 h-1.5 bg-white rounded-r-full rotate-[-45deg] shadow-sm"></div>
              </div>
            
            </div>
        </div>

        {/* 
          Floating Tooltip 
        */}
        <div 
          className={`absolute z-50 pointer-events-none transition-all duration-300 ease-out origin-center
              ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}
          style={{ 
             // Origin is at the center of the plate (radius position)
             transform: getTooltipTransform(), 
             width: '200px',
             left: '50%',
             marginLeft: '-100px', // Center horizontally on anchor point
             
             // Vertical Positioning Anchors
             // If Left or Right side, we use 'top: 0' to align via translateY (-25%).
             // If Top/Bottom (Default), we use 'bottom: 58px' to sit on top of plate.
             bottom: (isLeftSide || isRightSide) ? 'auto' : '58px', 
             top: (isLeftSide || isRightSide) ? '0' : 'auto',
          }} 
        >
            <div className={`bg-white/50 backdrop-blur-md p-3 rounded-xl shadow-2xl border-l-4 relative
              ${isIncome ? 'border-green-600' : 'border-red-600'}
            `}>
              <div className="flex justify-between items-center text-[10px] text-gray-800 uppercase font-bold tracking-widest mb-1">
                <span>{event.date}</span>
                {isIncome ? <ArrowDownCircle size={14} className="text-green-700"/> : <ArrowUpCircle size={14} className="text-red-700"/>}
              </div>
              
              <div className="flex justify-between items-start mb-1">
                 <div className="font-serif font-bold text-gray-900 text-base leading-tight">{event.person}</div>
                 <div className={`text-base font-bold ${isIncome ? 'text-green-800' : 'text-red-800'}`}>
                   ¥{event.amount.toLocaleString()}
                 </div>
              </div>
              
              <div className="text-xs text-gray-800 mb-2 font-medium bg-white/60 inline-block px-2 py-0.5 rounded-full">{event.occasion}</div>
              
              {event.aiAnalysis && (
                <div className="mt-2 text-xs leading-relaxed text-gray-900 italic border-t border-gray-400/30 pt-2 font-serif font-medium">
                  "{event.aiAnalysis}"
                </div>
              )}
            </div>
        </div>
    </div>
  );
};