import React, { useState, useEffect } from 'react';
import {
  Product,
  ProductColor,
  DesignElement,
  GarmentDesign,
  TextElement,
  ClipartElement,
  ImageElement,
  ClipartItem,
  DesignTemplate,
} from '../../types';
import { CanvasWorkspace } from './CanvasWorkspace';
import { TextTool } from './TextTool';
import { ClipartTool } from './ClipartTool';
import { UploadTool } from './UploadTool';
import { PrintExportModal } from './PrintExportModal';
import { DESIGN_TEMPLATES } from '../../data/templates';
import { exportPrintReadyFile } from '../../utils/canvasRenderer';
import { Translations, Language } from '../../i18n/translations';
import {
  X,
  Type,
  Palette,
  Upload,
  Layers,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  RotateCw,
  Printer,
  Info,
} from 'lucide-react';

interface DesignerStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  initialTemplate?: DesignTemplate | null;
  onAddToCart: (customizedItem: {
    productId: string;
    productName: string;
    productImage: string;
    garmentType: Product['garmentType'];
    color: ProductColor;
    size: string;
    quantity: number;
    unitPrice: number;
    design: GarmentDesign;
    mockupPreviewUrl: string;
    printSides: ('front' | 'back')[];
    customNotes?: string;
  }) => void;
  t: Translations;
  lang: Language;
}

type StudioTab = 'text' | 'cliparts' | 'upload' | 'templates' | 'colors';

