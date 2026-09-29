import React, { useState } from 'react';
import { StoreSettings, ArabicFontFamily, EnglishFontFamily } from '../../types';
import {
  Sliders,
  Save,
  CheckCircle2,
  Sparkles,
  Megaphone,
  Feather,
  LayoutGrid,
  Palette,
  Phone,
  Layers,
  Ruler,
  Smartphone,
  Printer,
  Truck,
  ArrowUp,
  ArrowDown,
  Globe,
  Type,
} from 'lucide-react';

export type CmsSubTab =
  | 'typography'
  | 'hero'
  | 'header'
  | 'features'
  | 'catalog'
  | 'templates'
  | 'footer'
  | 'sections'
  | 'sizeguide'
  | 'payments';

export const ARABIC_FONTS: { id: ArabicFontFamily; name: string; style: string }[] = [
  { id: 'Cairo', name: 'خط كايرو (Cairo)', style: 'خط كلاسيكي عصري عريض متناسق' },
  { id: 'Tajawal', name: 'خط تجوال (Tajawal)', style: 'هندسي مريح للقراءة وناعم' },
  { id: 'Almarai', name: 'خط المراعي (Almarai)', style: 'تقني أنيق ونظيف ومميز' },
  { id: 'Readex Pro', name: 'خط ريديكس برو (Readex Pro)', style: 'عصري متطور مخصص لواجهات الويب' },
  { id: 'Alexandria', name: 'خط الإسكندرية (Alexandria)', style: 'طابع إنساني راقٍ متصل' },
  { id: 'Changa', name: 'خط تشانجا (Changa)', style: 'عريض ومرح وجذاب لملابس الأطفال' },
  { id: 'Baloo Bhaijaan 2', name: 'خط بالو (Baloo Bhaijaan 2)', style: 'دائري لطيف وفكاهي للأطفال والرضع' },
  { id: 'IBM Plex Sans Arabic', name: 'خط آي بي إم بلكس (IBM Plex Arabic)', style: 'احترافي عالمي ذو حضور قوي' },
];

export const ENGLISH_FONTS: { id: EnglishFontFamily; name: string; style: string }[] = [
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', style: 'Modern geometric sans' },
  { id: 'Inter', name: 'Inter', style: 'World standard clean UI font' },
  { id: 'Poppins', name: 'Poppins', style: 'Friendly circular geometric curves' },
  { id: 'Outfit', name: 'Outfit', style: 'Sleek luxury fashion branding' },
  { id: 'Montserrat', name: 'Montserrat', style: 'Bold classic aesthetic style' },
  { id: 'Nunito', name: 'Nunito', style: 'Ultra-soft rounded playful baby apparel' },
  { id: 'Playfair Display', name: 'Playfair Display', style: 'Elegant high-end editorial serif' },
];

interface CuratedMockup {
  id: string;
  label: string;
  url: string;
}

interface StorefrontCmsProps {
  settingsForm: StoreSettings;
  setSettingsForm: React.Dispatch<React.SetStateAction<StoreSettings>>;
  onSaveSettings: () => void;
  savedSettingsNotice: boolean;
  curatedMockups: CuratedMockup[];
}

