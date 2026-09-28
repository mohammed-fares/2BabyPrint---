import React, { useState } from 'react';
import { StoreSettings } from '../../types';
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
} from 'lucide-react';

export type CmsSubTab =
  | 'hero'
  | 'header'
  | 'features'
  | 'catalog'
  | 'templates'
  | 'footer'
  | 'sections'
  | 'sizeguide'
  | 'payments';

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
  const [cmsSubTab, setCmsSubTab] = useState<CmsSubTab>('hero');

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

      {/* ============================================================== */}
      {/* SUBTAB 1: HERO SECTION CMS */}
      {/* ============================================================== */}
      {cmsSubTab === 'hero' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>تخصيص البانر الترحيبي الرئيسي (Hero Banner Section)</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              الواجهة الأولى التي يراها زوار وأمهات الأطفال في القاهرة عند فتح الموقع
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-4">
              <div>
                <label className="text-stone-700 font-bold block mb-1">الشارة الترويجية العلوية (Badge):</label>
                <input
                  type="text"
                  value={settingsForm.heroBadge || ''}
                  placeholder="✨ قطن مصري 100% فائق النعومة مخصص للأطفال"
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">العنوان الرئيسي الكبير (Headline):</label>
                <input
                  type="text"
                  value={settingsForm.heroTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">النص الوصفي التوضيحي (Subtitle):</label>
                <textarea
                  rows={3}
                  value={settingsForm.heroSubtitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 font-bold block mb-1">نص زر الإجراء الأول (CTA):</label>
                  <input
                    type="text"
                    value={settingsForm.heroCta}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroCta: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold block mb-1">نص زر الإجراء الثانوي:</label>
                  <input
                    type="text"
                    value={settingsForm.heroSecondaryCta || ''}
                    placeholder="استعراض القوالب والأفكار 💡"
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSecondaryCta: e.target.value })}
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
                  <label className="text-stone-700 font-bold block mb-1">نقطة ثقة الخامات (القطن):</label>
                  <input
                    type="text"
                    value={settingsForm.heroProofCotton || ''}
                    placeholder="قطن مصري 100% معتمد للمواليد"
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroProofCotton: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold block mb-1">نقطة ثقة الأحبار:</label>
                  <input
                    type="text"
                    value={settingsForm.heroProofInks || ''}
                    placeholder="أحبار مائية بيئية آمنة غير ملموسة"
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroProofInks: e.target.value })}
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
                    <p className="text-xs font-bold text-stone-900 truncate">{settingsForm.heroTitle}</p>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{settingsForm.heroSubtitle}</p>
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
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-amber-600" />
              <span>تخصيص الهيدر وشريط الإعلانات الترويجي العلوي</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              التحكم في اسم العلامة التجارية، الشريط الإعلاني، وإمكانية إظهاره أو إخفائه
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-4">
              <div>
                <label className="text-stone-700 font-bold block mb-1">اسم المتجر / العلامة التجارية (Store Name):</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">الشعار والوصف المختصر (Tagline):</label>
                <input
                  type="text"
                  value={settingsForm.storeTagline || ''}
                  placeholder="براند أزياء وملابس الأطفال المخصصة بالقطن المصري"
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeTagline: e.target.value })}
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
                  <label className="text-stone-600 block mb-1 text-[11px] font-semibold">نص شريط الإعلانات:</label>
                  <textarea
                    rows={2}
                    value={settingsForm.announcementText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs resize-none"
                    placeholder="✨ شحن سريع داخل القاهرة والجيزة..."
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
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Feather className="w-4 h-4 text-amber-600" />
              <span>تخصيص شريط مميزات الخامات والطباعة (Features Bar)</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              القيم المضافة والمزايا التنافسية التي تُشجع أولياء الأمور على الطلب بثقة وأمان
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Feature 1 */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold pb-1 border-b border-stone-200">
                <Feather className="w-4 h-4 text-amber-600" />
                <span>الميزة الأولى (القطن والخامات):</span>
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">العنوان:</label>
                <input
                  type="text"
                  value={settingsForm.feature1Title || ''}
                  placeholder="قطن مصري 100% طبيعي"
                  onChange={(e) => setSettingsForm({ ...settingsForm, feature1Title: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">الوصف:</label>
                <input
                  type="text"
                  value={settingsForm.feature1Desc || ''}
                  placeholder="خامات ناعمة كالحرير مسامية ومريحة لبشرة الرضع طوال اليوم"
                  onChange={(e) => setSettingsForm({ ...settingsForm, feature1Desc: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold pb-1 border-b border-stone-200">
                <Printer className="w-4 h-4 text-amber-600" />
                <span>الميزة الثانية (أحبار الطباعة):</span>
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">العنوان:</label>
                <input
                  type="text"
                  value={settingsForm.feature2Title || ''}
                  placeholder="أحبار مائية آمنة وصحية"
                  onChange={(e) => setSettingsForm({ ...settingsForm, feature2Title: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">الوصف:</label>
                <input
                  type="text"
                  value={settingsForm.feature2Desc || ''}
                  placeholder="خالية تماماً من الكيماويات ومقاومة للغسيل المتكرر بثبات عالي"
                  onChange={(e) => setSettingsForm({ ...settingsForm, feature2Desc: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold pb-1 border-b border-stone-200">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>الميزة الثالثة (استوديو التخصيص):</span>
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">العنوان:</label>
                <input
                  type="text"
                  value={settingsForm.feature3Title || ''}
                  placeholder="استوديو تصميم حي فوري"
                  onChange={(e) => setSettingsForm({ ...settingsForm, feature3Title: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">الوصف:</label>
                <input
                  type="text"
                  value={settingsForm.feature3Desc || ''}
                  placeholder="اكتبي اسم طفلك وعباراتك المفضلة وشاهدي النتيجة قبل الطباعة"
                  onChange={(e) => setSettingsForm({ ...settingsForm, feature3Desc: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold pb-1 border-b border-stone-200">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>الميزة الرابعة (الشحن وسرعة التوصيل):</span>
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">العنوان:</label>
                <input
                  type="text"
                  value={settingsForm.feature4Title || ''}
                  placeholder="شحن سريع للقاهرة والجيزة"
                  onChange={(e) => setSettingsForm({ ...settingsForm, feature4Title: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-stone-500 text-[11px] block">الوصف:</label>
                <input
                  type="text"
                  value={settingsForm.feature4Desc || ''}
                  placeholder="تسليم موثوق ومباشر لباب منزلك خلال 48 إلى 72 ساعة كحد أقصى"
                  onChange={(e) => setSettingsForm({ ...settingsForm, feature4Desc: e.target.value })}
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
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-amber-600" />
              <span>تخصيص كتالوج المنتجات وتوزيعة العرض (Product Catalog CMS)</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              التحكم في عنوان القسم، رسالة التوجيه للتصميم، عدد الأعمدة، ونسبة أبعاد كروت المنتجات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Texts & Prompts */}
            <div className="space-y-4">
              <div>
                <label className="text-stone-700 font-bold block mb-1">شارة القسم العلوية (Tagline):</label>
                <input
                  type="text"
                  value={settingsForm.catalogTagline || ''}
                  placeholder="تشكيلة ملابس الأطفال الجاهزة للتخصيص"
                  onChange={(e) => setSettingsForm({ ...settingsForm, catalogTagline: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">عنوان قسم الكتالوج الرئيسي (Title):</label>
                <input
                  type="text"
                  value={settingsForm.catalogTitle || ''}
                  placeholder="اختر الموديل المناسب وابدأ التصميم"
                  onChange={(e) => setSettingsForm({ ...settingsForm, catalogTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">رسالة التلميح التوجيهية للعميل (Hint Banner):</label>
                <textarea
                  rows={2}
                  value={settingsForm.catalogHint || ''}
                  placeholder="💡 اختاري القطعة أو الموديل أولاً بالأسفل لبدء تخصيص التصميم والألوان والاسم في الاستوديو الحي"
                  onChange={(e) => setSettingsForm({ ...settingsForm, catalogHint: e.target.value })}
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
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-600" />
              <span>تخصيص قسم معرض القوالب والتصاميم الجاهزة</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              تعديل نصوص وأوصاف القوالب السريعة لأعياد الميلاد والسبوع والمناسبات
            </p>
          </div>

          <div className="max-w-xl space-y-4 text-xs">
            <div>
              <label className="text-stone-700 font-bold block mb-1">شارة القسم العلوية (Tagline):</label>
              <input
                type="text"
                value={settingsForm.templatesTagline || ''}
                placeholder="مجموعات حصرية ومحبوبة للأمهات"
                onChange={(e) => setSettingsForm({ ...settingsForm, templatesTagline: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-stone-700 font-bold block mb-1">العنوان الرئيسي للقسم (Title):</label>
              <input
                type="text"
                value={settingsForm.templatesTitle || ''}
                placeholder="قوالب وأفكار جاهزة للتصميم بنقرة واحدة"
                onChange={(e) => setSettingsForm({ ...settingsForm, templatesTitle: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-stone-700 font-bold block mb-1">النص الوصفي للقسم (Subtitle):</label>
              <textarea
                rows={3}
                value={settingsForm.templatesSubtitle || ''}
                placeholder="تصاميم مختارة ومحبوبة لأعياد الميلاد والسبوع..."
                onChange={(e) => setSettingsForm({ ...settingsForm, templatesSubtitle: e.target.value })}
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
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-600" />
              <span>تخصيص الفوتر، أرقام التواصل، وبيانات الدعم</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              التحكم في أرقام الواتساب وخدمة العملاء وعنوان المقر وحقوق النشر
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-4">
              <div>
                <label className="text-stone-700 font-bold block mb-1">نبذة المتجر في الفوتر (Bio):</label>
                <textarea
                  rows={3}
                  value={settingsForm.footerBio || ''}
                  placeholder="البراند المصري الرائد في طباعة وتخصيص ملابس الأطفال..."
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerBio: e.target.value })}
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
                <label className="text-stone-700 font-bold block mb-1">عنوان المقر أو التوصيل بالقاهرة:</label>
                <input
                  type="text"
                  value={settingsForm.footerAddress || ''}
                  placeholder="القاهرة الجديدة، التجمع الخامس، جمهورية مصر العربية"
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">ساعات العمل وخدمة العملاء:</label>
                <input
                  type="text"
                  value={settingsForm.footerWorkingHours || ''}
                  placeholder="خدمة العملاء يومياً من 9:00 صباحاً حتى 10:00 مساءً"
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerWorkingHours: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">نص حقوق النشر (Copyright Notice):</label>
                <input
                  type="text"
                  value={settingsForm.footerCopyright || ''}
                  placeholder="© 2026 2BabyPrint مصر. جميع الحقوق محفوظة."
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerCopyright: e.target.value })}
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
