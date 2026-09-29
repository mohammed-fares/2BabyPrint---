import React from 'react';
import { ShieldCheck, Heart, Lock, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { Translations, Language } from '../i18n/translations';
import { StoreSettings } from '../types';

interface FooterProps {
  onOpenSizeGuide: () => void;
  onExploreProducts: () => void;
  onOpenStaffLogin?: () => void;
  t: Translations;
  lang: Language;
  storeSettings?: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSizeGuide,
  onExploreProducts,
  onOpenStaffLogin,
  t,
  lang,
  storeSettings,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="space-y-3">
            <a
              href="#"
              className="text-2xl font-extrabold text-white tracking-tight inline-block"
            >
              <span className="text-amber-400">
                {lang === 'en'
                  ? (storeSettings?.storeNameEn || storeSettings?.storeName || '2BabyPrint')
                  : (storeSettings?.storeName || '2BabyPrint')}
              </span>
            </a>
            <p className="text-stone-400 leading-relaxed text-xs">
              {lang === 'en'
                ? (storeSettings?.footerBioEn || t.footer.desc)
                : (storeSettings?.footerBio || t.footer.desc)}
            </p>

            {(storeSettings?.contactPhone || storeSettings?.contactWhatsapp) && (
              <div className="space-y-1.5 pt-2 text-stone-300 text-xs">
                {storeSettings?.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span dir="ltr">{storeSettings.contactPhone}</span>
                  </div>
                )}
                {storeSettings?.contactWhatsapp && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <a
                      href={`https://wa.me/${storeSettings.contactWhatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-400 transition-colors"
                      dir="ltr"
                    >
                      {storeSettings.contactWhatsapp} (واتساب)
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-1.5 text-stone-400 text-[11px] pt-1">
              <span>{t.footer.madeWithLove}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm">{t.footer.sectionsTitle}</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  {t.nav.infants}
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  {t.nav.toddlers}
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  {t.nav.youth}
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-amber-400 transition-colors">
                  {t.nav.templates}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onExploreProducts}
                  className="hover:text-amber-400 transition-colors text-right"
                >
                  {lang === 'ar' ? 'اختر قطعة لتصميمها' : 'Pick a Garment to Design'}
                </button>
              </li>
            </ul>
          </div>

          {/* Sizing & Care Instructions */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm">{t.footer.careTitle}</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="hover:text-amber-400 transition-colors text-right"
                >
                  {t.nav.sizeGuide}
                </button>
              </li>
              <li>
                <span className="text-stone-400">
                  {t.footer.washingTip}
                </span>
              </li>
              <li>
                <span className="text-stone-400">
                  {t.footer.inkSafety}
                </span>
              </li>
              <li>
                <span className="text-stone-400">
                  {t.footer.deliveryTime}
                </span>
              </li>
            </ul>
          </div>

          {/* Security & Gateways */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">{t.footer.paymentsTitle}</h4>
            <p className="text-stone-400 text-xs">
              {lang === 'ar'
                ? 'الدفع إلكتروني ومسبق حصرياً عبر قنوات الدفع المعتمدة في القاهرة ومصر لضمان جدية تصنيع وطباعة القطع المخصصة.'
                : '100% verified prepayments only for custom made-to-order children apparel.'}
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-stone-300">
              <span className="px-2 py-1 bg-stone-800 rounded border border-stone-700 font-semibold text-amber-300">
                إنستاباي InstaPay
              </span>
              <span className="px-2 py-1 bg-stone-800 rounded border border-stone-700 font-semibold">
                فودافون كاش
              </span>
              <span className="px-2 py-1 bg-stone-800 rounded border border-stone-700 font-semibold">
                أورنج / اتصالات كاش
              </span>
              <span className="px-2 py-1 bg-stone-800 rounded border border-stone-700 font-semibold">
                فوري Fawry
              </span>
              <span className="px-2 py-1 bg-stone-800 rounded border border-stone-700 font-semibold">
                فيزا ومستر كارد
              </span>
              <span className="px-2 py-1 bg-stone-800 rounded border border-stone-700 font-semibold">
                بطاقات ميزة Meeza
              </span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.footer.ssl}</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Discreet Staff Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-3">
          <div>
            {lang === 'en'
              ? (storeSettings?.footerCopyrightEn || `© ${new Date().getFullYear()} ${t.footer.copyright}`)
              : (storeSettings?.footerCopyright || `© ${new Date().getFullYear()} ${t.footer.copyright}`)}
            {(storeSettings?.footerAddress || storeSettings?.footerAddressEn) && (
              <span className="block text-[10px] text-stone-500 mt-0.5">
                {lang === 'en'
                  ? (storeSettings?.footerAddressEn || storeSettings?.footerAddress)
                  : storeSettings?.footerAddress}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <a href="#" className="hover:text-stone-300 transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-stone-300 transition-colors">{t.footer.terms}</a>
            <a href="#" className="hover:text-stone-300 transition-colors">{t.footer.refund}</a>

            {/* Discreet Staff Portal Link */}
            {onOpenStaffLogin && (
              <button
                type="button"
                onClick={onOpenStaffLogin}
                className="hover:text-amber-400 transition-colors flex items-center gap-1 text-stone-600 hover:text-stone-300 border-l border-stone-800 pr-3"
                title="بوابة دخول الإدارة والمطبعة"
              >
                <Lock className="w-3 h-3" />
                <span>{lang === 'ar' ? 'بوابة الإدارة وفريق العمل' : 'Staff Portal'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
