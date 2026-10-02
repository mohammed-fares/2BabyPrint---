import React, { useState, useEffect } from 'react';
import {
  Product,
  OrderDetails,
  Coupon,
  AgeGroup,
  ProductColor,
  StoreSettings,
  SocialCampaign,
  AdminNotification,
} from '../../types';
import { STANDARD_COLORS } from '../../data/products';
import { INITIAL_CAMPAIGNS } from '../../data/initialCampaigns';
import {
  TrendingUp,
  Package,
  Printer,
  Truck,
  Plus,
  Trash2,
  Edit2,
  Tag,
  CheckCircle2,
  Clock,
  Eye,
  DollarSign,
  AlertCircle,
  Filter,
  Save,
  X,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Layers,
  LayoutGrid,
  Image as ImageIcon,
  Sliders,
  Ruler,
  Smartphone,
  Check,
  Palette,
  FolderTree,
  Megaphone,
  Phone,
  MessageCircle,
  Globe,
  Feather,
  Bell,
  Zap,
  ExternalLink,
  Send,
} from 'lucide-react';
import { GarmentSilhouette } from '../DesignerStudio/GarmentSilhouette';
import { exportPrintReadyFile, downloadDataUrl } from '../../utils/canvasRenderer';
import { StorefrontCms } from './StorefrontCms';
import { SocialAdsHub } from './SocialAdsHub';
import { AnalyticsDashboard } from './AnalyticsDashboard';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onUpdateProductPrice: (id: string, newPrice: number, newOriginalPrice?: number) => void;
  onReorderProducts: (newProducts: Product[]) => void;
  onDeleteProduct: (id: string) => void;
  orders: OrderDetails[];
  onUpdateOrderStatus: (orderNumber: string, status: OrderDetails['status']) => void;
  coupons: Coupon[];
  onAddCoupon: (newCoupon: Coupon) => void;
  onToggleCoupon: (id: string) => void;
  onDeleteCoupon: (id: string) => void;
  storeSettings: StoreSettings;
  onUpdateStoreSettings: (newSettings: StoreSettings) => void;
}

type AdminTab = 'overview' | 'orders' | 'products' | 'categories' | 'layout' | 'coupons' | 'marketing';
type CmsSubTab = 'hero' | 'header' | 'features' | 'catalog' | 'templates' | 'footer' | 'sections' | 'sizeguide' | 'payments';