export const StorefrontCms: React.FC<StorefrontCmsProps> = ({
  settingsForm,
  setSettingsForm,
  onSaveSettings,
  savedSettingsNotice,
  curatedMockups,
}) => {
  const [cmsSubTab, setCmsSubTab] = useState<CmsSubTab>('typography');
  const [cmsLanguage, setCmsLanguage] = useState<'ar' | 'en'>('ar');

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

  return (
    <div className="space-y-6">
      {/* Top CMS Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-600" />
            <span>محرر وتخصيص واجهة المتجر بالكامل (Storefront CMS)</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            تحكم كامل في نصوص البانر، شريط الإعلانات، مميزات الخامات والطباعة، كتالوج المنتجات، بيانات الفوتر، وجداول المقاسات المعتمدة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveSettings}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ وتطبيق التعديلات في المتجر فوراً</span>
          </button>
        </div>
      </div>

      {savedSettingsNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>تم حفظ إعدادات وتخصيصات واجهة المتجر بنجاح وتحديث كافة الأقسام على الفور!</span>
        </div>
      )}

      {/* CMS Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-2xs">
        {[
          { id: 'typography', label: 'الخطوط والمظهر (Fonts)', icon: Type },
          { id: 'hero', label: 'البانر الترحيبي (Hero)', icon: Sparkles },
          { id: 'header', label: 'الهيدر والإعلانات', icon: Megaphone },
          { id: 'features', label: 'شريط المميزات', icon: Feather },
          { id: 'catalog', label: 'كتالوج المنتجات والعرض', icon: LayoutGrid },
          { id: 'templates', label: 'معرض القوالب', icon: Palette },
          { id: 'footer', label: 'الفوتر وبيانات التواصل', icon: Phone },
          { id: 'sections', label: 'ترتيب وإظهار الأقسام', icon: Layers },
          { id: 'sizeguide', label: 'دليل المقاسات المعتمد', icon: Ruler },
          { id: 'payments', label: 'التحويلات والشحن بالقاهرة', icon: Smartphone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = cmsSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCmsSubTab(tab.id as CmsSubTab)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-stone-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bilingual Content Editor Toggle (for text sections) */}
      {cmsSubTab !== 'sections' && cmsSubTab !== 'typography' && cmsSubTab !== 'sizeguide' && cmsSubTab !== 'payments' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 border border-stone-200/80 p-3 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
            <Globe className="w-4 h-4 text-amber-600" />
            <span>لغة المحتوى والنصوص المراد تحريرها في المتجر:</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setCmsLanguage('ar')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                cmsLanguage === 'ar' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🇸🇦 العربية (المحتوى الأساسي)</span>
            </button>
            <button
              type="button"
              onClick={() => setCmsLanguage('en')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                cmsLanguage === 'en' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🇬🇧 English (English Storefront)</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 0: DYNAMIC TYPOGRAPHY & FONT MANAGER CMS */}
      {/* ============================================================== */}
      {cmsSubTab === 'typography' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-amber-600" />
              <span>تحديد نوع الخط المستخدم للواجهة (Typography & Font Manager)</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              اختاري نوع الخط المناسب للغة العربية واللغة الإنجليزية لتطبيقه فوراً على كافة نصوص وعناوين وأزرار المتجر
            </p>
          </div>

          {/* Arabic Font Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-900 flex items-center justify-between">
              <span>1. نوع الخط المستخدم للغة العربية (Arabic Font):</span>
              <span className="text-amber-800 text-[11px] font-mono bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-bold">
                الخط المحدد: {settingsForm.fontArabic || 'Cairo'}
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ARABIC_FONTS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, fontArabic: font.id })}
                  className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                    (settingsForm.fontArabic || 'Cairo') === font.id
                      ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/50 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-sm text-stone-900" style={{ fontFamily: `'${font.id}', sans-serif` }}>
                    {font.name}
                  </div>
                  <div className="text-[11px] text-stone-600 mt-1" style={{ fontFamily: `'${font.id}', sans-serif` }}>
                    معاينة: قطن مصري 100% لبشرة الرضع
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1.5 pt-1 border-t border-stone-100">
                    {font.style}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* English Font Selector */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <label className="text-xs font-bold text-stone-900 flex items-center justify-between">
              <span>2. نوع الخط المستخدم للغة الإنجليزية (English Font):</span>
              <span className="text-amber-800 text-[11px] font-mono bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-bold">
                Selected: {settingsForm.fontEnglish || 'Plus Jakarta Sans'}
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" dir="ltr">
              {ENGLISH_FONTS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, fontEnglish: font.id })}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    (settingsForm.fontEnglish || 'Plus Jakarta Sans') === font.id
                      ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/50 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-sm text-stone-900" style={{ fontFamily: `'${font.id}', sans-serif` }}>
                    {font.name}
                  </div>
                  <div className="text-[11px] text-stone-600 mt-1" style={{ fontFamily: `'${font.id}', sans-serif` }}>
                    Sample: 100% Pure Egyptian Cotton
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1.5 pt-1 border-t border-stone-100">
                    {font.style}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Typography Preview Box */}
          <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-4 shadow-sm">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>معاينة حية ومباشرة للخطوط المطبقة على واجهة المتجر:</span>
              </span>
              <span className="text-[11px] text-stone-400 font-mono">
                عربي: {settingsForm.fontArabic || 'Cairo'} | English: {settingsForm.fontEnglish || 'Plus Jakarta Sans'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-stone-800/80 space-y-2 border border-stone-700" style={{ fontFamily: `'${settingsForm.fontArabic || 'Cairo'}', sans-serif` }}>
              <h3 className="text-xl font-extrabold text-amber-400">
                {settingsForm.heroTitle || 'ملابس أطفال تُخلّد أجمل ذكريات البدايات'}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {settingsForm.heroSubtitle || 'صممي سالوبيتات وتيشرتات وهوديز فريدة لطفلك من سن المواليد وحتى 10 سنوات، مطبوعة رقمياً على أجود خامات القطن المصري في القاهرة.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-800/80 space-y-2 text-left border border-stone-700" dir="ltr" style={{ fontFamily: `'${settingsForm.fontEnglish || 'Plus Jakarta Sans'}', sans-serif` }}>
              <h3 className="text-xl font-extrabold text-amber-400">
                {settingsForm.heroTitleEn || 'Cherished Custom Outfits for Your Little Ones'}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {settingsForm.heroSubtitleEn || 'Design unique baby rompers, tees, and hoodies from newborn to 10 years, digitally printed with eco-safe inks on premium Egyptian cotton in Cairo.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 1: HERO SECTION CMS */}
      {/* ============================================================== */}
      {cmsSubTab === 'hero' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>تخصيص البانر الترحيبي الرئيسي (Hero Banner Section)</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                الواجهة الأولى التي يراها زوار وأمهات الأطفال في القاهرة عند فتح الموقع ({cmsLanguage === 'ar' ? 'العربية' : 'English'})
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
              {cmsLanguage === 'ar' ? 'تحرير النص العربي 🇸🇦' : 'Editing English 🇬🇧'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-4">
              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'الشارة الترويجية العلوية (Badge):' : 'Hero Kicker Badge (English):'}
                </label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.heroBadge || '') : (settingsForm.heroBadgeEn || '')}
                  placeholder={cmsLanguage === 'ar' ? '✨ قطن مصري 100% فائق النعومة مخصص للأطفال' : '✨ 100% Pure Egyptian Cotton Ultra-Soft for Baby Skin'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, heroBadge: e.target.value })
                      : setSettingsForm({ ...settingsForm, heroBadgeEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'العنوان الرئيسي الكبير (Headline):' : 'Main Display Headline (English):'}
                </label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? settingsForm.heroTitle : (settingsForm.heroTitleEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'ملابس أطفال تُخلّد أجمل ذكريات البدايات' : 'Cherished Custom Outfits for Your Little Ones'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, heroTitle: e.target.value })
                      : setSettingsForm({ ...settingsForm, heroTitleEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'النص الوصفي التوضيحي (Subtitle):' : 'Descriptive Subtitle (English):'}
                </label>
                <textarea
                  rows={3}
                  value={cmsLanguage === 'ar' ? settingsForm.heroSubtitle : (settingsForm.heroSubtitleEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'صممي سالوبيتات وتيشرتات وهوديز فريدة لطفلك...' : 'Design unique baby rompers, tees, and hoodies from newborn to 10 years...'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })
                      : setSettingsForm({ ...settingsForm, heroSubtitleEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 font-bold block mb-1">
                    {cmsLanguage === 'ar' ? 'زر الإجراء الأول (CTA):' : 'Primary CTA Button (English):'}
                  </label>
                  <input
                    type="text"
                    value={cmsLanguage === 'ar' ? settingsForm.heroCta : (settingsForm.heroCtaEn || '')}
                    placeholder={cmsLanguage === 'ar' ? 'ابدئي التصميم واختاري الموديل 🎨' : 'Start Customizing Now 🎨'}
                    onChange={(e) =>
                      cmsLanguage === 'ar'
                        ? setSettingsForm({ ...settingsForm, heroCta: e.target.value })
                        : setSettingsForm({ ...settingsForm, heroCtaEn: e.target.value })
                    }
                    dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold block mb-1">
                    {cmsLanguage === 'ar' ? 'زر الإجراء الثانوي:' : 'Secondary CTA Button (English):'}
                  </label>
                  <input
                    type="text"
                    value={cmsLanguage === 'ar' ? (settingsForm.heroSecondaryCta || '') : (settingsForm.heroSecondaryCtaEn || '')}
                    placeholder={cmsLanguage === 'ar' ? 'استعراض القوالب والأفكار 💡' : 'Explore Ready Ideas 💡'}
                    onChange={(e) =>
                      cmsLanguage === 'ar'
                        ? setSettingsForm({ ...settingsForm, heroSecondaryCta: e.target.value })
                        : setSettingsForm({ ...settingsForm, heroSecondaryCtaEn: e.target.value })
                    }
                    dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-stone-700 font-bold block mb-1">رابط صورة البانر الرئيسية (Hero Image):</label>
                <input
                  type="text"
                  value={settingsForm.heroImageUrl || ''}
                  placeholder="/src/assets/images/hero_baby_apparel_1790519873737.jpg"
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-[11px]"
                  dir="ltr"
                />
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-stone-500 font-semibold">نماذج سريعة:</span>
                  {curatedMockups.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, heroImageUrl: m.url })}
                      className="px-2 py-1 bg-stone-100 hover:bg-amber-100 rounded text-[10px] text-stone-700 transition-colors cursor-pointer"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-stone-700 font-bold block mb-1">
                    {cmsLanguage === 'ar' ? 'نقطة ثقة الخامات (القطن):' : 'Proof (Cotton - English):'}
                  </label>
                  <input
                    type="text"
                    value={cmsLanguage === 'ar' ? (settingsForm.heroProofCotton || '') : (settingsForm.heroProofCottonEn || '')}
                    placeholder={cmsLanguage === 'ar' ? 'قطن مصري 100% معتمد للمواليد' : '100% Certified Egyptian Cotton'}
                    onChange={(e) =>
                      cmsLanguage === 'ar'
                        ? setSettingsForm({ ...settingsForm, heroProofCotton: e.target.value })
                        : setSettingsForm({ ...settingsForm, heroProofCottonEn: e.target.value })
                    }
                    dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold block mb-1">
                    {cmsLanguage === 'ar' ? 'نقطة ثقة الأحبار:' : 'Proof (Inks - English):'}
                  </label>
                  <input
                    type="text"
                    value={cmsLanguage === 'ar' ? (settingsForm.heroProofInks || '') : (settingsForm.heroProofInksEn || '')}
                    placeholder={cmsLanguage === 'ar' ? 'أحبار مائية بيئية آمنة غير ملموسة' : 'Water-based Hypoallergenic Eco Inks'}
                    onChange={(e) =>
                      cmsLanguage === 'ar'
                        ? setSettingsForm({ ...settingsForm, heroProofInks: e.target.value })
                        : setSettingsForm({ ...settingsForm, heroProofInksEn: e.target.value })
                    }
                    dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block mb-1.5 font-bold uppercase">معاينة مصغرة للبانر:</span>
                <div className="flex items-center gap-3">
                  <img
                    src={settingsForm.heroImageUrl || "/src/assets/images/hero_baby_apparel_1790519873737.jpg"}
                    alt="Hero Preview"
                    className="w-16 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">
                      {cmsLanguage === 'ar' ? settingsForm.heroTitle : (settingsForm.heroTitleEn || settingsForm.heroTitle)}
                    </p>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {cmsLanguage === 'ar' ? settingsForm.heroSubtitle : (settingsForm.heroSubtitleEn || settingsForm.heroSubtitle)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 2: HEADER & ANNOUNCEMENT BAR CMS */}
      {/* ============================================================== */}
      {cmsSubTab === 'header' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>تخصيص الهيدر وشريط الإعلانات الترويجي العلوي</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                التحكم في اسم العلامة التجارية، الشريط الإعلاني، وإمكانية إظهاره أو إخفائه ({cmsLanguage === 'ar' ? 'العربية' : 'English'})
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
              {cmsLanguage === 'ar' ? 'تحرير النص العربي 🇸🇦' : 'Editing English 🇬🇧'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-4">
              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'اسم المتجر / العلامة التجارية (Store Name):' : 'Brand & Store Name (English):'}
                </label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? settingsForm.storeName : (settingsForm.storeNameEn || '')}
                  placeholder={cmsLanguage === 'ar' ? '2BabyPrint' : '2BabyPrint Egypt'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, storeName: e.target.value })
                      : setSettingsForm({ ...settingsForm, storeNameEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'الشعار والوصف المختصر (Tagline):' : 'Store Tagline (English):'}
                </label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.storeTagline || '') : (settingsForm.storeTaglineEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'براند أزياء وملابس الأطفال المخصصة بالقطن المصري' : 'Custom Egyptian Cotton Baby & Kids Apparel Brand'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, storeTagline: e.target.value })
                      : setSettingsForm({ ...settingsForm, storeTaglineEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-stone-900 font-bold text-xs flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-600" />
                    <span>تفعيل شريط الإعلانات أعلى الصفحة:</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={settingsForm.showAnnouncement !== false}
                    onChange={(e) => setSettingsForm({ ...settingsForm, showAnnouncement: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                </div>

                <div>
                  <label className="text-stone-600 block mb-1 text-[11px] font-semibold">
                    {cmsLanguage === 'ar' ? 'نص شريط الإعلانات الترويجي:' : 'Announcement Bar Banner (English):'}
                  </label>
                  <textarea
                    rows={2}
                    value={cmsLanguage === 'ar' ? settingsForm.announcementText : (settingsForm.announcementTextEn || '')}
                    onChange={(e) =>
                      cmsLanguage === 'ar'
                        ? setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                        : setSettingsForm({ ...settingsForm, announcementTextEn: e.target.value })
                    }
                    dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs resize-none"
                    placeholder={cmsLanguage === 'ar' ? '✨ شحن سريع داخل القاهرة والجيزة...' : '✨ Fast 48h Delivery across Greater Cairo & Giza...'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 3: FEATURES BAR CMS */}
      {/* ============================================================== */}
      {cmsSubTab === 'features' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Feather className="w-4 h-4 text-amber-600" />
                <span>تخصيص شريط مميزات الخامات والطباعة (Features Bar)</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                القيم المضافة والمزايا التنافسية التي تُشجع أولياء الأمور على الطلب بثقة وأمان ({cmsLanguage === 'ar' ? 'العربية' : 'English'})
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
              {cmsLanguage === 'ar' ? 'تحرير النص العربي 🇸🇦' : 'Editing English 🇬🇧'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Feature 1 */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold pb-1 border-b border-stone-200">
                <Feather className="w-4 h-4 text-amber-600" />
                <span>{cmsLanguage === 'ar' ? 'الميزة الأولى (القطن والخامات):' : 'Feature 1 (Cotton & Material):'}</span>
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">{cmsLanguage === 'ar' ? 'العنوان:' : 'Title:'}</label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.feature1Title || '') : (settingsForm.feature1TitleEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'قطن مصري 100% طبيعي' : '100% Pure Egyptian Cotton'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, feature1Title: e.target.value })
                      : setSettingsForm({ ...settingsForm, feature1TitleEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">{cmsLanguage === 'ar' ? 'الوصف:' : 'Description:'}</label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.feature1Desc || '') : (settingsForm.feature1DescEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'خامات ناعمة كالحرير مسامية ومريحة...' : 'Silky soft, ultra-breathable fabric gentle on infant skin all day'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, feature1Desc: e.target.value })
                      : setSettingsForm({ ...settingsForm, feature1DescEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold pb-1 border-b border-stone-200">
                <Printer className="w-4 h-4 text-amber-600" />
                <span>{cmsLanguage === 'ar' ? 'الميزة الثانية (أحبار الطباعة):' : 'Feature 2 (Safe Eco Inks):'}</span>
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">{cmsLanguage === 'ar' ? 'العنوان:' : 'Title:'}</label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.feature2Title || '') : (settingsForm.feature2TitleEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'أحبار مائية آمنة وصحية' : 'Safe Eco-Friendly Inks'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, feature2Title: e.target.value })
                      : setSettingsForm({ ...settingsForm, feature2TitleEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">{cmsLanguage === 'ar' ? 'الوصف:' : 'Description:'}</label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.feature2Desc || '') : (settingsForm.feature2DescEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'خالية تماماً من الكيماويات ومقاومة للغسيل...' : 'Oeko-Tex certified water-based inks resilient to repeated washes'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, feature2Desc: e.target.value })
                      : setSettingsForm({ ...settingsForm, feature2DescEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold pb-1 border-b border-stone-200">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{cmsLanguage === 'ar' ? 'الميزة الثالثة (استوديو التخصيص):' : 'Feature 3 (Interactive Live Studio):'}</span>
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">{cmsLanguage === 'ar' ? 'العنوان:' : 'Title:'}</label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.feature3Title || '') : (settingsForm.feature3TitleEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'استوديو تصميم حي فوري' : 'Interactive Live Studio'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, feature3Title: e.target.value })
                      : setSettingsForm({ ...settingsForm, feature3TitleEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">{cmsLanguage === 'ar' ? 'الوصف:' : 'Description:'}</label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.feature3Desc || '') : (settingsForm.feature3DescEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'اكتبي اسم طفلك وشاهدي النتيجة قبل الطباعة' : 'Type your baby name, preview quotes, and see mockups before print'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, feature3Desc: e.target.value })
                      : setSettingsForm({ ...settingsForm, feature3DescEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold pb-1 border-b border-stone-200">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>{cmsLanguage === 'ar' ? 'الميزة الرابعة (الشحن والتوصيل):' : 'Feature 4 (Fast Delivery):'}</span>
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">{cmsLanguage === 'ar' ? 'العنوان:' : 'Title:'}</label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.feature4Title || '') : (settingsForm.feature4TitleEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'شحن سريع للقاهرة والجيزة' : 'Fast Cairo & Giza Delivery'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, feature4Title: e.target.value })
                      : setSettingsForm({ ...settingsForm, feature4TitleEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">{cmsLanguage === 'ar' ? 'الوصف:' : 'Description:'}</label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.feature4Desc || '') : (settingsForm.feature4DescEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'تسليم موثوق ومباشر لباب منزلك خلال 48 إلى 72 ساعة' : 'Reliable doorstep shipping across Cairo & Giza within 48 to 72 hours'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, feature4Desc: e.target.value })
                      : setSettingsForm({ ...settingsForm, feature4DescEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 4: PRODUCT CATALOG CMS & GRID LAYOUT */}
      {/* ============================================================== */}
      {cmsSubTab === 'catalog' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-amber-600" />
                <span>تخصيص كتالوج المنتجات وتوزيعة العرض (Product Catalog CMS)</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                التحكم في عنوان القسم، رسالة التوجيه للتصميم، عدد الأعمدة، ونسبة أبعاد كروت المنتجات ({cmsLanguage === 'ar' ? 'العربية' : 'English'})
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
              {cmsLanguage === 'ar' ? 'تحرير النص العربي 🇸🇦' : 'Editing English 🇬🇧'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Texts & Prompts */}
            <div className="space-y-4">
              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'شارة القسم العلوية (Tagline):' : 'Catalog Tagline (English):'}
                </label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.catalogTagline || '') : (settingsForm.catalogTaglineEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'تشكيلة ملابس الأطفال الجاهزة للتخصيص' : 'Ready-to-Customize Apparel Collection'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, catalogTagline: e.target.value })
                      : setSettingsForm({ ...settingsForm, catalogTaglineEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'عنوان قسم الكتالوج الرئيسي (Title):' : 'Main Catalog Title (English):'}
                </label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.catalogTitle || '') : (settingsForm.catalogTitleEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'اختر الموديل المناسب وابدأ التصميم' : 'Choose a Garment and Start Customizing'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, catalogTitle: e.target.value })
                      : setSettingsForm({ ...settingsForm, catalogTitleEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'رسالة التلميح التوجيهية للعميل (Hint Banner):' : 'Guiding Hint Banner (English):'}
                </label>
                <textarea
                  rows={2}
                  value={cmsLanguage === 'ar' ? (settingsForm.catalogHint || '') : (settingsForm.catalogHintEn || '')}
                  placeholder={cmsLanguage === 'ar' ? '💡 اختاري القطعة أو الموديل أولاً بالأسفل...' : '💡 Select a garment below to personalize names and colors in live studio'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, catalogHint: e.target.value })
                      : setSettingsForm({ ...settingsForm, catalogHintEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs resize-none"
                />
              </div>
            </div>

            {/* Grid Layout & Card Ratio */}
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  عدد أعمدة شبكة المنتجات في الشاشات الكبيرة:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map((cols) => (
                    <button
                      key={cols}
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, gridColumns: cols as 2 | 3 | 4 })}
                      className={`p-3 text-xs font-bold rounded-xl border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        settingsForm.gridColumns === cols
                          ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      <span>{cols} أعمدة</span>
                      <span className="text-[10px] font-normal opacity-80">
                        {cols === 2 ? 'كبير ومفصل' : cols === 3 ? 'متوازن ومثالي' : 'مدمج ومكثف'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  نسبة أبعاد كارت صورة المنتج:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: '4/3', label: 'مستطيل 4:3', desc: 'أنيق وفاخر' },
                    { key: '1/1', label: 'مربع 1:1', desc: 'عصري لإنستغرام' },
                    { key: '3/4', label: 'طولي 3:4', desc: 'يبرز أطقم المواليد' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, cardAspectRatio: item.key as any })}
                      className={`p-3 text-xs font-bold rounded-xl border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        settingsForm.cardAspectRatio === item.key
                          ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] font-normal opacity-80">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 5: READY TEMPLATES SHOWCASE CMS */}
      {/* ============================================================== */}
      {cmsSubTab === 'templates' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-600" />
                <span>تخصيص قسم معرض القوالب والتصاميم الجاهزة</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                تعديل نصوص وأوصاف القوالب السريعة لأعياد الميلاد والسبوع والمناسبات ({cmsLanguage === 'ar' ? 'العربية' : 'English'})
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
              {cmsLanguage === 'ar' ? 'تحرير النص العربي 🇸🇦' : 'Editing English 🇬🇧'}
            </span>
          </div>

          <div className="max-w-xl space-y-4 text-xs">
            <div>
              <label className="text-stone-700 font-bold block mb-1">
                {cmsLanguage === 'ar' ? 'شارة القسم العلوية (Tagline):' : 'Templates Tagline (English):'}
              </label>
              <input
                type="text"
                value={cmsLanguage === 'ar' ? (settingsForm.templatesTagline || '') : (settingsForm.templatesTaglineEn || '')}
                placeholder={cmsLanguage === 'ar' ? 'مجموعات حصرية ومحبوبة للأمهات' : 'Exclusive Loved Collections for Moms'}
                onChange={(e) =>
                  cmsLanguage === 'ar'
                    ? setSettingsForm({ ...settingsForm, templatesTagline: e.target.value })
                    : setSettingsForm({ ...settingsForm, templatesTaglineEn: e.target.value })
                }
                dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-stone-700 font-bold block mb-1">
                {cmsLanguage === 'ar' ? 'العنوان الرئيسي للقسم (Title):' : 'Templates Section Title (English):'}
              </label>
              <input
                type="text"
                value={cmsLanguage === 'ar' ? (settingsForm.templatesTitle || '') : (settingsForm.templatesTitleEn || '')}
                placeholder={cmsLanguage === 'ar' ? 'قوالب وأفكار جاهزة للتصميم بنقرة واحدة' : 'Ready-made Design Ideas in One Click'}
                onChange={(e) =>
                  cmsLanguage === 'ar'
                    ? setSettingsForm({ ...settingsForm, templatesTitle: e.target.value })
                    : setSettingsForm({ ...settingsForm, templatesTitleEn: e.target.value })
                }
                dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-stone-700 font-bold block mb-1">
                {cmsLanguage === 'ar' ? 'النص الوصفي للقسم (Subtitle):' : 'Templates Subtitle (English):'}
              </label>
              <textarea
                rows={3}
                value={cmsLanguage === 'ar' ? (settingsForm.templatesSubtitle || '') : (settingsForm.templatesSubtitleEn || '')}
                placeholder={cmsLanguage === 'ar' ? 'تصاميم مختارة ومحبوبة لأعياد الميلاد والسبوع...' : 'Handcrafted designs for Sebou baby showers, birthdays, and Egyptian celebrations...'}
                onChange={(e) =>
                  cmsLanguage === 'ar'
                    ? setSettingsForm({ ...settingsForm, templatesSubtitle: e.target.value })
                    : setSettingsForm({ ...settingsForm, templatesSubtitleEn: e.target.value })
                }
                dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 6: FOOTER & CONTACT CMS */}
      {/* ============================================================== */}
      {cmsSubTab === 'footer' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>تخصيص الفوتر، أرقام التواصل، وبيانات الدعم</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                التحكم في أرقام الواتساب وخدمة العملاء وعنوان المقر وحقوق النشر ({cmsLanguage === 'ar' ? 'العربية' : 'English'})
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
              {cmsLanguage === 'ar' ? 'تحرير النص العربي 🇸🇦' : 'Editing English 🇬🇧'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-4">
              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'نبذة المتجر في الفوتر (Bio):' : 'Footer Brand Bio (English):'}
                </label>
                <textarea
                  rows={3}
                  value={cmsLanguage === 'ar' ? (settingsForm.footerBio || '') : (settingsForm.footerBioEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'البراند المصري الرائد في طباعة وتخصيص ملابس الأطفال...' : 'Leading Egyptian brand in custom baby and children clothing with certified cotton...'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, footerBio: e.target.value })
                      : setSettingsForm({ ...settingsForm, footerBioEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 font-bold block mb-1">رقم خدمة العملاء (هاتف):</label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone || ''}
                    placeholder="+20 109 988 7766"
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold block mb-1">رقم الواتساب المباشر:</label>
                  <input
                    type="text"
                    value={settingsForm.contactWhatsapp || ''}
                    placeholder="+201099887766"
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactWhatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'عنوان المقر أو التوصيل بالقاهرة:' : 'Headquarters / Delivery Address (English):'}
                </label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.footerAddress || '') : (settingsForm.footerAddressEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'القاهرة الجديدة، التجمع الخامس، جمهورية مصر العربية' : 'New Cairo, 5th Settlement, Cairo, Egypt'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, footerAddress: e.target.value })
                      : setSettingsForm({ ...settingsForm, footerAddressEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'ساعات العمل وخدمة العملاء:' : 'Working Hours (English):'}
                </label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.footerWorkingHours || '') : (settingsForm.footerWorkingHoursEn || '')}
                  placeholder={cmsLanguage === 'ar' ? 'خدمة العملاء يومياً من 9:00 صباحاً حتى 10:00 مساءً' : 'Customer Support Daily from 9:00 AM to 10:00 PM'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, footerWorkingHours: e.target.value })
                      : setSettingsForm({ ...settingsForm, footerWorkingHoursEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  {cmsLanguage === 'ar' ? 'نص حقوق النشر (Copyright Notice):' : 'Copyright Notice (English):'}
                </label>
                <input
                  type="text"
                  value={cmsLanguage === 'ar' ? (settingsForm.footerCopyright || '') : (settingsForm.footerCopyrightEn || '')}
                  placeholder={cmsLanguage === 'ar' ? '© 2026 2BabyPrint مصر. جميع الحقوق محفوظة.' : '© 2026 2BabyPrint Egypt. All rights reserved.'}
                  onChange={(e) =>
                    cmsLanguage === 'ar'
                      ? setSettingsForm({ ...settingsForm, footerCopyright: e.target.value })
                      : setSettingsForm({ ...settingsForm, footerCopyrightEn: e.target.value })
                  }
                  dir={cmsLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 7: HOMEPAGE SECTIONS FLOW & VISIBILITY */}
      {/* ============================================================== */}
      {cmsSubTab === 'sections' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>ترتيب أقسام الصفحة الرئيسية وإظهارها (Sections Reordering)</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              يمكنك تغيير ترتيب ظهور أي قسم في الصفحة الرئيسية باستخدام أسهم التحريك، أو إخفاء أي قسم مؤقتاً
            </p>
          </div>

          <div className="space-y-3 max-w-2xl">
            {settingsForm.sectionsOrder.map((sectionKey, index) => {
              const titles: Record<string, string> = {
                hero: 'البانر الترحيبي الرئيسي (Hero Banner)',
                features: 'شريط مميزات القطن والطباعة (Features Bar)',
                catalog: 'كتالوج استعراض المنتجات المخصصة (Product Catalog)',
                templates: 'معرض القوالب الجاهزة القابلة للتعديل (Ready Templates)',
              };

              const isVisible = settingsForm.visibleSections[sectionKey];

              return (
                <div
                  key={sectionKey}
                  className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => handleToggleSectionVisibility(sectionKey)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <div>
                      <span className={`text-xs font-bold block ${isVisible ? 'text-stone-900' : 'text-stone-400 line-through'}`}>
                        {titles[sectionKey]}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {isVisible ? 'ظاهر ومفعل في الموقع' : 'مخفي حالياً'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMoveSection(index, 'up')}
                      disabled={index === 0}
                      className={`p-2 rounded-lg border text-stone-700 cursor-pointer ${
                        index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:border-amber-400 active:scale-95'
                      }`}
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(index, 'down')}
                      disabled={index === settingsForm.sectionsOrder.length - 1}
                      className={`p-2 rounded-lg border text-stone-700 cursor-pointer ${
                        index === settingsForm.sectionsOrder.length - 1
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:bg-white hover:border-amber-400 active:scale-95'
                      }`}
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 8: SIZE GUIDE EDITOR */}
      {/* ============================================================== */}
      {cmsSubTab === 'sizeguide' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-amber-600" />
              <span>محرر وتعديل جداول دليل المقاسات المعتمد (Size Guide Tables)</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              تعديل المقاسات، الأطوال، والأوزان التي تظهر للأمهات في نافذة دليل المقاسات قبل اختيار المقاس المناسب
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Infant Sizes */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center justify-between">
                <span>مقاسات الرضع وحديثي الولادة (0 - 24 شهر):</span>
                <span className="text-[10px] text-amber-700 font-mono">{settingsForm.infantSizes.length} مقاسات</span>
              </h5>
              <div className="space-y-2.5">
                {settingsForm.infantSizes.map((row, idx) => (
                  <div key={row.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block">المقاس:</label>
                      <input
                        type="text"
                        value={row.size}
                        onChange={(e) => {
                          const updated = [...settingsForm.infantSizes];
                          updated[idx].size = e.target.value;
                          setSettingsForm({ ...settingsForm, infantSizes: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 block">العمر:</label>
                      <input
                        type="text"
                        value={row.age}
                        onChange={(e) => {
                          const updated = [...settingsForm.infantSizes];
                          updated[idx].age = e.target.value;
                          setSettingsForm({ ...settingsForm, infantSizes: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 block">الوزن:</label>
                      <input
                        type="text"
                        value={row.weight}
                        onChange={(e) => {
                          const updated = [...settingsForm.infantSizes];
                          updated[idx].weight = e.target.value;
                          setSettingsForm({ ...settingsForm, infantSizes: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 block">الطول:</label>
                      <input
                        type="text"
                        value={row.height}
                        onChange={(e) => {
                          const updated = [...settingsForm.infantSizes];
                          updated[idx].height = e.target.value;
                          setSettingsForm({ ...settingsForm, infantSizes: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Youth Sizes */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center justify-between">
                <span>مقاسات الأطفال واليافعين (3 - 10 سنوات):</span>
                <span className="text-[10px] text-amber-700 font-mono">{settingsForm.youthSizes.length} مقاسات</span>
              </h5>
              <div className="space-y-2.5">
                {settingsForm.youthSizes.map((row, idx) => (
                  <div key={row.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block">المقاس:</label>
                      <input
                        type="text"
                        value={row.size}
                        onChange={(e) => {
                          const updated = [...settingsForm.youthSizes];
                          updated[idx].size = e.target.value;
                          setSettingsForm({ ...settingsForm, youthSizes: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 block">العمر:</label>
                      <input
                        type="text"
                        value={row.age}
                        onChange={(e) => {
                          const updated = [...settingsForm.youthSizes];
                          updated[idx].age = e.target.value;
                          setSettingsForm({ ...settingsForm, youthSizes: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 block">الوزن:</label>
                      <input
                        type="text"
                        value={row.weight}
                        onChange={(e) => {
                          const updated = [...settingsForm.youthSizes];
                          updated[idx].weight = e.target.value;
                          setSettingsForm({ ...settingsForm, youthSizes: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 block">الطول:</label>
                      <input
                        type="text"
                        value={row.height}
                        onChange={(e) => {
                          const updated = [...settingsForm.youthSizes];
                          updated[idx].height = e.target.value;
                          setSettingsForm({ ...settingsForm, youthSizes: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 9: PAYMENTS & SHIPPING SETTINGS IN CAIRO */}
      {/* ============================================================== */}
      {cmsSubTab === 'payments' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>التحويلات الإلكترونية المسبقة وسياسة الشحن في القاهرة والجيزة</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              تعديل معرف إنستاباي، أرقام فودافون كاش، قيمة الشحن والحد الأدنى للشحن المجاني
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Electronic Payments */}
            <div className="space-y-4">
              <h5 className="font-bold text-xs text-stone-900 pb-1 border-b border-stone-100">
                بيانات استقبال التحويلات المسبقة:
              </h5>

              <div>
                <label className="text-stone-700 font-bold block mb-1">عنوان إنستاباي (InstaPay IPA):</label>
                <input
                  type="text"
                  value={settingsForm.instapayIpa}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instapayIpa: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs text-stone-900"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">رقم هاتف إنستاباي:</label>
                <input
                  type="text"
                  value={settingsForm.instapayPhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instapayPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs text-stone-900"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">رقم فودافون كاش / المحافظ الإلكترونية:</label>
                <input
                  type="text"
                  value={settingsForm.walletPhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, walletPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs text-stone-900"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Shipping Fees & Free Shipping Threshold */}
            <div className="space-y-4">
              <h5 className="font-bold text-xs text-stone-900 pb-1 border-b border-stone-100">
                مصاريف الشحن والتوصيل (بالجنيه المصري):
              </h5>

              <div>
                <label className="text-stone-700 font-bold block mb-1">قيمة الشحن القياسي لأحياء القاهرة والجيزة:</label>
                <div className="relative">
                  <input
                    type="number"
                    value={settingsForm.shippingFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, shippingFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs text-stone-900"
                  />
                  <span className="absolute left-3 top-2 text-[11px] text-stone-400 font-bold">ج.م</span>
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">الحد الأدنى للطلب للشحن المجاني:</label>
                <div className="relative">
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs text-stone-900"
                  />
                  <span className="absolute left-3 top-2 text-[11px] text-stone-400 font-bold">ج.م</span>
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  إذا وصل مجموع سلة العميل لهذا المبلغ يحصل على شحن مجاني تلقائياً.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-between bg-stone-50 p-4 rounded-2xl border border-stone-200">
        <span className="text-xs text-stone-500">
          💡 كافة التعديلات تحفظ وتنعكس فوراً على المتجر عند الضغط على زر الحفظ.
        </span>
        <button
          type="button"
          onClick={onSaveSettings}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التعديلات في المتجر الآن</span>
        </button>
      </div>
    </div>
  );
};
