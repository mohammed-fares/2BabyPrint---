export type AgeGroup = '0-2' | '3-5' | '6-10';

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  borderClass?: string;
}

export type GarmentType =
  | 'romper_short'
  | 'romper_long'
  | 'bib'
  | 'beanie'
  | 'kids_tee'
  | 'shorts_set'
  | 'cotton_dress'
  | 'youth_tee'
  | 'crewneck'
  | 'hoodie';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  ageGroup: AgeGroup;
  ageLabel: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  material: string;
  features: string[];
  colors: ProductColor[];
  sizes: string[];
  garmentType: GarmentType;
  image: string; // Primary image
  galleryImages?: string[]; // Multiple additional gallery images
  isBestSeller?: boolean;
  printAreaRatio: {
    x: number; // percentage from left
    y: number; // percentage from top
    width: number; // percentage of garment width
    height: number; // percentage of garment height
  };
}

export type ElementType = 'text' | 'clipart' | 'image';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number; // in pixels relative to print area
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees
  opacity: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  align: 'right' | 'center' | 'left';
  isCurved?: boolean;
  curveRadius?: number; // positive or negative for arch
  isBold?: boolean;
  isItalic?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
}

export interface ClipartElement extends BaseElement {
  type: 'clipart';
  clipartId: string;
  svgContent: string;
  fill?: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  shape?: 'rect' | 'circle' | 'heart';
}

export type DesignElement = TextElement | ClipartElement | ImageElement;

export interface SideDesign {
  elements: DesignElement[];
}

export interface GarmentDesign {
  front: SideDesign;
  back: SideDesign;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  garmentType: GarmentType;
  color: ProductColor;
  size: string;
  quantity: number;
  unitPrice: number;
  design: GarmentDesign;
  mockupPreviewUrl: string;
  printSides: ('front' | 'back')[];
  customNotes?: string;
}

export interface ClipartItem {
  id: string;
  name: string;
  category: 'birthdays' | 'animals' | 'crowns' | 'baby_shower' | 'quotes' | 'eid_ramadan';
  categoryLabel: string;
  svg: string;
  defaultFill?: string;
}

export interface DesignTemplate {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  garmentType: GarmentType;
  defaultColorId: string;
  thumbnail: string;
  design: GarmentDesign;
}

// Strictly online & verified prepayments only (COD is eliminated for custom print on demand)
export type PaymentMethodType = 'instapay' | 'wallets' | 'fawry' | 'card' | 'valu';

export type OrderStatus =
  | 'pending_review' // تم استلام الطلب وتأكيد التحويل
  | 'printing_dtf' // قيد الطباعة الرقمية والتجهيز في المطبعة
  | 'ready_for_shipping' // جاهز للتسليم لشركة الشحن
  | 'out_for_delivery' // استلمه مندوب التوصيل وقيد التوصيل
  | 'delivered' // تم التوصيل للعميل بنجاح
  | 'cancelled'; // تم الإلغاء

export interface OrderDetails {
  orderNumber: string;
  date: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  paymentMethod: PaymentMethodType;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  instapayReference?: string;
  notes?: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  description: string;
  expiryDate?: string;
  usageCount: number;
}

export type AppRole = 'store' | 'admin' | 'printer' | 'courier';

export interface SizeGuideRow {
  id: string;
  size: string;
  age: string;
  weight: string;
  height: string;
  chest?: string;
  length?: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline?: string;
  showAnnouncement?: boolean;
  announcementText: string;
  freeShippingThreshold: number;
  shippingFee: number;
  
  // Hero Section CMS
  heroBadge?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroSecondaryCta?: string;
  heroImageUrl?: string;
  heroProofCotton?: string;
  heroProofInks?: string;

  // Features Bar CMS
  feature1Title?: string;
  feature1Desc?: string;
  feature2Title?: string;
  feature2Desc?: string;
  feature3Title?: string;
  feature3Desc?: string;
  feature4Title?: string;
  feature4Desc?: string;

  // Product Catalog CMS
  catalogTagline?: string;
  catalogTitle?: string;
  catalogHint?: string;
  gridColumns: 2 | 3 | 4;
  cardAspectRatio: '4/3' | '1/1' | '3/4';

