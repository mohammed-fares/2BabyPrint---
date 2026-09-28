import React, { useState } from 'react';
import { CLIPARTS, CLIPART_CATEGORIES } from '../../data/cliparts';
import { ClipartItem, ClipartElement } from '../../types';
import { Search, Sparkles } from 'lucide-react';
import { Translations, Language } from '../../i18n/translations';

interface ClipartToolProps {
  selectedElement: ClipartElement | null;
  onAddClipart: (clipart: ClipartItem, fill?: string) => void;
  onUpdateClipartFill: (fill: string) => void;
  t: Translations;
  lang: Language;
}

const CLIPART_PALETTE = [
  '#D97706', // Amber Gold
  '#B45309', // Warm Bronze
  '#BE123C', // Deep Rose
  '#2563EB', // Blue
  '#059669', // Emerald
  '#7C3AED', // Violet
  '#EA580C', // Orange
  '#1E293B', // Slate
  '#FFFFFF', // White
];

export const ClipartTool: React.FC<ClipartToolProps> = ({
  selectedElement,
  onAddClipart,
  onUpdateClipartFill,
  t,
  lang,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFill, setActiveFill] = useState<string>('#D97706');

  const filteredCliparts = CLIPARTS.filter((c) => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 text-stone-800">
      {/* If element is selected, allow tinting */}
      {selectedElement && (
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.clipartTool.changeColor}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CLIPART_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  setActiveFill(color);
                  onUpdateClipartFill(color);
                }}
                className={`w-6 h-6 rounded-full border transition-transform ${
                  selectedElement.fill === color
                    ? 'scale-115 ring-2 ring-amber-500 ring-offset-2'
                    : 'border-stone-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className={`w-4 h-4 absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-3 text-stone-400`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.clipartTool.searchPlaceholder}
          className={`w-full ${lang === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white text-stone-800`}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          {t.clipartTool.all}
        </button>
        {CLIPART_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Clipart Grid */}
      <div className="grid grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto p-1">
        {filteredCliparts.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAddClipart(item, activeFill || item.defaultFill)}
            className="group flex flex-col items-center p-2.5 bg-white border border-stone-200 hover:border-amber-400 hover:shadow-sm rounded-lg transition-all text-center relative"
          >
            <div
              className="w-14 h-14 flex items-center justify-center p-1 text-stone-800 group-hover:scale-105 transition-transform"
              dangerouslySetInnerHTML={{
                __html: item.svg.replace(/currentColor/g, item.defaultFill || '#B45309'),
              }}
            />
            <span className="mt-1 text-[11px] font-medium text-stone-700 line-clamp-1">
              {item.name}
            </span>
          </button>
        ))}
      </div>
      {filteredCliparts.length === 0 && (
        <div className="text-center py-8 text-xs text-stone-400">
          {t.clipartTool.noResults}
        </div>
      )}
    </div>
  );
};
