import React from 'react';
import { Feather, Sparkles, Printer, Truck } from 'lucide-react';
import { Translations } from '../i18n/translations';

import { StoreSettings } from '../types';

interface FeaturesBarProps {
  t: Translations;
  storeSettings?: StoreSettings;
}

export const FeaturesBar: React.FC<FeaturesBarProps> = ({ t, storeSettings }) => {
  const features = [
    {
      icon: Feather,
      title: storeSettings?.feature1Title || t.features.f1Title,
      description: storeSettings?.feature1Desc || t.features.f1Desc,
    },
    {
      icon: Printer,
      title: storeSettings?.feature2Title || t.features.f2Title,
      description: storeSettings?.feature2Desc || t.features.f2Desc,
    },
    {
      icon: Sparkles,
      title: storeSettings?.feature3Title || t.features.f3Title,
      description: storeSettings?.feature3Desc || t.features.f3Desc,
    },
    {
      icon: Truck,
      title: storeSettings?.feature4Title || t.features.f4Title,
      description: storeSettings?.feature4Desc || t.features.f4Desc,
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
