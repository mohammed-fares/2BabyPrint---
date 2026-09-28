import { ClipartItem } from '../types';

export const CLIPART_CATEGORIES = [
  { id: 'birthdays', name: 'أعياد الميلاد', icon: 'PartyPopper' },
  { id: 'animals', name: 'حيوانات لطيفة', icon: 'PawPrint' },
  { id: 'crowns', name: 'تيجان ونجوم', icon: 'Crown' },
  { id: 'baby_shower', name: 'السبوع والمواليد', icon: 'Baby' },
  { id: 'quotes', name: 'عبارات مرحة', icon: 'Sparkles' },
  { id: 'eid_ramadan', name: 'رمضان والأعياد', icon: 'Moon' },
] as const;

export const CLIPARTS: ClipartItem[] = [
  // 1. Birthdays
  {
    id: 'bday-cake',
    name: 'كعكة عيد الميلاد',
    category: 'birthdays',
    categoryLabel: 'أعياد الميلاد',
    defaultFill: '#F59E0B',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 70h60v20a4 4 0 01-4 4H24a4 4 0 01-4-4V70z" fill="#FDE68A" fill-opacity="0.4"/>
      <path d="M26 48h48v22H26V48z" fill="#FBCFE8" fill-opacity="0.4"/>
      <path d="M32 32h36v16H32V32z" fill="#BAE6FD" fill-opacity="0.4"/>
      <path d="M50 16v16M42 22l8-6 8 6"/>
      <circle cx="50" cy="14" r="3" fill="#EF4444" stroke="#EF4444"/>
      <path d="M20 70c4-4 8 4 12 0s8-4 12 0 8-4 12 0 8-4 12 0 8-4 12 0"/>
      <path d="M26 48c4-3 8 3 12 0s8-3 12 0 8-3 12 0 8-3 12 0"/>
    </svg>`,
  },
  {
    id: 'bday-balloons',
    name: 'بالونات الاحتفال',
    category: 'birthdays',
    categoryLabel: 'أعياد الميلاد',
    defaultFill: '#EC4899',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="40" cy="36" rx="18" ry="22" fill="#F472B6" fill-opacity="0.35"/>
      <ellipse cx="62" cy="40" rx="16" ry="20" fill="#60A5FA" fill-opacity="0.35"/>
      <polygon points="40,58 37,63 43,63" fill="currentColor"/>
      <polygon points="62,60 59,65 65,65" fill="currentColor"/>
      <path d="M40 63c2 8-5 18 8 28"/>
      <path d="M62 65c-3 8 4 16-6 26"/>
      <circle cx="34" cy="30" r="3" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: 'bday-one',
    name: 'رقم 1 المتوج',
    category: 'birthdays',
    categoryLabel: 'أعياد الميلاد',
    defaultFill: '#D97706',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M42 38l10-8v46h-6m6 0h12" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M38 76h28" stroke-width="4"/>
      <path d="M40 22l6-8 6 5 6-5 6 8-12 3-12-3z" fill="#F59E0B" stroke="#D97706" stroke-width="2"/>
      <circle cx="46" cy="14" r="1.5" fill="#EF4444"/>
      <circle cx="52" cy="19" r="1.5" fill="#3B82F6"/>
      <circle cx="58" cy="14" r="1.5" fill="#10B981"/>
    </svg>`,
  },
  {
    id: 'bday-hat',
    name: 'طاقية الاحتفال',
    category: 'birthdays',
    categoryLabel: 'أعياد الميلاد',
    defaultFill: '#8B5CF6',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="50,20 25,78 75,78" fill="#DDD6FE" fill-opacity="0.4"/>
      <circle cx="50" cy="16" r="5" fill="#F59E0B"/>
      <path d="M32 62l36-24M38 72l32-20"/>
      <circle cx="50" cy="50" r="3" fill="#EC4899"/>
      <circle cx="42" cy="65" r="2.5" fill="#3B82F6"/>
      <circle cx="60" cy="68" r="2.5" fill="#10B981"/>
    </svg>`,
  },

  // 2. Cute Animals
  {
    id: 'anim-bear',
    name: 'دبدوب لطيف',
    category: 'animals',
    categoryLabel: 'حيوانات لطيفة',
    defaultFill: '#B45309',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="54" r="28" fill="#FDE68A" fill-opacity="0.3"/>
      <circle cx="30" cy="32" r="11" fill="#FDE68A" fill-opacity="0.4"/>
      <circle cx="70" cy="32" r="11" fill="#FDE68A" fill-opacity="0.4"/>
      <circle cx="30" cy="32" r="6" fill="#F472B6" fill-opacity="0.5"/>
      <circle cx="70" cy="32" r="6" fill="#F472B6" fill-opacity="0.5"/>
      <circle cx="41" cy="50" r="3" fill="currentColor"/>
      <circle cx="59" cy="50" r="3" fill="currentColor"/>
      <ellipse cx="50" cy="62" rx="10" ry="7" fill="#FFFFFF"/>
      <ellipse cx="50" cy="59" rx="4" ry="2.5" fill="currentColor"/>
      <path d="M50 62v4m-3 0a3 3 0 006 0"/>
      <circle cx="35" cy="58" r="3" fill="#F472B6" fill-opacity="0.6"/>
      <circle cx="65" cy="58" r="3" fill="#F472B6" fill-opacity="0.6"/>
    </svg>`,
  },
  {
    id: 'anim-lion',
    name: 'شبل الغابة الصغير',
    category: 'animals',
    categoryLabel: 'حيوانات لطيفة',
    defaultFill: '#EA580C',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="50" r="30" fill="#FED7AA" fill-opacity="0.6" stroke="#FB923C" stroke-width="3" stroke-dasharray="3 4"/>
      <circle cx="50" cy="50" r="22" fill="#FEF08A"/>
      <circle cx="42" cy="46" r="3" fill="currentColor"/>
      <circle cx="58" cy="46" r="3" fill="currentColor"/>
      <ellipse cx="50" cy="56" rx="4" ry="3" fill="#7C2D12"/>
      <path d="M50 59v3m-3-1a3 3 0 006 0"/>
      <path d="M34 56h-6m38 0h6"/>
      <circle cx="38" cy="54" r="2" fill="#F87171" fill-opacity="0.6"/>
      <circle cx="62" cy="54" r="2" fill="#F87171" fill-opacity="0.6"/>
    </svg>`,
  },
  {
    id: 'anim-bunny',
    name: 'أرنوب السكر',
    category: 'animals',
    categoryLabel: 'حيوانات لطيفة',
    defaultFill: '#EC4899',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="38" cy="28" rx="8" ry="20" fill="#FCE7F3"/>
      <ellipse cx="62" cy="28" rx="8" ry="20" fill="#FCE7F3"/>
      <ellipse cx="38" cy="30" rx="4" ry="14" fill="#F472B6" fill-opacity="0.5"/>
      <ellipse cx="62" cy="30" rx="4" ry="14" fill="#F472B6" fill-opacity="0.5"/>
      <circle cx="50" cy="62" r="24" fill="#FFFFFF"/>
      <circle cx="43" cy="58" r="2.5" fill="currentColor"/>
      <circle cx="57" cy="58" r="2.5" fill="currentColor"/>
      <polygon points="50,65 47,62 53,62" fill="#F43F5E"/>
      <path d="M50 65v3m-3 0a3 3 0 006 0"/>
      <circle cx="36" cy="66" r="3" fill="#FB7185" fill-opacity="0.5"/>
      <circle cx="64" cy="66" r="3" fill="#FB7185" fill-opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'anim-elephant',
    name: 'فيل صغير مرح',
    category: 'animals',
    categoryLabel: 'حيوانات لطيفة',
    defaultFill: '#0284C7',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="50" r="26" fill="#E0F2FE"/>
      <ellipse cx="26" cy="46" rx="12" ry="16" fill="#BAE6FD" fill-opacity="0.5"/>
      <ellipse cx="74" cy="46" rx="12" ry="16" fill="#BAE6FD" fill-opacity="0.5"/>
      <circle cx="42" cy="46" r="2.5" fill="currentColor"/>
      <circle cx="58" cy="46" r="2.5" fill="currentColor"/>
      <path d="M50 52c0 8 4 14 10 14 3 0 5-2 5-5" stroke-width="3"/>
      <circle cx="36" cy="56" r="2.5" fill="#F472B6" fill-opacity="0.5"/>
      <circle cx="64" cy="56" r="2.5" fill="#F472B6" fill-opacity="0.5"/>
      <circle cx="70" cy="22" r="2" fill="#F59E0B"/>
    </svg>`,
  },

  // 3. Crowns & Stars
  {
    id: 'crw-prince',
    name: 'تاج الأمير الصغير',
    category: 'crowns',
    categoryLabel: 'تيجان ونجوم',
    defaultFill: '#F59E0B',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 72h64l6-38-19 14-19-22-19 22-19-14 6 38z" fill="#FEF08A" fill-opacity="0.6"/>
      <circle cx="18" cy="34" r="3.5" fill="#EF4444"/>
      <circle cx="50" cy="26" r="4.5" fill="#3B82F6"/>
      <circle cx="82" cy="34" r="3.5" fill="#10B981"/>
      <rect x="22" y="72" width="56" height="8" rx="2" fill="#F59E0B"/>
      <circle cx="36" cy="76" r="2" fill="#FFFFFF"/>
      <circle cx="50" cy="76" r="2" fill="#FFFFFF"/>
      <circle cx="64" cy="76" r="2" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: 'crw-magic-star',
    name: 'نجمة سحرية براقة',
    category: 'crowns',
    categoryLabel: 'تيجان ونجوم',
    defaultFill: '#EAB308',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="50,15 61,38 86,41 67,59 72,84 50,71 28,84 33,59 14,41 39,38" fill="#FEF08A" fill-opacity="0.7"/>
      <circle cx="44" cy="50" r="2" fill="currentColor"/>
      <circle cx="56" cy="50" r="2" fill="currentColor"/>
      <path d="M47 57c2 2 4 2 6 0"/>
      <circle cx="38" cy="56" r="2" fill="#FB7185" fill-opacity="0.6"/>
      <circle cx="62" cy="56" r="2" fill="#FB7185" fill-opacity="0.6"/>
    </svg>`,
  },
  {
    id: 'crw-crescent',
    name: 'هلال نائم ونجوم',
    category: 'crowns',
    categoryLabel: 'تيجان ونجوم',
    defaultFill: '#6366F1',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M64 22A36 36 0 1076 74 36 36 0 0164 22z" fill="#C7D2FE" fill-opacity="0.5"/>
      <circle cx="74" cy="30" r="2" fill="#F59E0B"/>
      <circle cx="82" cy="46" r="3" fill="#F59E0B"/>
      <path d="M42 46c-2 2-6 2-8 0" stroke-width="2"/>
      <circle cx="34" cy="52" r="2" fill="#F472B6" fill-opacity="0.5"/>
    </svg>`,
  },

  // 4. Newborn & Baby Shower
  {
    id: 'nb-stroller',
    name: 'عربة مواليد كلاسيكية',
    category: 'baby_shower',
    categoryLabel: 'السبوع والمواليد',
    defaultFill: '#0D9488',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M30 30h32a24 24 0 0124 24v8a4 4 0 01-4 4H30a4 4 0 01-4-4V34a4 4 0 014-4z" fill="#CCFBF1" fill-opacity="0.6"/>
      <path d="M62 30A24 24 0 0086 54"/>
      <circle cx="38" cy="74" r="8" fill="#F0FDFA"/>
      <circle cx="38" cy="74" r="2" fill="currentColor"/>
      <circle cx="68" cy="74" r="8" fill="#F0FDFA"/>
      <circle cx="68" cy="74" r="2" fill="currentColor"/>
      <path d="M26 38l-10-8H8"/>
    </svg>`,
  },
  {
    id: 'nb-feet',
    name: 'أقدام بيبي صغيرة',
    category: 'baby_shower',
    categoryLabel: 'السبوع والمواليد',
    defaultFill: '#F43F5E',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="38" cy="62" rx="10" ry="16" fill="#FFE4E6"/>
      <ellipse cx="62" cy="62" rx="10" ry="16" fill="#FFE4E6"/>
      <circle cx="30" cy="38" r="4" fill="#FDA4AF"/>
      <circle cx="38" cy="34" r="3" fill="#FDA4AF"/>
      <circle cx="45" cy="36" r="2.5" fill="#FDA4AF"/>
      <circle cx="50" cy="40" r="2" fill="#FDA4AF"/>
      <circle cx="70" cy="38" r="4" fill="#FDA4AF"/>
      <circle cx="62" cy="34" r="3" fill="#FDA4AF"/>
      <circle cx="55" cy="36" r="2.5" fill="#FDA4AF"/>
    </svg>`,
  },
  {
    id: 'nb-pacifier',
    name: 'لهاية طفل ناعمة',
    category: 'baby_shower',
    categoryLabel: 'السبوع والمواليد',
    defaultFill: '#8B5CF6',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="42" r="16" fill="#DDD6FE" fill-opacity="0.6"/>
      <ellipse cx="50" cy="24" rx="8" ry="12" fill="#C4B5FD" fill-opacity="0.8"/>
      <circle cx="50" cy="68" r="12"/>
      <path d="M50 58v-4"/>
    </svg>`,
  },

  // 5. Quotes & Typography badges
  {
    id: 'q-sugar',
    name: '100% قطن 100% سكر',
    category: 'quotes',
    categoryLabel: 'عبارات مرحة',
    defaultFill: '#D97706',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="15" y="24" width="70" height="52" rx="12" fill="#FEF3C7" fill-opacity="0.7"/>
      <text x="50" y="46" font-size="11" font-weight="bold" text-anchor="middle" fill="#92400E" stroke="none" font-family="'Cairo', sans-serif">100% قطن</text>
      <text x="50" y="64" font-size="11" font-weight="bold" text-anchor="middle" fill="#B45309" stroke="none" font-family="'Cairo', sans-serif">100% سكر</text>
      <circle cx="22" cy="30" r="3" fill="#F59E0B" stroke="none"/>
      <circle cx="78" cy="30" r="3" fill="#F59E0B" stroke="none"/>
    </svg>`,
  },
  {
    id: 'q-prince',
    name: 'الملك الصغير / Little Prince',
    category: 'quotes',
    categoryLabel: 'عبارات مرحة',
    defaultFill: '#2563EB',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M30 36l8-10 12 6 12-6 8 10-20 6-20-6z" fill="#FBBF24" stroke="#D97706"/>
      <text x="50" y="60" font-size="13" font-weight="bold" text-anchor="middle" fill="#1E3A8A" stroke="none" font-family="'Cairo', sans-serif">الملك الصغير</text>
      <text x="50" y="74" font-size="8" font-weight="600" text-anchor="middle" fill="#6B7280" stroke="none" font-family="sans-serif">LITTLE PRINCE</text>
    </svg>`,
  },
  {
    id: 'q-mama-hero',
    name: 'حبيبة ماما وروح قلبها',
    category: 'quotes',
    categoryLabel: 'عبارات مرحة',
    defaultFill: '#E11D48',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M50 78C20 60 14 42 24 28a16 16 0 0126 8 16 16 0 0126-8c10 14 4 32-26 50z" fill="#FFE4E6" fill-opacity="0.8"/>
      <text x="50" y="48" font-size="10" font-weight="bold" text-anchor="middle" fill="#BE123C" stroke="none" font-family="'Cairo', sans-serif">حبيبة</text>
      <text x="50" y="62" font-size="10" font-weight="bold" text-anchor="middle" fill="#BE123C" stroke="none" font-family="'Cairo', sans-serif">ماما</text>
    </svg>`,
  },

  // 6. Ramadan & Eid
  {
    id: 'eid-lantern',
    name: 'فانوس رمضان الكيوت',
    category: 'eid_ramadan',
    categoryLabel: 'رمضان والأعياد',
    defaultFill: '#D97706',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="18" r="6"/>
      <polygon points="50,24 34,36 66,36" fill="#FDE68A"/>
      <rect x="36" y="36" width="28" height="34" rx="3" fill="#FEF3C7"/>
      <polygon points="34,70 66,70 50,82" fill="#FDE68A"/>
      <circle cx="50" cy="53" r="5" fill="#F59E0B"/>
      <path d="M50 48v10M45 53h10"/>
      <path d="M50 82v6"/>
    </svg>`,
  },
  {
    id: 'eid-crescent-star',
    name: 'هلال رمضان وفرحة العيد',
    category: 'eid_ramadan',
    categoryLabel: 'رمضان والأعياد',
    defaultFill: '#059669',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M56 22A30 30 0 1068 76 30 30 0 0156 22z" fill="#D1FAE5" fill-opacity="0.6"/>
      <polygon points="68,36 71,43 78,44 73,49 74,56 68,52 62,56 63,49 58,44 65,43" fill="#FBBF24"/>
      <text x="50" y="88" font-size="8" font-weight="bold" text-anchor="middle" fill="#065F46" stroke="none" font-family="'Cairo', sans-serif">عساكم من عواده</text>
    </svg>`,
  },
];
