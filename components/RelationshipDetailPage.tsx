import React, { useState } from 'react';
import { ArrowLeft, MapPin, Gift, AlignLeft } from 'lucide-react';
import { GiftEvent, TransactionType } from '../types';
import { getCategory } from '../utils';

interface RelationshipDetailPageProps {
  person: string;
  events: GiftEvent[];
  onBack: () => void;
}

export const RelationshipDetailPage: React.FC<RelationshipDetailPageProps> = ({ person, events, onBack }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'GIVING' | 'RECEIVING'>('ALL');

  // Stats Calculation
  const totalGiven = events.filter(e => e.type === TransactionType.EXPENSE).reduce((sum, e) => sum + e.amount, 0);
  const totalReceived = events.filter(e => e.type === TransactionType.INCOME).reduce((sum, e) => sum + e.amount, 0);
  const balance = totalReceived - totalGiven;
  const category = events.length > 0 ? getCategory(person, events[0].occasion) : 'General';

  // Filter Events
  const filteredEvents = events.filter(e => {
    if (activeTab === 'GIVING') return e.type === TransactionType.EXPENSE;
    if (activeTab === 'RECEIVING') return e.type === TransactionType.INCOME;
    return true;
  });

  // Mock Realistic Images
  const getProfileImage = () => {
    if (category === 'Elders') return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"; 
    if (category === 'Core Family') return "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop"; 
    if (category === 'Workplace') return "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"; 
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"; 
  };

  const getEventImage = (index: number) => {
    const images = [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1529516548873-9ce57c8f155e?q=80&w=600&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=600&auto=format&fit=crop"
    ];
    return images[index % images.length];
  };

  // Helper Component for "Form Field" style card
  const Field = ({ label, value, isMoney = false }: { label: string, value: React.ReactNode, isMoney?: boolean }) => (
    <div className="border border-white/40 rounded-lg p-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
       {isMoney ? (
          <div className="text-white font-mono font-bold text-lg leading-none">{value}</div>
       ) : (
          <div className="text-white font-serif font-bold text-base leading-tight mb-1">{value}</div>
       )}
       <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">{label}</div>
    </div>
  );

  return (
    <div className="w-screen h-screen bg-[#B11414] flex flex-col relative overflow-hidden font-serif">
      
      {/* Header */}
      <div className="h-24 bg-[#951111] w-full flex items-center px-6 shadow-md z-20 shrink-0 border-b border-[#7a0e0e]">
        <button 
          onClick={onBack}
          className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform"/>
          <span className="font-serif font-bold text-lg tracking-wide">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* --- Column 1: Photos (3 cols) --- */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-start space-y-6">
                {/* Main Profile Photo - Resized smaller */}
                <div className="aspect-[3/4] w-48 lg:w-56 overflow-hidden rounded-xl shadow-2xl border-4 border-white/10 bg-[#fdfbf7] shrink-0">
                  <img 
                    src={getProfileImage()} 
                    alt={person} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Photo Slider (Horizontal Scroll) */}
                <div className="w-full max-w-[240px] lg:max-w-full">
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

            {/* --- Column 2: Identity & Summary (3 cols) --- */}
            <div className="lg:col-span-3 space-y-6">
                
                {/* Name Header */}
                <div className="flex items-center gap-4">
                    <h1 className="text-white font-serif font-bold text-3xl tracking-wide leading-none">{person}</h1>
                    {/* Red Envelopes Icon */}
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
                    
                    <div className="space-y-3 font-mono text-sm">
                        <div className="flex justify-between items-center text-yellow-300 font-bold">
                            <span>RECEIVING</span>
                            <span>+ ¥{totalReceived}</span>
                        </div>
                        <div className="flex justify-between items-center text-white/80">
                            <span>GIVING</span>
                            <span>- ¥{totalGiven}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-white/20 text-lg font-bold">
                            <span>Total</span>
                            <span className={balance >= 0 ? "text-yellow-300" : "text-white"}>
                                {balance >= 0 ? '+' : ''} ¥{Math.abs(balance)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Column 3: Transaction History (6 cols) --- */}
            <div className="lg:col-span-6 space-y-6">
                
                {/* Giving/Receiving Tabs */}
                <div className="flex gap-4">
                    <button 
                        onClick={() => setActiveTab('GIVING')}
                        className={`flex-1 py-3 rounded-lg font-bold font-serif uppercase tracking-widest shadow-lg transition-all ${
                            activeTab === 'GIVING' 
                                ? 'bg-[#3e2723] text-white scale-105 border border-[#5d4037]' 
                                : 'bg-[#3e2723]/40 text-white/50 hover:bg-[#3e2723]/60'
                        }`}
                    >
                        GIVING
                    </button>
                    <button 
                        onClick={() => setActiveTab('RECEIVING')}
                        className={`flex-1 py-3 rounded-lg font-bold font-serif uppercase tracking-widest shadow-lg transition-all ${
                            activeTab === 'RECEIVING' 
                                ? 'bg-[#b71c1c] text-white scale-105 border border-red-500' 
                                : 'bg-[#b71c1c]/40 text-white/50 hover:bg-[#b71c1c]/60'
                        }`}
                    >
                        RECEIVING
                    </button>
                </div>

                {/* Event List */}
                <div className="space-y-4">
                    {filteredEvents.map(event => (
                        <div 
                            key={event.id} 
                            className="bg-[#d9d9d9]/20 backdrop-blur-md border border-white/30 rounded-xl p-5 shadow-lg space-y-4"
                        >
                             <Field label={`Occasion ${events.indexOf(event) + 1}`} value={event.occasion} />
                             
                             <Field label="Date" value={event.date} />
                             
                             <Field label="Relation Type" value={category} />

                             <Field label="Gift Amount" value={`¥ ${event.amount}`} isMoney />
                             
                             {event.aiAnalysis && (
                                <div className="border border-white/40 rounded-lg p-3 bg-white/5 backdrop-blur-sm">
                                    <div className="text-white/90 font-serif italic text-sm leading-relaxed">
                                        "{event.aiAnalysis}"
                                    </div>
                                    <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold mt-1">
                                        Purpose / Message
                                    </div>
                                </div>
                             )}

                             {/* Bottom Decor */}
                             <div className="h-1 w-full bg-white/10 rounded-full mt-2"></div>
                        </div>
                    ))}

                    {filteredEvents.length === 0 && (
                        <div className="text-center text-white/40 py-10 font-serif italic border border-white/10 rounded-xl">
                            No records found in this category.
                        </div>
                    )}
                </div>

            </div>

         </div>
      </div>
    </div>
  );
};