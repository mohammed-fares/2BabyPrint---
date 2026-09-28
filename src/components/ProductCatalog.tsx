import React, { useState } from 'react';
import { Product, StoreSettings } from '../types';
import { Sparkles, ArrowUpRight, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Translations, Language } from '../i18n/translations';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenCustomizer: (product: Product) => void;
  t: Translations;
  lang: Language;
  storeSettings?: StoreSettings;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onOpenCustomizer,
  t,
  lang,
  storeSettings,
}) => {
  // Map of active image index per product card
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.ageGroup === selectedCategory;
  });

  const gridColsClass =
    storeSettings?.gridColumns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : storeSettings?.gridColumns === 4
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  const aspectClass =
    storeSettings?.cardAspectRatio === '1/1'
      ? 'aspect-square'
      : storeSettings?.cardAspectRatio === '3/4'
      ? 'aspect-3/4'
      : 'aspect-4/3';

  const handleNextImage = (productId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % total,
    }));
  };

  const handlePrevImage = (productId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + total) % total,
    }));
  };

  return (
    <section id="catalog" className="py-14 md:py-20 bg-[#FAF9F6] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-700 mb-1">
              {storeSettings?.catalogTagline || t.catalog.tagline}
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight"
              style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Plus Jakarta Sans', sans-serif" }}
            >
              {storeSettings?.catalogTitle || t.catalog.title}
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-white text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.catalog.tabAll} ({products.length})
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('0-2')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === '0-2'
                  ? 'bg-white text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.catalog.tabInfants}
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('3-5')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === '3-5'
                  ? 'bg-white text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.catalog.tabToddlers}
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('6-10')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === '6-10'
                  ? 'bg-white text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.catalog.tabYouth}
            </button>
          </div>
        </div>

        {/* Guidance Prompt: Pick a Product to Start Customizing */}
        <div className="mb-6 p-3 sm:p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs text-amber-950 font-semibold gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {storeSettings?.catalogHint || (lang === 'ar'
                ? '💡 اختاري القطعة أو الموديل أولاً بالأسفل لبدء تخصيص التصميم والألوان والاسم في الاستوديو الحي'
                : '💡 Select any garment below to open the Live Design Studio and customize it specifically')}
            </span>
          </div>
          <span className="text-[11px] text-amber-800 font-mono hidden md:inline">
            {filteredProducts.length} {lang === 'ar' ? 'موديلات متاحة' : 'garments available'}
          </span>
        </div>

        {/* Dynamic Product Grid */}
        <div className={`grid ${gridColsClass} gap-6 sm:gap-8`}>
          {filteredProducts.map((product) => {
            const productName = lang === 'ar' ? product.name : product.nameEn;
            const allImages = [product.image, ...(product.galleryImages || [])];
            const currentImgIndex = activeImageIndexes[product.id] || 0;
            const displayedImage = allImages[currentImgIndex] || product.image;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col hover:border-amber-300 hover:shadow-md transition-all"
              >
                {/* Product Image Stage */}
                <div className={`relative ${aspectClass} bg-[#F9F9F8] overflow-hidden flex items-center justify-center p-3`}>
                  <img
                    src={displayedImage}
                    alt={productName}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />

                  {product.isBestSeller && (
                    <span className="absolute top-3 right-3 text-[11px] font-semibold text-amber-900 bg-amber-100/95 px-2 py-0.5 rounded-md shadow-2xs">
                      {t.catalog.bestSeller}
                    </span>
                  )}

                  {/* Gallery Image Switcher Arrows (if product has multiple images) */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handlePrevImage(product.id, allImages.length, e)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 hover:bg-white text-stone-800 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="الصورة السابقة"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleNextImage(product.id, allImages.length, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 hover:bg-white text-stone-800 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="الصورة التالية"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Image dots */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-stone-900/40 px-2 py-0.5 rounded-full">
                        {allImages.map((_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              i === currentImgIndex ? 'bg-amber-400 w-3' : 'bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Quick Customize overlay button */}
                  <div className="absolute inset-0 bg-stone-900/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <button
                      type="button"
                      onClick={() => onOpenCustomizer(product)}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.catalog.customizeBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Clean unboxed metadata with dot separators */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.ageLabel}</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                      {productName}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Colors & Price baseline */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1.5">
                      {product.colors.slice(0, 5).map((col) => (
                        <span
                          key={col.id}
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                      {product.colors.length > 5 && (
                        <span className="text-[10px] text-stone-400 font-mono">
                          +{product.colors.length - 5}
                        </span>
                      )}
                    </div>

                    {/* Tabular Price in EGP */}
                    <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                      <span className="text-base font-extrabold text-stone-900 font-mono tabular-nums">
                        {product.price} {t.catalog.currency}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through mr-1 font-mono">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Explicit Touch & Desktop Customize Action Button */}
                  <button
                    type="button"
                    onClick={() => onOpenCustomizer(product)}
                    className="w-full mt-3 py-2.5 px-3 bg-amber-50 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs border border-amber-200 hover:border-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-2xs group-hover:bg-amber-400 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-700 group-hover:text-stone-950" />
                    <span>{lang === 'ar' ? 'صممي هذا الموديل لطفلك' : 'Customize This Garment'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
