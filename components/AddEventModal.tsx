import React, { useState } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';
import { TransactionType, GiftEvent } from '../types';
import { analyzeTransaction } from '../services/geminiService';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: GiftEvent) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [occasion, setOccasion] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person || !amount || !occasion) return;

    setIsAnalyzing(true);
    
    // Call Gemini to analyze the "deep meaning"
    const analysis = await analyzeTransaction(person, parseFloat(amount), type, occasion);

    const newEvent: GiftEvent = {
      id: Date.now().toString(),
      person,
      amount: parseFloat(amount),
      date,
      type,
      occasion,
      aiAnalysis: analysis
    };

    onAdd(newEvent);
    setIsAnalyzing(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setPerson('');
    setAmount('');
    setOccasion('');
    setType(TransactionType.EXPENSE);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#fdfbf7] w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-gray-300">
        <div className="bg-china-red p-4 flex justify-between items-center">
          <h2 className="text-white font-serif text-xl tracking-widest">
            {type === TransactionType.EXPENSE ? 'Sow Relations' : 'Harvest Debt'}
          </h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`p-3 rounded-lg border text-center transition-all ${
                type === TransactionType.EXPENSE 
                  ? 'bg-red-100 border-red-500 text-red-800 ring-2 ring-red-500' 
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              Give (Expense)
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`p-3 rounded-lg border text-center transition-all ${
                type === TransactionType.INCOME 
                  ? 'bg-yellow-100 border-yellow-500 text-yellow-800 ring-2 ring-yellow-500' 
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              Receive (Income)
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-china-red focus:border-transparent outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Person (Debtor/Creditor)</label>
            <input 
              type="text" 
              placeholder="e.g. Uncle Zhang, Boss Li"
              required
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-china-red focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
            <input 
              type="text" 
              placeholder="e.g. Wedding, Funeral, Promotion"
              required
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-china-red focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (¥)</label>
            <input 
              type="number" 
              placeholder="Amount calculated by emotion"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-china-red focus:border-transparent outline-none font-mono text-lg"
            />
          </div>

          <div className="pt-4">
             <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full bg-china-red text-white py-3 px-4 rounded-lg shadow-lg hover:bg-china-red-light transition-all flex items-center justify-center gap-2 font-serif text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" /> Calculating Social Impact...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-gold-coin" /> Record Transaction
                </>
              )}
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">
              Gemini AI will analyze the emotional debt ratio of this event.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
