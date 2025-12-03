import { GiftEvent, TransactionType } from './types';

export const MOCK_EVENTS: GiftEvent[] = [
  {
    id: '1',
    person: 'Cousin Li',
    amount: 1000,
    date: '2023-10-01',
    type: TransactionType.EXPENSE,
    occasion: 'Wedding',
    aiAnalysis: 'A substantial sum to purchase silence regarding your own unmarried status.'
  },
  {
    id: '2',
    person: 'Boss Wang',
    amount: 2000,
    date: '2024-02-09',
    type: TransactionType.EXPENSE,
    occasion: 'New Year',
    aiAnalysis: 'Career insurance premium paid in full.'
  },
  {
    id: '3',
    person: 'Auntie Zhang',
    amount: 500,
    date: '2024-02-12',
    type: TransactionType.INCOME,
    occasion: 'Red Packet',
    aiAnalysis: 'A small rebate on the emotional toll of family interrogation.'
  },
  {
    id: '4',
    person: 'Old Classmate',
    amount: 600,
    date: '2024-05-20',
    type: TransactionType.EXPENSE,
    occasion: 'Child Birth',
    aiAnalysis: 'The price of maintaining a loose connection with a past version of yourself.'
  },
  {
    id: '5',
    person: 'Colleague Jen',
    amount: 200,
    date: '2024-06-01',
    type: TransactionType.INCOME,
    occasion: 'Group Lunch',
    aiAnalysis: 'Micro-transaction to sustain workplace harmony.'
  },
  {
    id: '6',
    person: 'Nephew',
    amount: 800,
    date: '2024-02-10',
    type: TransactionType.EXPENSE,
    occasion: 'New Year',
    aiAnalysis: 'Wealth redistribution to the younger generation to maintain patriarchal authority.'
  }
];