export const DesignerStudioModal: React.FC<DesignerStudioModalProps> = ({
  isOpen,
  onClose,
  product,
  initialTemplate,
  onAddToCart,
  t,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('text');
  const [mobileActiveTab, setMobileActiveTab] = useState<'canvas' | 'tools'>('canvas');
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '0-3 شهر');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Design elements for Front and Back
  const [design, setDesign] = useState<GarmentDesign>({
    front: { elements: [] },
    back: { elements: [] },
  });

  // History for Undo / Redo
  const [history, setHistory] = useState<GarmentDesign[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Print export modal state
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Initialize with template or clear
  useEffect(() => {
    if (initialTemplate) {
      setDesign(initialTemplate.design);
      const matchColor = product.colors.find((c) => c.id === initialTemplate.defaultColorId);
      if (matchColor) setSelectedColor(matchColor);
      setHistory([initialTemplate.design]);
      setHistoryIndex(0);
    } else {
      const initialDesign: GarmentDesign = {
        front: { elements: [] },
        back: { elements: [] },
      };
      setDesign(initialDesign);
      setHistory([initialDesign]);
      setHistoryIndex(0);
    }
  }, [initialTemplate, product]);

  if (!isOpen) return null;

  const currentElements = design[activeSide].elements;
  const selectedElement = currentElements.find((el) => el.id === selectedElementId) || null;

  // Push new state to history
  const pushToHistory = (newDesign: GarmentDesign) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newDesign);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setDesign(newDesign);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setDesign(history[historyIndex - 1]);
      setSelectedElementId(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setDesign(history[historyIndex + 1]);
      setSelectedElementId(null);
    }
  };

  // Add text element
  const handleAddText = (text: string, options?: Partial<TextElement>) => {
    const newId = `txt-${Date.now()}`;
    const newElement: TextElement = {
      id: newId,
      type: 'text',
      text,
      fontFamily: options?.fontFamily || 'Cairo',
      fontSize: options?.fontSize || 26,
      fill: options?.fill || '#1E293B',
      align: options?.align || 'center',
      x: 30,
      y: 60 + currentElements.length * 30,
      width: 180,
      height: 42,
      rotation: 0,
      opacity: 1,
      isBold: options?.isBold ?? true,
      isCurved: options?.isCurved,
      curveRadius: options?.curveRadius,
    };

    const updated = {
      ...design,
      [activeSide]: {
        elements: [...currentElements, newElement],
      },
    };
    pushToHistory(updated);
    setSelectedElementId(newId);
    setMobileActiveTab('canvas');
  };

  // Update text element
  const handleUpdateText = (updates: Partial<TextElement>) => {
    if (!selectedElementId) return;
    const updatedElements = currentElements.map((el) =>
      el.id === selectedElementId ? ({ ...el, ...updates } as DesignElement) : el
    );
    const updated = {
      ...design,
      [activeSide]: { elements: updatedElements },
    };
    pushToHistory(updated);
  };

  // Add clipart
  const handleAddClipart = (clipart: ClipartItem, fill?: string) => {
    const newId = `clip-${Date.now()}`;
    const newElement: ClipartElement = {
      id: newId,
      type: 'clipart',
      clipartId: clipart.id,
      svgContent: clipart.svg,
      fill: fill || clipart.defaultFill || '#D97706',
      x: 55,
      y: 35,
      width: 130,
      height: 120,
      rotation: 0,
      opacity: 1,
    };

    const updated = {
      ...design,
      [activeSide]: {
        elements: [...currentElements, newElement],
      },
    };
    pushToHistory(updated);
    setSelectedElementId(newId);
    setMobileActiveTab('canvas');
  };

  // Update clipart fill
  const handleUpdateClipartFill = (fill: string) => {
    if (!selectedElementId) return;
    const updatedElements = currentElements.map((el) =>
      el.id === selectedElementId ? ({ ...el, fill } as DesignElement) : el
    );
    const updated = {
      ...design,
      [activeSide]: { elements: updatedElements },
    };
    pushToHistory(updated);
  };

  // Add Image
  const handleAddImage = (src: string, shape?: 'rect' | 'circle' | 'heart') => {
    const newId = `img-${Date.now()}`;
    const newElement: ImageElement = {
      id: newId,
      type: 'image',
      src,
      shape: shape || 'rect',
      x: 45,
      y: 40,
      width: 150,
      height: 150,
      rotation: 0,
      opacity: 1,
    };

    const updated = {
      ...design,
      [activeSide]: {
        elements: [...currentElements, newElement],
      },
    };
    pushToHistory(updated);
    setSelectedElementId(newId);
    setMobileActiveTab('canvas');
  };

  // Update element coordinates / transform
  const handleUpdateElement = (id: string, updates: Partial<DesignElement>) => {
    const updatedElements = currentElements.map((el) =>
      el.id === id ? ({ ...el, ...updates } as DesignElement) : el
    );
    setDesign({
      ...design,
      [activeSide]: { elements: updatedElements },
    });
  };

  // Delete element
  const handleDeleteElement = (id: string) => {
    const updatedElements = currentElements.filter((el) => el.id !== id);
    const updated = {
      ...design,
      [activeSide]: { elements: updatedElements },
    };
    pushToHistory(updated);
    setSelectedElementId(null);
  };

  // Duplicate element
  const handleDuplicateElement = (id: string) => {
    const target = currentElements.find((el) => el.id === id);
    if (!target) return;
    const clone: DesignElement = {
      ...target,
      id: `${target.type}-${Date.now()}`,
      x: target.x + 15,
      y: target.y + 15,
    };
    const updated = {
      ...design,
      [activeSide]: { elements: [...currentElements, clone] },
    };
    pushToHistory(updated);
    setSelectedElementId(clone.id);
  };

  // Apply template
  const handleApplyTemplate = (tpl: DesignTemplate) => {
    setDesign(tpl.design);
    const matchCol = product.colors.find((c) => c.id === tpl.defaultColorId);
    if (matchCol) setSelectedColor(matchCol);
    pushToHistory(tpl.design);
    setMobileActiveTab('canvas');
  };

  // Pricing calculation in EGP (+50 EGP if both sides have customization)
  const hasFront = design.front.elements.length > 0;
  const hasBack = design.back.elements.length > 0;
  const dualSideExtra = hasFront && hasBack ? 50 : 0;
  const unitPrice = product.price + dualSideExtra;
  const totalPrice = unitPrice * quantity;

  // Add to cart handler
  const handleCompleteAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const primarySide = hasFront ? design.front.elements : design.back.elements;
      const exportRes = await exportPrintReadyFile(primarySide, 240, 300, 150);

      const printSides: ('front' | 'back')[] = [];
      if (hasFront) printSides.push('front');
      if (hasBack) printSides.push('back');

      onAddToCart({
        productId: product.id,
        productName: lang === 'ar' ? product.name : product.nameEn,
        productImage: product.image,
        garmentType: product.garmentType,
        color: selectedColor,
        size: selectedSize,
        quantity,
        unitPrice,
        design,
        mockupPreviewUrl: exportRes.dataUrl,
        printSides: printSides.length > 0 ? printSides : ['front'],
      });

      onClose();
    } catch (err) {
      console.error('Failed to add customized item to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/75 backdrop-blur-xs select-none">
      <div className="w-full h-full max-w-7xl max-h-[96vh] m-2 md:m-4 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        {/* 1. Studio Header */}
        <header className="px-5 py-3 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/80 transition-colors"
              title="Close Studio"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {t.studio.title}
                </span>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs text-stone-500">{product.category}</span>
              </div>
              <h2 className="text-sm md:text-base font-bold text-stone-900">
                {lang === 'ar' ? product.name : product.nameEn}
              </h2>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white border border-stone-300 hover:border-stone-400 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
              title={t.studio.exportDtf}
            >
              <Printer className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">{t.studio.exportDtf}</span>
            </button>

            <button
              type="button"
              onClick={handleCompleteAddToCart}
              disabled={isAddingToCart}
              className="px-4 py-2 text-xs md:text-sm font-bold bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 rounded-lg flex items-center gap-2 transition-all shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {isAddingToCart ? t.studio.addingToCart : `${t.studio.addToCart} (${totalPrice} ${t.catalog.currency})`}
              </span>
            </button>
          </div>
        </header>

        {/* Mobile View Switcher Tab (Visible on mobile/small tablet screens < md) */}
        <div className="md:hidden flex items-center justify-center p-2 bg-stone-100 border-b border-stone-200 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileActiveTab('canvas')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileActiveTab === 'canvas'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            <span>👕</span>
            <span>{lang === 'ar' ? 'معاينة القطعة والتصميم' : 'Garment Canvas'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileActiveTab('tools')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileActiveTab === 'tools'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            <span>🎨</span>
            <span>{lang === 'ar' ? 'أدوات التصميم والرسومات' : 'Design Tools'}</span>
          </button>
        </div>

        {/* 2. Studio Body (Sidebar + Canvas + Property Bar) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Studio Left Tool Selector */}
          <div className={`w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-l border-stone-200 bg-white flex flex-col ${mobileActiveTab === 'tools' ? 'flex-1 overflow-y-auto' : 'hidden md:flex'}`}>
            {/* Tool Tabs Bar */}
            <div className="flex items-center justify-around border-b border-stone-200 p-1.5 bg-stone-50/50">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('text');
                  setMobileActiveTab('tools');
                }}
                className={`flex-1 py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  activeTab === 'text'
                    ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Type className="w-4 h-4" />
                <span>{t.studio.textTab}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('cliparts');
                  setMobileActiveTab('tools');
                }}
                className={`flex-1 py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  activeTab === 'cliparts'
                    ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.studio.clipartsTab}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('upload');
                  setMobileActiveTab('tools');
                }}
                className={`flex-1 py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>{t.studio.uploadTab}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('templates');
                  setMobileActiveTab('tools');
                }}
                className={`flex-1 py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  activeTab === 'templates'
                    ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{t.studio.templatesTab}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('colors');
                  setMobileActiveTab('tools');
                }}
                className={`flex-1 py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  activeTab === 'colors'
                    ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>{t.studio.colorsTab}</span>
              </button>
            </div>

            {/* Tool Active Panel */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === 'text' && (
                <TextTool
                  selectedElement={
                    selectedElement && selectedElement.type === 'text'
                      ? (selectedElement as TextElement)
                      : null
                  }
                  onAddText={handleAddText}
                  onUpdateText={handleUpdateText}
                  t={t}
                  lang={lang}
                />
              )}

              {activeTab === 'cliparts' && (
                <ClipartTool
                  selectedElement={
                    selectedElement && selectedElement.type === 'clipart'
                      ? (selectedElement as ClipartElement)
                      : null
                  }
                  onAddClipart={handleAddClipart}
                  onUpdateClipartFill={handleUpdateClipartFill}
                  t={t}
                  lang={lang}
                />
              )}

              {activeTab === 'upload' && (
                <UploadTool
                  selectedElement={
                    selectedElement && selectedElement.type === 'image'
                      ? (selectedElement as ImageElement)
                      : null
                  }
                  onAddImage={handleAddImage}
                  onUpdateShape={(shape) => {
                    if (selectedElementId) {
                      handleUpdateElement(selectedElementId, { shape });
                    }
                  }}
                  t={t}
                  lang={lang}
                />
              )}

              {activeTab === 'templates' && (
                <div className="space-y-3">
                  <div className="text-xs text-stone-500 mb-2">
                    {t.studio.readyTemplatesTitle}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {DESIGN_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleApplyTemplate(tpl)}
                        className="p-3 bg-stone-50 hover:bg-amber-50/70 border border-stone-200 hover:border-amber-300 rounded-xl text-right transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{tpl.thumbnail}</span>
                          <div>
                            <span className="text-xs font-bold text-stone-900 group-hover:text-amber-900 block">
                              {tpl.title}
                            </span>
                            <span className="text-[11px] text-stone-500 block">
                              {tpl.subtitle}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-amber-700 font-semibold px-2 py-1 bg-white rounded border border-stone-200 group-hover:border-amber-400">
                          {t.studio.apply}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-2">
                      {t.studio.garmentColorsTitle}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2.5 transition-all ${
                            selectedColor.id === color.id
                              ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold shadow-2xs ring-1 ring-amber-400'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="truncate">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      {t.studio.garmentColorsNote}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Studio Center Workspace */}
          <div className={`flex-1 bg-stone-100 flex flex-col overflow-hidden relative ${mobileActiveTab === 'canvas' ? 'flex' : 'hidden md:flex'}`}>
            {/* Top Canvas Controls (Side toggle, Undo/Redo) */}
            <div className="px-4 py-2 bg-white/80 border-b border-stone-200 flex items-center justify-between z-20 backdrop-blur-xs">
              {/* Front / Back Switcher */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSide('front');
                    setSelectedElementId(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeSide === 'front'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.studio.front} ({design.front.elements.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSide('back');
                    setSelectedElementId(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeSide === 'back'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.studio.back} ({design.back.elements.length})
                </button>
              </div>

              {/* Undo / Redo controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 rounded hover:bg-stone-200 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title={t.studio.undo}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 rounded hover:bg-stone-200 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title={t.studio.redo}
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canvas Surface */}
            <div className="flex-1 p-4 flex items-center justify-center overflow-auto">
              <CanvasWorkspace
                garmentType={product.garmentType}
                colorHex={selectedColor.hex}
                side={activeSide}
                elements={currentElements}
                selectedId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                onDuplicateElement={handleDuplicateElement}
              />
            </div>

            {/* Bottom Quick Garment Options Bar */}
            <div className="px-5 py-3 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Color chips */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-600">{t.studio.selectedColor}</span>
                <span className="font-medium text-stone-800">{selectedColor.name}</span>
                <div className="flex items-center gap-1.5 mr-2">
                  {product.colors.slice(0, 6).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-5 h-5 rounded-full border transition-transform ${
                        selectedColor.id === c.id
                          ? 'ring-2 ring-amber-500 scale-110'
                          : 'border-stone-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-600">{t.studio.size}</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-md text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-600">{t.studio.quantity}</span>
                <div className="flex items-center border border-stone-300 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700"
                  >
                    -
                  </button>
                  <span className="px-3 py-0.5 bg-white font-mono font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Export Modal */}
      <PrintExportModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        frontElements={design.front.elements}
        backElements={design.back.elements}
        productName={lang === 'ar' ? product.name : product.nameEn}
        garmentType={product.garmentType}
        color={selectedColor}
      />
    </div>
  );
};
