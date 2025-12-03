import React, { useState, useMemo } from 'react';
import { ArrowLeft, FolderOpen, ArrowDownCircle, ArrowUpCircle, ExternalLink } from 'lucide-react';
import { GiftEvent, TransactionType, Page } from '../types';

interface RelationshipLedgerPageProps {
  events: GiftEvent[];
  onBack: () => void;
  onViewDetails: (person: string) => void;
}

export const RelationshipLedgerPage: React.FC<RelationshipLedgerPageProps> = ({ events, onBack, onViewDetails }) => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  // Group events by Person
  const groupedData = useMemo(() => {
    const groups: Record<string, GiftEvent[]> = {};
    events.forEach(e => {
      if (!groups[e.person]) groups[e.person] = [];
      groups[e.person].push(e);
    });
    return groups;
  }, [events]);

  const people = Object.keys(groupedData).sort();

  return (
    <div className="w-screen h-screen bg-[#B11414] flex flex-col relative overflow-hidden">
      
      {/* Top Header */}
      <div className="h-24 bg-[#951111] w-full flex items-center px-6 shadow-md z-20 shrink-0 border-b border-[#7a0e0e]">
        <button 
          onClick={onBack}
          className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={28} />
          <span className="font-serif font-bold text-lg tracking-wide">Back to Table</span>
        </button>
        <h1 className="ml-auto text-gold-coin font-serif font-bold text-2xl tracking-widest flex items-center gap-3">
          <FolderOpen className="text-gold-coin" /> RELATIONSHIP LEDGER
        </h1>
      </div>

      {/* Main Content: The Archive Scene */}
      <div className="flex-1 flex items-center justify-center relative perspective-1000">
        
        {/* Detail Overlay (When a file is pulled) */}
        {selectedPerson && (
           <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setSelectedPerson(null)}>
              <div 
                className="bg-[#fdfbf7] w-full max-w-2xl h-[85%] rounded-sm shadow-2xl relative rotate-1 flex flex-col overflow-hidden paper-texture"
                onClick={(e) => e.stopPropagation()}
              >
                  {/* Paper Header */}
                  <div className="h-16 border-b-2 border-double border-gray-300 flex items-center justify-between px-8 bg-[#f5f1e6]">
                     <h2 className="font-serif font-bold text-2xl text-[#8B0000]">{selectedPerson}</h2>
                     <div className="text-sm font-mono text-gray-500">CONFIDENTIAL RECORD</div>
                  </div>

                  {/* Red Stamp */}
                  <div className="absolute top-4 right-20 w-24 h-24 border-4 border-red-700 rounded-full opacity-20 flex items-center justify-center -rotate-12 pointer-events-none">
                     <span className="text-red-700 font-bold text-xl uppercase">Renqing</span>
                  </div>

                  {/* Transaction List Summary (Preview) */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                     {groupedData[selectedPerson].slice(0, 5).map(event => (
                       <div key={event.id} className="flex gap-4 border-b border-gray-200 pb-4 items-start group hover:bg-black/5 p-2 rounded transition-colors">
                          <div className={`mt-1 ${event.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                             {event.type === TransactionType.INCOME ? <ArrowDownCircle /> : <ArrowUpCircle />}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-baseline mb-1">
                                <span className="font-bold text-gray-800 text-lg">{event.occasion}</span>
                                <span className={`font-mono font-bold text-lg ${event.type === TransactionType.INCOME ? 'text-green-700' : 'text-red-700'}`}>
                                   {event.type === TransactionType.INCOME ? '+' : '-'}¥{event.amount}
                                </span>
                             </div>
                             <div className="text-sm text-gray-500 mb-2">{event.date}</div>
                          </div>
                       </div>
                     ))}
                     {groupedData[selectedPerson].length > 5 && (
                        <div className="text-center text-gray-400 italic text-sm py-2">
                           ... {groupedData[selectedPerson].length - 5} more records ...
                        </div>
                     )}
                  </div>
                  
                  {/* Paper Footer with View More Button */}
                  <div className="p-6 bg-[#f5f1e6] border-t border-gray-300 flex items-center justify-center gap-4">
                     <button 
                        onClick={() => onViewDetails(selectedPerson)}
                        className="bg-[#8B0000] text-gold-coin font-bold font-serif px-8 py-3 rounded shadow-lg hover:bg-[#a61e1e] hover:scale-105 transition-all flex items-center gap-2 uppercase tracking-widest text-sm"
                     >
                        View Full Profile (查看更多) <ExternalLink size={16} />
                     </button>
                  </div>
              </div>
           </div>
        )}

        {/* The Archive Drawer */}
        <div className="relative w-[600px] h-[300px] mt-40">
           
           {/* Back of Drawer */}
           <div className="absolute bottom-0 left-4 w-[570px] h-[200px] bg-[#3e2723] rounded-t-lg z-0 transform translate-z-[-20px] shadow-inner"></div>

           {/* Files Container */}
           <div className="absolute bottom-[20px] left-[30px] w-[540px] flex items-end justify-center space-x-[-80px] z-10 perspective-500">
              {people.map((person, index) => {
                 const isSelected = selectedPerson === person;
                 // Dynamic styling for randomizing folder appearance slightly
                 const rotation = (index % 5 - 2) * 2; 
                 const zIndex = isSelected ? 100 : index + 1;
                 
                 return (
                    <div 
                      key={person}
                      onClick={() => setSelectedPerson(person)}
                      className={`
                        relative w-[240px] h-[180px] bg-[#f0e6d2] rounded-t-lg shadow-[-5px_0_15px_rgba(0,0,0,0.2)] 
                        border-t border-l border-white/50 cursor-pointer transition-all duration-500 ease-out
                        hover:-translate-y-10 hover:z-50
                        ${isSelected ? '-translate-y-[100px] scale-105 shadow-2xl' : ''}
                      `}
                      style={{
                         zIndex: zIndex,
                         transform: isSelected ? 'translateY(-150px) scale(1.1)' : `rotate(${rotation}deg)`,
                         backgroundColor: index % 2 === 0 ? '#f3e5ab' : '#ebe2cd' // Alternating folder colors
                      }}
                    >
                       {/* Tab */}
                       <div className="absolute -top-8 left-0 w-24 h-8 bg-[#e6d5ac] rounded-t-lg border-t border-l border-white/40 flex items-center justify-center shadow-sm">
                          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest truncate px-1">
                             {person.slice(0, 8)}
                          </span>
                       </div>
                       
                       {/* Folder Content Preview (Lines) */}
                       <div className="p-6 opacity-30">
                          <div className="w-full h-2 bg-gray-400/20 mb-3 rounded"></div>
                          <div className="w-2/3 h-2 bg-gray-400/20 mb-3 rounded"></div>
                          <div className="w-4/5 h-2 bg-gray-400/20 rounded"></div>
                       </div>

                       {/* Label on Folder Body */}
                       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/80 px-4 py-2 shadow-sm rounded rotate-1 border border-gray-200">
                          <span className="font-serif font-bold text-[#5d4037] whitespace-nowrap">{person}</span>
                       </div>
                    </div>
                 );
              })}
           </div>

           {/* Front of Drawer (Wood Texture) */}
           <div className="absolute bottom-0 w-full h-[140px] bg-[#5d4037] rounded-b-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-40 flex items-center justify-center border-t-4 border-[#3e2723]">
              {/* Wood Grain Effect (CSS Gradient) */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%,#000_100%)] bg-[length:20px_20px]"></div>
              
              {/* Metal Handle Label */}
              <div className="relative w-40 h-20 bg-[#a1887f] rounded border-4 border-[#8d6e63] shadow-lg flex items-center justify-center">
                 <div className="w-[90%] h-[80%] bg-[#f5f5f5] shadow-inner flex items-center justify-center">
                    <span className="font-serif font-bold text-[#3e2723] tracking-widest text-lg">ARCHIVES</span>
                 </div>
                 {/* Handle Bar */}
                 <div className="absolute -bottom-6 w-32 h-4 bg-[#bdbdbd] rounded-full shadow-md border-b-2 border-gray-500"></div>
                 <div className="absolute -bottom-6 left-2 w-1 h-6 bg-[#9e9e9e]"></div>
                 <div className="absolute -bottom-6 right-2 w-1 h-6 bg-[#9e9e9e]"></div>
              </div>
           </div>
           
           {/* Side depth (Fake 3D) */}
           <div className="absolute bottom-[20px] -right-[20px] w-[20px] h-[120px] bg-[#3e2723] skew-y-[45deg] z-30 brightness-75 rounded-br"></div>
           <div className="absolute bottom-[20px] -left-[20px] w-[20px] h-[120px] bg-[#3e2723] -skew-y-[45deg] z-30 brightness-75 rounded-bl"></div>

        </div>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .perspective-500 { perspective: 500px; }
        .paper-texture {
           background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};