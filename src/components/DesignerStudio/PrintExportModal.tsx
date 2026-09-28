import React, { useEffect, useState } from 'react';
import { DesignElement, GarmentType, ProductColor } from '../../types';
import { exportPrintReadyFile, downloadDataUrl } from '../../utils/canvasRenderer';
import { X, Download, Printer, CheckCircle, FileText, Sparkles } from 'lucide-react';
import { GarmentSilhouette } from './GarmentSilhouette';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  frontElements: DesignElement[];
  backElements: DesignElement[];
  productName: string;
  garmentType: GarmentType;
  color: ProductColor;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  frontElements,
  backElements,
  productName,
  garmentType,
  color,
}) => {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [frontPrintData, setFrontPrintData] = useState<string | null>(null);
  const [backPrintData, setBackPrintData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const generateFiles = async () => {
      setIsLoading(true);
      try {
        if (frontElements.length > 0) {
          const frontRes = await exportPrintReadyFile(frontElements, 240, 300, 300);
          setFrontPrintData(frontRes.dataUrl);
        } else {
          setFrontPrintData(null);
        }

        if (backElements.length > 0) {
          const backRes = await exportPrintReadyFile(backElements, 240, 300, 300);
          setBackPrintData(backRes.dataUrl);
        } else {
          setBackPrintData(null);
        }
      } catch (err) {
        console.error('Error generating print file:', err);
      } finally {
        setIsLoading(false);
      }
    };

    generateFiles();
  }, [isOpen, frontElements, backElements]);

  if (!isOpen) return null;

  const currentSideData = activeSide === 'front' ? frontPrintData : backPrintData;
  const currentElements = activeSide === 'front' ? frontElements : backElements;

  const handleDownloadDtf = () => {
    if (!currentSideData) return;
    const filename = `2BabyPrint_${productName.replace(/\s+/g, '_')}_${activeSide}_300DPI.png`;
    downloadDataUrl(currentSideData, filename);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                مخرجات ملف الطباعة الرقمية (DTG / DTF Output)
              </h3>
              <p className="text-xs text-stone-500">
                دقة 300 DPI حقيقية بخلفية شفافة جاهزة لماكينات الطباعة الفورية
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Side Tabs */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSide('front')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSide === 'front'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                الواجهة الأمامية ({frontElements.length} عناصر)
              </button>
              <button
                type="button"
                onClick={() => setActiveSide('back')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSide === 'back'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                الجهة الخلفية ({backElements.length} عناصر)
              </button>
            </div>

            <span className="text-xs font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded">
              300 DPI Transparent PNG
            </span>
          </div>

          {/* Preview Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transparent Print Art */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-stone-500 block">
                1. ملف الرسم المفرغ للطباعة (DTF Film)
              </span>
              <div
                className="h-56 rounded-xl border border-stone-200 flex items-center justify-center p-4 relative overflow-hidden"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                }}
              >
                {isLoading ? (
                  <div className="text-xs text-stone-500 animate-pulse">جارٍ معالجة دقة 300 DPI...</div>
                ) : currentSideData ? (
                  <img
                    src={currentSideData}
                    alt="DTF Print Layer"
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                  />
                ) : (
                  <div className="text-xs text-stone-400">لا توجد رسومات في هذه الجهة</div>
                )}
              </div>
            </div>

            {/* Mockup Preview with Garment */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-stone-500 block">
                2. محاكاة القطعة على القماش ({color.name})
              </span>
              <div className="h-56 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center p-2 relative overflow-hidden">
                <div className="relative w-44 h-48 flex items-center justify-center">
                  <GarmentSilhouette
                    garmentType={garmentType}
                    colorHex={color.hex}
                    side={activeSide}
                  />
                  {currentSideData && (
                    <div className="absolute top-[28%] w-24 h-28 flex items-center justify-center pointer-events-none">
                      <img
                        src={currentSideData}
                        alt="Print overlay"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specs Callout */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-stone-400 block text-[11px]">أبعاد الطباعة:</span>
              <span className="font-semibold text-stone-800">20 × 25 سم</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">الدقة الرأسية:</span>
              <span className="font-semibold text-stone-800">300 DPI</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">صيغة الملف:</span>
              <span className="font-semibold text-stone-800">PNG Alpha (شفاف)</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">طريقة الطباعة:</span>
              <span className="font-semibold text-stone-800">DTF / DTG مباشر</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
          >
            إغلاق
          </button>

          <button
            type="button"
            onClick={handleDownloadDtf}
            disabled={!currentSideData}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>تحميل ملف الطباعة DTF (300 DPI)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
