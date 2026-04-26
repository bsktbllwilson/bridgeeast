export type PlaybookCategory =
  | 'all'
  | 'buying'
  | 'selling'
  | 'legal'
  | 'visa'
  | 'market-entry'
  | 'operations'
  | 'finance'

export type Playbook = {
  slug: string
  title: string
  excerpt: string
  category: Exclude<PlaybookCategory, 'all'>
  secondaryCategory?: Exclude<PlaybookCategory, 'all'>
  image: string
  readTime: string
}

export const PLAYBOOK_CATEGORY_LABELS: Record<PlaybookCategory, string> = {
  all: 'Read All',
  buying: 'Buying',
  selling: 'Selling',
  legal: 'Legal',
  visa: 'Visa & Immigration',
  'market-entry': 'Market Entry',
  operations: 'Operations',
  finance: 'Finance',
}

export const PLAYBOOK_CATEGORY_TAG: Record<Exclude<PlaybookCategory, 'all'>, string> = {
  buying: 'Buying',
  selling: 'Selling',
  legal: 'Legal',
  visa: 'Visa',
  'market-entry': 'Market Entry',
  operations: 'Operations',
  finance: 'Finance',
}

export const PLAYBOOKS: Playbook[] = [
  {
    slug: 'asian-fb-market-entry-guide',
    title: 'The Asian F&B Market Entry Guide to US',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'market-entry',
    image:
      'https://images.unsplash.com/photo-1581349481014-30c7b1b1cf65?auto=format&fit=crop&w=1200&q=80',
    readTime: '12 min read',
  },
  {
    slug: 'visa-eb5-e2-l1',
    title: 'Which Visa Works for Me? EB5, E-2, or L-1?',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'legal',
    secondaryCategory: 'visa',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    readTime: '9 min read',
  },
  {
    slug: 'sba-7a-loans',
    title: 'How to Use SBA 7(a) Loans to Buy Your First Restaurant',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'finance',
    image:
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80',
    readTime: '11 min read',
  },
  {
    slug: '30-point-due-diligence',
    title: '30-Point Due Diligence',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'buying',
    image:
      'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1200&q=80',
    readTime: '15 min read',
  },
  {
    slug: 'value-restaurant-before-selling',
    title: 'How To Value Your Restaurant Before Selling',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'selling',
    image:
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
    readTime: '10 min read',
  },
]
