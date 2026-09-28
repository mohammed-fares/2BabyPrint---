import { StoreSettings } from '../types';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: '2BabyPrint',
  storeTagline: 'براند أزياء وملابس الأطفال المخصصة بالقطن المصري',
  showAnnouncement: true,
  announcementText: '✨ شحن سريع داخل القاهرة الكبرى والجيزة خلال 48 ساعة | خامات قطن مصري 100% طبيعية فاخرة',
  freeShippingThreshold: 600,
  shippingFee: 45,

  // Hero Section CMS
  heroBadge: '✨ قطن مصري 100% فائق النعومة مخصص لبشرة الأطفال الحساسة',
  heroTitle: 'ملابس أطفال تُخلّد أجمل ذكريات البدايات',
  heroSubtitle: 'صممي سالوبيتات وتيشرتات وهوديز فريدة لطفلك من سن المواليد وحتى 10 سنوات، مطبوعة رقمياً بأعلى دقة على أجود خامات القطن المصري في القاهرة.',
  heroCta: 'ابدئي التصميم واختاري الموديل 🎨',
  heroSecondaryCta: 'استعراض القوالب والأفكار 💡',
  heroImageUrl: '/src/assets/images/hero_baby_apparel_1790519873737.jpg',
  heroProofCotton: 'قطن مصري 100% معتمد وآمن تماماً للمواليد',
  heroProofInks: 'أحبار مائية بيئية غير ملموسة لا تسبب الحساسية',

  // Features Bar CMS
  feature1Title: 'قطن مصري 100% طبيعي',
  feature1Desc: 'خامات ناعمة كالحرير مسامية ومريحة لبشرة الرضع طوال اليوم',
  feature2Title: 'أحبار مائية آمنة وصحية',
  feature2Desc: 'خالية تماماً من الكيماويات ومقاومة للغسيل المتكرر بثبات عالي',
  feature3Title: 'استوديو تصميم حي فوري',
  feature3Desc: 'اكتبي اسم طفلك وعباراتك المفضلة وشاهدي النتيجة قبل الطباعة',
  feature4Title: 'شحن سريع للقاهرة والجيزة',
  feature4Desc: 'تسليم موثوق ومباشر لباب منزلك خلال 48 إلى 72 ساعة كحد أقصى',

  // Product Catalog CMS
  catalogTagline: 'تشكيلة ملابس الأطفال الجاهزة للتخصيص',
  catalogTitle: 'اختر الموديل المناسب وابدأ التصميم',
  catalogHint: '💡 اختاري القطعة أو الموديل أولاً بالأسفل لبدء تخصيص التصميم والألوان والاسم في الاستوديو الحي',
  gridColumns: 3,
  cardAspectRatio: '4/3',

  // Ready Templates Showcase CMS
  templatesTagline: 'مجموعات حصرية ومحبوبة للأمهات',
  templatesTitle: 'قوالب وأفكار جاهزة للتصميم بنقرة واحدة',
  templatesSubtitle: 'تصاميم مختارة ومحبوبة لأعياد الميلاد والسبوع والمناسبات المصرية المميزة، جاهزة للتعديل وإضافة اسم طفلك فوراً',

  // Footer & Contact Info
  footerBio: 'البراند المصري الرائد في طباعة وتخصيص ملابس الأطفال والرضع بالقطن المصري الخالص عالي الجودة مع شحن لكافة أحياء القاهرة الكبرى.',
  contactPhone: '+20 109 988 7766',
  contactWhatsapp: '+201099887766',
  footerAddress: 'القاهرة الجديدة، التجمع الخامس، جمهورية مصر العربية',
  footerWorkingHours: 'خدمة العملاء يومياً من 9:00 صباحاً حتى 10:00 مساءً',
  footerCopyright: '© 2026 2BabyPrint مصر. جميع الحقوق محفوظة لملابس الأطفال المخصصة.',
  socialInstagram: 'https://instagram.com',
  socialFacebook: 'https://facebook.com',

  // Theme Accent
  themeColor: 'amber',

  // Electronic Pre-Payments in Cairo & Egypt
  instapayIpa: '2babyprint@instapay',
  instapayPhone: '01099887766',
  walletPhone: '01012345678',

  // Sections Order & Visibility
  sectionsOrder: ['hero', 'features', 'catalog', 'templates'],
  visibleSections: {
    hero: true,
    features: true,
    catalog: true,
    templates: true,
  },

  // Measurement Tables
  infantSizes: [
    { id: 'inf-1', size: '0 - 3 شهر', age: 'حديثي الولادة', weight: '3 - 5.5 كجم', height: '50 - 60 سم', chest: '40 سم', length: '36 سم' },
    { id: 'inf-2', size: '3 - 6 شهر', age: '3 - 6 أشهر', weight: '5.5 - 7.5 كجم', height: '60 - 68 سم', chest: '43 سم', length: '40 سم' },
    { id: 'inf-3', size: '6 - 12 شهر', age: '6 - 12 شهراً', weight: '7.5 - 10 كجم', height: '68 - 76 سم', chest: '46 سم', length: '44 سم' },
    { id: 'inf-4', size: '12 - 18 شهر', age: 'سنة - سنة ونصف', weight: '10 - 11.5 كجم', height: '76 - 83 سم', chest: '48 سم', length: '47 سم' },
    { id: 'inf-5', size: '18 - 24 شهر', age: 'سنة ونصف - سنتين', weight: '11.5 - 13 كجم', height: '83 - 90 سم', chest: '50 سم', length: '50 سم' },
  ],
  youthSizes: [
    { id: 'yth-1', size: '3 - 4 سنوات', age: '3 إلى 4 سنوات', weight: '14 - 16 كجم', height: '98 - 104 سم', chest: '54 سم', length: '44 سم' },
    { id: 'yth-2', size: '5 - 6 سنوات', age: '5 إلى 6 سنوات', weight: '18 - 21 كجم', height: '110 - 116 سم', chest: '58 سم', length: '48 سم' },
    { id: 'yth-3', size: '7 - 8 سنوات', age: '7 إلى 8 سنوات', weight: '23 - 27 كجم', height: '122 - 128 سم', chest: '64 سم', length: '52 سم' },
    { id: 'yth-4', size: '9 - 10 سنوات', age: '9 إلى 10 سنوات', weight: '28 - 34 كجم', height: '134 - 140 سم', chest: '70 سم', length: '56 سم' },
  ],
};

