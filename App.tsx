
import React, { useState, useMemo } from 'react';
import { Menu, Plus, Search } from 'lucide-react';
import { RedEnvelope } from './components/RedEnvelope';
import { AddEventModal } from './components/AddEventModal';
import { Navigation } from './components/Navigation';
import { EmotionalOverview } from './components/EmotionalOverview';
import { SearchDrawer } from './components/SearchDrawer';
import { RelationshipLedgerPage } from './components/RelationshipLedgerPage';
import { EmotionalFluctuationsPage } from './components/EmotionalFluctuationsPage';
import { RelationshipDetailPage } from './components/RelationshipDetailPage';
import { MOCK_EVENTS } from './constants';
import { GiftEvent, FilterState, Page } from './types';
import { getCategory } from './utils';

function App() {
  const [events, setEvents] = useState<GiftEvent[]>(MOCK_EVENTS);
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  
  // Detail Page State
  const [selectedPersonForDetail, setSelectedPersonForDetail] = useState<string | null>(null);
  
  // Home Page State
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  
  // Search State
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    occasions: [],
    relations: [],
    minAmount: 0,
    maxAmount: 10000,
    date: ''
  });

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // 1. Keyword match
      const lowerQ = filters.query.toLowerCase();
      const matchesQuery = !lowerQ || e.person.toLowerCase().includes(lowerQ) || e.occasion.toLowerCase().includes(lowerQ);

      // 2. Occasion match
      const matchesOccasion = filters.occasions.length === 0 || 
        filters.occasions.some(occ => {
           if (occ === 'Others') return true; // simplified "Others" logic
           return e.occasion.toLowerCase().includes(occ.toLowerCase());
        });

      // 3. Relation Type match
      const matchesRelation = filters.relations.length === 0 ||
        filters.relations.includes(getCategory(e.person, e.occasion));

      // 4. Amount match
      const matchesAmount = e.amount >= filters.minAmount && e.amount <= filters.maxAmount;

      // 5. Date match (Year-Month)
      const matchesDate = !filters.date || e.date.startsWith(filters.date);

      return matchesQuery && matchesOccasion && matchesRelation && matchesAmount && matchesDate;
    });
  }, [events, filters]);

  const displayEvents = filteredEvents.slice(0, 8); // Limit to 8 for the table size

  const handleAddEvent = (newEvent: GiftEvent) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setIsNavOpen(false);
  };
  
  const handleViewPersonDetails = (person: string) => {
    setSelectedPersonForDetail(person);
    setCurrentPage(Page.RELATIONSHIP_DETAIL);
  };

  // --- Router Logic ---
  
  // 1. Relationship Ledger Page
  if (currentPage === Page.RELATIONSHIP_LEDGER) {
    return (
      <RelationshipLedgerPage 
        events={events} 
        onBack={() => setCurrentPage(Page.HOME)} 
        onViewDetails={handleViewPersonDetails}
      />
    );
  }

  // 2. Relationship Detail Page
  if (currentPage === Page.RELATIONSHIP_DETAIL && selectedPersonForDetail) {
    return (
        <RelationshipDetailPage 
           person={selectedPersonForDetail}
           events={events.filter(e => e.person === selectedPersonForDetail)}
           onBack={() => setCurrentPage(Page.RELATIONSHIP_LEDGER)}
        />
    );
  }

  // 3. Emotional Fluctuations Page
  if (currentPage === Page.EMOTIONAL_FLUCTUATIONS) {
    return (
        <EmotionalFluctuationsPage 
            events={events}
            onBack={() => setCurrentPage(Page.HOME)}
        />
    );
  }

  // Fallback / Default: Render Home Page (Dining Table)
  return (
    <div className="relative w-screen h-screen bg-[#B11414] overflow-hidden font-serif">
      
      {/* --- Top Navigation Bar --- */}
      <div className="absolute top-0 left-0 w-full h-24 px-6 flex justify-between items-center z-40 bg-[#951111]">
        
        {/* Left: Hamburger Menu */}
        <button 
          onClick={() => setIsNavOpen(true)}
          className="text-white hover:opacity-80 transition-opacity"
        >
          <Menu size={42} strokeWidth={2.5} />
        </button>

        {/* Right: Search + Coin */}
        <div className="flex items-center gap-4">
          
          {/* Search Bar (Click to Open Drawer) */}
          <div 
             onClick={() => setIsSearchDrawerOpen(true)}
             className="bg-[#cc8b8b] h-12 rounded-full flex items-center pl-6 pr-1 shadow-sm w-72 relative cursor-pointer hover:bg-[#d69999] transition-colors"
          >
             <span className="text-[#8B2E2E] font-serif text-lg mr-2 select-none">Search</span>
             <input 
                type="text"
                readOnly
                value={filters.query}
                placeholder="Click to filter..."
                className="bg-transparent border-none outline-none w-full text-[#5c1818] placeholder-[#9c4848] font-serif cursor-pointer"
             />
             <button 
                onClick={(e) => { e.stopPropagation(); setIsAddModalOpen(true); }}
                className="w-10 h-10 bg-[#d11515] rounded-full flex items-center justify-center text-white hover:bg-[#ff3333] transition-colors shadow-sm ml-auto shrink-0 z-10"
              >
                <Plus size={20} strokeWidth={3} />
             </button>
          </div>

          {/* Gold Coin */}
          <button 
            onClick={() => setIsOverviewOpen(true)}
            className="w-12 h-12 rounded-full bg-[#FFD700] border-2 border-[#ffed4a] shadow-md flex items-center justify-center text-[#d11515] font-bold text-xl hover:scale-105 transition-transform"
          >
            ¥
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="w-full h-full flex items-center justify-center">
        
        {/* Table Container */}
        <div className="relative w-[480px] h-[480px] flex items-center justify-center mt-24">
           
           {/* The Grey Round Table */}
           <div className="absolute w-[480px] h-[480px] rounded-full bg-[#9E9689] shadow-[0_10px_30px_rgba(0,0,0,0.3)] z-10 flex items-center justify-center">
              
              {/* Center Red Button */}
              <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="z-30 w-16 h-16 rounded-full bg-[#d11515] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 group"
              >
                  <Plus size={32} strokeWidth={3} className="drop-shadow-sm group-hover:rotate-90 transition-transform duration-300"/>
              </button>

              {/* Items on Table */}
              {displayEvents.length === 0 ? (
                 <div className="text-white/50 text-sm font-serif absolute top-32">No events match filters.</div>
              ) : (
                displayEvents.map((event, index) => {
                  const total = Math.max(displayEvents.length, 6);
                  const angle = (index / total) * 360; 
                  return (
                    <RedEnvelope 
                      key={event.id}
                      event={event}
                      angle={angle}
                      isHovered={hoveredEventId === event.id}
                      onHover={setHoveredEventId}
                    />
                  );
                })
              )}
           </div>

           {/* Shadow under table */}
           <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full bg-black/20 blur-2xl -z-10"></div>
        </div>

      </div>

      {/* --- Drawers & Modals --- */}
      <Navigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} onNavigate={handleNavigate} />
      
      <EmotionalOverview 
        isOpen={isOverviewOpen} 
        onClose={() => setIsOverviewOpen(false)} 
        events={events} 
        onNavigateToDetails={() => {
            setIsOverviewOpen(false);
            handleNavigate(Page.EMOTIONAL_FLUCTUATIONS);
        }} 
      />
      
      <SearchDrawer 
        isOpen={isSearchDrawerOpen} 
        onClose={() => setIsSearchDrawerOpen(false)}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />

      <AddEventModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddEvent} />

    </div>
  );
}

export default App;
