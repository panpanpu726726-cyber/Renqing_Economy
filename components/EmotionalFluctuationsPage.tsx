import React, { useMemo, useState } from 'react';
import { ArrowLeft, Activity, TrendingUp, AlertTriangle, Share2, ArrowUpCircle, ArrowDownCircle, Banknote, Clock, Info, Zap, Skull } from 'lucide-react';
import { GiftEvent, TransactionType } from '../types';
import { CATEGORIES, getCategory } from '../utils';

interface EmotionalFluctuationsPageProps {
  events: GiftEvent[];
  onBack: () => void;
}

export const EmotionalFluctuationsPage: React.FC<EmotionalFluctuationsPageProps> = ({ events, onBack }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // --- Data Processing ---

  // 1. Stats Calculation
  const totalIncome = events.filter(e => e.type === TransactionType.INCOME).reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = events.filter(e => e.type === TransactionType.EXPENSE).reduce((sum, e) => sum + e.amount, 0);
  const netWorth = totalIncome - totalExpense;
  const avgTransaction = Math.round((totalIncome + totalExpense) / (events.length || 1));

  // 2. Stress Chart Data (Sorted by Date)
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const maxAmount = Math.max(...events.map(e => e.amount), 2000);

  // 3. Network Data (Weighted)
  const relationshipWeights = useMemo(() => {
    const weights: Record<string, number> = {};
    events.forEach(e => {
        weights[e.person] = (weights[e.person] || 0) + e.amount;
    });
    return weights;
  }, [events]);

  const maxWeight = Math.max(...(Object.values(relationshipWeights) as number[]), 100);

  const peopleMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    CATEGORIES.forEach(c => map[c] = []);
    Object.keys(relationshipWeights).forEach(person => {
        const event = events.find(e => e.person === person);
        const cat = getCategory(person, event?.occasion || '');
        map[cat].push(person);
    });
    return map;
  }, [relationshipWeights, events]);

  // --- Helper Functions for SVG ---
  
  const getCurvePath = (data: GiftEvent[], width: number, height: number) => {
    if (data.length === 0) return "";
    const points = data.map((e, i) => {
      const x = (i / (data.length - 1 || 1)) * width;
      const y = height - (e.amount / maxAmount) * (height * 0.7) - 30; 
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
    <div className="w-screen h-screen bg-[#B11414] flex flex-col relative overflow-hidden font-serif text-white">
      
      {/* Header */}
      <div className="h-24 bg-[#951111] w-full flex items-center px-6 shadow-md z-20 shrink-0 border-b border-[#7a0e0e]">
        <button 
          onClick={onBack}
          className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform"/>
          <span className="font-serif font-bold text-lg tracking-wide">Back to Home</span>
        </button>
        <h1 className="ml-auto text-gold-coin font-serif font-bold text-2xl tracking-widest flex items-center gap-3">
          <Activity className="text-gold-coin" /> EMOTIONAL FLUCTUATIONS
        </h1>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative">
         
         {/* Background Watermark */}
         <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[200px] font-bold text-black/5 pointer-events-none select-none z-0">
            RENQING
         </div>

         <div className="max-w-7xl mx-auto space-y-8 pb-20 relative z-10">

            {/* --- 1. Intro Banner --- */}
            <div className="bg-gradient-to-r from-[#5c0e0e] to-[#3d0b0b] border border-[#7a1a1a] rounded-2xl p-6 lg:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-start gap-6 backdrop-blur-sm group hover:border-gold-coin/50 transition-all duration-500">
                <div className="bg-gold-coin text-[#8B0000] p-3 rounded-full shrink-0 shadow-lg group-hover:rotate-12 transition-transform duration-500">
                    <Info size={32} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-wide group-hover:text-gold-coin transition-colors">The Economy of Human Emotion</h2>
                    <p className="text-red-100 text-lg leading-relaxed font-serif opacity-90">
                        Social relationships in Chinese culture are not merely interactions; they are transactional investments. 
                        This dashboard quantifies your "Renqing" (favor) debts and credits. Use this data to strategize your next move: 
                        who to invite to dinner, and who to avoid until next pay day.
                    </p>
                </div>
            </div>

            {/* --- 2. Summary Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Outflow */}
                <div className="bg-[#2e0b0b] border border-[#5c1c1c] rounded-xl p-5 shadow-lg hover:bg-[#3f1212] hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:-translate-y-1 transition-all duration-300 group cursor-default">
                    <div className="text-red-300 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Total Outflow (Gifted)</div>
                    <div className="flex justify-between items-end">
                        <div className="text-4xl font-bold text-white">¥{totalExpense.toLocaleString()}</div>
                        <TrendingUp className="text-red-500 opacity-50 mb-1 group-hover:opacity-100 group-hover:scale-110 transition-all" size={32} />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">Investment in social stability.</div>
                </div>
                
                {/* Inflow */}
                <div className="bg-[#2e0b0b] border border-[#5c1c1c] rounded-xl p-5 shadow-lg hover:bg-[#3f1212] hover:border-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:-translate-y-1 transition-all duration-300 group cursor-default">
                    <div className="text-green-300 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Total Inflow (Received)</div>
                    <div className="flex justify-between items-end">
                        <div className="text-4xl font-bold text-white">¥{totalIncome.toLocaleString()}</div>
                        <ArrowDownCircle className="text-green-500 opacity-50 mb-1 group-hover:opacity-100 group-hover:scale-110 transition-all" size={32} />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">Return on investment.</div>
                </div>

                {/* Net Worth */}
                <div className="bg-[#2e0b0b] border border-[#5c1c1c] rounded-xl p-5 shadow-lg hover:bg-[#3f1212] hover:border-gold-coin hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:-translate-y-1 transition-all duration-300 group cursor-default">
                    <div className="text-gold-accent text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Social Net Worth</div>
                    <div className="flex justify-between items-end">
                        <div className={`text-4xl font-bold ${netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {netWorth >= 0 ? '+' : ''}¥{netWorth.toLocaleString()}
                        </div>
                        <Zap className="text-gold-coin opacity-50 mb-1 group-hover:opacity-100 group-hover:scale-110 transition-all" size={32} />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">You are in {netWorth < 0 ? 'social debt' : 'social surplus'}.</div>
                </div>

                {/* Avg Transaction */}
                <div className="bg-[#2e0b0b] border border-[#5c1c1c] rounded-xl p-5 shadow-lg hover:bg-[#3f1212] hover:border-blue-400 hover:shadow-[0_0_20px_rgba(96,165,250,0.2)] hover:-translate-y-1 transition-all duration-300 group cursor-default">
                    <div className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Avg. Transaction</div>
                    <div className="flex justify-between items-end">
                        <div className="text-4xl font-bold text-white">¥{avgTransaction.toLocaleString()}</div>
                        <Activity className="text-blue-500 opacity-50 mb-1 group-hover:opacity-100 group-hover:scale-110 transition-all" size={32} />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">Price of a single face (Mianzi).</div>
                </div>
            </div>

            
            {/* --- 3. Stress Trajectory Chart (Detailed) --- */}
            <div className="bg-gradient-to-b from-[#3d0b0b] to-[#1a0505] rounded-2xl border border-[#5c1c1c] shadow-2xl overflow-hidden hover:border-gold-coin/40 transition-colors duration-500">
                <div className="p-6 border-b border-[#5c1c1c] flex justify-between items-center bg-[#4a0d0d]/50">
                    <div>
                        <h2 className="text-xl font-bold text-gold-coin flex items-center gap-2">
                           <Activity /> Social Pressure Trajectory
                        </h2>
                        <p className="text-sm text-gray-300 italic mt-1">
                           Timeline analysis of financial magnitude per event.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold opacity-80">
                         <span className="text-red-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_red]"></span> Expense (Stress)</span>
                         <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_green]"></span> Income (Relief)</span>
                    </div>
                </div>

                <div className="relative h-96 w-full p-6 group">
                    {/* SVG Chart */}
                    <svg className="w-full h-full visible overflow-visible" viewBox="0 0 800 300" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#eab308" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
                            </linearGradient>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        
                        {/* Background Grid */}
                        <rect width="800" height="300" fill="url(#grid)" />

                        {/* Guide Lines */}
                        <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                        <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                        <line x1="0" y1="250" x2="800" y2="250" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

                        {/* Curve */}
                        <path 
                            d={getCurvePath(sortedEvents, 800, 300)} 
                            fill="url(#moodGradient)" 
                            stroke="#FFD700" 
                            strokeWidth="3"
                            className="drop-shadow-[0_0_15px_rgba(255,215,0,0.6)] transition-all duration-300"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Interactive Data Points */}
                        {sortedEvents.map((e, i) => {
                            const x = (i / (sortedEvents.length - 1 || 1)) * 800;
                            const y = 300 - (e.amount / maxAmount) * (300 * 0.7) - 30;
                            const isIncome = e.type === TransactionType.INCOME;
                            const isHovered = hoveredPoint === i;

                            return (
                                <g key={e.id} 
                                   onMouseEnter={() => setHoveredPoint(i)} 
                                   onMouseLeave={() => setHoveredPoint(null)}
                                   onClick={() => setHoveredPoint(i)} // Touch support
                                   className="cursor-pointer"
                                >
                                    {/* Hover Vertical Line */}
                                    <line 
                                        x1={x} y1={0} x2={x} y2={300} 
                                        stroke="rgba(255,255,255,0.5)" 
                                        strokeDasharray="2" 
                                        opacity={isHovered ? 1 : 0}
                                        className="transition-opacity duration-200"
                                    />

                                    {/* Main Dot */}
                                    <circle 
                                        cx={x} cy={y} 
                                        r={isHovered ? 14 : 7} 
                                        fill={isIncome ? "#4ade80" : "#ef4444"} 
                                        stroke="#fff" strokeWidth={2}
                                        className="transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                    />
                                    
                                    {/* Pulse Effect */}
                                    {isHovered && (
                                        <circle cx={x} cy={y} r={25} fill="none" stroke="#FFD700" strokeWidth={1} className="animate-ping opacity-50" />
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                     {/* Detail Tooltip (Fixed Position Overlay for clarity) */}
                     {hoveredPoint !== null && sortedEvents[hoveredPoint] && (
                        <div 
                           className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#1a0505] text-white p-4 rounded-xl border border-gold-coin shadow-[0_0_30px_rgba(255,215,0,0.2)] z-50 w-80 animate-in fade-in zoom-in-95 duration-200"
                           style={{ pointerEvents: 'none' }}
                        >
                            <div className="flex justify-between items-center mb-2 border-b border-gray-600 pb-2">
                                <span className="font-bold text-gold-coin text-lg font-serif">{sortedEvents[hoveredPoint].date}</span>
                                <span className={`font-mono font-bold text-xl ${sortedEvents[hoveredPoint].type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>
                                    {sortedEvents[hoveredPoint].type === TransactionType.INCOME ? '+' : '-'}¥{sortedEvents[hoveredPoint].amount}
                                </span>
                            </div>
                            <div className="text-base font-bold mb-1 text-white">{sortedEvents[hoveredPoint].occasion}</div>
                            <div className="text-sm text-gray-400 mb-2">Target: {sortedEvents[hoveredPoint].person}</div>
                            {sortedEvents[hoveredPoint].aiAnalysis && (
                                <div className="text-xs text-gray-300 italic bg-white/10 p-2 rounded border-l-2 border-gold-coin mt-2 leading-relaxed font-serif">
                                    "{sortedEvents[hoveredPoint].aiAnalysis}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* Chart Caption */}
                <div className="px-6 py-4 bg-[#1a0505]/50 text-sm text-gray-300 border-t border-[#5c1c1c] font-serif leading-relaxed">
                   The peaks represent moments of intense financial pressure, usually correlating with "High Season" events like Weddings or New Year. The valleys represent periods of dormancy or minor income. A consistent upward trajectory in expense without corresponding income suggests a potential "Relationship Deficit".
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- 4. Relationship Gravity Web --- */}
                <div className="bg-gradient-to-br from-[#3d0b0b] to-[#1a0505] rounded-2xl border border-[#5c1c1c] shadow-xl overflow-hidden flex flex-col hover:border-gold-coin/40 transition-colors duration-500">
                    <div className="p-6 border-b border-[#5c1c1c] bg-[#4a0d0d]/50">
                        <h2 className="text-xl font-bold text-gold-coin flex items-center gap-2">
                        <Share2 /> Social Gravity Map
                        </h2>
                        <p className="text-sm text-gray-300 italic mt-1">
                            Visualizing the "Renqing" density.
                        </p>
                    </div>
                    
                    <div className="flex-1 min-h-[400px] relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4a0d0d] to-[#1a0505]">
                        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 400 400">
                            {/* Center ME */}
                            <g className="hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <circle cx="200" cy="200" r="30" fill="#d11515" stroke="#FFD700" strokeWidth="4" className="shadow-lg filter drop-shadow-[0_0_20px_rgba(209,21,21,0.8)]"/>
                                <text x="200" y="205" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">ME</text>
                            </g>

                            {CATEGORIES.map((cat, i) => {
                                const angle = (i / CATEGORIES.length) * Math.PI * 2;
                                const orbitR = 120;
                                const cx = 200 + Math.cos(angle) * orbitR;
                                const cy = 200 + Math.sin(angle) * orbitR;
                                const people = peopleMap[cat];
                                const hasPeople = people.length > 0;

                                return (
                                    <g key={cat}>
                                        <line x1="200" y1="200" x2={cx} y2={cy} stroke="rgba(255,255,255,0.1)" strokeDasharray="4"/>
                                        
                                        <g className="transition-transform duration-300 hover:scale-125 origin-center">
                                            <circle cx={cx} cy={cy} r="25" fill={hasPeople ? "rgba(255,215,0,0.15)" : "rgba(0,0,0,0.2)"} stroke={hasPeople ? "#FFD700" : "rgba(255,255,255,0.2)"} className="transition-colors" />
                                            <text x={cx} y={cy} dy={4} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" className="uppercase tracking-tighter pointer-events-none">{cat.split(' ')[0]}</text>
                                        </g>

                                        {people.map((person, j) => {
                                            const fanAngle = angle + ((j - people.length/2 + 0.5) * 0.4); 
                                            const pDist = 55;
                                            const px = cx + Math.cos(fanAngle) * pDist;
                                            const py = cy + Math.sin(fanAngle) * pDist;
                                            const weight = relationshipWeights[person] || 0;
                                            const normalizedWeight = Math.min(weight / maxWeight, 1);
                                            const lineThick = 1 + normalizedWeight * 6; 
                                            const nodeSize = 4 + normalizedWeight * 6;
                                            const isHovered = hoveredNode === person;

                                            return (
                                                <g key={person} 
                                                onMouseEnter={() => setHoveredNode(person)}
                                                onMouseLeave={() => setHoveredNode(null)}
                                                className="cursor-pointer transition-all"
                                                >
                                                    <line 
                                                        x1={cx} y1={cy} x2={px} y2={py} 
                                                        stroke={isHovered ? "#FFD700" : "rgba(255,255,255,0.2)"} 
                                                        strokeWidth={lineThick}
                                                        className="transition-all duration-300"
                                                    />
                                                    <circle 
                                                        cx={px} cy={py} r={nodeSize} 
                                                        fill={isHovered ? "#fff" : "#FFD700"} 
                                                        stroke={isHovered ? "#FFD700" : "transparent"}
                                                        strokeWidth={2}
                                                        className="drop-shadow-[0_0_10px_rgba(255,215,0,0.6)] transition-all duration-300"
                                                    />
                                                    {(isHovered || hasPeople) && (
                                                        <text 
                                                            x={px} y={py + 15} textAnchor="middle" 
                                                            fontSize="10" fill="white" 
                                                            className={`${isHovered ? 'opacity-100 font-bold' : 'opacity-0'} transition-opacity bg-black/80 px-1 rounded`}
                                                        >
                                                            {person}
                                                        </text>
                                                    )}
                                                </g>
                                            )
                                        })}
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                     <div className="px-6 py-4 bg-[#1a0505]/50 text-sm text-gray-300 border-t border-[#5c1c1c] font-serif leading-relaxed">
                       Nodes closer to "ME" are structurally closer categories. However, the true measure of a relationship is the thickness of the connecting line—indicating the volume of cash flow. A thick line to a "Distant Relative" suggests you are being exploited; a thin line to a "Boss" suggests you are in danger.
                    </div>
                </div>

                {/* --- 5. Debt Monitor & Alerts --- */}
                <div className="bg-gradient-to-br from-[#3d0b0b] to-[#1a0505] rounded-2xl border border-[#5c1c1c] shadow-xl overflow-hidden flex flex-col hover:border-red-500/40 transition-colors duration-500">
                    <div className="p-6 border-b border-[#5c1c1c] bg-[#4a0d0d]/50">
                        <h2 className="text-xl font-bold text-gold-coin flex items-center gap-2">
                        <AlertTriangle /> Social Debt Monitor
                        </h2>
                        <p className="text-sm text-gray-300 italic mt-1">
                            Warning: Reciprocity is mandatory.
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Countdown Alert */}
                        <div className="bg-[#450a0a] p-5 rounded-xl border border-red-500/50 flex items-start gap-4 hover:bg-[#5e1212] hover:scale-[1.02] transition-all duration-300 shadow-lg">
                            <div className="bg-red-600 p-3 rounded-lg animate-pulse shadow-[0_0_15px_red]">
                                <Clock className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Spring Festival</h3>
                                <p className="text-red-200 text-sm">34 Days Remaining</p>
                                <div className="mt-2 text-xs bg-[#2e0b0b] p-2 rounded text-red-100 border border-red-500/30">
                                    ⚠ Est. Impact: <span className="font-bold text-gold-coin">¥5,000 - ¥8,000</span>. Prepare red envelopes for Nephews and Nieces.
                                </div>
                            </div>
                        </div>

                        {/* High Maintenance List */}
                        <div>
                            <h4 className="text-gold-accent font-bold text-sm uppercase mb-3 flex items-center gap-2">
                                <Banknote size={14} /> Top Creditors (Most Expensive)
                            </h4>
                            <div className="space-y-3">
                                {Object.entries(relationshipWeights)
                                    .sort(([,a], [,b]) => (b as number) - (a as number))
                                    .slice(0, 3)
                                    .map(([person, amount], i) => (
                                        <div key={person} className="flex justify-between items-center bg-[#2e0b0b] p-3 rounded-lg hover:bg-[#3f1212] hover:border-l-4 hover:border-red-500 transition-all cursor-pointer border border-[#5c1c1c] group shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${i === 0 ? 'bg-red-600 text-white' : 'bg-gold-coin text-[#8B0000]'}`}>
                                                    {i === 0 ? <Skull size={16}/> : person.charAt(0)}
                                                </div>
                                                <span className="font-bold text-sm text-gray-100 group-hover:text-red-300 transition-colors">{person}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                 {i === 0 && <span className="text-[10px] bg-red-600 text-white px-1.5 rounded uppercase font-bold">Risk</span>}
                                                 <span className="font-mono text-red-400 font-bold text-base group-hover:scale-110 transition-transform">-¥{amount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                         <div className="px-4 py-3 bg-[#450a0a]/50 text-xs text-red-200 border border-red-800/30 rounded-lg italic text-center">
                           "A debt of gold is easy to repay; a debt of human feeling (Renqing) weighs a thousand pounds."
                        </div>

                    </div>
                </div>
            </div>

         </div>
      </div>
    </div>
  );
};