import React, { useRef, useState } from 'react';
import { Upload, Circle, Square, Heart, ShieldCheck } from 'lucide-react';
import { ImageElement } from '../../types';
import { Translations, Language } from '../../i18n/translations';

interface UploadToolProps {
  selectedElement: ImageElement | null;
  onAddImage: (src: string, shape?: 'rect' | 'circle' | 'heart') => void;
  onUpdateShape: (shape: 'rect' | 'circle' | 'heart') => void;
  t: Translations;
  lang: Language;
}

export const UploadTool: React.FC<UploadToolProps> = ({
  selectedElement,
  onAddImage,
  onUpdateShape,
  t,
  lang,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedShape, setSelectedShape] = useState<'rect' | 'circle' | 'heart'>('rect');

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onAddImage(result, selectedShape);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-4 text-stone-800">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-amber-500 bg-amber-50/50'
            : 'border-stone-300 hover:border-amber-400 bg-stone-50/60 hover:bg-stone-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-3">
          <Upload className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-stone-800 mb-1">
          {t.uploadTool.dragTitle}
        </p>
        <p className="text-xs text-stone-500">
          {t.uploadTool.dragSubtitle}
        </p>
      </div>

      {/* Shape Masking */}
      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-2">
          {t.uploadTool.shapeTitle}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedShape('rect');
              if (selectedElement) onUpdateShape('rect');
            }}
            className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
              (selectedElement?.shape || selectedShape) === 'rect'
                ? 'border-amber-500 bg-amber-50 text-amber-950 font-semibold'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Square className="w-4 h-4" />
            <span>{t.uploadTool.shapeRect}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedShape('circle');
              if (selectedElement) onUpdateShape('circle');
            }}
            className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
              (selectedElement?.shape || selectedShape) === 'circle'
                ? 'border-amber-500 bg-amber-50 text-amber-950 font-semibold'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Circle className="w-4 h-4" />
            <span>{t.uploadTool.shapeCircle}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedShape('heart');
              if (selectedElement) onUpdateShape('heart');
            }}
            className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
              (selectedElement?.shape || selectedShape) === 'heart'
                ? 'border-amber-500 bg-amber-50 text-amber-950 font-semibold'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{t.uploadTool.shapeHeart}</span>
          </button>
        </div>
      </div>

      {/* Quality hint */}
      <div className="p-3 bg-stone-100 rounded-lg text-xs text-stone-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          {t.uploadTool.tip}
        </span>
      </div>
    </div>
  );
};
