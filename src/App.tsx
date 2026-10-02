import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { INITIAL_ORDERS } from './data/initialOrders';
import { INITIAL_COUPONS } from './data/coupons';
import { DEFAULT_STORE_SETTINGS } from './data/defaultSettings';
import { Product, CartItem, OrderDetails, DesignTemplate, Coupon, AppRole, StoreSettings } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturesBar } from './components/FeaturesBar';
import { ProductCatalog } from './components/ProductCatalog';
import { TemplatesShowcase } from './components/TemplatesShowcase';
import { DesignerStudioModal } from './components/DesignerStudio/DesignerStudioModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { Footer } from './components/Footer';
import { RoleHeader } from './components/RoleHeader';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { PrinterPortal } from './components/Printer/PrinterPortal';
import { CourierPortal } from './components/Courier/CourierPortal';
import { StaffLoginModal } from './components/StaffLoginModal';
import { HowItWorksTutorial } from './components/HowItWorksTutorial';
import { CustomerAiChatbot } from './components/CustomerAiChatbot';
import { translations, Language } from './i18n/translations';

export default function App() {
  // Language & i18n
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined' && window.navigator) {
      const sysLang = window.navigator.language || '';
      if (sysLang.toLowerCase().startsWith('en')) {
        return 'en';
      }
    }
    return 'ar';
  });

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Staff Authentication State (Restricted to Management & Staff)
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('2babyprint_staff_auth');
    return saved === 'true';
  });
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // Multi-Role state ('store' | 'admin' | 'printer' | 'courier')
  const [currentRole, setCurrentRole] = useState<AppRole>(() => {
    const savedRole = localStorage.getItem('2babyprint_active_role');
    const auth = localStorage.getItem('2babyprint_staff_auth') === 'true';
    if (auth && (savedRole === 'admin' || savedRole === 'printer' || savedRole === 'courier')) {
      return savedRole as AppRole;
    }
    return 'store';
  });

  // App Data States (with persistent or reactive state across all portals)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('2babyprint_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [orders, setOrders] = useState<OrderDetails[]>(() => {
    const saved = localStorage.getItem('2babyprint_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('2babyprint_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('2babyprint_settings');
    if (!saved) return DEFAULT_STORE_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_STORE_SETTINGS,
        ...parsed,
        visibleSections: {
          ...DEFAULT_STORE_SETTINGS.visibleSections,
          ...(parsed.visibleSections || {}),
        },
      };
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  // Apply dynamic fonts selected from control panel per language
  useEffect(() => {
    const arFont = storeSettings.fontArabic || 'Cairo';
    const enFont = storeSettings.fontEnglish || 'Plus Jakarta Sans';
    document.documentElement.style.setProperty('--font-ar', `'${arFont}', system-ui, -apple-system, sans-serif`);
    document.documentElement.style.setProperty('--font-en', `'${enFont}', system-ui, -apple-system, sans-serif`);
  }, [storeSettings.fontArabic, storeSettings.fontEnglish]);

  // Save changes
  useEffect(() => {
    localStorage.setItem('2babyprint_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('2babyprint_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('2babyprint_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('2babyprint_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('2babyprint_staff_auth', isStaffAuthenticated ? 'true' : 'false');
    localStorage.setItem('2babyprint_active_role', currentRole);
  }, [isStaffAuthenticated, currentRole]);

  // Customer Shopping & Studio States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioProduct, setStudioProduct] = useState<Product>(products[0] || PRODUCTS[0]);
  const [studioInitialTemplate, setStudioInitialTemplate] = useState<DesignTemplate | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Deep-linking URL and Hash handler (from Marketing Campaigns, Social Exports, QR Codes)
  useEffect(() => {
    const handleUrlHashAndQuery = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      const search = window.location.search;
      const params = new URLSearchParams(search);

      // Deep link to Studio
      if (hash.startsWith('#studio') || hash.startsWith('#designer-studio')) {
        const babyNameParam = params.get('babyName') || '';
        const prodParam = params.get('product') || '';
        if (prodParam) {
          const match = products.find((p) => p.id === prodParam || p.name.includes(prodParam));
          if (match) setStudioProduct(match);
        }
        if (babyNameParam) {
          const customTemplate: DesignTemplate = {
            id: `tpl-url-${Date.now()}`,
            title: `تصميم ${babyNameParam}`,
            subtitle: `مخصص للمولود ${babyNameParam}`,
            category: 'sebou',
            garmentType: 'romper_short',
            defaultColorId: 'c-cream',
            thumbnail: '/src/assets/images/product_romper_studio_1790519885828.jpg',
            design: {
              front: {
                elements: [
                  {
                    id: 'text-baby-name',
                    type: 'text',
                    text: `${babyNameParam} 👑`,
                    x: 60,
                    y: 120,
                    width: 180,
                    height: 50,
                    rotation: 0,
                    opacity: 1,
                    fontSize: 28,
                    fontFamily: 'Cairo',
                    fill: '#f59e0b',
                    align: 'center',
                    isBold: true,
                  },
                ],
              },
              back: { elements: [] },
            },
          };
          setStudioInitialTemplate(customTemplate);
        }
        setIsStudioOpen(true);
      } else if (hash.startsWith('#checkout')) {
        setIsCheckoutOpen(true);
      } else if (hash.startsWith('#catalog')) {
        const prodParam = params.get('product') || '';
        if (prodParam) {
          const match = products.find((p) => p.id === prodParam);
          if (match) {
            setStudioProduct(match);
            setIsStudioOpen(true);
          }
        }
        const el = document.getElementById('catalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (hash.startsWith('#templates')) {
        const el = document.getElementById('templates');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    handleUrlHashAndQuery();
    window.addEventListener('hashchange', handleUrlHashAndQuery);
    return () => window.removeEventListener('hashchange', handleUrlHashAndQuery);
  }, [products]);

  // Open customizer specifically for a chosen product
  const handleOpenCustomizerForProduct = (product: Product) => {
    setStudioProduct(product);
    setStudioInitialTemplate(null);
    setIsStudioOpen(true);
  };

  // Open customizer with a pre-configured design template
  const handleOpenCustomizerWithTemplate = (template: DesignTemplate) => {
    const matchingProduct =
      products.find((p) => p.garmentType === template.garmentType) || products[0];
    setStudioProduct(matchingProduct);
    setStudioInitialTemplate(template);
    setIsStudioOpen(true);
  };

  // Add customized item from studio to cart
  const handleAddToCart = (customizedItem: {
    productId: string;
    productName: string;
    productImage: string;
    garmentType: Product['garmentType'];
    color: CartItem['color'];
    size: string;
    quantity: number;
    unitPrice: number;
    design: CartItem['design'];
    mockupPreviewUrl: string;
    printSides: ('front' | 'back')[];
    customNotes?: string;
  }) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...customizedItem,
    };
    setCartItems((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // New order placed via Checkout
  const handleOrderPlaced = (order: OrderDetails) => {
    setConfirmedOrder(order);
    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);

    // If coupon used, increment its usage
    if (order.couponCode) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.code.toUpperCase() === order.couponCode?.toUpperCase()
            ? { ...c, usageCount: c.usageCount + 1 }
            : c
        )
      );
    }
  };

  // Update order status from Admin, Printer, or Courier
  const handleUpdateOrderStatus = (orderNumber: string, status: OrderDetails['status']) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNumber === orderNumber
          ? { ...o, status, updatedAt: 'منذ لحظات' }
          : o
      )
    );
  };

  // Product management actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleUpdateProductPrice = (id: string, newPrice: number, newOriginalPrice?: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, price: newPrice, originalPrice: newOriginalPrice } : p
      )
    );
  };

  const handleReorderProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Coupon management actions
  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const handleToggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  // Store Settings action
  const handleUpdateStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 flex flex-col font-sans">
      {/* 1. RESTRICTED STAFF ROLE HEADER (Shown ONLY when Staff is Authenticated) */}
      {isStaffAuthenticated && (
        <RoleHeader
          currentRole={currentRole}
          onSelectRole={setCurrentRole}
          orders={orders}
          lang={lang}
          onLogout={() => {
            setIsStaffAuthenticated(false);
            setCurrentRole('store');
          }}
        />
      )}

      {/* 2. ROLE VIEW ROUTING (Accessible ONLY when Authenticated) */}
      {isStaffAuthenticated && currentRole === 'admin' && (
        <AdminDashboard
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onUpdateProductPrice={handleUpdateProductPrice}
          onReorderProducts={handleReorderProducts}
          onDeleteProduct={handleDeleteProduct}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          coupons={coupons}
          onAddCoupon={handleAddCoupon}
          onToggleCoupon={handleToggleCoupon}
          onDeleteCoupon={handleDeleteCoupon}
          storeSettings={storeSettings}
          onUpdateStoreSettings={handleUpdateStoreSettings}
        />
      )}

      {isStaffAuthenticated && currentRole === 'printer' && (
        <PrinterPortal
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {isStaffAuthenticated && currentRole === 'courier' && (
        <CourierPortal
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {/* 3. STOREFRONT CUSTOMER VIEW (Default view for all regular visitors) */}
      {(!isStaffAuthenticated || currentRole === 'store') && (
        <>
          <Header
            cartItems={cartItems}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            lang={lang}
            t={t}
            onToggleLanguage={toggleLanguage}
            storeSettings={storeSettings}
            onOpenStaffLogin={() => setIsStaffModalOpen(true)}
            isStaffAuthenticated={isStaffAuthenticated}
          />

          <main className="flex-1">
            {storeSettings.sectionsOrder.map((sectionKey) => {
              if (!storeSettings.visibleSections[sectionKey]) return null;

              if (sectionKey === 'hero') {
                return (
                  <Hero
                    key="hero"
                    onStartCustomizing={() => {
                      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onExploreTemplates={() => {
                      document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    t={t}
                    lang={lang}
                    storeSettings={storeSettings}
                  />
                );
              }

              if (sectionKey === 'features') {
                return (
                  <React.Fragment key="features-and-tutorial">
                    <FeaturesBar t={t} lang={lang} storeSettings={storeSettings} />
                    <HowItWorksTutorial
                      lang={lang}
                      onStartDesigning={() => handleOpenCustomizerForProduct(products[0])}
                      onExploreCatalog={() => {
                        document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    />
                  </React.Fragment>
                );
              }

              if (sectionKey === 'catalog') {
                return (
                  <ProductCatalog
                    key="catalog"
                    products={products}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onOpenCustomizer={handleOpenCustomizerForProduct}
                    t={t}
                    lang={lang}
                    storeSettings={storeSettings}
                  />
                );
              }

              if (sectionKey === 'templates') {
                return (
                  <TemplatesShowcase
                    key="templates"
                    onSelectTemplate={handleOpenCustomizerWithTemplate}
                    t={t}
                    lang={lang}
                    storeSettings={storeSettings}
                  />
                );
              }

              return null;
            })}
          </main>

          <Footer
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            onExploreProducts={() => {
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenStaffLogin={() => setIsStaffModalOpen(true)}
            t={t}
            lang={lang}
            storeSettings={storeSettings}
          />

          {/* Customer Smart AI Assistant & WhatsApp Connector */}
          <CustomerAiChatbot
            storeSettings={storeSettings}
            lang={lang}
            onOpenCatalog={() => {
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          />
        </>
      )}

      {/* Lumise-like Interactive Designer Studio Modal (Opened ONLY for a chosen specific product) */}
      {isStudioOpen && (
        <DesignerStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          product={studioProduct}
          initialTemplate={studioInitialTemplate}
          onAddToCart={handleAddToCart}
          t={t}
          lang={lang}
        />
      )}

      {/* Staff Login Modal (Password-protected for Manager & Production Operators) */}
      <StaffLoginModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onLoginSuccess={(role) => {
          setIsStaffAuthenticated(true);
          setCurrentRole(role);
        }}
        lang={lang}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        t={t}
        lang={lang}
      />

      {/* WooCommerce Checkout Modal (No COD, Prepayments only + Coupons) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderPlaced={handleOrderPlaced}
        coupons={coupons}
        storeSettings={storeSettings}
        t={t}
        lang={lang}
      />

      {/* Post-Order Receipt & Order Tracking */}
      {confirmedOrder && (
        <OrderSuccessModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          storeSettings={storeSettings}
          t={t}
          lang={lang}
        />
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        t={t}
        lang={lang}
        storeSettings={storeSettings}
      />
    </div>
  );
}
