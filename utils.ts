
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

/**
 * Maps person names to the 6 local images provided in the root directory.
 * Based on user requested mapping.
 */
export const getProfileImage = (person: string): string | null => {
  const p = person.toLowerCase();
  if (!p) return null;

  if (p.includes('zhang') || p.includes('auntie')) return "1.jpeg";
  if (p.includes('wang') || p.includes('boss')) return "2.png";
  if (p.includes('jen') || p.includes('colleague')) return "3.png";
  if (p.includes('li') || p.includes('cousin')) return "4.png";
  if (p.includes('nephew')) return "5.png";
  if (p.includes('classmate')) return "6.png";
  
  return null;
};
