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

