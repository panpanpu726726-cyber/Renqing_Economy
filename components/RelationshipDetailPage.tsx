
import React, { useState, useMemo } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { GiftEvent, TransactionType } from '../types';
import { getCategory, getProfileImage } from '../utils';

interface RelationshipDetailPageProps {
  person: string;
  events: GiftEvent[];
  onBack: () => void;
  isCreateMode?: boolean;
}

export const RelationshipDetailPage: React.FC<RelationshipDetailPageProps> = ({ person, events, onBack, isCreateMode = false }) => {
  const [activeTab, setActiveTab] = useState<'GIVING' | 'RECEIVING'>('GIVING');

  const augmentedEvents = useMemo(() => {
    let baseEvents = [...events];
    const category = events.length > 0 ? getCategory(person, events[0].occasion) : getCategory(person, '');
    
    let expenses = baseEvents.filter(e => e.type === TransactionType.EXPENSE);
    let incomes = baseEvents.filter(e => e.type === TransactionType.INCOME);

    const getOccasion = (type: TransactionType, category: string) => {
        const isExpense = type === TransactionType.EXPENSE;
        const list = isExpense 
          ? ['Wedding Banquet', 'Housewarming', 'New Year Gift', 'Elder Birthday', 'Hospital Visit'] 
          : ['New Year Gift', 'My Wedding', 'Return Gift'];
        return list[Math.floor(Math.random() * list.length)];
    };
    
    const getCynicalAnalysis = () => {
        const descriptions = ['Buying "Face" (Mianzi).', 'A mandatory social tax.', 'Investing in a low-dividend bond.', 'Performative generosity.', 'Strategic payment.'];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    };

    const getLuckyAmount = (category: string) => {
        if (category === 'Core Family') return 2000;
        return 600;
    };

    const createSynthetic = (type: TransactionType, indexOffset: number) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (indexOffset * 2 + 1));
        return {
            id: `syn-${type}-${Math.random()}`,
            person,
            amount: getLuckyAmount(category),
            date: d.toISOString().split('T')[0],
            type,
            occasion: getOccasion(type, category),
            aiAnalysis: getCynicalAnalysis()
        } as GiftEvent;
    };

    while (expenses.length < 3) expenses.push(createSynthetic(TransactionType.EXPENSE, expenses.length));
    while (incomes.length < 3) incomes.push(createSynthetic(TransactionType.INCOME, incomes.length));
    
    return [...expenses, ...incomes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, person]);

  const totalGiven = augmentedEvents.filter(e => e.type === TransactionType.EXPENSE).reduce((sum, e) => sum + e.amount, 0);
  const totalReceived = augmentedEvents.filter(e => e.type === TransactionType.INCOME).reduce((sum, e) => sum + e.amount, 0);
  const balance = totalReceived - totalGiven;
  const category = augmentedEvents.length > 0 ? getCategory(person, augmentedEvents[0].occasion) : 'General';

  const filteredEvents = augmentedEvents.filter(e => {
    if (activeTab === 'GIVING') return e.type === TransactionType.EXPENSE;
    if (activeTab === 'RECEIVING') return e.type === TransactionType.INCOME;
    return true;
  });

  const portrait = getProfileImage(person) || "1.jpeg";

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
      <div className="h-24 bg-[#951111] w-full flex items-center px-6 shadow-md z-20 shrink-0 border-b border-[#7a0e0e] relative">
        <button onClick={onBack} className="absolute right-6 text-white/80 hover:text-white hover:rotate-90 transition-all p-2">
          <X size={32} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col items-center lg:items-start space-y-6">
                    <div className="aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-xl shadow-2xl border-4 border-white/10 bg-[#fdfbf7] shrink-0 self-center lg:self-start">
                      <img src={portrait} alt={person} className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-white font-serif font-bold text-4xl tracking-wide leading-none drop-shadow-md">{person}</h1>
                    <div className="bg-[#a65d5d] rounded-2xl p-6 shadow-xl border border-white/10 text-white space-y-5">
                        <div className="text-center pb-2 border-b border-white/20">
                            <h3 className="font-serif font-bold text-lg text-white/90 tracking-widest uppercase">Summary</h3>
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
                                <span>Net</span>
                                <span className={balance >= 0 ? "text-yellow-300" : "text-white"}>
                                    {balance >= 0 ? '+' : ''} ¥{Math.abs(balance)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
                <div className="flex gap-4 p-1 bg-black/10 rounded-xl border border-white/5">
                    <button onClick={() => setActiveTab('GIVING')} className={`flex-1 py-4 rounded-lg font-bold uppercase tracking-widest transition-all ${activeTab === 'GIVING' ? 'bg-[#991b1b] text-white border-[#ef4444] border-2 shadow-lg' : 'text-white/60'}`}>GIVING</button>
                    <button onClick={() => setActiveTab('RECEIVING')} className={`flex-1 py-4 rounded-lg font-bold uppercase tracking-widest transition-all ${activeTab === 'RECEIVING' ? 'bg-[#b45309] text-gold-coin border-gold-coin border-2 shadow-lg' : 'text-white/60'}`}>RECEIVING</button>
                </div>

                <div className="space-y-4 h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-2">
                    {filteredEvents.map(event => (
                        <div key={event.id} className="bg-[#d9d9d9]/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg space-y-5">
                             <div className="space-y-4">
                                <Field label="Occasion" value={event.occasion} />
                                <Field label="Date" value={event.date} />
                                <Field label="Amount" value={`¥ ${event.amount}`} isMoney />
                             </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
