export type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
};

export const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Meeting notes',
    body: 'Discuss roadmap for Q3, assign owners for the mobile cohort assignment, and follow up on design tokens.',
    updatedAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: '2',
    title: 'Grocery list',
    body: 'Milk, oats, berries, coffee beans, and something green for dinner.',
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: '3',
    title: 'Book ideas',
    body: 'A short chapter on responsive layouts in React Native, with examples using useWindowDimensions and sensible breakpoints.',
    updatedAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: '4',
    title: 'Weekend plan',
    body: 'Morning run, coffee with a friend, then block a few hours for polishing UI spacing and typography.',
    updatedAt: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: '5',
    title: 'App feedback',
    body: 'Keep cards airy, use clear hierarchy between title and preview, and make the editor comfortable for long-form writing.',
    updatedAt: Date.now() - 1000 * 60 * 8,
  },
];
