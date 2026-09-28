import React from 'react';
import { X, Ruler, CheckCircle } from 'lucide-react';
import { Translations, Language } from '../i18n/translations';
import { StoreSettings } from '../types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
  lang: Language;
  storeSettings?: StoreSettings;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  t,
  lang,
  storeSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {t.sizeGuide.title}
              </h3>
              <p className="text-xs text-stone-500">
                {t.sizeGuide.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          {/* Infants Table (0 - 24 Months) */}
          <div>
            <h4 className="font-bold text-sm text-stone-900 mb-2">
              {t.sizeGuide.infantsTitle}
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
                <thead className="bg-stone-100/75 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-2.5">{t.sizeGuide.colSize}</th>
                    <th className="p-2.5">{t.sizeGuide.colAge}</th>
                    <th className="p-2.5">{t.sizeGuide.colWeight}</th>
                    <th className="p-2.5">{t.sizeGuide.colHeight}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
                  {(storeSettings?.infantSizes || [
                    { id: '1', size: '0 - 3 M', age: 'حديث الولادة', weight: '3.5 - 5.5 كغم', height: '50 - 60 سم' },
                    { id: '2', size: '3 - 6 M', age: '3 إلى 6 أشهر', weight: '5.5 - 7.5 كغم', height: '60 - 68 سم' },
                    { id: '3', size: '6 - 12 M', age: 'نصف سنة إلى سنة', weight: '7.5 - 10 كغم', height: '68 - 76 سم' },
                    { id: '4', size: '12 - 18 M', age: 'سنة إلى سنة ونصف', weight: '10 - 12 كغم', height: '76 - 84 سم' },
                    { id: '5', size: '18 - 24 M', age: 'سنتان تقريباً', weight: '12 - 14 كغم', height: '84 - 90 سم' },
                  ]).map((row, i) => (
                    <tr key={row.id || i} className={i % 2 === 1 ? 'bg-stone-50/50' : ''}>
                      <td className="p-2.5 font-bold font-sans text-stone-900">{row.size}</td>
                      <td className="p-2.5 font-sans">{row.age}</td>
                      <td className="p-2.5 text-stone-700">{row.weight}</td>
                      <td className="p-2.5 text-stone-700">{row.height}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Toddlers & Youths Table */}
          <div>
            <h4 className="font-bold text-sm text-stone-900 mb-2">
              {t.sizeGuide.toddlersTitle}
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
                <thead className="bg-stone-100/75 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-2.5">{t.sizeGuide.colSize}</th>
                    <th className="p-2.5">{t.sizeGuide.colAge}</th>
                    <th className="p-2.5">{t.sizeGuide.colChest}</th>
                    <th className="p-2.5">{t.sizeGuide.colLength}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
                  {(storeSettings?.youthSizes || [
                    { id: '1', size: '3 - 4 Y', age: 'الأطفال الصغار', weight: '14 - 16 كجم', height: '98 - 104 سم' },
                    { id: '2', size: '5 - 6 Y', age: 'مرحلة الروضة', weight: '18 - 21 كجم', height: '110 - 116 سم' },
                    { id: '3', size: '7 - 8 Y', age: 'المرحلة الابتدائية', weight: '23 - 27 كجم', height: '122 - 128 سم' },
                    { id: '4', size: '9 - 10 Y', age: 'اليافعين', weight: '28 - 34 كجم', height: '134 - 140 سم' },
                  ]).map((row, i) => (
                    <tr key={row.id || i} className={i % 2 === 1 ? 'bg-stone-50/50' : ''}>
                      <td className="p-2.5 font-bold font-sans text-stone-900">{row.size}</td>
                      <td className="p-2.5 font-sans">{row.age}</td>
                      <td className="p-2.5 text-stone-700">{row.weight || row.chest || '—'}</td>
                      <td className="p-2.5 text-stone-700">{row.height || row.length || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-stone-700">
            <CheckCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              {t.sizeGuide.advice}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-semibold rounded-lg text-xs hover:bg-stone-800 transition-colors"
          >
            {t.sizeGuide.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
