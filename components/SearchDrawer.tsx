
import React, { useState } from 'react';
import { X, Search, Calendar, Users, Gift, Tag, RotateCcw, Check } from 'lucide-react';
import { FilterState } from '../types';
import { CATEGORIES, OCCASIONS } from '../utils';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  // Local state for the form before applying
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  const toggleOccasion = (occ: string) => {
    setLocalFilters(prev => {
      const exists = prev.occasions.includes(occ);
      return {
        ...prev,
        occasions: exists ? prev.occasions.filter(o => o !== occ) : [...prev.occasions, occ]
      };
    });
  };

  const toggleRelation = (rel: string) => {
    setLocalFilters(prev => {
      const exists = prev.relations.includes(rel);
      return {
        ...prev,
        relations: exists ? prev.relations.filter(r => r !== rel) : [...prev.relations, rel]
      };
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetState = {
      query: '',
      occasions: [],
      relations: [],
      minAmount: 0,
      maxAmount: 10000,
      date: ''
    };
    setLocalFilters(resetState);
    onApplyFilters(resetState); 
  };

  // --- Date Logic (English Dropdowns) ---
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5) + i); // 5 years back, 5 years forward
  const months = [
    { val: '01', label: 'Jan' }, { val: '02', label: 'Feb' }, { val: '03', label: 'Mar' },
    { val: '04', label: 'Apr' }, { val: '05', label: 'May' }, { val: '06', label: 'Jun' },
    { val: '07', label: 'Jul' }, { val: '08', label: 'Aug' }, { val: '09', label: 'Sep' },
    { val: '10', label: 'Oct' }, { val: '11', label: 'Nov' }, { val: '12', label: 'Dec' },
  ];

  const selectedYear = localFilters.date ? localFilters.date.split('-')[0] : '';
  const selectedMonth = localFilters.date ? localFilters.date.split('-')[1] : '';

  const handleDateChange = (type: 'year' | 'month', value: string) => {
    let y = selectedYear || currentYear.toString();
    let m = selectedMonth || '01';

    if (type === 'year') {
        if (!value) { setLocalFilters(prev => ({ ...prev, date: '' })); return; }
        y = value;
    }
    if (type === 'month') {
        if (!value) { setLocalFilters(prev => ({ ...prev, date: '' })); return; }
        m = value;
    }
    setLocalFilters(prev => ({ ...prev, date: `${y}-${m}` }));
  };

  // --- Dual Range Slider Logic ---
  const minVal = localFilters.minAmount;
  const maxVal = localFilters.maxAmount;
  const maxLimit = 10000;
  const priceGap = 500;

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>, isMin: boolean) => {
    const val = parseInt(e.target.value);
    if (isMin) {
        if (val <= maxVal - priceGap) {
            setLocalFilters(prev => ({ ...prev, minAmount: val }));
        }
    } else {
        if (val >= minVal + priceGap) {
            setLocalFilters(prev => ({ ...prev, maxAmount: val }));
        }
    }
  };

  // Percentage for track visuals
  const getPercent = (value: number) => Math.round((value / maxLimit) * 100);

  return (
    <>
      <style>{`
        .range-slider-input {
            pointer-events: none;
            position: absolute;
            height: 0;
            width: 100%;
            outline: none;
            z-index: 10;
        }
        .range-slider-input::-webkit-slider-thumb {
            pointer-events: all;
            width: 16px;
            height: 16px;
            -webkit-appearance: none;
            background-color: #FFD700;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            margin-top: -7px; /* Align vertical center with track */
        }
        .range-slider-input::-moz-range-thumb {
            pointer-events: all;
            width: 16px;
            height: 16px;
            background-color: #FFD700;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            border: none;
        }
      `}</style>

      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-gray-900/90 backdrop-blur-xl z-[70] shadow-2xl transform transition-transform duration-300 ease-out border-l border-white/10 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0 bg-[#8B0000]/50">
           <h2 className="text-xl font-serif font-bold text-white tracking-widest flex items-center gap-2">
             <Search size={22} className="text-gold-coin" /> Quick Search
           </h2>
           <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
             <X size={26} />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* 1. Keyword Search */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-gold-accent uppercase tracking-wider flex items-center gap-2">
                <Tag size={14} /> Keywords
             </label>
             <div className="relative">
                <input 
                  type="text" 
                  value={localFilters.query}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, query: e.target.value }))}
                  placeholder="Event name, person..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-gold-coin focus:ring-1 focus:ring-gold-coin transition-all font-serif"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
             </div>
          </div>

          {/* 2. Occasion (Categories) */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-gold-accent uppercase tracking-wider flex items-center gap-2">
                <Gift size={14} /> Occasion
             </label>
             <div className="grid grid-cols-2 gap-2">
                {OCCASIONS.map(occ => {
                  const isActive = localFilters.occasions.includes(occ);
                  return (
                    <button 
                      key={occ}
                      onClick={() => toggleOccasion(occ)}
                      className={`py-2 px-3 rounded text-sm font-medium transition-all text-left flex justify-between items-center ${
                        isActive 
                          ? 'bg-gold-coin text-[#8B0000] shadow-[0_0_10px_rgba(255,215,0,0.3)]' 
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {occ}
                      {isActive && <Check size={14} strokeWidth={3} />}
                    </button>
                  );
                })}
             </div>
          </div>

          {/* 3. Date Selection (Custom English Dropdowns) */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-gold-accent uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> Date
             </label>
             <div className="flex gap-4">
                <select 
                   value={selectedYear} 
                   onChange={(e) => handleDateChange('year', e.target.value)}
                   className="flex-1 bg-white/10 border border-white/20 rounded-lg py-3 px-3 text-white focus:outline-none focus:border-gold-coin font-mono cursor-pointer appearance-none"
                >
                   <option value="" className="bg-gray-800 text-gray-400">Year</option>
                   {years.map(y => (
                       <option key={y} value={y} className="bg-gray-800">{y}</option>
                   ))}
                </select>

                <select 
                   value={selectedMonth} 
                   onChange={(e) => handleDateChange('month', e.target.value)}
                   className="flex-1 bg-white/10 border border-white/20 rounded-lg py-3 px-3 text-white focus:outline-none focus:border-gold-coin font-mono cursor-pointer appearance-none"
                >
                   <option value="" className="bg-gray-800 text-gray-400">Month</option>
                   {months.map(m => (
                       <option key={m.val} value={m.val} className="bg-gray-800">{m.label}</option>
                   ))}
                </select>
             </div>
             <p className="text-[10px] text-gray-400">Filter timeline by Year and Month.</p>
          </div>

          {/* 4. Relation Type */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-gold-accent uppercase tracking-wider flex items-center gap-2">
                <Users size={14} /> Relation Type
             </label>
             <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => {
                   const isActive = localFilters.relations.includes(cat);
                   return (
                     <button 
                       key={cat}
                       onClick={() => toggleRelation(cat)}
                       className={`py-1.5 px-3 rounded-full text-xs font-bold border transition-all ${
                         isActive 
                           ? 'bg-[#d11515] border-[#d11515] text-white shadow-md' 
                           : 'bg-transparent border-white/20 text-gray-300 hover:border-white/50'
                       }`}
                     >
                       {cat}
                     </button>
                   );
                })}
             </div>
          </div>

           {/* 5. Gift Amount (Dual Range Slider) */}
           <div className="space-y-6">
             <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-gold-accent uppercase tracking-wider flex items-center gap-2">
                    Gift Amount
                </label>
                <span className="text-gold-coin font-mono font-bold text-sm">
                    ¥{minVal} - ¥{maxVal}{maxVal === 10000 ? '+' : ''}
                </span>
             </div>
             
             <div className="relative w-full h-8 flex items-center">
                 {/* Track Background */}
                 <div className="absolute w-full h-1.5 bg-white/20 rounded-full z-0"></div>
                 
                 {/* Active Track Range */}
                 <div 
                    className="absolute h-1.5 bg-gold-coin rounded-full z-0 opacity-80"
                    style={{
                        left: `${getPercent(minVal)}%`,
                        width: `${getPercent(maxVal) - getPercent(minVal)}%`
                    }}
                 ></div>

                 {/* Input Min */}
                 <input 
                   type="range" 
                   min="0" 
                   max={maxLimit} 
                   value={minVal}
                   onChange={(e) => handleRangeChange(e, true)}
                   className="range-slider-input appearance-none bg-transparent"
                 />
                 
                 {/* Input Max */}
                 <input 
                   type="range" 
                   min="0" 
                   max={maxLimit} 
                   value={maxVal}
                   onChange={(e) => handleRangeChange(e, false)}
                   className="range-slider-input appearance-none bg-transparent"
                 />
             </div>
             
             <div className="flex justify-between text-[10px] text-gray-400 font-mono -mt-2">
                <span>¥0</span>
                <span>¥5000</span>
                <span>¥10000+</span>
             </div>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-white/10 bg-[#8B0000]/30 shrink-0 flex gap-4">
            <button 
                onClick={handleReset}
                className="flex-1 py-3 rounded-lg border border-white/20 text-white font-serif hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
            >
                <RotateCcw size={16} /> Reset
            </button>
            <button 
                onClick={handleApply}
                className="flex-[2] py-3 rounded-lg bg-gold-coin text-[#8B0000] font-bold font-serif shadow-lg hover:bg-[#ffe033] hover:scale-[1.02] transition-all text-sm uppercase tracking-wide"
            >
                Search & Apply
            </button>
        </div>

      </div>
    </>
  );
};
