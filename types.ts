
export enum TransactionType {
  INCOME = 'INCOME', // Received (Harvesting relations)
  EXPENSE = 'EXPENSE', // Given (Sowing relations/Paying debt)
}

export enum Page {
  HOME = 'HOME',
  EMOTIONAL_FLUCTUATIONS = 'EMOTIONAL_FLUCTUATIONS',
  TIMELINE = 'TIMELINE',
  RELATIONSHIP_LEDGER = 'RELATIONSHIP_LEDGER',
  RELATIONSHIP_DETAIL = 'RELATIONSHIP_DETAIL',
  SETTINGS = 'SETTINGS'
}

export interface GiftEvent {
  id: string;
  person: string;
  amount: number;
  date: string;
  type: TransactionType;
  occasion: string; // e.g., Wedding, Funeral, New Year
  description?: string;
  aiAnalysis?: string; // The cynical sociological interpretation
}

export interface NavItem {
  label: string;
  icon: any;
  id: string;
}

export interface FilterState {
  query: string;
  occasions: string[];
  relations: string[];
  minAmount: number;
  maxAmount: number;
  date: string; // YYYY-MM-DD or YYYY-MM or empty
}
