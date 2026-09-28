import React, { useState } from 'react';
import { OrderDetails, CartItem } from '../../types';
import { exportPrintReadyFile, downloadDataUrl } from '../../utils/canvasRenderer';
import { GarmentSilhouette } from '../DesignerStudio/GarmentSilhouette';
import {
  Printer,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  PackageCheck,
  Layers,
  FileCheck,
  Send,
  AlertCircle,
} from 'lucide-react';

interface PrinterPortalProps {
  orders: OrderDetails[];
  onUpdateOrderStatus: (orderNumber: string, status: OrderDetails['status']) => void;
}

export const PrinterPortal: React.FC<PrinterPortalProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'printing'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter orders relevant for printing
  const printOrders = orders.filter((o) => {
    if (filter === 'pending') return o.status === 'pending_review';
    if (filter === 'printing') return o.status === 'printing_dtf';
    return o.status === 'pending_review' || o.status === 'printing_dtf';
  });

  const handleDownloadItemPrintFile = async (orderNumber: string, item: CartItem, side: 'front' | 'back') => {
    const key = `${orderNumber}-${item.id}-${side}`;
    setDownloadingId(key);
    try {
      const elements = side === 'front' ? item.design.front.elements : item.design.back.elements;
      if (elements.length === 0) return;
      const res = await exportPrintReadyFile(elements, 240, 300, 300);
      const filename = `PRINT_${orderNumber}_${item.productName.slice(0, 10)}_${side}_300DPI.png`;
      downloadDataUrl(res.dataUrl, filename);
    } catch (err) {
      console.error('Failed to export print file:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/90 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Portal Header */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900">
                  بوابة المطبعة وفريق الإنتاج الرقمي (DTF / DTG Production)
                </h1>
                <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded">
                  ماكينات القاهرة
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                استقبال ملفات التصاميم الفورية بدقة 300 DPI وتجهيز طباعة خامات القطن المصري
              </p>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              جميع أوامر الطباعة ({printOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'pending'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              بانتظار البدء ({orders.filter((o) => o.status === 'pending_review').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('printing')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'printing'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              قيد الطباعة الآن ({orders.filter((o) => o.status === 'printing_dtf').length})
            </button>
          </div>
        </div>

        {/* Orders Queue List */}
        {printOrders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-400 space-y-3">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
            <h3 className="text-base font-bold text-stone-800">
              لا توجد أوامر طباعة معلقة حالياً في طابور الإنتاج
            </h3>
            <p className="text-xs text-stone-500">
              جميع الطلبات تم الانتهاء من طباعتها وتسليمها لقسم التوصيل والشحن
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {printOrders.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-amber-300 transition-all"
              >
                {/* Order Top Banner */}
                <div className="px-6 py-4 bg-stone-50/70 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-stone-900 font-mono bg-stone-200/80 px-2.5 py-1 rounded-md">
                      أمر تشغيل #{order.orderNumber}
                    </span>
                    <span className="text-xs text-stone-500">{order.date}</span>
                    <span className="text-xs text-stone-400">·</span>
                    <span className="text-xs font-semibold text-stone-700">
                      العميل: {order.customerName} ({order.city})
                    </span>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        order.status === 'printing_dtf'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {order.status === 'printing_dtf'
                          ? 'قيد الطباعة على ماكينة DTF'
                          : 'طلب مؤكد - بانتظار الطباعة'}
                      </span>
                    </span>

                    {/* Status Progress Button */}
                    {order.status === 'pending_review' ? (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.orderNumber, 'printing_dtf')}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>بدء الطباعة الآن</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.orderNumber, 'ready_for_shipping')}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>اكتملت الطباعة والتغليف (جاهز للشحن)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="p-6 space-y-6">
                  {order.notes && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">ملاحظات العميل الخاصة للتنفيذ: </span>
                        <span>{order.notes}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {order.items.map((item, idx) => {
                      const hasFront = item.design.front.elements.length > 0;
                      const hasBack = item.design.back.elements.length > 0;

                      return (
                        <div
                          key={idx}
                          className="border border-stone-200 rounded-xl p-4 bg-stone-50/40 flex flex-col justify-between space-y-4"
                        >
                          <div>
                            {/* Product Header */}
                            <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-3">
                              <div>
                                <h4 className="text-sm font-bold text-stone-900">
                                  {item.productName}
                                </h4>
                                <div className="text-xs text-stone-500 mt-0.5 space-x-2 space-x-reverse">
                                  <span>المقاس المطلوب: <strong className="text-stone-900">{item.size}</strong></span>
                                  <span>·</span>
                                  <span>الكمية: <strong className="text-stone-900 font-mono">{item.quantity}</strong> قطعة</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-stone-200 text-xs">
                                <span
                                  className="w-3 h-3 rounded-full border border-stone-300"
                                  style={{ backgroundColor: item.color.hex }}
                                />
                                <span className="font-semibold text-stone-800">{item.color.name}</span>
                              </div>
                            </div>

                            {/* Garment Preview & Elements Detail */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                              {/* Visual Mockup */}
                              <div className="h-44 bg-white rounded-xl border border-stone-200 p-2 flex items-center justify-center relative overflow-hidden">
                                <div className="w-32 h-40 relative flex items-center justify-center">
                                  <GarmentSilhouette
                                    garmentType={item.garmentType}
                                    colorHex={item.color.hex}
                                    side="front"
                                  />
                                </div>
                              </div>

                              {/* Design Specs (Text & Cliparts) */}
                              <div className="space-y-2 text-xs text-stone-700">
                                <span className="font-bold text-stone-900 block text-[11px]">
                                  تفاصيل التصميم المعتمد للطباعة:
                                </span>

                                {/* Front Elements */}
                                {hasFront && (
                                  <div className="p-2 bg-white rounded-lg border border-stone-200 space-y-1">
                                    <span className="font-semibold text-amber-800 text-[10px] block">
                                      واجهة الصدر (Front):
                                    </span>
                                    {item.design.front.elements.map((el, elIdx) => (
                                      <div key={elIdx} className="text-[11px] text-stone-600 flex items-center gap-1.5">
                                        <span>•</span>
                                        {el.type === 'text' ? (
                                          <span>
                                            نص: <strong>"{(el as any).text}"</strong> (خط {(el as any).fontFamily})
                                          </span>
                                        ) : el.type === 'clipart' ? (
                                          <span>رسمة مفرغة (كود: {(el as any).clipartId})</span>
                                        ) : (
                                          <span>صورة شخصية مرفوعة من العميل</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Back Elements */}
                                {hasBack && (
                                  <div className="p-2 bg-white rounded-lg border border-stone-200 space-y-1">
                                    <span className="font-semibold text-amber-800 text-[10px] block">
                                      الجهة الخلفية (Back):
                                    </span>
                                    {item.design.back.elements.map((el, elIdx) => (
                                      <div key={elIdx} className="text-[11px] text-stone-600 flex items-center gap-1.5">
                                        <span>•</span>
                                        {el.type === 'text' ? (
                                          <span>نص: "{(el as any).text}"</span>
                                        ) : (
                                          <span>رسمة مفرغة</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Print Files Download Bar */}
                          <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center gap-2">
                            {hasFront && (
                              <button
                                type="button"
                                onClick={() => handleDownloadItemPrintFile(order.orderNumber, item, 'front')}
                                disabled={downloadingId === `${order.orderNumber}-${item.id}-front`}
                                className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>
                                  {downloadingId === `${order.orderNumber}-${item.id}-front`
                                    ? 'جارٍ التوليد...'
                                    : 'تحميل ملف الصدر DTF (300 DPI)'}
                                </span>
                              </button>
                            )}

                            {hasBack && (
                              <button
                                type="button"
                                onClick={() => handleDownloadItemPrintFile(order.orderNumber, item, 'back')}
                                disabled={downloadingId === `${order.orderNumber}-${item.id}-back`}
                                className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>تحميل ملف الظهر (300 DPI)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
