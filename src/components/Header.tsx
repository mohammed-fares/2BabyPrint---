import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Ruler, Globe, ChevronDown, Menu, X, Lock, Sparkles, Check } from 'lucide-react';
import { CartItem, StoreSettings } from '../types';
import { Language, Translations } from '../i18n/translations';

interface HeaderProps {
  lang: Language;
  t: Translations;
  onToggleLanguage: () => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenSizeGuide: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory?: string;
  storeSettings?: StoreSettings;
  onOpenStaffLogin: () => void;
  isStaffAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  t,
  onToggleLanguage,
  cartItems,
  onOpenCart,
  onOpenSizeGuide,
  onSelectCategory,
  selectedCategory = 'all',
  storeSettings,
  onOpenStaffLogin,
  isStaffAuthenticated = false,
}) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categoriesList = [
    { id: 'all', nameAr: 'كافة الأقسام والمنتجات', nameEn: 'All Categories', count: '10 قطع' },
    { id: '0-2', nameAr: 'حديثي الولادة والرضع (0 - 2 سنة)', nameEn: 'Newborns & Infants (0-2 Y)', count: 'سالوبيتات، مرايل، قبعات' },
    { id: '3-5', nameAr: 'الأطفال الصغار (3 - 5 سنوات)', nameEn: 'Toddlers (3-5 Y)', count: 'تيشرتات، أطقم، فساتين' },
    { id: '6-10', nameAr: 'اليافعين (6 - 10 سنوات)', nameEn: 'Youth & Teens (6-10 Y)', count: 'هوديز، سويت شيرت، تيشرت' },
  ];

  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    setIsCategoriesOpen(false);
    setIsMobileMenuOpen(false);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToCatalogToChoose = () => {
    setIsMobileMenuOpen(false);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Announcement Bar */}
      {storeSettings?.showAnnouncement !== false && (
        <div className="bg-[#FAF6EE] border-b border-amber-100/60 py-2 px-4 text-center text-xs text-amber-900 font-medium">
          <span>
            {lang === 'en'
              ? (storeSettings?.announcementTextEn || t.announcement)
              : (storeSettings?.announcementText || t.announcement)}
          </span>
        </div>
      )}

      {/* Main Header Bar */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Left/Start: Brand Wordmark */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-stone-600 hover:text-stone-900 lg:hidden rounded-lg hover:bg-stone-100 transition-colors"
            title="القائمة"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <a
            href="#"
            className="text-2xl font-extrabold tracking-tight text-stone-900 hover:text-amber-800 transition-colors flex items-center gap-1.5"
          >
            <span className="text-amber-600">
              {lang === 'en'
                ? (storeSettings?.storeNameEn || storeSettings?.storeName || '2BabyPrint')
                : (storeSettings?.storeName || '2BabyPrint')}
            </span>
          </a>
        </div>

        {/* Center: Desktop Navigation Links with Categories Dropdown */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-amber-700 transition-colors"
          >
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </a>

          {/* SINGLE DROPDOWN: الأقسام / الأصناف */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                isCategoriesOpen || selectedCategory !== 'all'
                  ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                  : 'hover:text-amber-700 hover:bg-stone-50'
              }`}
            >
              <span>{lang === 'ar' ? 'الأقسام والمنتجات' : 'Categories'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180 text-amber-700' : 'text-stone-400'}`} />
            </button>

            {/* Dropdown Menu */}
            {isCategoriesOpen && (
              <div className="absolute top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-stone-100 text-[11px] font-bold text-stone-400">
                  {lang === 'ar' ? 'اختر تصنيف الملابس:' : 'Select Garment Category:'}
                </div>
                {categoriesList.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full px-4 py-2.5 text-right flex items-center justify-between text-xs transition-colors ${
                        isSelected
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{lang === 'ar' ? cat.nameAr : cat.nameEn}</div>
                        <div className="text-[10px] text-stone-400">{cat.count}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <a
            href="#templates"
            className="hover:text-amber-700 transition-colors"
          >
            {t.nav.templates}
          </a>

          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="hover:text-amber-700 transition-colors flex items-center gap-1 text-stone-600"
          >
            <Ruler className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.nav.sizeGuide}</span>
          </button>
        </nav>

        {/* Right/End: Actions (Choose Garment to Design, Language, Cart, Staff Portal Access) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct call to choose product first to design */}
          <button
            type="button"
            onClick={handleGoToCatalogToChoose}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-2xs transition-all whitespace-nowrap cursor-pointer hover:shadow-xs active:scale-98"
            title="اختر الموديل أولاً لبدء تصميمه"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'اختر قطعة لتصميمها' : 'Pick a Garment to Design'}</span>
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50/80 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'ar' ? 'English' : 'عربي (Cairo)'}</span>
          </button>

          {/* Cart Icon with Counter */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-stone-800 transition-colors"
            title={t.cart.title}
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-amber-500 text-stone-950 font-bold text-xs rounded-full flex items-center justify-center font-mono shadow-xs">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* Discreet Staff Login Padlock (Restricted to Management/Staff) */}
          <button
            type="button"
            onClick={onOpenStaffLogin}
            className={`p-2 rounded-xl border transition-colors ${
              isStaffAuthenticated
                ? 'border-amber-400 bg-amber-50 text-amber-900'
                : 'border-transparent text-stone-400 hover:text-stone-700 hover:bg-stone-100'
            }`}
            title={lang === 'ar' ? 'بوابة دخول الإدارة والمطبعة' : 'Staff Access'}
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white p-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-stone-400 px-3 py-1">
              {lang === 'ar' ? 'أقسام المتجر:' : 'Store Categories:'}
            </div>
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                  selectedCategory === cat.id
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'text-stone-700 hover:bg-stone-50 font-medium'
                }`}
              >
                <span>{lang === 'ar' ? cat.nameAr : cat.nameEn}</span>
                <span className="text-[10px] text-stone-400">{cat.count}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
            <a
              href="#templates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-stone-700 hover:bg-stone-50 rounded-xl font-medium"
            >
              {t.nav.templates}
            </a>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSizeGuide();
              }}
              className="w-full text-right px-3 py-2 text-stone-700 hover:bg-stone-50 rounded-xl font-medium flex items-center gap-1.5"
            >
              <Ruler className="w-4 h-4 text-amber-600" />
              <span>{t.nav.sizeGuide}</span>
            </button>

            <button
              type="button"
              onClick={handleGoToCatalogToChoose}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ar' ? 'اختر قطعة لتصميمها' : 'Pick a Garment to Design'}</span>
            </button>

            {/* Staff portal option in mobile drawer */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenStaffLogin();
              }}
              className="w-full text-right px-3 py-2 text-stone-500 hover:text-stone-800 rounded-xl text-[11px] flex items-center gap-1.5 pt-2 border-t border-stone-100 mt-2"
            >
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>{lang === 'ar' ? 'بوابة الإدارة وفريق العمل' : 'Staff Portal Access'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
