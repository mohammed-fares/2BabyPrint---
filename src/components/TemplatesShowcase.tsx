import React from 'react';
import { DESIGN_TEMPLATES } from '../data/templates';
import { DesignTemplate, StoreSettings } from '../types';
import { Sparkles, Edit3 } from 'lucide-react';
import { Translations, Language } from '../i18n/translations';

interface TemplatesShowcaseProps {
  onSelectTemplate: (template: DesignTemplate) => void;
  t: Translations;
  lang: Language;
  storeSettings?: StoreSettings;
}

export const TemplatesShowcase: React.FC<TemplatesShowcaseProps> = ({
  onSelectTemplate,
  t,
  lang,
  storeSettings,
}) => {
  return (
    <section id="templates" className="py-14 md:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-amber-700 mb-1.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{storeSettings?.templatesTagline || t.templates.tagline}</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight"
            style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Plus Jakarta Sans', sans-serif" }}
          >
            {storeSettings?.templatesTitle || t.templates.title}
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            {storeSettings?.templatesSubtitle || t.templates.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {DESIGN_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-stone-50 border border-stone-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-300 hover:shadow-sm transition-all text-center group"
            >
              <div>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100/60 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {tpl.thumbnail}
                </div>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block mb-1.5">
                  {tpl.category}
                </span>
                <h3 className="text-sm font-bold text-stone-900 line-clamp-1 mb-1">
                  {tpl.title}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {tpl.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-200/60">
                <button
                  type="button"
                  onClick={() => onSelectTemplate(tpl)}
                  className="w-full py-2 px-3 bg-white hover:bg-amber-400 hover:text-stone-950 text-stone-800 border border-stone-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.templates.editBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
