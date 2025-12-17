
import React, { useState, useMemo } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { GiftEvent, TransactionType } from '../types';
import { getCategory } from '../utils';

interface RelationshipDetailPageProps {
  person: string;
  events: GiftEvent[];
  onBack: () => void;
  isCreateMode?: boolean;
}

export const RelationshipDetailPage: React.FC<RelationshipDetailPageProps> = ({ person, events, onBack, isCreateMode = false }) => {
  const [activeTab, setActiveTab] = useState<'GIVING' | 'RECEIVING'>('GIVING');

  // --- 1. Augmented Data Logic ---
  // Ensure every person has bidirectional data (at least 2-3 items per side)
  const augmentedEvents = useMemo(() => {
    let baseEvents = [...events];
    const category = events.length > 0 ? getCategory(person, events[0].occasion) : getCategory(person, '');
    
    // Separate current counts
    let expenses = baseEvents.filter(e => e.type === TransactionType.EXPENSE);
    let incomes = baseEvents.filter(e => e.type === TransactionType.INCOME);

    // --- Culturally Specific Data Helpers ---

    const getOccasion = (type: TransactionType, category: string) => {
        const isExpense = type === TransactionType.EXPENSE;
        
        // Occasions for GIVING (Expense)
        const expenseOccasions = [
            'Wedding Banquet (Attending)', 
            'Housewarming (Qiao Qian)', 
            'New Year Red Packet (To Kids)', 
            'Elder Birthday (Shou)', 
            'Hospital Visit (Condolence)', 
            'Funeral (Bai Jin)',
            'Child\'s 1st Month (Full Moon)'
        ];

        // Occasions for RECEIVING (Income)
        // Note: Unless user hosted a big event, income is usually from Elders or Return Gifts
        const incomeOccasions = [
            'New Year Red Packet (From Elder)', 
            'My Wedding (Gift)', 
            'My Child\'s Full Moon', 
            'Return Gift (Hui Li)', 
            'Workplace Bonus / Group Gift'
        ];

        const list = isExpense ? expenseOccasions : incomeOccasions;
        return list[Math.floor(Math.random() * list.length)];
    };
    
    const getCynicalAnalysis = (amount: number, type: TransactionType) => {
        const descriptions = [
            'Buying "Face" (Mianzi) in the inflated market of social obligations.',
            'A mandatory tax levied by the collective to maintain harmony.',
            'Investing in a bond that yields low emotional dividends.',
            'Purely performative generosity to avoid gossip.',
            'Inflation has hit the "Fenzi" market hard this year.',
            'A strategic payment to keep the "Guanxi" channels open.',
            'Reciprocity is not optional; it is a debt collection mechanism.'
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    };

    // Helper to generate "Lucky" Chinese Amounts based on RELATIONSHIP
    const getLuckyAmount = (category: string) => {
        const tier = Math.random();
        
        if (category === 'Core Family') {
            // High amounts: 1000, 2000, 2888, 5000, 6666, 8888, 10000
            if (tier > 0.9) return 10000;
            if (tier > 0.7) return 5000;
            if (tier > 0.5) return 2888; // Prosperous
            if (tier > 0.3) return 2000;
            return 1000;
        } 
        else if (category === 'Close Friends' || category === 'Elders') {
             // Mid amounts: 600, 666, 800, 888, 1000, 1200, 1688
             if (tier > 0.9) return 1688; // Way to prosperity
             if (tier > 0.7) return 1200;
             if (tier > 0.5) return 1000;
             if (tier > 0.3) return 888;
             return 600; // Standard close friend floor
        } 
        else {
             // General / Workplace: 200, 300, 400 (rare), 500, 600
             if (tier > 0.9) return 800;
             if (tier > 0.7) return 600; // Standard colleague wedding
             if (tier > 0.4) return 500;
             if (tier > 0.2) return 300; // Close acquaintance
             return 200; // Bare minimum
        }
    };

    // Synthetic Data Generator
    const createSynthetic = (type: TransactionType, indexOffset: number) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (indexOffset * 2 + 1)); // Spread out dates
        d.setDate(Math.floor(Math.random() * 28) + 1);
        
        const amt = getLuckyAmount(category);
        
        return {
            id: `syn-${type}-${Math.random()}`,
            person,
            amount: amt,
            date: d.toISOString().split('T')[0],
            type,
            occasion: getOccasion(type, category),
            aiAnalysis: getCynicalAnalysis(amt, type)
        } as GiftEvent;
    };

    // A. Ensure at least 3 Expenses (Giving)
    while (expenses.length < 3) {
        const newEvent = createSynthetic(TransactionType.EXPENSE, expenses.length);
        expenses.push(newEvent);
        baseEvents.push(newEvent);
    }

    // B. Ensure at least 3 Incomes (Receiving)
    while (incomes.length < 3) {
        const newEvent = createSynthetic(TransactionType.INCOME, incomes.length);
        incomes.push(newEvent);
        baseEvents.push(newEvent);
    }

    // C. Enforce "Crisis" (Ensure Total Given > Total Received) for most, unless Core Family
    const tIn = baseEvents.filter(e => e.type === TransactionType.INCOME).reduce((s, e) => s + e.amount, 0);
    const tOut = baseEvents.filter(e => e.type === TransactionType.EXPENSE).reduce((s, e) => s + e.amount, 0);

    if (tIn >= tOut && category !== 'Core Family') {
        // Add a massive expense to tip the scales to debt
        const crisisEvent: GiftEvent = {
            id: `syn-crisis-${Math.random()}`,
            person,
            amount: tIn - tOut + 2000, 
            date: new Date().toISOString().split('T')[0],
            type: TransactionType.EXPENSE,
            occasion: 'Wedding (Grand Banquet)',
            aiAnalysis: 'A heavy financial blow required to cement this alliance. You are now a net creditor, which is dangerous.'
        };
        baseEvents.push(crisisEvent);
    }

    // Sort by date desc
    return baseEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, person]);


  // Stats Calculation using Augmented Data
  const totalGiven = augmentedEvents.filter(e => e.type === TransactionType.EXPENSE).reduce((sum, e) => sum + e.amount, 0);
  const totalReceived = augmentedEvents.filter(e => e.type === TransactionType.INCOME).reduce((sum, e) => sum + e.amount, 0);
  const balance = totalReceived - totalGiven; // Likely negative
  const category = augmentedEvents.length > 0 ? getCategory(person, augmentedEvents[0].occasion) : 'General';

  // Filter for View
  const filteredEvents = augmentedEvents.filter(e => {
    if (activeTab === 'GIVING') return e.type === TransactionType.EXPENSE;
    if (activeTab === 'RECEIVING') return e.type === TransactionType.INCOME;
    return true;
  });

  // Mock Realistic Images - using Chinese/Asian portraits matching the user reference style
  const getProfileImage = () => {
    // 1. Auntie Zhang / Elders (Female) - Asian, middle-aged/elderly woman, half body portrait
    if (person.includes('Zhang') || person.includes('Aunt') || (category === 'Elders' && !person.includes('Uncle'))) {
        return "https://raw.githubusercontent.com/panpanpu/Renqing_Economy/main/services/1.jpeg"; 
    }
    
    // 2. Uncle / Boss / Father (Male) - Asian, elderly/middle-aged man, half body
    if (person.includes('Li') || person.includes('Wang') || person.includes('Boss') || person.includes('Dad') || person.includes('Uncle') || category === 'Core Family') {
        return "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop"; 
    }
    
    // 3. Young Female (Colleague/Friend/Jen) - Asian professional woman
    if (person.includes('Jen') || person.includes('Sister') || category === 'Workplace') {
        return "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop";
    }
    
    // 4. Close Friends / General - Young Asian Male/Female
    return "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=600&auto=format&fit=crop"; 
  };

  const getEventImage = (index: number) => {
    const images = [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop", // Chinese Wedding
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop", // Red Envelopes
      "https://images.unsplash.com/photo-1529516548873-9ce57c8f155e?q=80&w=600&auto=format&fit=crop", // Tea
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop", // Celebration
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=600&auto=format&fit=crop"  // Holiday
    ];
    return images[index % images.length];
  };

  // Helper Component for "Form Field" style card
  // Using <fieldset> and <legend> to cut the border line with the label
  const Field = ({ label, value, isMoney = false }: { label: string, value: React.ReactNode, isMoney?: boolean }) => (
    <fieldset className="border-[2px] border-white/80 rounded-lg px-4 pb-3 pt-1 bg-transparent hover:bg-white/5 transition-colors group w-full relative">
       <legend className="text-xs text-white px-2 font-bold tracking-wider ml-1">
          {label}
       </legend>
       <div className="-mt-1">
           {isMoney ? (
              <div className="text-white font-mono font-bold text-xl leading-tight tracking-wide">{value}</div>
           ) : (
              <div className="text-white font-serif font-bold text-lg leading-tight">{value}</div>
           )}
       </div>
    </fieldset>
  );

  return (
    <div className="w-screen h-screen bg-[#B11414] flex flex-col relative overflow-hidden font-serif">
      
      {/* Header */}
      <div className="h-24 bg-[#951111] w-full flex items-center px-6 shadow-md z-20 shrink-0 border-b border-[#7a0e0e] relative">
        {/* Close Button - Top Right */}
        <button 
          onClick={onBack}
          className="absolute right-6 text-white/80 hover:text-white hover:rotate-90 transition-all p-2"
        >
          <X size={32} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* --- Left Half: Photos & Summary (Cols 1-6) --- */}
            <div className="lg:col-span-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. Profile Photo & Slider */}
                <div className="flex flex-col items-center lg:items-start space-y-6">
                    {/* Main Profile Photo */}
                    <div className="aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-xl shadow-2xl border-4 border-white/10 bg-[#fdfbf7] shrink-0 self-center lg:self-start">
                      <img 
                        src={getProfileImage()} 
                        alt={person} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Photo Slider (Horizontal Scroll) */}
                    <div className="w-full max-w-[260px] lg:max-w-full self-center lg:self-start">
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Event Memories</p>
                        <div className="flex gap-3 overflow-x-auto pb-4 snap-x custom-scrollbar">
                            {[0, 1, 2, 3, 4].map(i => (
                                <div key={i} className="shrink-0 w-24 h-32 rounded-lg overflow-hidden border border-white/10 shadow-md snap-start">
                                    <img src={getEventImage(i)} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" alt="Event" />
                                </div>
                            ))}
                        </div>
                     </div>
                </div>

                {/* 2. Identity & Summary Card */}
                <div className="space-y-6">
                    {/* Name Header */}
                    <div className="flex items-center gap-4">
                        <h1 className="text-white font-serif font-bold text-4xl tracking-wide leading-none drop-shadow-md">{person}</h1>
                        <div className="flex -space-x-2">
                            <div className="w-6 h-8 bg-red-600 border border-red-400 rounded rotate-[-10deg] shadow-sm"></div>
                            <div className="w-6 h-8 bg-red-600 border border-red-400 rounded rotate-[10deg] shadow-sm"></div>
                        </div>
                    </div>

                    {/* Amount Summary Card */}
                    <div className="bg-[#a65d5d] rounded-2xl p-6 shadow-xl border border-white/10 text-white space-y-5">
                        <div className="text-center pb-2 border-b border-white/20">
                            <h3 className="font-serif font-bold text-lg text-white/90 tracking-widest">
                                AMOUNT SUMMARY
                            </h3>
                        </div>
                        
                        <div className="space-y-4 font-mono text-sm">
                            <div className="flex justify-between items-center text-yellow-300 font-bold bg-black/10 p-2 rounded">
                                <span>RECEIVING</span>
                                <span>+ ¥{totalReceived}</span>
                            </div>
                            <div className="flex justify-between items-center text-white/90 bg-black/10 p-2 rounded">
                                <span>GIVING</span>
                                <span>- ¥{totalGiven}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-white/20 text-xl font-bold">
                                <span>Total</span>
                                <span className={balance >= 0 ? "text-yellow-300" : "text-white"}>
                                    {balance >= 0 ? '+' : ''} ¥{Math.abs(balance)}
                                </span>
                            </div>
                        </div>
                        
                        {/* Status Label based on balance */}
                        {balance < 0 && (
                            <div className="text-center">
                                <span className="bg-red-800 text-white text-xs px-2 py-1 rounded border border-red-500 uppercase font-bold tracking-wider">
                                    Emotional Debtor
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Right Half: Transaction History (Cols 7-12) --- */}
            <div className="lg:col-span-6 space-y-6">
                
                {/* Giving/Receiving Tabs */}
                <div className="flex gap-4 p-1 bg-black/10 rounded-xl border border-white/5">
                    <button 
                        onClick={() => setActiveTab('GIVING')}
                        className={`flex-1 py-4 rounded-lg font-bold font-serif uppercase tracking-widest transition-all duration-300 border-2 ${
                            activeTab === 'GIVING' 
                                ? 'bg-[#991b1b] text-white border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-[1.02]' 
                                : 'bg-transparent text-white/60 border-transparent hover:bg-white/5 hover:border-white/5'
                        }`}
                    >
                        GIVING
                    </button>
                    <button 
                        onClick={() => setActiveTab('RECEIVING')}
                        className={`flex-1 py-4 rounded-lg font-bold font-serif uppercase tracking-widest transition-all duration-300 border-2 ${
                            activeTab === 'RECEIVING' 
                                ? 'bg-[#b45309] text-[#FFD700] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.5)] scale-[1.02]' 
                                : 'bg-transparent text-white/60 border-transparent hover:bg-white/5 hover:border-white/5'
                        }`}
                    >
                        RECEIVING
                    </button>
                </div>

                {/* Event List */}
                <div className="space-y-4 h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-2">
                    {filteredEvents.map(event => (
                        <div 
                            key={event.id} 
                            className="bg-[#d9d9d9]/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                             <div className="space-y-4">
                                <Field label={`Occasion`} value={event.occasion} />
                                <Field label="Date" value={event.date} />
                                <Field label="Relation Type" value={category} />
                                <Field label="Gift Amount" value={`¥ ${event.amount}`} isMoney />
                             </div>
                             
                             {event.aiAnalysis && (
                                <div className="border border-white/40 rounded-lg p-3 bg-white/5 backdrop-blur-sm relative mt-2">
                                    <div className="text-[10px] text-gold-coin uppercase tracking-wider font-bold mb-1">Purpose / Message</div>
                                    <div className="text-white/90 font-serif italic text-sm leading-relaxed">
                                        "{event.aiAnalysis}"
                                    </div>
                                </div>
                             )}
                        </div>
                    ))}
                </div>

            </div>

         </div>
      </div>
    </div>
  );
};
