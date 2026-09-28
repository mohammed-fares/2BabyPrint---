import React, { useState } from 'react';
import { TextElement } from '../../types';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Type, Sparkles } from 'lucide-react';
import { Translations, Language } from '../../i18n/translations';

interface TextToolProps {
  selectedElement: TextElement | null;
  onAddText: (text: string, options?: Partial<TextElement>) => void;
  onUpdateText: (updated: Partial<TextElement>) => void;
  t: Translations;
  lang: Language;
}

const FONTS_LIST = [
  { id: 'Cairo', name: 'خط كايرو الأساسي (Cairo Font)' },
  { id: 'Tajawal', name: 'خط تجوال العصري (Tajawal)' },
  { id: 'Baloo Bhaijaan 2', name: 'خط بالو طفولي ومرح (Baloo)' },
  { id: 'Changa', name: 'خط تشانجا العريض (Changa)' },
  { id: 'Plus Jakarta Sans', name: 'English Sans (Jakarta)' },
];

const PRESET_QUOTES_AR = [
  'ريــــان',
  'أكملتُ عامي الأول 🎂',
  'نونو العيلة شرف 👑',
  '100% قطن مصري 100% سكر 🍭',
  'الباشا الصغير ياسين',
  'حبيبة ماما فريدة 💕',
  'ابن الوز عوام 🐾',
  'أول رمضان في بيتنا 🌙',
];

const PRESET_QUOTES_EN = [
  'Rayan',
  'My 1st Birthday 🎂',
  'Little Prince 👑',
  '100% Sweet Cotton 🍭',
  'Mama’s Little Miracle 💕',
  'Handsome Boy ✨',
  'Daddy’s Twin 🐾',
];

const COLOR_SWATCHES = [
  '#1E293B', // Dark Slate
  '#FFFFFF', // White
  '#D97706', // Gold / Amber
  '#B45309', // Warm Bronze
  '#BE123C', // Deep Rose
  '#2563EB', // Royal Blue
  '#059669', // Emerald
  '#7C3AED', // Violet
  '#EA580C', // Orange
  '#475569', // Muted Grey
];

