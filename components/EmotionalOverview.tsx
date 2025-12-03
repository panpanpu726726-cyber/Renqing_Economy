
import React, { useState } from 'react';
import { X, ArrowRight, AlertTriangle, Activity, Share2 } from 'lucide-react';
import { GiftEvent } from '../types';
import { CATEGORIES, getCategory } from '../utils';

interface EmotionalOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  events: GiftEvent[];
  onNavigateToDetails: () => void;
}

export const EmotionalOverview: React.FC<EmotionalOverviewProps> = ({ isOpen, onClose, events, onNavigateToDetails }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // --- Data Prep for Charts ---
  
  // 1. Stress Curve Data (Sort by date, amount = stress)
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7); // Last 7 events
  const maxAmount = Math.max(...sortedEvents.map(e => e.amount), 1000);

  // 2. Network Data - Categorization Logic
  // Group unique people by category
  const peopleMap: Record<string, string[]> = {};
  CATEGORIES.forEach(c => peopleMap[c] = []);
  
  const processedPeople = new Set<string>();
  events.forEach(e => {
      if (!processedPeople.has(e.person)) {
          const cat = getCategory(e.person, e.occasion);
          peopleMap[cat].push(e.person);
          processedPeople.add(e.person);
      }
  });

  // --- Chart Helpers ---

  // Stress Curve Path
  const getCurvePath = (data: typeof sortedEvents, width: number, height: number) => {
    if (data.length === 0) return "";
    const points = data.map((e, i) => {
      const x = (i / (data.length - 1 || 1)) * width;
      const y = height - (e.amount / maxAmount) * (height * 0.8) - 10; // 10px padding
      return `${x},${y}`;
    });

    return `M0,${height} L0,${points[0].split(',')[1]} ` + points.map((p, i) => {
      if (i === 0) return ""; 
      const [prevX, prevY] = points[i-1].split(',');
      const [currX, currY] = p.split(',');
      const cX1 = parseFloat(prevX) + (parseFloat(currX) - parseFloat(prevX)) / 2;
      const cY1 = parseFloat(prevY);
      const cX2 = parseFloat(prevX) + (parseFloat(currX) - parseFloat(prevX)) / 2;
      const cY2 = parseFloat(currY);
      return `C${cX1},${cY1} ${cX2},${cY2} ${currX},${currY}`;
    }).join(' ') + ` L${width},${height} Z`;
  };

  return (
    <>
       <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer Container */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-gray-900/80 backdrop-blur-md z-50 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-white/10 overflow-hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header - Renamed to Emotional Snapshot */}
        <div className="p-6 flex justify-between items-center text-white shrink-0 border-b border-white/10">
          <h2 className="text-xl font-serif font-bold tracking-widest flex items-center gap-2 text-gold-coin drop-shadow-md">
            <Activity size={22} className="text-gold-coin" /> Emotional Snapshot
          </h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300 text-white/80 hover:text-white">
            <X size={28} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
          
          {/* --- A. Stress Curve --- */}
          <div className="relative group">
            <div className="flex justify-between items-end mb-3">
                <h3 className="font-serif font-bold text-white text-sm uppercase tracking-wide opacity-90">Stress Trajectory</h3>
                <span className="text-[10px] text-gray-300">Past 7 Events</span>
            </div>
            
            <div className="h-44 bg-[#D9D9D9]/20 rounded-xl shadow-lg border border-white/10 relative overflow-hidden backdrop-blur-sm">
                <svg className="w-full h-full absolute inset-0 p-2 overflow-visible" viewBox="0 0 300 150" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                    <path 
                        d={getCurvePath(sortedEvents, 300, 150)} 
                        fill="url(#stressGradient)" 
                        stroke="#FFD700" 
                        strokeWidth="3"
                        className="drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                    />
                    {sortedEvents.map((e, i) => {
                        const x = (i / (sortedEvents.length - 1 || 1)) * 300;
                        const y = 150 - (e.amount / maxAmount) * (150 * 0.8) - 10;
                        return (
                            <g key={e.id} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                                <circle cx={x} cy={y} r={hoveredPoint === i ? 7 : 4} fill={hoveredPoint === i ? "#fff" : "#FFD700"} stroke="white" strokeWidth="1" className="transition-all cursor-pointer" />
                            </g>
                        );
                    })}
                </svg>

                {hoveredPoint !== null && sortedEvents[hoveredPoint] && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10 border border-white/20">
                        {sortedEvents[hoveredPoint].occasion}: ¥{sortedEvents[hoveredPoint].amount}
                    </div>
                )}
                <div className="absolute top-3 right-3 text-2xl drop-shadow-md animate-pulse">😭</div>
                <div className="absolute bottom-3 right-3 text-2xl drop-shadow-md">😃</div>
            </div>
            <button onClick={onNavigateToDetails} className="w-full mt-2 text-xs text-gold-accent hover:text-white transition-colors flex items-center justify-end gap-1 font-bold tracking-wide">
                View Full Analysis <ArrowRight size={12}/>
            </button>
          </div>

          {/* --- B. Network Map (Hierarchical) --- */}
          <div>
             <div className="flex justify-between items-end mb-3">
                <h3 className="font-serif font-bold text-white text-sm uppercase tracking-wide opacity-90">Relationship Web</h3>
                <Share2 size={16} className="text-gray-300"/>
            </div>
            
            <div className="h-64 bg-[#D9D9D9]/20 rounded-xl shadow-lg border border-white/10 relative flex items-center justify-center overflow-hidden backdrop-blur-sm">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 240">
                    {/* ME Node */}
                    <circle cx="150" cy="120" r="14" fill="#d11515" stroke="#fff" strokeWidth="2" />
                    <text x="150" y="124" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ME</text>

                    {/* Hierarchical Categories */}
                    {CATEGORIES.map((cat, i) => {
                        // Level 1: Category Nodes (Orbit r=80)
                        const angle = (i / CATEGORIES.length) * Math.PI * 2 - Math.PI / 2;
                        const catR = 80;
                        const cx = 150 + Math.cos(angle) * catR;
                        const cy = 120 + Math.sin(angle) * catR;
                        
                        const people = peopleMap[cat];
                        const hasPeople = people.length > 0;
                        const isHovered = hoveredCategory === cat;

                        return (
                            <g key={cat} 
                               onMouseEnter={() => setHoveredCategory(cat)}
                               onMouseLeave={() => setHoveredCategory(null)}
                            >
                                {/* Line ME -> Category */}
                                <line 
                                    x1="150" y1="120" x2={cx} y2={cy} 
                                    stroke="rgba(255,255,255,0.2)" 
                                    strokeWidth={isHovered ? 2 : 1} 
                                />
                                
                                {/* Category Node */}
                                <circle 
                                    cx={cx} cy={cy} 
                                    r={isHovered ? 20 : 16} 
                                    fill={hasPeople ? "rgba(255, 215, 0, 0.2)" : "rgba(255, 255, 255, 0.05)"}
                                    stroke={hasPeople ? "#FFD700" : "rgba(255, 255, 255, 0.2)"}
                                    strokeWidth="1"
                                    className="transition-all duration-300 cursor-pointer"
                                />
                                {/* Label (Category) - Split words if needed for small space */}
                                <text 
                                    x={cx} y={cy} 
                                    dy={3}
                                    textAnchor="middle" 
                                    fill={isHovered ? "#fff" : "rgba(255,255,255,0.7)"} 
                                    fontSize="6" 
                                    fontWeight="bold"
                                    className="pointer-events-none uppercase tracking-tighter"
                                >
                                    {cat.split(' ')[0]}
                                </text>

                                {/* Level 2: Person Nodes (Mini Orbit r=25 around Category) */}
                                {people.map((person, j) => {
                                    // Fan out people around the category node
                                    // Angle relative to category center, facing away from main center slightly
                                    const spreadAngle = (j / people.length) * Math.PI + angle - Math.PI/2; 
                                    const pR = 30; // Distance from category node
                                    const px = cx + Math.cos(spreadAngle) * pR;
                                    const py = cy + Math.sin(spreadAngle) * pR;
                                    
                                    const isNodeHovered = hoveredNode === person;

                                    return (
                                        <g key={person}
                                           onMouseEnter={(e) => { e.stopPropagation(); setHoveredNode(person); }}
                                           onMouseLeave={(e) => { e.stopPropagation(); setHoveredNode(null); }}
                                           className="cursor-pointer"
                                        >
                                            {/* Line Category -> Person */}
                                            <line 
                                                x1={cx} y1={cy} x2={px} y2={py} 
                                                stroke={isHovered ? "rgba(255,215,0,0.5)" : "rgba(255,255,255,0.1)"} 
                                                strokeWidth="1"
                                            />
                                            {/* Person Node */}
                                            <circle 
                                                cx={px} cy={py} 
                                                r={isNodeHovered ? 6 : 3} 
                                                fill="#FFD700" 
                                                stroke="white" 
                                                strokeWidth="1"
                                            />
                                            {/* Person Label (Only show on hover/category hover to reduce clutter) */}
                                            {(isNodeHovered || isHovered) && (
                                                <text 
                                                    x={px} y={py - 8} 
                                                    textAnchor="middle" 
                                                    fill="white" 
                                                    fontSize="8" 
                                                    fontWeight="bold"
                                                    className="drop-shadow-md z-10"
                                                >
                                                    {person}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })}
                </svg>
            </div>
             <button onClick={onNavigateToDetails} className="w-full mt-2 text-xs text-gold-accent hover:text-white transition-colors flex items-center justify-end gap-1 font-bold tracking-wide">
                Explore Connections <ArrowRight size={12}/>
            </button>
          </div>

          {/* --- C. Alerts / Debt Warning --- */}
          <div className="bg-[#D9D9D9]/20 border border-red-500/30 rounded-xl p-5 relative overflow-hidden backdrop-blur-sm shadow-lg">
             <div className="flex items-start gap-4 relative z-10">
                <div className="bg-red-600 text-white p-2.5 rounded-lg shrink-0 animate-bounce shadow-lg border border-red-400">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-white text-base tracking-wide">Approaching Debt Horizon</h4>
                    <p className="text-sm text-gray-100 mt-1 leading-snug">
                        Warning: <span className="font-bold text-gold-coin">Spring Festival</span> is in 34 days.
                        Est. social cost: <span className="font-mono font-bold text-red-300">¥5,000+</span>.
                    </p>
                    <div className="mt-3 w-full bg-black/30 h-2 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-gradient-to-r from-red-500 to-yellow-500 h-full w-[70%]"></div>
                    </div>
                </div>
             </div>
             <div className="absolute -bottom-6 -right-6 text-red-500/20 rotate-12">
                <AlertTriangle size={100} />
             </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-white/10 shrink-0">
            <button 
                onClick={onNavigateToDetails}
                className="w-full py-3.5 bg-gold-coin text-[#8B0000] font-bold font-serif rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:shadow-[0_0_25px_rgba(255,215,0,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
                View Full Emotional Ledger
            </button>
        </div>

      </div>
    </>
  );
};