  // Ready Templates Showcase CMS
  templatesTagline?: string;
  templatesTitle?: string;
  templatesSubtitle?: string;

  // Footer & Contact Info
  footerBio?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  footerAddress?: string;
  footerWorkingHours?: string;
  footerCopyright?: string;
  socialInstagram?: string;
  socialFacebook?: string;

  // Theme Accent Color
  themeColor?: 'amber' | 'rose' | 'emerald' | 'sky' | 'indigo';

  // Dynamic Typography Configuration per Language
  fontArabic?: ArabicFontFamily;
  fontEnglish?: EnglishFontFamily;

  // Bilingual English CMS Fields
  storeNameEn?: string;
  storeTaglineEn?: string;
  announcementTextEn?: string;
  heroBadgeEn?: string;
  heroTitleEn?: string;
  heroSubtitleEn?: string;
  heroCtaEn?: string;
  heroSecondaryCtaEn?: string;
  heroProofCottonEn?: string;
  heroProofInksEn?: string;

  feature1TitleEn?: string;
  feature1DescEn?: string;
  feature2TitleEn?: string;
  feature2DescEn?: string;
  feature3TitleEn?: string;
  feature3DescEn?: string;
  feature4TitleEn?: string;
  feature4DescEn?: string;

  catalogTaglineEn?: string;
  catalogTitleEn?: string;
  catalogHintEn?: string;

  templatesTaglineEn?: string;
  templatesTitleEn?: string;
  templatesSubtitleEn?: string;

  footerBioEn?: string;
  footerAddressEn?: string;
  footerWorkingHoursEn?: string;
  footerCopyrightEn?: string;

  // Electronic Pre-Payments in Cairo & Egypt
  instapayIpa: string;
  instapayPhone: string;
  walletPhone: string;

  // Sections Reordering & Visibility
  sectionsOrder: ('hero' | 'features' | 'catalog' | 'templates')[];
  visibleSections: {
    hero: boolean;
    features: boolean;
    catalog: boolean;
    templates: boolean;
  };

  // Measurement Tables
  infantSizes: SizeGuideRow[];
  youthSizes: SizeGuideRow[];
}

export type ArabicFontFamily =
  | 'Cairo'
  | 'Tajawal'
  | 'Almarai'
  | 'Readex Pro'
  | 'Alexandria'
  | 'Changa'
  | 'Baloo Bhaijaan 2'
  | 'IBM Plex Sans Arabic';

export type EnglishFontFamily =
  | 'Plus Jakarta Sans'
  | 'Inter'
  | 'Poppins'
  | 'Outfit'
  | 'Montserrat'
  | 'Nunito'
  | 'Playfair Display';

// Social Media & AI Ads Campaign Types
export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'snapchat' | 'google' | 'pinterest';

export type CampaignGoal =
  | 'custom_studio' // الترويج لاستوديو التصميم الحي وتجربة العميل
  | 'baby_shower' // هدايا السبوع والمواليد الجدد
  | 'birthdays' // تصاميم أعياد الميلاد المخصصة
  | 'pure_cotton' // إبراز جودة القطن المصري 100% والأحبار الآمنة
  | 'fast_delivery' // توصيل سريع للقاهرة والجيزة
  | 'promo_discount'; // عروض وتخفيضات وكوبونات

export type CampaignStatus = 'active' | 'paused' | 'draft' | 'completed';

export interface SocialCampaign {
  id: string;
  name: string;
  platform: SocialPlatform;
  goal: CampaignGoal;
  status: CampaignStatus;
  startDate: string;
  budgetPerDay: number; // in EGP
  totalSpent: number; // in EGP
  targetAudience: {
    label: string;
    ageRange: string;
    locations: string[];
    interests: string[];
    demographics: string;
  };
  adCreative: {
    headline: string;
    bodyText: string;
    ctaText: string;
    ctaUrl: string;
    hashtags: string[];
    mediaType: 'image' | 'carousel' | 'video_reel';
    imageUrl: string;
    videoScript?: {
      hookSeconds: string;
      visualAction: string;
      voiceover: string;
      soundTrackRecommendation: string;
    };
  };
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number; // percentage e.g. 3.4
    conversions: number; // orders
    cpa: number; // EGP per order
    roas: number; // e.g. 4.2
  };
  aiNotes?: string;
  createdAt: string;
}