const CURATED_MOCKUPS = [
  { id: 'romper_studio', label: 'سالوبيت قطني ناعم', url: '/src/assets/images/product_romper_studio_1790519885828.jpg' },
  { id: 'hoodie_kids', label: 'هودي وسويت شيرت', url: '/src/assets/images/product_hoodie_kids_1790519897372.jpg' },
  { id: 'hero_baby', label: 'صورة طفل ملائكية', url: '/src/assets/images/hero_baby_apparel_1790519873737.jpg' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onUpdateProductPrice,
  onReorderProducts,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  coupons,
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  storeSettings,
  onUpdateStoreSettings,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderDetails | null>(null);

  // Product Editing Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editGalleryInput, setEditGalleryInput] = useState('');
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Add Product Modal State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductNameEn, setNewProductNameEn] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('حديثي الولادة والرضع');
  const [newProductAgeGroup, setNewProductAgeGroup] = useState<AgeGroup>('0-2');
  const [newProductPrice, setNewProductPrice] = useState(290);
  const [newProductOriginalPrice, setNewProductOriginalPrice] = useState(360);
  const [newProductMaterial, setNewProductMaterial] = useState('100% قطن مصري فاخر فائق النعومة');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductImage, setNewProductImage] = useState('/src/assets/images/product_romper_studio_1790519885828.jpg');
  const [newProductGallery, setNewProductGallery] = useState<string[]>([]);
  const [newProductGalleryInput, setNewProductGalleryInput] = useState('');

  // Add Coupon Modal State
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(250);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Category Management State
  const [newCategoryName, setNewCategoryName] = useState('');

  // Social Media & AI Advertising Campaigns State
  const [campaigns, setCampaigns] = useState<SocialCampaign[]>(() => {
    const saved = localStorage.getItem('2babyprint_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const handleSaveCampaigns = (newCampaigns: SocialCampaign[]) => {
    setCampaigns(newCampaigns);
    localStorage.setItem('2babyprint_campaigns', JSON.stringify(newCampaigns));
  };

  // Local settings copy for Layout customization
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(storeSettings);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);
  const [cmsSubTab, setCmsSubTab] = useState<CmsSubTab>('hero');

  // Sync settings when prop changes
  React.useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  // Notifications State (Internal notifications & WhatsApp urgent alerts)
  const [notifications, setNotifications] = useState<AdminNotification[]>([
    {
      id: 'notif-1',
      title: 'طلب مستعجل: أوبر سكوتر فوري اليوم ⚡',
      message: 'طلب رقم #2BP-8421 للعميل نورهان الشريف - التجمع الخامس (توصيل فوري نفس اليوم)',
      date: 'منذ دقيقتين',
      type: 'urgent',
      isRead: false,
      priority: 'urgent',
      orderNumber: '2BP-8421',
    },
    {
      id: 'notif-2',
      title: 'تم مسح واعتماد وصل إنستاباي بالذكاء الاصطناعي ✓',
      message: 'تم فحص ومطابقة إيصال السداد الإلكتروني بنجاح بدقة 99.4% للطلب #2BP-3190',
      date: 'منذ 15 دقيقة',
      type: 'payment_verified',
      isRead: false,
      priority: 'high',
      orderNumber: '2BP-3190',
    },
    {
      id: 'notif-3',
      title: 'أوردر جديد قيد التجهيز للمطبعة',
      message: 'طلب سالوبيت السبوع الملكي قطعتين قطن مصري فاخر',
      date: 'منذ ساعة',
      type: 'order',
      isRead: true,
      priority: 'normal',
    },
  ]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Product Color Editing State
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#FFFFFF');

  const handleAddColorToEdit = () => {
    if (!editingProduct || !newColorName.trim()) return;
    const newColor: ProductColor = {
      id: `col-${Date.now()}`,
      name: newColorName.trim(),
      hex: newColorHex,
      silhouetteUrl: editingProduct.colors[0]?.silhouetteUrl || '/src/assets/images/product_romper_studio_1790519885828.jpg',
    };
    setEditingProduct({
      ...editingProduct,
      colors: [...editingProduct.colors, newColor],
    });
    setNewColorName('');
  };

  const handleRemoveColorFromEdit = (colorId: string) => {
    if (!editingProduct || editingProduct.colors.length <= 1) return;
    setEditingProduct({
      ...editingProduct,
      colors: editingProduct.colors.filter((c) => c.id !== colorId),
    });
  };

  // Dispatch order to Print House via WhatsApp or Telegram
  const handleSendOrderToPrinter = (order: OrderDetails, platform: 'whatsapp' | 'telegram') => {
    const printerPhone = storeSettings.printerWhatsapp || '01019998877';
    const cleanPhone = printerPhone.replace(/[^0-9]/g, '');
    const itemsList = order.items
      .map(
        (it, idx) =>
          `[قطعة ${idx + 1}] ${it.productName}\n- المقاس: ${it.size} | اللون: ${it.color.name} (${it.color.hex})\n- الكمية: ${it.quantity}\n- جوانب الطباعة: ${it.printSides.join(' + ')}\n- عناصر التصميم: ${it.design.front.elements.length} أمام + ${it.design.back.elements.length} خلف`
      )
      .join('\n\n');

    const msg = `*أمر تشغيل وطباعة جديد لمطبعة 2BabyPrint رقم: ${order.orderNumber}*
---------------------------------------
👤 *العميل:* ${order.customerName}
📞 *الهاتف:* ${order.phone}
📍 *العنوان:* ${order.city} - ${order.address}
🚚 *الشحن:* ${order.shippingType === 'express_uber' ? '⚡ أوبر سكوتر فوري (اليوم)' : 'شحن قياسي 48 ساعة'}
💳 *طريقة الدفع:* ${order.paymentMethod === 'instapay' ? 'إنستاباي' : 'محفظة إلكترونية'} (مرجع: ${order.instapayReference || 'مرفق الوصل'})
💰 *الإجمالي المدفوع:* ${order.total} ج.م
---------------------------------------
👕 *القطع المطلوب طباعتها رقمياً (DTF):*
${itemsList}
${order.notes ? `\n📝 *ملاحظات:* ${order.notes}` : ''}
---------------------------------------
✅ تفاصيل التصاميم محفوظة وملفات الطباعة 300 DPI جاهزة للتحميل الفوري.`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
      const tgUsername = (storeSettings.printerTelegram || 'BabyPrintProduction').replace('@', '');
      window.open(`https://t.me/${tgUsername}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const handleSendUrgentAlert = (notif: AdminNotification) => {
    const printerPhone = storeSettings.printerWhatsapp || '01019998877';
    const cleanPhone = printerPhone.replace(/[^0-9]/g, '');
    const msg = `🚨 *تنبيه إداري عاجل فائق الأهمية - 2BabyPrint*
---------------------------------------
📌 *الموضوع:* ${notif.title}
📝 *التفاصيل:* ${notif.message}
⏰ *التوقيت:* ${notif.date}
---------------------------------------
يرجى المتابعة الفورية والتجهيز العاجل للطلب.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Analytics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending_review').length;
  const printingOrders = orders.filter((o) => o.status === 'printing_dtf').length;
  const shippingOrders = orders.filter(
    (o) => o.status === 'ready_for_shipping' || o.status === 'out_for_delivery'
  ).length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // Unique categories in products
  const allCategories = Array.from(new Set(products.map((p) => p.category)));

  // Reorder product handlers
  const handleMoveProduct = (index: number, direction: 'up' | 'down') => {
    const newProducts = [...products];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProducts.length) return;
    const temp = newProducts[index];
    newProducts[index] = newProducts[targetIndex];
    newProducts[targetIndex] = temp;
    onReorderProducts(newProducts);
  };

  // Open Full Product Editor
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({
      ...prod,
      galleryImages: prod.galleryImages ? [...prod.galleryImages] : [],
      sizes: [...prod.sizes],
      features: [...prod.features],
      colors: [...prod.colors],
    });
    setEditGalleryInput('');
    setNewSizeInput('');
    setNewFeatureInput('');
  };

  // Save Full Product Edits
  const handleSaveProductEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  // Add gallery image to currently edited product
  const handleAddGalleryImageToEdit = () => {
    if (!editGalleryInput.trim() || !editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      galleryImages: [...(editingProduct.galleryImages || []), editGalleryInput.trim()],
    });
    setEditGalleryInput('');
  };

  // Remove gallery image from currently edited product
  const handleRemoveGalleryImageFromEdit = (idx: number) => {
    if (!editingProduct) return;
    const updated = (editingProduct.galleryImages || []).filter((_, i) => i !== idx);
    setEditingProduct({ ...editingProduct, galleryImages: updated });
  };

  // Add size to currently edited product
  const handleAddSizeToEdit = () => {
    if (!newSizeInput.trim() || !editingProduct) return;
    if (!editingProduct.sizes.includes(newSizeInput.trim())) {
      setEditingProduct({
        ...editingProduct,
        sizes: [...editingProduct.sizes, newSizeInput.trim()],
      });
    }
    setNewSizeInput('');
  };

  // Remove size from currently edited product
  const handleRemoveSizeFromEdit = (sizeToRemove: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      sizes: editingProduct.sizes.filter((s) => s !== sizeToRemove),
    });
  };

  // Add feature to currently edited product
  const handleAddFeatureToEdit = () => {
    if (!newFeatureInput.trim() || !editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      features: [...editingProduct.features, newFeatureInput.trim()],
    });
    setNewFeatureInput('');
  };

  // Remove feature from currently edited product
  const handleRemoveFeatureFromEdit = (idx: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      features: editingProduct.features.filter((_, i) => i !== idx),
    });
  };

  // Create new product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;

    const newProd: Product = {
      id: `prod-custom-${Date.now()}`,
      name: newProductName,
      nameEn: newProductNameEn || newProductName,
      ageGroup: newProductAgeGroup,
      ageLabel:
        newProductAgeGroup === '0-2'
          ? '0 - 24 شهر'
          : newProductAgeGroup === '3-5'
          ? '3 - 5 سنوات'
          : '6 - 10 سنوات',
      category: newProductCategory,
      price: Number(newProductPrice),
      originalPrice: Number(newProductOriginalPrice),
      description: newProductDesc || 'قطعة ملابس قطنية مخصصة مصنوعة من أجود خامات القطن المصري الطبيعي.',
      material: newProductMaterial,
      features: ['100% قطن مصري ناعم', 'أحبار رقمية نباتية معتمدة', 'أزرار كبس خالية من النيكل'],
      colors: STANDARD_COLORS,
      sizes:
        newProductAgeGroup === '0-2'
          ? ['0-3 شهر', '3-6 شهر', '6-12 شهر', '12-18 شهر']
          : newProductAgeGroup === '3-5'
          ? ['3-4 سنوات', '4-5 سنوات', '5-6 سنوات']
          : ['6-7 سنوات', '7-8 سنوات', '9-10 سنوات'],
      garmentType:
        newProductAgeGroup === '0-2'
          ? 'romper_short'
          : newProductAgeGroup === '3-5'
          ? 'kids_tee'
          : 'hoodie',
      image: newProductImage,
      galleryImages: newProductGallery,
      isBestSeller: false,
      printAreaRatio: { x: 26, y: 22, width: 48, height: 45 },
    };

    onAddProduct(newProd);
    setIsAddProductModalOpen(false);
    setNewProductName('');
    setNewProductNameEn('');
    setNewProductDesc('');
    setNewProductGallery([]);
  };

  // Create new coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const newCpn: Coupon = {
      id: `cpn-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrderAmount: Number(newCouponMinOrder),
      isActive: true,
      description: newCouponDesc || 'خصم ترويجي خاص لعملاء القاهرة',
      usageCount: 0,
    };

    onAddCoupon(newCpn);
    setIsAddCouponModalOpen(false);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  // Save Storefront Layout Settings
  const handleSaveSettings = () => {
    onUpdateStoreSettings(settingsForm);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  // Reorder sections in storefront
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...settingsForm.sectionsOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setSettingsForm({ ...settingsForm, sectionsOrder: newOrder });
  };

  // Toggle section visibility
  const handleToggleSectionVisibility = (sectionKey: keyof StoreSettings['visibleSections']) => {
    setSettingsForm({
      ...settingsForm,
      visibleSections: {
        ...settingsForm.visibleSections,
        [sectionKey]: !settingsForm.visibleSections[sectionKey],
      },
    });
  };

  // Download DTF print file for an order item
  const handleDownloadItemPrint = async (order: OrderDetails, itemIdx: number, side: 'front' | 'back') => {
    const item = order.items[itemIdx];
    if (!item) return;
    const elements = side === 'front' ? item.design.front.elements : item.design.back.elements;
    if (elements.length === 0) return;
    try {
      const res = await exportPrintReadyFile(elements, 240, 300, 300);
      downloadDataUrl(res.dataUrl, `PRINT_${order.orderNumber}_${item.productName.slice(0, 8)}_${side}_300DPI.png`);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/90 py-8 px-4 sm:px-6 font-['Cairo']">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Master Top Bar */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900">
                لوحة الإدارة الشاملة لمتجر 2BabyPrint (القاهرة)
              </h1>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                إدارة المتجر والإنتاج
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              تحكم كامل في المنتجات والصور، ترتيب وتوزيعة الموقع، الأسعار والمقاسات، ومتابعة الطلبات بدقة للمطبعة والتوصيل
            </p>
          </div>

          {/* Quick Actions & Notification Bell */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer"
                title="مركز الإشعارات والتنبيهات"
              >
                <Bell className="w-5 h-5" />
                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute left-0 sm:right-auto sm:left-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-2xl border border-stone-200 shadow-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold text-xs text-stone-900">إشعارات الإدارة والطلبات الجديدة</span>
                    <button
                      type="button"
                      onClick={() =>
                        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
                      }
                      className="text-[11px] text-amber-700 hover:underline cursor-pointer"
                    >
                      تحديد الكل كمقروء
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          notif.priority === 'urgent'
                            ? 'bg-red-50/70 border-red-200'
                            : notif.isRead
                            ? 'bg-stone-50 border-stone-100'
                            : 'bg-amber-50/60 border-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-stone-900 flex items-center gap-1">
                            {notif.priority === 'urgent' && <Zap className="w-3.5 h-3.5 text-red-600" />}
                            <span>{notif.title}</span>
                          </span>
                          <span className="text-[10px] text-stone-400">{notif.date}</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mb-2 leading-relaxed">{notif.message}</p>
                        <button
                          type="button"
                          onClick={() => handleSendUrgentAlert(notif)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>إرسال تنبيه لواتساب المطبعة</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              نظرة عامة وإحصائيات
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-white text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>إدارة الطلبات</span>
              <span className="bg-amber-400 text-stone-950 text-[10px] px-1.5 rounded-full font-mono font-bold">
                {orders.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-white text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>المنتجات والصور والترتيب ({products.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('layout')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'layout'
                  ? 'bg-white text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>محرر وتخصيص واجهة المتجر (CMS)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'categories'
                  ? 'bg-white text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5 text-amber-600" />
              <span>الأقسام ({allCategories.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('coupons')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'coupons'
                  ? 'bg-white text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span>العروض والكوبونات ({coupons.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('marketing')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'marketing'
                  ? 'bg-amber-500 text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 text-amber-600" />
              <span>الإعلانات والحملات الذكية ({campaigns.length})</span>
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Visual Recharts Analytics Dashboard */}
            <AnalyticsDashboard orders={orders} products={products} />

            {/* Quick Action Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  مرحباً بك في لوحة تحكم 2BabyPrint
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 max-w-xl">
                  يمكنك من هنا تعديل صور المنتجات أو إضافة معرض صور كامل لكل منتج، والتحكم في ترتيب ظهور المنتجات وأقسام الموقع ومقاساتها حسب رغبتك التامة.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>التحكم بالمنتجات والصور</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('layout')}
                  className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl text-xs border border-stone-300 shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Sliders className="w-4 h-4" />
                  <span>توزيعة المتجر والمظهر</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>أحدث الطلبات الواردة من عملاء القاهرة</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                >
                  عرض كافة الطلبات ({orders.length}) ←
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {orders.slice(0, 4).map((order) => (
                  <div key={order.orderNumber} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center font-mono font-bold text-xs text-amber-900">
                        {order.orderNumber.replace('2BP-', '#')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                          <span>{order.customerName}</span>
                          <span className="text-[10px] text-stone-400 font-normal">({order.city})</span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {order.items.length} قطع مخصصة · {order.total} ج.م ·{' '}
                          <span className="font-mono text-stone-400">{order.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === 'printing_dtf'
                            ? 'bg-amber-100 text-amber-900'
                            : order.status === 'ready_for_shipping'
                            ? 'bg-purple-100 text-purple-900'
                            : order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {order.status === 'pending_review'
                          ? 'قيد المراجعة'
                          : order.status === 'printing_dtf'
                          ? 'قيد الطباعة'
                          : order.status === 'ready_for_shipping'
                          ? 'جاهز للشحن'
                          : order.status === 'out_for_delivery'
                          ? 'مع المندوب'
                          : order.status === 'delivered'
                          ? 'تم التوصيل'
                          : 'ملغي'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrderDetails(order);
                          setActiveTab('orders');
                        }}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-xs"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. ORDERS MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    orderFilter === 'all' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  الكل ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('pending_review')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    orderFilter === 'pending_review' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  قيد المراجعة ({pendingOrders})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('printing_dtf')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    orderFilter === 'printing_dtf' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  في المطبعة ({printingOrders})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('out_for_delivery')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    orderFilter === 'out_for_delivery' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  مع المندوب للتوصيل ({shippingOrders})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('delivered')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    orderFilter === 'delivered' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  تم التوصيل ({completedOrders})
                </button>
              </div>

              <div className="text-xs text-stone-500">
                إجمالي الطلبات المعروضة: <strong>{filteredOrders.length}</strong>
              </div>
            </div>

            {/* Orders Table / Cards */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-amber-300 transition-all"
                >
                  <div className="p-4 sm:p-5 bg-stone-50/60 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-sm text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                        {order.orderNumber}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{order.customerName}</div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {order.phone} · {order.city}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.orderNumber, e.target.value as OrderDetails['status'])
                        }
                        className="text-xs font-semibold bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800"
                      >
                        <option value="pending_review">قيد المراجعة وتأكيد الدفع</option>
                        <option value="printing_dtf">قيد الطباعة في المطبعة</option>
                        <option value="ready_for_shipping">جاهز للتسليم لشركة الشحن</option>
                        <option value="out_for_delivery">خرج مع مندوب التوصيل</option>
                        <option value="delivered">تم التوصيل للعميل بنجاح</option>
                        <option value="cancelled">ملغي</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setSelectedOrderDetails(order)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>تفاصيل وتصاميم الطلب</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100"
                        >
                          <div className="w-14 h-14 bg-white rounded-lg p-1 border border-stone-200 flex items-center justify-center shrink-0">
                            <GarmentSilhouette
                              garmentType={item.garmentType}
                              colorHex={item.color.hex}
                              side="front"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-stone-900 truncate">
                              {item.productName}
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              المقاس: <strong>{item.size}</strong> · اللون: {item.color.name} · الكمية: {item.quantity}
                            </div>
                            <div className="text-[11px] text-amber-800 mt-0.5 font-medium">
                              طباعة: {item.printSides.includes('front') && item.printSides.includes('back') ? 'وجهين (أمام وخلف)' : item.printSides.includes('front') ? 'الصدر الأمامي' : 'الظهر'}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 shrink-0">
                            {item.design.front.elements.length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleDownloadItemPrint(order, idx, 'front')}
                                className="px-2 py-1 bg-white hover:bg-amber-50 text-[10px] font-bold text-stone-700 border border-stone-200 rounded flex items-center gap-1"
                                title="تحميل ملف الطباعة عالي الدقة 300 DPI"
                              >
                                <Printer className="w-3 h-3 text-amber-600" />
                                <span>طباعة الأمام</span>
                              </button>
                            )}
                            {item.design.back.elements.length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleDownloadItemPrint(order, idx, 'back')}
                                className="px-2 py-1 bg-white hover:bg-amber-50 text-[10px] font-bold text-stone-700 border border-stone-200 rounded flex items-center gap-1"
                                title="تحميل ملف الطباعة عالي الدقة 300 DPI"
                              >
                                <Printer className="w-3 h-3 text-amber-600" />
                                <span>طباعة الظهر</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex flex-col md:flex-row md:items-center justify-between text-xs text-stone-600 gap-3">
                      <div className="space-y-1">
                        <div>
                          العنوان في القاهرة: <strong>{order.address}</strong> ({order.city})
                          {order.notes && <span className="text-amber-800 mr-2">· ملاحظة: {order.notes}</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                              order.shippingType === 'express_uber'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {order.shippingType === 'express_uber'
                              ? '⚡ شحن فوري اليوم (أوبر سكوتر)'
                              : '🚚 شحن قياسي 48 ساعة'}
                          </span>

                          {order.receiptVerified && (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                              ✓ تم مسح واعتماد الوصل ({order.instapayReference || 'معتمد'})
                            </span>
                          )}

                          {order.receiptImageUrl && (
                            <a
                              href={order.receiptImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-700 hover:underline text-[11px] flex items-center gap-1"
                            >
                              <span>معاينة إيصال السداد المرفوع</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="font-bold text-stone-900 sm:text-left sm:ml-2">
                          إجمالي الطلب: <span className="text-amber-900 font-mono text-sm">{order.total} ج.م</span>
                        </div>

                        {/* Dispatch to Print House Channels */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSendOrderToPrinter(order, 'whatsapp')}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="إرسال بيانات الأوردر والتصميمات لواتساب المطبعة"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>واتساب المطبعة</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendOrderToPrinter(order, 'telegram')}
                            className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="إرسال لتلجرام المطبعة"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>تلجرام</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PRODUCTS & GALLERY IMAGES & REORDERING TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  إدارة المنتجات، الصور والمعارض، والترتيب
                </h3>
                <p className="text-xs text-stone-500">
                  يمكنك تعديل أي منتج بالكامل، تغيير صورته، إضافة معرض صور متعدد، وتغيير ترتيب ظهوره للعملاء بالأزرار للأعلى والأسفل
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج أو موديل جديد</span>
              </button>
            </div>

            {/* Products List with Full Edit and Reorder Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
                >
                  <div className="p-4 space-y-3">
                    {/* Primary Image & Gallery Preview */}
                    <div className="relative aspect-4/3 bg-stone-100 rounded-xl overflow-hidden group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 text-[10px] bg-white/95 text-stone-800 font-bold px-2 py-0.5 rounded shadow-xs">
                        {product.ageLabel}
                      </span>
                      {product.isBestSeller && (
                        <span className="absolute top-2 left-2 text-[10px] bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded shadow-xs">
                          الأكثر مبيعاً
                        </span>
                      )}

                      {/* Multiple Gallery Images Counter Badge */}
                      {product.galleryImages && product.galleryImages.length > 0 && (
                        <span className="absolute bottom-2 right-2 text-[10px] bg-stone-900/80 text-white font-medium px-2 py-0.5 rounded flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>+{product.galleryImages.length} صور في المعرض</span>
                        </span>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span>{product.category}</span>
                        <span className="font-mono text-stone-400">#{index + 1} بالترتيب</span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-900 mt-0.5 line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">{product.description}</p>
                    </div>

                    {/* Quick Price inline */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block">سعر البيع:</span>
                        <span className="font-bold text-sm text-amber-900 font-mono">
                          {product.price} ج.م
                        </span>
                      </div>
                      {product.originalPrice && (
                        <div>
                          <span className="text-[10px] text-stone-400 block">قبل الخصم:</span>
                          <span className="text-xs text-stone-400 line-through font-mono">
                            {product.originalPrice} ج.م
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] text-stone-400 block">المقاسات:</span>
                        <span className="text-[11px] text-stone-600 font-medium">
                          {product.sizes.length} مقاسات
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar: Reorder & Full Edit Modal */}
                  <div className="p-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-2">
                    {/* Reorder Buttons (Move Up / Down) */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveProduct(index, 'up')}
                        disabled={index === 0}
                        className={`p-1.5 rounded-lg border text-stone-600 transition-colors ${
                          index === 0 ? 'opacity-30 cursor-not-allowed border-stone-200' : 'hover:bg-white hover:border-amber-300'
                        }`}
                        title="تحريك لأعلى في ترتيب العرض"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveProduct(index, 'down')}
                        disabled={index === products.length - 1}
                        className={`p-1.5 rounded-lg border text-stone-600 transition-colors ${
                          index === products.length - 1 ? 'opacity-30 cursor-not-allowed border-stone-200' : 'hover:bg-white hover:border-amber-300'
                        }`}
                        title="تحريك لأسفل في ترتيب العرض"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(product)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>تعديل كامل</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف هذا المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. FULL STOREFRONT CMS & INTERFACE BUILDER TAB */}
        {activeTab === 'layout' && (
          <StorefrontCms
            settingsForm={settingsForm}
            setSettingsForm={setSettingsForm}
            onSaveSettings={handleSaveSettings}
            savedSettingsNotice={savedSettingsNotice}
            curatedMockups={CURATED_MOCKUPS}
          />
        )}

        {/* 5. CATEGORIES MANAGEMENT TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  إدارة أقسام وتصنيفات المتجر (Categories)
                </h3>
                <p className="text-xs text-stone-500">
                  يمكنك تنظيم وتوزيع المنتجات تحت أقسام مخصصة لسهولة تصفح أولياء الأمور
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="اسم القسم الجديد..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newCategoryName.trim()) return;
                    setNewCategoryName('');
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs transition-colors shrink-0"
                >
                  إضافة قسم
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {allCategories.map((category) => {
                const count = products.filter((p) => p.category === category).length;
                return (
                  <div
                    key={category}
                    className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-sm text-stone-900">{category}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{count} منتجات نشطة</div>
                    </div>
                    <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. COUPONS TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  محرك العروض وأكواد الخصم الترويجية (Coupons)
                </h3>
                <p className="text-xs text-stone-500">
                  أنشئي كوبونات خصم بنسبة مئوية أو مبلغ ثابت قابلة للاستخدام الفوري لعملاء القاهرة
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddCouponModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء كود خصم جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                    coupon.isActive ? 'border-amber-300 ring-1 ring-amber-100' : 'border-stone-200 opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-sm text-amber-900 bg-amber-100 px-3 py-1 rounded-lg tracking-wider">
                        {coupon.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleCoupon(coupon.id)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          coupon.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {coupon.isActive ? 'مفعل وجاهز' : 'معطل مؤقتاً'}
                      </button>
                    </div>

                    <p className="text-xs text-stone-700 font-semibold">{coupon.description}</p>

                    <div className="space-y-1 text-xs text-stone-500 pt-1">
                      <div>
                        قيمة الخصم:{' '}
                        <strong className="text-stone-900">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}%`
                            : `${coupon.discountValue} ج.م`}
                        </strong>
                      </div>
                      <div>
                        الحد الأدنى للطلب:{' '}
                        <strong className="text-stone-900">{coupon.minOrderAmount} ج.م</strong>
                      </div>
                      <div className="font-mono text-[11px] text-stone-400">
                        مرات الاستخدام: {coupon.usageCount} مرة
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onToggleCoupon(coupon.id)}
                      className="text-xs text-stone-600 hover:text-stone-900 font-medium"
                    >
                      {coupon.isActive ? 'تعطيل الكود' : 'تفعيل الكود'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCoupon(coupon.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                      title="حذف الكوبون"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. SOCIAL MEDIA & AI MARKETING HUB TAB */}
        {activeTab === 'marketing' && (
          <SocialAdsHub
            campaigns={campaigns}
            onSaveCampaigns={handleSaveCampaigns}
            products={products}
          />
        )}

        {/* ============================================================== */}
        {/* MODAL 1: FULL PRODUCT EDIT MODAL (تعديل كامل للمنتج والصور والمعرض) */}
        {/* ============================================================== */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      تعديل المنتج ومعرض الصور: {editingProduct.name}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      تحكم كامل في الصور، الأسعار، المقاسات، الألوان، والمواصفات التي يراها العميل
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProductEdits} className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700">
                {/* 1. Main Image & Gallery Management */}
                <div className="space-y-3 bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
                  <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>الصورة الأساسية ومعرض الصور الإضافية (Gallery Images)</span>
                  </h4>

                  {/* Primary Image */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div className="aspect-4/3 bg-white rounded-xl overflow-hidden border border-stone-300">
                      <img
                        src={editingProduct.image}
                        alt="Primary Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-[11px] font-bold text-stone-700 block">
                        رابط الصورة الأساسية للمنتج:
                      </label>
                      <input
                        type="text"
                        value={editingProduct.image}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                      />

                      {/* Mockup Picker Quick Buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-stone-400">نماذج سريعة:</span>
                        {CURATED_MOCKUPS.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, image: m.url })}
                            className="px-2 py-0.5 text-[10px] bg-white hover:bg-amber-50 border border-stone-200 rounded text-stone-700"
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Additional Gallery Images */}
                  <div className="pt-3 border-t border-stone-200 space-y-2">
                    <label className="text-[11px] font-bold text-stone-700 block">
                      صور إضافية للمنتج (معرض الصور - يظهر في كارت المنتج):
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="أدخل رابط صورة إضافية (URL)..."
                        value={editGalleryInput}
                        onChange={(e) => setEditGalleryInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryImageToEdit}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold shrink-0"
                      >
                        + إضافة للمعرض
                      </button>
                    </div>

                    {/* Gallery Thumbnails List */}
                    {editingProduct.galleryImages && editingProduct.galleryImages.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                        {editingProduct.galleryImages.map((imgUrl, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-stone-300 group">
                            <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImageFromEdit(idx)}
                              className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-80 group-hover:opacity-100"
                              title="حذف من المعرض"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Basic Info & Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">اسم المنتج (عربي):</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">اسم المنتج (English):</label>
                    <input
                      type="text"
                      value={editingProduct.nameEn}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">السعر (ج.م):</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">السعر قبل الخصم:</label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">الفئة العمرية:</label>
                    <select
                      value={editingProduct.ageGroup}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          ageGroup: e.target.value as AgeGroup,
                          ageLabel: e.target.value === '0-2' ? '0 - 24 شهر' : e.target.value === '3-5' ? '3 - 5 سنوات' : '6 - 10 سنوات',
                        })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    >
                      <option value="0-2">0 - 2 سنة (رضع)</option>
                      <option value="3-5">3 - 5 سنوات</option>
                      <option value="6-10">6 - 10 سنوات</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">القسم:</label>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Best Seller Toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isBestSellerCheck"
                    checked={editingProduct.isBestSeller ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <label htmlFor="isBestSellerCheck" className="font-bold text-stone-800 cursor-pointer">
                    تمييز كمنتج الأكثر مبيعاً (Best Seller Badge)
                  </label>
                </div>

                {/* Description & Material */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">الوصف:</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl resize-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">الخامة والقماش:</label>
                    <input
                      type="text"
                      value={editingProduct.material}
                      onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl mb-2"
                    />
                    <label className="font-bold text-stone-700 block mb-1">نوع القطعة الفنية:</label>
                    <select
                      value={editingProduct.garmentType}
                      onChange={(e) => setEditingProduct({ ...editingProduct, garmentType: e.target.value as any })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    >
                      <option value="romper_short">سالوبيت بأكمام قصيرة</option>
                      <option value="romper_long">سالوبيت بأكمام طويلة</option>
                      <option value="bib">مريلة أطفال</option>
                      <option value="beanie">قبعة مواليد</option>
                      <option value="kids_tee">تيشرت أطفال كلاسيك</option>
                      <option value="shorts_set">طقم شورت وتيشرت</option>
                      <option value="cotton_dress">فستان قطني</option>
                      <option value="youth_tee">تيشرت يافعين</option>
                      <option value="crewneck">سويت شيرت كرو نيك</option>
                      <option value="hoodie">هودي شتوي بقلنسوة</option>
                    </select>
                  </div>
                </div>

                {/* 3. Sizes Customization */}
                <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="font-bold text-stone-800 block">
                    المقاسات المتاحة للطلب:
                  </label>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {editingProduct.sizes.map((sz) => (
                      <span
                        key={sz}
                        className="bg-white border border-stone-300 px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-800 flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{sz}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSizeFromEdit(sz)}
                          className="text-stone-400 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="أضف مقاس جديد (مثال: 6-9 شهر أو 3-4 سنوات)..."
                      value={newSizeInput}
                      onChange={(e) => setNewSizeInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddSizeToEdit}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold"
                    >
                      + إضافة مقاس
                    </button>
                  </div>
                </div>

                {/* 4. Available Colors Management */}
                <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-800 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-amber-600" />
                      <span>الألوان المتوفرة لهذا الموديل ({editingProduct.colors.length} ألوان):</span>
                    </label>
                    <span className="text-[10px] text-stone-500">
                      يمكنك إضافة درجات ألوان جديدة أو حذف ألوان
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    {editingProduct.colors.map((col) => (
                      <span
                        key={col.id}
                        className="bg-white border border-stone-300 px-2.5 py-1 rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-2 shadow-2xs"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-400 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        {editingProduct.colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveColorFromEdit(col.id)}
                            className="text-stone-400 hover:text-red-600 cursor-pointer"
                            title="حذف هذا اللون"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Add New Color Form */}
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200 mt-2 space-y-2">
                    <span className="text-[11px] font-bold text-stone-700 block">إضافة لون جديد للمنتج:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-9 h-9 p-0.5 rounded-lg border border-stone-300 cursor-pointer shrink-0"
                        title="اختيار درجة اللون"
                      />
                      <input
                        type="text"
                        placeholder="اسم اللون (مثال: أزرق سماوي، سكري، وردي هادئ)..."
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddColorToEdit}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                      >
                        + إضافة اللون
                      </button>
                    </div>

                    {/* Quick Color Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                      <span className="text-stone-400 font-medium">ألوان شائعة:</span>
                      {[
                        { name: 'أبيض ناصع', hex: '#FFFFFF' },
                        { name: 'سكري عاجي', hex: '#FDFBF7' },
                        { name: 'وردي باستيل', hex: '#FCE7F3' },
                        { name: 'أزرق سماوي', hex: '#E0F2FE' },
                        { name: 'رمادي فاتح', hex: '#F3F4F6' },
                        { name: 'كحلي ملكي', hex: '#1E293B' },
                        { name: 'أصفر ليموني', hex: '#FEF08A' },
                        { name: 'أخضر نعناعي', hex: '#D1FAE5' },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setNewColorName(preset.name);
                            setNewColorHex(preset.hex);
                          }}
                          className="px-2 py-0.5 bg-stone-100 hover:bg-amber-100 rounded border border-stone-200 text-stone-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span
                            className="w-2 h-2 rounded-full border border-stone-300"
                            style={{ backgroundColor: preset.hex }}
                          />
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Features bullet list */}
                <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="font-bold text-stone-800 block">
                    المميزات ونقاط الجودة (Bullet points):
                  </label>
                  <div className="space-y-1">
                    {editingProduct.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1.5 bg-white rounded border border-stone-200 text-xs">
                        <span>• {feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureFromEdit(idx)}
                          className="text-stone-400 hover:text-red-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="أضف ميزة جديدة (مثال: خالي من النيكل، أحبار آمنة)..."
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeatureToEdit}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold"
                    >
                      + إضافة ميزة
                    </button>
                  </div>
                </div>

                {/* Footer Save Buttons */}
                <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-stone-300 rounded-xl font-bold text-stone-700 hover:bg-stone-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-xs"
                  >
                    حفظ كافة التعديلات
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: ADD NEW PRODUCT MODAL */}
        {/* ============================================================== */}
        {isAddProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <h3 className="text-sm font-bold text-stone-900">إضافة منتج قطني جديد لمتجر 2BabyPrint</h3>
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">اسم الموديل (عربي):</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سالوبيت صيفي بطبعة قطنية ناعمة"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">الفئة العمرية:</label>
                    <select
                      value={newProductAgeGroup}
                      onChange={(e) => setNewProductAgeGroup(e.target.value as AgeGroup)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    >
                      <option value="0-2">حديثي الولادة والرضع (0-2 سنة)</option>
                      <option value="3-5">الأطفال الصغار (3-5 سنوات)</option>
                      <option value="6-10">اليافعين (6-10 سنوات)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">القسم:</label>
                    <input
                      type="text"
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">سعر البيع للعميل (ج.م):</label>
                    <input
                      type="number"
                      required
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">السعر الأصلي قبل الخصم (ج.م):</label>
                    <input
                      type="number"
                      value={newProductOriginalPrice}
                      onChange={(e) => setNewProductOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">صورة المنتج الأساسية:</label>
                  <input
                    type="text"
                    value={newProductImage}
                    onChange={(e) => setNewProductImage(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mb-1.5"
                  />
                  <div className="flex gap-2">
                    {CURATED_MOCKUPS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setNewProductImage(m.url)}
                        className="px-2 py-0.5 text-[10px] bg-stone-100 hover:bg-stone-200 rounded text-stone-700"
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">وصف المنتج:</label>
                  <textarea
                    rows={2}
                    value={newProductDesc}
                    onChange={(e) => setNewProductDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl resize-none"
                    placeholder="تفاصيل النعومة والأزرار وسهولة الارتداء..."
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 rounded-xl font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-xs"
                  >
                    إضافة المنتج
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 3: ADD NEW COUPON MODAL */}
        {/* ============================================================== */}
        {isAddCouponModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <h3 className="text-sm font-bold text-stone-900">إنشاء كود خصم جديد (Coupon)</h3>
                <button
                  type="button"
                  onClick={() => setIsAddCouponModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">كود الخصم (بالحروف الإنجليزية):</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: CAIRO2026"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono uppercase font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">نوع الخصم:</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as 'percentage' | 'fixed')}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    >
                      <option value="percentage">نسبة مئوية (%)</option>
                      <option value="fixed">مبلغ ثابت (ج.م)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">قيمة الخصم:</label>
                    <input
                      type="number"
                      required
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">الحد الأدنى للطلب (ج.م):</label>
                  <input
                    type="number"
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">وصف العرض للعملاء:</label>
                  <input
                    type="text"
                    placeholder="مثال: خصم 10% بمناسبة افتتاح المتجر في القاهرة"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCouponModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 rounded-xl font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-xs"
                  >
                    حفظ وتفعيل الكوبون
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 4: ORDER DETAILS VIEW MODAL (معاينة تفاصيل الطلب والتصميم) */}
        {/* ============================================================== */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      طلب رقم {selectedOrderDetails.orderNumber}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      بتاريخ {selectedOrderDetails.date} · العميل: {selectedOrderDetails.customerName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700">
                {/* Customer & Address Details */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-stone-400 block">رقم الهاتف:</span>
                    <strong className="font-mono">{selectedOrderDetails.phone}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 block">طريقة الدفع المؤكدة:</span>
                    <strong className="text-emerald-800">
                      {selectedOrderDetails.paymentMethod === 'instapay'
                        ? `إنستاباي (${selectedOrderDetails.instapayReference || 'تحويل مباشر'})`
                        : selectedOrderDetails.paymentMethod === 'wallets'
                        ? 'محفظة إلكترونية (فودافون كاش)'
                        : 'بطاقة فيزا / ماستركارد'}
                    </strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[11px] text-stone-400 block">عنوان التوصيل في القاهرة:</span>
                    <strong>{selectedOrderDetails.address} ({selectedOrderDetails.city})</strong>
                  </div>
                </div>

                {/* Items and Custom Design Preview */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-stone-900">القطع المطلوبة مع تفاصيل الطباعة:</h4>
                  {selectedOrderDetails.items.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg p-1 border border-stone-300">
                          <GarmentSilhouette garmentType={item.garmentType} colorHex={item.color.hex} side="front" />
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">{item.productName}</div>
                          <div className="text-[11px] text-stone-500">
                            المقاس: <strong>{item.size}</strong> · اللون: {item.color.name} · الكمية: {item.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {item.design.front.elements.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleDownloadItemPrint(selectedOrderDetails, idx, 'front')}
                            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>تحميل ملف الطباعة 300 DPI</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between font-bold">
                  <span>إجمالي المدفوع:</span>
                  <span className="text-base text-amber-900 font-mono">{selectedOrderDetails.total} ج.م</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
