
export const CATEGORIES = [
  'Core Family',
  'Close Friends',
  'Workplace',
  'Elders',
  'General',
  'Special'
];

export const OCCASIONS = [
  'Wedding',
  'Party',
  'Housewarming',
  'Child Birth',
  'Business',
  'Others'
];

// Helper to categorize people based on name or occasion keywords
export const getCategory = (name: string, occasion: string): string => {
  const n = name.toLowerCase();
  const o = occasion.toLowerCase();
  
  if (n.includes('dad') || n.includes('mom') || n.includes('spouse') || n.includes('child') || n.includes('nephew') || n.includes('cousin') || n.includes('li')) return 'Core Family';
  if (n.includes('boss') || n.includes('colleague') || n.includes('manager') || o.includes('work') || o.includes('lunch') || o.includes('business')) return 'Workplace';
  if (n.includes('aunt') || n.includes('uncle') || n.includes('grand') || n.includes('mentor') || n.includes('zhang')) return 'Elders';
  if (n.includes('friend') || n.includes('classmate') || n.includes('bestie')) return 'Close Friends';
  if (o.includes('bribe') || o.includes('secret') || o.includes('vip')) return 'Special';
  return 'General'; // Default to General Social Acquaintances
};
