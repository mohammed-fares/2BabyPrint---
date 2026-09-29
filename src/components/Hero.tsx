import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Palette,
  Truck,
} from 'lucide-react';
import { Translations, Language } from '../i18n/translations';
import { StoreSettings, HeroSlide } from '../types';

interface HeroProps {
  t: Translations;
  lang: Language;
  onStartCustomizing: () => void;
  onExploreTemplates: () => void;
  storeSettings?: StoreSettings;
}

export const Hero: React.FC<HeroProps> = ({
  t,
  lang,
  onStartCustomizing,
  onExploreTemplates,
  storeSettings,
}) => {
  const isEn = lang === 'en';
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  // Standard classic slides list
  const defaultSlides: HeroSlide[] = [
    {
      id: 'slide-1',
      badge: storeSettings?.heroBadge || '✨ قطن مصري 100% فائق النعومة مخصص لبشرة الأطفال الحساسة',
      badgeEn: storeSettings?.heroBadgeEn || '✨ 100% Pure Egyptian Cotton Ultra-Soft for Baby Skin',
      title: storeSettings?.heroTitle || 'ملابس أطفال تُخلّد أجمل ذكريات البدايات',
      titleEn: storeSettings?.heroTitleEn || 'Cherished Custom Outfits for Your Little Ones',
      subtitle:
        storeSettings?.heroSubtitle ||
        'صممي سالوبيتات وتيشرتات وهوديز فريدة لطفلك من سن المواليد وحتى 10 سنوات، مطبوعة رقمياً بأعلى دقة على أجود خامات القطن المصري في القاهرة.',
      subtitleEn:
        storeSettings?.heroSubtitleEn ||
        'Design unique baby rompers, tees, and hoodies from newborn to 10 years, digitally printed with eco-safe inks on premium Egyptian cotton.',
      ctaText: storeSettings?.heroCta || 'ابدئي التصميم الآن مجاناً 🎨',
      ctaTextEn: storeSettings?.heroCtaEn || 'Start Customizing Now 🎨',
      ctaLink: 'catalog',
      imageUrl: storeSettings?.heroImageUrl || '/src/assets/images/hero_baby_apparel_1790519873737.jpg',
      captionTitle: 'معاينة حية ومباشرة',
      captionSubtitle: 'شاهدي اسم طفلك وتصميمك على الموك آب قبل الطباعة',
    },
    {
      id: 'slide-2',
      badge: '👑 تشكيلة السبوع الملكي والمواليد الجدد',
      badgeEn: '👑 Royal Sebou & Newborn Baby Shower Collection',
      title: 'أول إطلالة لطفلك في السبوع باسمه وتاريخ ميلاده',
      titleEn: 'Your Baby’s First Royal Outfit with Custom Name',
      subtitle:
        'سالوبيتات سبوع قطنية ناصعة البياض مطبوعة بأحبار مائية خالية من أي ملمس خشن، مع خيارات التيجان الملكية وعبارات التهنئة الفاخرة لتخليد اليوم.',
      subtitleEn:
        'Ultra-gentle pure white rompers with royal crests and customized names, designed for baby skin and milestone celebration photos.',
      ctaText: 'استعراض تصاميم السبوع 👶',
      ctaTextEn: 'Explore Sebou Designs 👶',
      ctaLink: 'templates',
      imageUrl: '/src/assets/images/product_romper_studio_1790519885828.jpg',
      captionTitle: 'قطن ناعم كالحرير',
      captionSubtitle: 'أحبار مائية بيئية 100% لا تسبب أي حساسية لجلد الرضيع',
    },
    {
      id: 'slide-3',
      badge: '🎂 فوتوسيشن وأعياد ميلاد مميزة',
      badgeEn: '🎂 Birthday Milestones & Family Photo Sessions',
      title: 'أطقم أعياد الميلاد وهوديز العائلة بطباعة رقمية مبهرة',
      titleEn: 'Matching Birthday Tees & Cozy Custom Hoodies',
      subtitle:
        'احتفلي بسنة طفلك الأولى أو عيد ميلاده المفضل بأطقم أنيقة مطبوعة باسمه ورقمه، مع تيشرتات متطابقة للأب والأم لذكريات لا تُنسى في كل صورة.',
      subtitleEn:
        'Celebrate every birthday milestone with vibrant wash-proof colors and matching family outfits ready for photography.',
      ctaText: 'صممي طقم عيد الميلاد 🥳',
      ctaTextEn: 'Design Birthday Set 🥳',
      ctaLink: 'catalog',
      imageUrl: '/src/assets/images/product_hoodie_kids_1790519897372.jpg',
      captionTitle: 'ألوان حية وثابتة',
      captionSubtitle: 'تقنية DTF الرقمية الدقيقة المقاومة للغسيل المتكرر',
    },
  ];

  const slides: HeroSlide[] =
    storeSettings?.heroSlides && storeSettings.heroSlides.length > 0
      ? storeSettings.heroSlides
      : defaultSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Classic Auto-Play every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;

    autoPlayRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [currentIndex, isHovered, slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentIndex] || slides[0];

  const handlePrimaryClick = () => {
    if (activeSlide.ctaLink === 'templates') {
      onExploreTemplates();
    } else {
      onStartCustomizing();
    }
  };

  const heroSecondaryCta = isEn
    ? storeSettings?.heroSecondaryCtaEn || t.hero.ctaSecondary
    : storeSettings?.heroSecondaryCta || t.hero.ctaSecondary;

  const heroProofCotton = isEn
    ? storeSettings?.heroProofCottonEn || t.hero.proofCotton
    : storeSettings?.heroProofCotton || t.hero.proofCotton;

  const heroProofInks = isEn
    ? storeSettings?.heroProofInksEn || t.hero.proofInks
    : storeSettings?.heroProofInks || t.hero.proofInks;

  const badgeText = isEn ? activeSlide.badgeEn || activeSlide.badge : activeSlide.badge;
  const titleText = isEn ? activeSlide.titleEn || activeSlide.title : activeSlide.title;
  const subtitleText = isEn ? activeSlide.subtitleEn || activeSlide.subtitle : activeSlide.subtitle;
  const ctaText = isEn ? activeSlide.ctaTextEn || activeSlide.ctaText : activeSlide.ctaText;

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] to-[#FAF9F6] border-b border-stone-200/80 font-sans select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 relative">
        {/* =========================================================================
            CLASSIC HERO SLIDER (Standard 2-Column Responsive Carousel)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* 1. Left Text Block */}
          <div className="lg:col-span-6 space-y-6">
            {/* Badge / Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{badgeText}</span>
            </div>

            {/* Slide Title with smooth transition */}
            <h1
              key={`title-${currentIndex}`}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 leading-[1.25] tracking-tight animate-in fade-in duration-300"
              style={{ textWrap: 'balance' }}
            >
              {titleText}
            </h1>

            {/* Slide Subtitle */}
            <p
              key={`desc-${currentIndex}`}
              className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl animate-in fade-in duration-300"
            >
              {subtitleText}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrimaryClick}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-sm flex items-center gap-2.5 cursor-pointer"
              >
                <Palette className="w-4 h-4" />
                <span>{ctaText}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreTemplates}
                className="px-5 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                {heroSecondaryCta}
              </button>
            </div>

            {/* Trust Points */}
            <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-6 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{heroProofCotton}</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{heroProofInks}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{isEn ? 'Same-day express option' : 'متاح شحن اليوم (أوبر سكوتر)'}</span>
              </div>
            </div>
          </div>

          {/* 2. Right Image Showcase with Classic Arrows and Caption */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/90 aspect-16/10 bg-stone-100 group">
              <img
                key={`img-${currentIndex}`}
                src={activeSlide.imageUrl}
                alt={titleText}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 animate-in fade-in duration-400"
                referrerPolicy="no-referrer"
              />

              {/* Gradient overlay and slide caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/10 flex items-end p-6">
                <div className="text-white flex-1">
                  <span className="text-xs font-bold text-amber-300 block mb-0.5 tracking-wide">
                    {activeSlide.captionTitle || t.hero.previewTag}
                  </span>
                  <p className="text-sm font-medium text-stone-100 max-w-md">
                    {activeSlide.captionSubtitle || t.hero.previewDesc}
                  </p>
                </div>
              </div>

              {/* Classic Navigation Arrows (Previous / Next) */}
              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute top-1/2 -translate-y-1/2 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-stone-900 flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute top-1/2 -translate-y-1/2 left-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-stone-900 flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer z-10"
                    aria-label="Next slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Classic Slide Dots Pagination */}
            {slides.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx
                        ? 'w-8 bg-amber-500'
                        : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
