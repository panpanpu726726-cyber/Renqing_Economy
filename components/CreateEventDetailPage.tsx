
import React, { useState } from 'react';
import { ArrowLeft, Upload, Save, Loader2, ImagePlus, Plus, X } from 'lucide-react';
import { GiftEvent, TransactionType } from '../types';
import { CATEGORIES, OCCASIONS } from '../utils';
import { analyzeTransaction } from '../services/geminiService';

interface CreateEventDetailPageProps {
  initialData?: Partial<GiftEvent>;
  onBack: () => void;
  onSave: (event: GiftEvent) => void;
}

export const CreateEventDetailPage: React.FC<CreateEventDetailPageProps> = ({ initialData, onBack, onSave }) => {
  const [person, setPerson] = useState(initialData?.person || '');
  const [amount, setAmount] = useState<string>(initialData?.amount ? initialData.amount.toString() : '');
  const [occasion, setOccasion] = useState(initialData?.occasion || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [relationType, setRelationType] = useState(initialData?.description || ''); // Using description field for relation type temp
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<TransactionType>(initialData?.type || TransactionType.EXPENSE);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!person || !amount || !occasion) {
        alert("Please fill in Name, Amount and Occasion.");
        return;
    }

    setIsSaving(true);
    // Simulate AI analysis or just save
    const analysis = await analyzeTransaction(person, parseFloat(amount), activeTab, occasion);
    
    const newEvent: GiftEvent = {
        id: Date.now().toString(),
        person,
        amount: parseFloat(amount),
        date,
        type: activeTab,
        occasion,
        description: relationType,
        aiAnalysis: analysis + (message ? ` Note: ${message}` : '')
    };

    onSave(newEvent);
    setIsSaving(false);
  };

  // Helper Input Field Component
  const InputField = ({ label, value, onChange, placeholder, type = "text", isSelect = false, options = [] }: any) => (
    <fieldset className="border-[2px] border-white/80 rounded-lg px-4 pb-3 pt-1 bg-transparent hover:bg-white/5 transition-colors group w-full relative">
       <legend className="text-xs text-white px-2 font-bold tracking-wider ml-1">
          {label}
       </legend>
       <div className="-mt-1">
           {isSelect ? (
                <select 
                    value={value} 
                    onChange={onChange}
                    className="w-full bg-transparent text-white font-serif font-bold text-lg border-none outline-none appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#8B0000] text-gray-300">Select...</option>
                    {options.map((opt: string) => (
                        <option key={opt} value={opt} className="bg-[#8B0000] text-white">{opt}</option>
                    ))}
                </select>
           ) : (
               <input 
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent text-white font-serif font-bold text-lg leading-tight border-none outline-none placeholder-white/30"
               />
           )}
       </div>
    </fieldset>
  );

  return (
    <div className="w-screen h-screen bg-[#B11414] flex flex-col relative overflow-hidden font-serif">
      
      {/* --- Standard Header (Matching RelationshipDetailPage) --- */}
      <div className="h-24 bg-[#951111] w-full flex items-center px-6 shadow-md z-20 shrink-0 border-b border-[#7a0e0e] relative">
        <h1 className="text-gold-coin font-serif font-bold text-2xl tracking-widest flex items-center gap-3">
          <Plus className="text-gold-coin" /> NEW EVENT
        </h1>

        {/* Close Button - Top Right */}
        <button 
          onClick={onBack}
          className="absolute right-6 text-white/80 hover:text-white hover:rotate-90 transition-all p-2"
        >
          <X size={32} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative z-10">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* --- Left Half: Photos (Cols 1-6) --- */}
            <div className="lg:col-span-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. Profile Photo & Slider */}
                <div className="flex flex-col items-center lg:items-start space-y-6">
                    {/* Main Profile Photo Placeholder */}
                    <div className="aspect-[3/4] w-full max-w-[220px] rounded-xl shadow-2xl border-4 border-white/10 bg-[#fdfbf7] shrink-0 self-center lg:self-start flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors group relative overflow-hidden">
                       <Upload className="text-gray-300 group-hover:text-[#8B0000] transition-colors mb-2" size={48} />
                       <span className="text-gray-400 text-xs font-bold uppercase tracking-widest group-hover:text-[#8B0000]">Upload Portrait</span>
                    </div>
                    
                    {/* Event Photos Placeholder */}
                    <div className="w-full max-w-[260px] lg:max-w-full self-center lg:self-start">
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Add Event Memories</p>
                        <div className="flex gap-3 overflow-x-auto pb-4 snap-x custom-scrollbar">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="shrink-0 w-24 h-32 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/50 hover:bg-white/5 transition-all">
                                    <ImagePlus className="text-white/30" />
                                </div>
                            ))}
                        </div>
                     </div>
                </div>

                {/* 2. Identity & Summary Card (Projected) */}
                <div className="space-y-6">
                    {/* Name Input Area */}
                    <div className="space-y-2">
                        <label className="text-white/50 text-xs font-bold uppercase tracking-wider">Person / Entity</label>
                        <input 
                            type="text"
                            value={person}
                            onChange={(e) => setPerson(e.target.value)}
                            placeholder="Name..."
                            className="w-full bg-transparent border-b-2 border-white/30 text-white font-serif font-bold text-4xl tracking-wide leading-none py-2 focus:outline-none focus:border-gold-coin placeholder-white/20"
                        />
                    </div>

                    {/* Projected Summary Card (Static for Create Mode) */}
                    <div className="bg-[#a65d5d] rounded-2xl p-6 shadow-xl border border-white/10 text-white space-y-5 opacity-80 cursor-not-allowed">
                        <div className="text-center pb-2 border-b border-white/20">
                            <h3 className="font-serif font-bold text-lg text-white/90 tracking-widest">
                                PROJECTED IMPACT
                            </h3>
                        </div>
                        
                        <div className="space-y-4 font-mono text-sm">
                            <div className="flex justify-between items-center text-white/50 bg-black/10 p-2 rounded">
                                <span>RECEIVING</span>
                                <span>---</span>
                            </div>
                            <div className="flex justify-between items-center text-white/50 bg-black/10 p-2 rounded">
                                <span>GIVING</span>
                                <span>---</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-white/20 text-xl font-bold text-white/50">
                                <span>Total</span>
                                <span>---</span>
                            </div>
                        </div>
                         <div className="text-center mt-2 text-xs text-white/40 italic">
                             Summary available after saving.
                         </div>
                    </div>
                </div>
            </div>

            {/* --- Right Half: Form Inputs (Cols 7-12) --- */}
            <div className="lg:col-span-6 space-y-6">
                
                {/* Giving/Receiving Tabs */}
                <div className="flex gap-4 p-1 bg-black/10 rounded-xl border border-white/5">
                    <button 
                        onClick={() => setActiveTab(TransactionType.EXPENSE)}
                        className={`flex-1 py-4 rounded-lg font-bold font-serif uppercase tracking-widest transition-all duration-300 border-2 ${
                            activeTab === TransactionType.EXPENSE
                                ? 'bg-[#991b1b] text-white border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-[1.02]' 
                                : 'bg-transparent text-white/60 border-transparent hover:bg-white/5 hover:border-white/5'
                        }`}
                    >
                        GIVING
                    </button>
                    <button 
                        onClick={() => setActiveTab(TransactionType.INCOME)}
                        className={`flex-1 py-4 rounded-lg font-bold font-serif uppercase tracking-widest transition-all duration-300 border-2 ${
                            activeTab === TransactionType.INCOME
                                ? 'bg-[#b45309] text-[#FFD700] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.5)] scale-[1.02]' 
                                : 'bg-transparent text-white/60 border-transparent hover:bg-white/5 hover:border-white/5'
                        }`}
                    >
                        RECEIVING
                    </button>
                </div>

                {/* Input Fields Stack */}
                <div className="bg-[#d9d9d9]/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    
                    <InputField 
                        label="Occasion Type" 
                        value={occasion} 
                        onChange={(e: any) => setOccasion(e.target.value)}
                        isSelect
                        options={OCCASIONS}
                    />

                    <InputField 
                        label="Date" 
                        value={date} 
                        onChange={(e: any) => setDate(e.target.value)}
                        type="date"
                    />

                    <InputField 
                        label="Relation Type" 
                        value={relationType} 
                        onChange={(e: any) => setRelationType(e.target.value)}
                        isSelect
                        options={CATEGORIES}
                    />

                    <InputField 
                        label="Gift Amount (¥)" 
                        value={amount} 
                        onChange={(e: any) => setAmount(e.target.value)}
                        placeholder="888"
                        type="number"
                    />

                    <fieldset className="border-[2px] border-white/80 rounded-lg px-4 pb-3 pt-1 bg-transparent hover:bg-white/5 transition-colors group w-full relative">
                        <legend className="text-xs text-white px-2 font-bold tracking-wider ml-1">
                            Remarks / Message
                        </legend>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Add supplementary information..."
                            rows={3}
                            className="w-full bg-transparent text-white font-serif text-base leading-tight border-none outline-none placeholder-white/30 resize-none -mt-1"
                        />
                    </fieldset>

                </div>

                {/* Save Button */}
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-4 bg-gold-coin text-[#8B0000] font-bold font-serif text-lg uppercase tracking-widest rounded-xl shadow-lg hover:bg-yellow-400 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                    Save Event
                </button>

            </div>

         </div>
      </div>
    </div>
  );
};
