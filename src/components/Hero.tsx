import React from 'react';
import { Sparkles, ArrowLeft, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Translations, Language } from '../i18n/translations';
import { StoreSettings } from '../types';

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

  const heroBadge = isEn ? (storeSettings?.heroBadgeEn || t.hero.kicker) : (storeSettings?.heroBadge || t.hero.kicker);
  const heroTitle = isEn
    ? (storeSettings?.heroTitleEn || (
        <>
          {t.hero.title1}
          <span className="text-amber-700 block mt-1">{t.hero.title2}</span>
        </>
      ))
    : (storeSettings?.heroTitle || (
        <>
          {t.hero.title1}
          <span className="text-amber-700 block mt-1">{t.hero.title2}</span>
        </>
      ));
  const heroSubtitle = isEn ? (storeSettings?.heroSubtitleEn || t.hero.subtitle) : (storeSettings?.heroSubtitle || t.hero.subtitle);
  const heroCta = isEn ? (storeSettings?.heroCtaEn || t.hero.ctaPrimary) : (storeSettings?.heroCta || t.hero.ctaPrimary);
  const heroSecondaryCta = isEn ? (storeSettings?.heroSecondaryCtaEn || t.hero.ctaSecondary) : (storeSettings?.heroSecondaryCta || t.hero.ctaSecondary);
  const heroProofCotton = isEn ? (storeSettings?.heroProofCottonEn || t.hero.proofCotton) : (storeSettings?.heroProofCotton || t.hero.proofCotton);
  const heroProofInks = isEn ? (storeSettings?.heroProofInksEn || t.hero.proofInks) : (storeSettings?.heroProofInks || t.hero.proofInks);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] to-[#FAF9F6] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Quiet 1-line kicker (No pill badge) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{heroBadge}</span>
            </div>

            {/* Display Headline with text-wrap: balance */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 leading-[1.25] tracking-tight"
              style={{
                textWrap: 'balance',
              }}
            >
              {heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
              {heroSubtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onStartCustomizing}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-sm flex items-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{heroCta}</span>
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

            {/* Quantitative Proof & Trust adjacency */}
            <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-6 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{heroProofCotton}</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-600" />
                <span>{heroProofInks}</span>
              </div>
            </div>
          </div>

          {/* Focal Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/90 aspect-16/10 bg-stone-100">
              <img
                src={storeSettings?.heroImageUrl || "/src/assets/images/hero_baby_apparel_1790519873737.jpg"}
                alt="2BabyPrint Egyptian cotton baby apparel"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-xs font-semibold text-amber-300 block mb-0.5">
                    {t.hero.previewTag}
                  </span>
                  <p className="text-sm font-medium text-stone-100">
                    {t.hero.previewDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
