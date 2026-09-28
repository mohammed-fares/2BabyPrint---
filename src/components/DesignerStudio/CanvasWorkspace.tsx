import React, { useRef, useState, useEffect } from 'react';
import { GarmentType, DesignElement, TextElement, ClipartElement, ImageElement } from '../../types';
import { GarmentSilhouette } from './GarmentSilhouette';
import {
  Trash2,
  Copy,
  RotateCw,
  RotateCcw,
  Move,
  Maximize2,
  Minimize2,
  AlignCenterHorizontal,
  AlignCenterVertical,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CanvasWorkspaceProps {
  garmentType: GarmentType;
  colorHex: string;
  side: 'front' | 'back';
  elements: DesignElement[];
  selectedId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onBringForward?: (id: string) => void;
  onSendBackward?: (id: string) => void;
  printAreaWidth?: number;
  printAreaHeight?: number;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  garmentType,
  colorHex,
  side,
  elements,
  selectedId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  printAreaWidth = 240,
  printAreaHeight = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const [showPrintBorder, setShowPrintBorder] = useState(true);
  const [activeAction, setActiveAction] = useState<'move' | 'resize' | 'rotate' | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState<{ x: number; y: number; w: number; h: number; rot: number }>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    rot: 0,
  });

  const selectedEl = elements.find((e) => e.id === selectedId) || null;

  // Window listeners for smooth drag / resize
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!activeAction || !selectedEl) return;

      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      if (activeAction === 'move') {
        onUpdateElement(selectedEl.id, {
          x: Math.round(elementStart.x + dx),
          y: Math.round(elementStart.y + dy),
        });
      } else if (activeAction === 'resize') {
        const newW = Math.max(30, Math.round(elementStart.w + dx));
        const newH = Math.max(30, Math.round(elementStart.h + dy));
        onUpdateElement(selectedEl.id, {
          width: newW,
          height: newH,
        });
      } else if (activeAction === 'rotate') {
        if (!printAreaRef.current) return;
        const rect = printAreaRef.current.getBoundingClientRect();
        const centerX = rect.left + elementStart.x + elementStart.w / 2;
        const centerY = rect.top + elementStart.y + elementStart.h / 2;
        const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const deg = Math.round((rad * 180) / Math.PI + 90);
        onUpdateElement(selectedEl.id, {
          rotation: deg,
        });
      }
    };

    const handlePointerUp = () => {
      setActiveAction(null);
    };

    if (activeAction) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeAction, dragStart, elementStart, selectedEl, onUpdateElement]);

  const startDrag = (e: React.PointerEvent, action: 'move' | 'resize' | 'rotate') => {
    e.stopPropagation();
    if (!selectedEl) return;
    setActiveAction(action);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({
      x: selectedEl.x,
      y: selectedEl.y,
      w: selectedEl.width,
      h: selectedEl.height,
      rot: selectedEl.rotation,
    });
  };

  // Dedicated Easy Action Helpers (Non-complex, 1-click precision)
  const handleCenterHorizontal = () => {
    if (!selectedEl) return;
    const newX = Math.round((printAreaWidth - selectedEl.width) / 2);
    onUpdateElement(selectedEl.id, { x: newX });
  };

  const handleCenterVertical = () => {
    if (!selectedEl) return;
    const newY = Math.round((printAreaHeight - selectedEl.height) / 2);
    onUpdateElement(selectedEl.id, { y: newY });
  };

  const handleNudge = (dx: number, dy: number) => {
    if (!selectedEl) return;
    onUpdateElement(selectedEl.id, {
      x: selectedEl.x + dx,
      y: selectedEl.y + dy,
    });
  };

  const handleScaleStep = (factor: number) => {
    if (!selectedEl) return;
    const newW = Math.max(30, Math.round(selectedEl.width * factor));
    const newH = Math.max(30, Math.round(selectedEl.height * factor));
    const dx = (newW - selectedEl.width) / 2;
    const dy = (newH - selectedEl.height) / 2;
    onUpdateElement(selectedEl.id, {
      width: newW,
      height: newH,
      x: Math.round(selectedEl.x - dx),
      y: Math.round(selectedEl.y - dy),
    });
  };

  const handleRotateStep = (degChange: number) => {
    if (!selectedEl) return;
    const currentRot = selectedEl.rotation || 0;
    onUpdateElement(selectedEl.id, {
      rotation: Math.round((currentRot + degChange) % 360),
    });
  };

  const handleResetRotation = () => {
    if (!selectedEl) return;
    onUpdateElement(selectedEl.id, { rotation: 0 });
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Visual Canvas Area */}
      <div
        ref={containerRef}
        onClick={() => onSelectElement(null)}
        className="relative w-full max-w-[480px] h-[400px] sm:h-[460px] md:h-[500px] bg-stone-100/80 border border-stone-200/90 rounded-2xl flex items-center justify-center overflow-hidden select-none shadow-inner"
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Print border toggle button on canvas top */}
        <div className="absolute top-3 left-3 z-30">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPrintBorder(!showPrintBorder);
            }}
            className="px-2.5 py-1 text-[11px] font-medium bg-white/90 hover:bg-white text-stone-700 rounded-lg border border-stone-300 shadow-2xs flex items-center gap-1.5 transition-colors"
            title="إظهار أو إخفاء الحدود الوهمية لمنطقة الطباعة"
          >
            {showPrintBorder ? <Eye className="w-3.5 h-3.5 text-amber-600" /> : <EyeOff className="w-3.5 h-3.5 text-stone-400" />}
            <span>{showPrintBorder ? 'حدود الطباعة: ظاهرة' : 'معاينة واقعية بدون حدود'}</span>
          </button>
        </div>

        {/* Garment Base Container */}
        <div className="relative w-[300px] h-[370px] xs:w-[340px] xs:h-[410px] sm:w-[380px] sm:h-[460px] flex items-center justify-center shrink-0">
          {/* Vector Garment Silhouette */}
          <GarmentSilhouette garmentType={garmentType} colorHex={colorHex} side={side} />

          {/* Printable Area Safe Zone */}
          <div
            ref={printAreaRef}
            onClick={(e) => {
              if (e.target === printAreaRef.current) {
                onSelectElement(null);
              }
            }}
            className={`absolute pointer-events-auto transition-all ${
              showPrintBorder
                ? 'border-2 border-dashed border-amber-500/50 bg-amber-50/10'
                : 'border-transparent'
            }`}
            style={{
              width: `${printAreaWidth}px`,
              height: `${printAreaHeight}px`,
              top: garmentType === 'beanie' ? '54%' : garmentType === 'bib' ? '36%' : '25%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {/* Safe area title badge */}
            {showPrintBorder && (
              <span className="absolute -top-5 right-0 text-[10px] text-amber-800 bg-amber-100/90 font-semibold px-1.5 py-0.5 rounded shadow-2xs">
                منطقة الصدر المعتمدة
              </span>
            )}

            {/* Elements list rendering */}
            {elements.map((el) => {
              const isSelected = el.id === selectedId;

              return (
                <div
                  key={el.id}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onSelectElement(el.id);
                    startDrag(e, 'move');
                  }}
                  className={`absolute cursor-grab active:cursor-grabbing touch-none select-none transition-shadow ${
                    isSelected
                      ? 'ring-2 ring-amber-500 ring-offset-1 rounded-sm shadow-md'
                      : 'hover:ring-1 hover:ring-amber-300'
                  }`}
                  style={{
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    transform: `rotate(${el.rotation}deg)`,
                    opacity: el.opacity ?? 1,
                    zIndex: isSelected ? 30 : 10,
                  }}
                >
                  {/* Text Rendering */}
                  {el.type === 'text' && (
                    <div
                      className="w-full h-full flex items-center justify-center text-center select-none"
                      style={{
                        fontFamily: (el as TextElement).fontFamily || 'Cairo',
                        fontSize: `${(el as TextElement).fontSize || 24}px`,
                        color: (el as TextElement).fill || '#1E293B',
                        fontWeight: (el as TextElement).isBold ? 'bold' : 'normal',
                        fontStyle: (el as TextElement).isItalic ? 'italic' : 'normal',
                        textAlign: (el as TextElement).align || 'center',
                        lineHeight: 1.2,
                      }}
                    >
                      {(el as TextElement).text}
                    </div>
                  )}

                  {/* Clipart Rendering */}
                  {el.type === 'clipart' && (
                    <div
                      className="w-full h-full flex items-center justify-center pointer-events-none select-none"
                      dangerouslySetInnerHTML={{
                        __html: (el as ClipartElement).svgContent.replace(
                          /currentColor/g,
                          (el as ClipartElement).fill || '#D97706'
                        ),
                      }}
                    />
                  )}

                  {/* Image Rendering */}
                  {el.type === 'image' && (
                    <div
                      className={`w-full h-full overflow-hidden flex items-center justify-center ${
                        (el as ImageElement).shape === 'circle'
                          ? 'rounded-full'
                          : (el as ImageElement).shape === 'heart'
                          ? 'rounded-2xl'
                          : 'rounded-none'
                      }`}
                    >
                      <img
                        src={(el as ImageElement).src}
                        alt="Baby Custom Art"
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </div>
                  )}

                  {/* Touch & Desktop Interactive Handles */}
                  {isSelected && (
                    <>
                      {/* Top Rotate Handle */}
                      <div
                        onPointerDown={(e) => startDrag(e, 'rotate')}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-500 text-stone-900 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm hover:scale-110 transition-transform"
                        title="تدوير العنصر بالسحب"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </div>

                      {/* Bottom-Right Resize Handle */}
                      <div
                        onPointerDown={(e) => startDrag(e, 'resize')}
                        className="absolute -bottom-2 -right-2 w-6 h-6 bg-amber-500 rounded-full cursor-se-resize shadow-sm hover:scale-110 transition-transform border-2 border-white flex items-center justify-center"
                        title="تكبير أو تصغير بالسحب"
                      >
                        <span className="w-1.5 h-1.5 bg-stone-950 rounded-full" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* EASY FLOATING CONTROLS FOR SELECTED ELEMENT (لوحة التحكم السهلة والمباشرة) */}
      {selectedEl && (
        <div className="w-full max-w-[480px] mt-3 p-3 bg-white border border-stone-200 rounded-xl shadow-xs space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 border-b border-stone-100 pb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                التحكم بالعنصر:{' '}
                {selectedEl.type === 'text'
                  ? `"${(selectedEl as TextElement).text}"`
                  : selectedEl.type === 'clipart'
                  ? 'رسمة لطيفة'
                  : 'صورة شخصية'}
              </span>
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDuplicateElement(selectedEl.id)}
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                title="تكرار ونسخ"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteElement(selectedEl.id)}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                title="حذف من القطعة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Buttons Grid for Easy Non-Complex Control */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            {/* Center Horizontally */}
            <button
              type="button"
              onClick={handleCenterHorizontal}
              className="py-1.5 px-2 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 border border-stone-200 rounded-lg font-medium text-stone-700 flex items-center justify-center gap-1 transition-colors"
              title="توسيط في منتصف الصدر تماماً"
            >
              <AlignCenterHorizontal className="w-3.5 h-3.5 text-amber-700" />
              <span>توسيط أفقي</span>
            </button>

            {/* Center Vertically */}
            <button
              type="button"
              onClick={handleCenterVertical}
              className="py-1.5 px-2 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 border border-stone-200 rounded-lg font-medium text-stone-700 flex items-center justify-center gap-1 transition-colors"
              title="توسيط رأسي"
            >
              <AlignCenterVertical className="w-3.5 h-3.5 text-amber-700" />
              <span>توسيط رأسي</span>
            </button>

            {/* Scale Bigger (+) */}
            <button
              type="button"
              onClick={() => handleScaleStep(1.15)}
              className="py-1.5 px-2 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 border border-stone-200 rounded-lg font-medium text-stone-700 flex items-center justify-center gap-1 transition-colors"
              title="تكبير الحجم"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-700" />
              <span>تكبير (+)</span>
            </button>

            {/* Scale Smaller (-) */}
            <button
              type="button"
              onClick={() => handleScaleStep(0.85)}
              className="py-1.5 px-2 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 border border-stone-200 rounded-lg font-medium text-stone-700 flex items-center justify-center gap-1 transition-colors"
              title="تصغير الحجم"
            >
              <Minimize2 className="w-3.5 h-3.5 text-amber-700" />
              <span>تصغير (-)</span>
            </button>
          </div>

          {/* Quick Color Swatches directly on floating bar for Text & Clipart */}
          {(selectedEl.type === 'text' || selectedEl.type === 'clipart') && (
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-stone-100">
              <span className="text-[11px] text-stone-500 font-medium">لون العنصر:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { hex: '#1E293B', title: 'كحلي داكن' },
                  { hex: '#FFFFFF', title: 'أبيض' },
                  { hex: '#D97706', title: 'ذهبي / كهرماني' },
                  { hex: '#BE123C', title: 'وردي عميق' },
                  { hex: '#2563EB', title: 'أزرق ملكي' },
                  { hex: '#059669', title: 'أخضر زمردي' },
                  { hex: '#7C3AED', title: 'بنفسجي هادئ' },
                  { hex: '#B45309', title: 'عسلي دافئ' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onUpdateElement(selectedEl.id, { fill: c.hex })}
                    className={`w-5 h-5 rounded-full border transition-transform hover:scale-115 ${
                      (selectedEl as any).fill === c.hex
                        ? 'ring-2 ring-amber-500 ring-offset-1 scale-110'
                        : 'border-stone-300'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.title}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Micro-positioning and Rotation Steppers */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 text-[11px] text-stone-600">
            {/* Nudge D-Pad */}
            <div className="flex items-center gap-1">
              <span className="text-stone-400">تحريك:</span>
              <button
                type="button"
                onClick={() => handleNudge(0, -6)}
                className="p-1 hover:bg-stone-100 rounded border border-stone-200"
                title="أعلى"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(0, 6)}
                className="p-1 hover:bg-stone-100 rounded border border-stone-200"
                title="أسفل"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(6, 0)}
                className="p-1 hover:bg-stone-100 rounded border border-stone-200"
                title="يمين"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(-6, 0)}
                className="p-1 hover:bg-stone-100 rounded border border-stone-200"
                title="يسار"
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
            </div>

            {/* Rotation controls */}
            <div className="flex items-center gap-1">
              <span className="text-stone-400">تدوير:</span>
              <button
                type="button"
                onClick={() => handleRotateStep(-15)}
                className="p-1 hover:bg-stone-100 rounded border border-stone-200"
                title="تدوير عكس عقارب الساعة"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleRotateStep(15)}
                className="p-1 hover:bg-stone-100 rounded border border-stone-200"
                title="تدوير مع عقارب الساعة"
              >
                <RotateCw className="w-3 h-3" />
              </button>
              {selectedEl.rotation !== 0 && (
                <button
                  type="button"
                  onClick={handleResetRotation}
                  className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 rounded text-[10px] font-semibold text-stone-700"
                  title="إلغاء التدوير"
                >
                  استعادة 0°
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Layer selector chips (if elements exist on this side) */}
      {elements.length > 0 && (
        <div className="w-full max-w-[480px] mt-2 flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-semibold text-stone-500 whitespace-nowrap flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>طبقات التصميم:</span>
          </span>
          {elements.map((el, i) => (
            <button
              key={el.id}
              type="button"
              onClick={() => onSelectElement(el.id)}
              className={`text-xs px-2.5 py-1 rounded-md border whitespace-nowrap transition-all flex items-center gap-1.5 ${
                el.id === selectedId
                  ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold shadow-2xs ring-1 ring-amber-400'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{el.type === 'text' ? '📝' : el.type === 'clipart' ? '🎨' : '🖼️'}</span>
              <span>
                {el.type === 'text'
                  ? (el as TextElement).text.slice(0, 14)
                  : el.type === 'clipart'
                  ? `رسمة ${i + 1}`
                  : `صورة ${i + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
