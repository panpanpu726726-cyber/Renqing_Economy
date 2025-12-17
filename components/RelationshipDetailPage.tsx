
import React, { useState, useMemo } from 'react';
import { X, AlertCircle, TrendingUp, Heart, Info } from 'lucide-react';
import { GiftEvent, TransactionType } from '../types';
import { getCategory, getProfileImage } from '../utils';

interface RelationshipDetailPageProps {
  person: string;
  events: GiftEvent[];
  onBack: () => void;
  isCreateMode?: boolean;
}

export const RelationshipDetailPage: React.FC<RelationshipDetailPageProps> = ({ person, events, onBack }) => {
  const [activeTab, setActiveTab] = useState<'GIVING' | 'RECEIVING'>('GIVING');
  const [imgError, setImgError] = useState(false);

  // --- Logic: Data Processing ---
  const augmentedEvents = useMemo(() => {
    let baseEvents = [...events];
    const category = events.length > 0 ? getCategory(person, events[0].occasion) : getCategory(person, '');
    
    let expenses = baseEvents.filter(e => e.type === TransactionType.EXPENSE);
    let incomes = baseEvents.filter(e => e.type === TransactionType.INCOME);

    const createSynthetic = (type: TransactionType, i: number) => ({
      id: `syn-${type}-${i}`,
      person,
      amount: category === 'Core Family' ? 1000 : 500,
      date: `2023-0${i + 1}-15`,
      type,
      occasion: type === TransactionType.EXPENSE ? 'Wedding Gift' : 'New Year Red Packet',
      aiAnalysis: 'A calculated move in the game of social face.'
    });

    while (expenses.length < 2) expenses.push(createSynthetic(TransactionType.EXPENSE, expenses.length));
    while (incomes.length < 2) incomes.push(createSynthetic(TransactionType.INCOME, incomes.length));
    
    return [...expenses, ...incomes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, person]);

  const displayEvents = useMemo(() => {
    return augmentedEvents.filter(e => e.type === (activeTab === 'GIVING' ? TransactionType.EXPENSE : TransactionType.INCOME));
  }, [augmentedEvents, activeTab]);

  const totalGiven = augmentedEvents.filter(e => e.type === TransactionType.EXPENSE).reduce((s, e) => s + e.amount, 0);
  const totalReceived = augmentedEvents.filter(e => e.type === TransactionType.INCOME).reduce((s, e) => s + e.amount, 0);
  const balance = totalReceived - totalGiven;
  const pressureLevel = Math.min(Math.abs(balance) / 50, 100);

  const portrait = getProfileImage(person);

  return (
    <div className="w-screen h-screen bg-[#B11414] flex flex-col font-serif overflow-hidden">
      {/* Header */}
      <div className="h-20 bg-[#951111] flex items-center justify-between px-6 border-b border-[#7a0e0e] z-30 shadow-lg">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-coin rounded-full flex items-center justify-center text-[#8B0000] font-bold border-2 border-yellow-200">¥</div>
            <h1 className="text-white font-bold text-xl tracking-widest">人情档案 / {person}</h1>
        </div>
        <button onClick={onBack} className="text-white/70 hover:text-white transition-all p-2"><X size={32} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Identity & Pressure */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative group">
                <div className="aspect-[3/4] w-full bg-[#fdfbf7] rounded-2xl shadow-2xl border-4 border-white/20 overflow-hidden relative">
                    {!imgError && portrait ? (
                        <img 
                            src={portrait} 
                            onError={() => setImgError(true)} 
                            className="w-full h-full object-cover" 
                            alt={person} 
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
                            <span className="text-6xl font-bold text-gray-400 opacity-50">{person.charAt(0)}</span>
                            <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-tighter">Portrait Unavailable</p>
                        </div>
                    )}
                    <div className="absolute inset-0 border-[12px] border-white/10 pointer-events-none"></div>
                </div>
                {/* Satirical Stamp */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-4 border-red-600/30 rounded-full flex items-center justify-center -rotate-12 pointer-events-none">
                    <span className="text-red-600/30 font-bold text-xs text-center leading-tight uppercase">Social<br/>Bonded</span>
                </div>
            </div>

            {/* Renqing Pressure Meter */}
            <div className="bg-black/20 rounded-2xl p-6 border border-white/10 space-y-4 shadow-inner">
                <div className="flex justify-between items-center">
                    <h3 className="text-gold-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={14} /> 人情压力指数
                    </h3>
                    <span className="text-white font-mono text-sm">{Math.round(pressureLevel)}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000"
                        style={{ width: `${pressureLevel}%` }}
                    ></div>
                </div>
                <p className="text-[11px] text-red-200 italic opacity-80 leading-relaxed">
                    {balance < 0 
                        ? "警告：你目前处于人情赤字状态。在该联系人面前，你的“面子”正在贬值。" 
                        : "提示：你的人情盈余较高。这虽然能带来面子，但也意味着你的资金流动性被锁死在了无效社交中。"}
                </p>
            </div>
          </div>

          {/* Right: Ledger Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                    <span className="text-white/60 text-[10px] uppercase font-bold mb-1">Total Harvested</span>
                    <span className="text-2xl font-bold text-green-400 font-mono">¥{totalReceived}</span>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                    <span className="text-white/60 text-[10px] uppercase font-bold mb-1">Total Sown</span>
                    <span className="text-2xl font-bold text-red-400 font-mono">¥{totalGiven}</span>
                </div>
            </div>

            <div className="flex p-1 bg-black/20 rounded-xl border border-white/5">
                <button 
                    onClick={() => setActiveTab('GIVING')} 
                    className={`flex-1 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'GIVING' ? 'bg-[#991b1b] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                >
                    支出 (Debt Paid)
                </button>
                <button 
                    onClick={() => setActiveTab('RECEIVING')} 
                    className={`flex-1 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'RECEIVING' ? 'bg-[#b45309] text-gold-coin shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                >
                    收入 (Debt Collected)
                </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {displayEvents.map(event => (
                    <div key={event.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gold-coin opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="text-white font-bold text-lg">{event.occasion}</h4>
                                <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest">{event.date}</p>
                            </div>
                            <div className={`text-xl font-bold font-mono ${event.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>
                                {event.type === TransactionType.INCOME ? '+' : '-'} ¥{event.amount}
                            </div>
                        </div>
                        {event.aiAnalysis && (
                            <div className="bg-black/20 p-3 rounded-lg border-l-2 border-gold-coin/50">
                                <p className="text-xs text-red-100 italic font-serif leading-relaxed opacity-90">
                                    "{event.aiAnalysis}"
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Quote */}
      <div className="p-4 bg-black/30 text-center border-t border-white/5">
        <p className="text-[10px] text-gold-accent font-serif tracking-widest uppercase opacity-60">
          "人情似纸张张薄，世事如棋局局新"
        </p>
      </div>
    </div>
  );
};