export const TextTool: React.FC<TextToolProps> = ({
  selectedElement,
  onAddText,
  onUpdateText,
  t,
  lang,
}) => {
  const [inputText, setInputText] = useState(selectedElement?.text || '');
  const [fontFamily, setFontFamily] = useState(selectedElement?.fontFamily || 'Cairo');
  const [fillColor, setFillColor] = useState(selectedElement?.fill || '#1E293B');
  const [fontSize, setFontSize] = useState(selectedElement?.fontSize || 26);
  const [isCurved, setIsCurved] = useState(selectedElement?.isCurved || false);

  const presets = lang === 'ar' ? PRESET_QUOTES_AR : PRESET_QUOTES_EN;

  const handleAddOrApply = () => {
    if (!inputText.trim()) return;
    if (selectedElement) {
      onUpdateText({
        text: inputText,
        fontFamily,
        fill: fillColor,
        fontSize,
        isCurved,
        curveRadius: isCurved ? 120 : undefined,
      });
    } else {
      onAddText(inputText, {
        fontFamily,
        fill: fillColor,
        fontSize,
        isCurved,
        curveRadius: isCurved ? 120 : undefined,
      });
      setInputText('');
    }
  };

  return (
    <div className="space-y-5 text-stone-800">
      {/* Title & Quick Presets */}
      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-2">
          {selectedElement ? t.textTool.editTitle : t.textTool.addTitle}
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (selectedElement) {
                onUpdateText({ text: e.target.value });
              }
            }}
            placeholder={t.textTool.placeholder}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all text-stone-900"
          />
        </div>

        {/* Suggestion tags */}
        {!selectedElement && (
          <div className="mt-2.5">
            <span className="text-[11px] text-stone-400 block mb-1">{t.textTool.suggestions}</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.slice(0, 6).map((quote) => (
                <button
                  key={quote}
                  type="button"
                  onClick={() => setInputText(quote)}
                  className="text-xs px-2 py-1 bg-stone-100 hover:bg-amber-50 hover:text-amber-800 border border-stone-200 rounded text-stone-600 transition-colors"
                >
                  {quote}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Font Family Selection */}
      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1.5">{t.textTool.fontFamily}</label>
        <div className="grid grid-cols-1 gap-1.5">
          {FONTS_LIST.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => {
                setFontFamily(font.id);
                if (selectedElement) onUpdateText({ fontFamily: font.id });
              }}
              style={{ fontFamily: font.id }}
              className={`px-3 py-2 text-sm text-right rounded-lg border transition-all flex items-center justify-between ${
                (selectedElement?.fontFamily || fontFamily) === font.id
                  ? 'border-amber-500 bg-amber-50/60 text-amber-950 font-semibold shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
              }`}
            >
              <span>{font.name}</span>
              <span className="text-xs text-stone-400">{lang === 'ar' ? 'أبجد 123' : 'Abc 123'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Swatches */}
      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1.5">{t.textTool.textColor}</label>
        <div className="flex flex-wrap gap-2 items-center">
          {COLOR_SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                setFillColor(color);
                if (selectedElement) onUpdateText({ fill: color });
              }}
              className={`w-7 h-7 rounded-full border transition-transform ${
                (selectedElement?.fill || fillColor) === color
                  ? 'scale-110 ring-2 ring-amber-500 ring-offset-2'
                  : 'hover:scale-105 border-stone-300'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          {/* Custom color input */}
          <label className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center cursor-pointer hover:border-stone-400 relative overflow-hidden bg-gradient-to-tr from-pink-300 via-amber-200 to-sky-300">
            <input
              type="color"
              value={selectedElement?.fill || fillColor}
              onChange={(e) => {
                setFillColor(e.target.value);
                if (selectedElement) onUpdateText({ fill: e.target.value });
              }}
              className="opacity-0 absolute inset-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Font Size & Arc */}
      <div className="space-y-3 pt-2 border-t border-stone-100">
        <div>
          <div className="flex justify-between text-xs text-stone-500 mb-1">
            <span>{t.textTool.fontSize}</span>
            <span className="font-mono tabular-nums">{selectedElement?.fontSize || fontSize}px</span>
          </div>
          <input
            type="range"
            min="14"
            max="64"
            value={selectedElement?.fontSize || fontSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              setFontSize(val);
              if (selectedElement) onUpdateText({ fontSize: val });
            }}
            className="w-full accent-amber-600"
          />
        </div>

        {/* Text styling buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !(selectedElement?.isBold ?? false);
              if (selectedElement) onUpdateText({ isBold: next });
            }}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedElement?.isBold
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
            <span>{t.textTool.bold}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !(selectedElement?.isItalic ?? false);
              if (selectedElement) onUpdateText({ isItalic: next });
            }}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              selectedElement?.isItalic
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
            <span>{t.textTool.italic}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !isCurved;
              setIsCurved(next);
              if (selectedElement) {
                onUpdateText({ isCurved: next, curveRadius: next ? 120 : undefined });
              }
            }}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              (selectedElement?.isCurved || isCurved)
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.textTool.curved}</span>
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => selectedElement && onUpdateText({ align: 'right' })}
            className={`p-1.5 rounded ${
              (selectedElement?.align || 'center') === 'right' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
            }`}
            title="Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => selectedElement && onUpdateText({ align: 'center' })}
            className={`p-1.5 rounded ${
              (selectedElement?.align || 'center') === 'center' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
            }`}
            title="Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => selectedElement && onUpdateText({ align: 'left' })}
            className={`p-1.5 rounded ${
              (selectedElement?.align || 'center') === 'left' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
            }`}
            title="Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Action Button */}
      <button
        type="button"
        onClick={handleAddOrApply}
        disabled={!inputText.trim()}
        className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
      >
        <Type className="w-4 h-4" />
        <span>{selectedElement ? t.textTool.applyBtn : t.textTool.addBtn}</span>
      </button>
    </div>
  );
};
