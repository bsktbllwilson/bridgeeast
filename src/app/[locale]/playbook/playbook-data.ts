export interface PlaybookPost {
  id: string
  title: string
  slug: string
  category: string
  phase: string
  content: string
  published: boolean
  created_at?: string
  updated_at?: string
}

export const PLAYBOOK_FALLBACK_POSTS: PlaybookPost[] = [
  {
    id: '1',
    title: 'Entity Setup & Visa Strategy',
    slug: 'entity-visa-setup',
    category: 'Visa & Legal',
    phase: 'Pre-Launch',
    content:
      '<h2>Choose Your Business Entity</h2><p>The first critical decision is selecting the right business structure. For F&B market entry, founders typically choose between an LLC or C-Corporation.</p><h3>Limited Liability Company (LLC)</h3><p>Best for: Most first-time F&B operators. LLCs provide liability protection, flexible taxation, and simpler administration.</p>',
    published: true,
  },
  {
    id: '2',
    title: 'Health Department Permits',
    slug: 'health-permits',
    category: 'Permits & Licensing',
    phase: 'Pre-Launch',
    content:
      '<h2>Food Service Establishment Permit</h2><p>The local Department of Health and Mental Hygiene (DOHMH) requires all food service establishments to obtain a permit before opening.</p><h3>Application Process</h3><ol><li>Complete online application through the DOHMH portal</li><li>Submit floor plan and equipment specifications</li><li>Pass pre-operational inspection</li></ol>',
    published: true,
  },
  {
    id: '3',
    title: 'Lease Negotiation Playbook for F&B',
    slug: 'lease-negotiation',
    category: 'Real Estate',
    phase: 'Pre-Launch',
    content:
      '<h2>Understanding Commercial Leases</h2><p>Commercial leases are complex and long-term commitments. Understanding key terms is crucial for restaurant success.</p><h3>Key Lease Terms</h3><ul><li><strong>Base Rent:</strong> Fixed monthly payment</li><li><strong>Additional Rent:</strong> Percentage of gross sales</li></ul>',
    published: true,
  },
  {
    id: '4',
    title: 'Hiring & Labor Law Compliance',
    slug: 'hiring-labor',
    category: 'Operations',
    phase: 'Launch',
    content:
      '<h2>Labor Laws Overview</h2><p>Many U.S. markets have employee-friendly labor laws. Understanding and complying with these regulations is essential.</p><h3>Minimum Wage</h3><p>Local minimum wage requirements vary by market and employer size.</p>',
    published: true,
  },
  {
    id: '5',
    title: 'Specialty Ingredient Sourcing',
    slug: 'ingredient-sourcing',
    category: 'Operations',
    phase: 'Launch',
    content:
      '<h2>Food Distribution Landscape</h2><p>Major U.S. markets have robust networks of food distributors and specialty suppliers serving the restaurant industry.</p><h3>Major Distributors</h3><ul><li><strong>Sysco:</strong> Full-service distribution</li><li><strong>US Foods:</strong> Restaurant-focused</li></ul>',
    published: true,
  },
  {
    id: '6',
    title: 'Brand Name Localization Strategy',
    slug: 'localization',
    category: 'Marketing',
    phase: 'Pre-Launch',
    content:
      '<h2>Understanding Cultural Context</h2><p>Successful brand localization requires understanding both your home market and the local market context.</p><h3>Brand Name Considerations</h3><ul><li><strong>Pronunciation:</strong> Ensure name is easy for English speakers</li><li><strong>Meaning:</strong> Consider cultural connotations</li></ul>',
    published: true,
  },
]

export const PLAYBOOK_CATEGORIES = [
  'Read All',
  'Visa & Legal',
  'Permits & Licensing',
  'Real Estate',
  'Operations',
  'Marketing',
] as const

const HTML_TAG = /<[^>]*>/g

export function stripHtml(html: string): string {
  return html.replace(HTML_TAG, ' ').replace(/\s+/g, ' ').trim()
}

export function buildExcerpt(content: string, length = 180): string {
  const text = stripHtml(content)
  if (text.length <= length) return text
  return `${text.substring(0, length).trimEnd()}…`
}

const COVER_GRADIENTS = [
  'linear-gradient(135deg,#FCE16E 0%,#D85A30 100%)',
  'linear-gradient(135deg,#1f2937 0%,#374151 100%)',
  'linear-gradient(135deg,#FAF7EE 0%,#FCE16E 100%)',
  'linear-gradient(135deg,#D85A30 0%,#7C2D12 100%)',
  'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
  'linear-gradient(135deg,#FCE16E 0%,#FAF7EE 100%)',
]

export function coverGradientFor(slug: string): string {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0
  }
  const idx = Math.abs(hash) % COVER_GRADIENTS.length
  return COVER_GRADIENTS[idx]
}
