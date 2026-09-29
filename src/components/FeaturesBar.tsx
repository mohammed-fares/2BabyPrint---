import React from 'react';
import { Feather, Sparkles, Printer, Truck } from 'lucide-react';
import { Translations, Language } from '../i18n/translations';
import { StoreSettings } from '../types';

interface FeaturesBarProps {
  t: Translations;
  lang?: Language;
  storeSettings?: StoreSettings;
}

export const FeaturesBar: React.FC<FeaturesBarProps> = ({ t, lang = 'ar', storeSettings }) => {
  const isEn = lang === 'en';
  const features = [
    {
      icon: Feather,
      title: isEn
        ? (storeSettings?.feature1TitleEn || t.features.f1Title)
        : (storeSettings?.feature1Title || t.features.f1Title),
      description: isEn
        ? (storeSettings?.feature1DescEn || t.features.f1Desc)
        : (storeSettings?.feature1Desc || t.features.f1Desc),
    },
    {
      icon: Printer,
      title: isEn
        ? (storeSettings?.feature2TitleEn || t.features.f2Title)
        : (storeSettings?.feature2Title || t.features.f2Title),
      description: isEn
        ? (storeSettings?.feature2DescEn || t.features.f2Desc)
        : (storeSettings?.feature2Desc || t.features.f2Desc),
    },
    {
      icon: Sparkles,
      title: isEn
        ? (storeSettings?.feature3TitleEn || t.features.f3Title)
        : (storeSettings?.feature3Title || t.features.f3Title),
      description: isEn
        ? (storeSettings?.feature3DescEn || t.features.f3Desc)
        : (storeSettings?.feature3Desc || t.features.f3Desc),
    },
    {
      icon: Truck,
      title: isEn
        ? (storeSettings?.feature4TitleEn || t.features.f4Title)
        : (storeSettings?.feature4Title || t.features.f4Title),
      description: isEn
        ? (storeSettings?.feature4DescEn || t.features.f4Desc)
        : (storeSettings?.feature4Desc || t.features.f4Desc),
    },
  ];

  return (
    <section className="bg-white border-b border-stone-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-start gap-3.5 p-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1">{f.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
