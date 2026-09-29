import React from 'react';
import { OrderDetails, StoreSettings } from '../types';
import {
  CheckCircle2,
  Package,
  Printer,
  MessageCircle,
  ExternalLink,
  Truck,
  Zap,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { GarmentSilhouette } from './DesignerStudio/GarmentSilhouette';
import { downloadDataUrl } from '../utils/canvasRenderer';
import { Translations, Language } from '../i18n/translations';

interface OrderSuccessModalProps {
  order: OrderDetails | null;
  onClose: () => void;
  storeSettings?: StoreSettings;
  t: Translations;
  lang: Language;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  storeSettings,
  t,
  lang,
}) => {
  if (!order) return null;

  const isEn = lang === 'en';

  const handleDownloadAllPrintFiles = () => {
    order.items.forEach((item, index) => {
      if (item.mockupPreviewUrl) {
        downloadDataUrl(
          item.mockupPreviewUrl,
          `Order_${order.orderNumber}_Item_${index + 1}_DTF_300DPI.png`
        );
      }
    });
  };

  const printerPhone =
    storeSettings?.printerWhatsapp ||
    storeSettings?.supportWhatsapp ||
    storeSettings?.contactWhatsapp ||
    '01019998877';

  const handleSendToPrinterWhatsApp = () => {
    const cleanPhone = printerPhone.replace(/[^0-9]/g, '');

    const itemsSummary = order.items
      .map(
        (it, idx) =>
          `[قطعة ${idx + 1}] ${it.productName} | المقاس: ${it.size} | اللون: ${it.color.name} | الكمية: ${it.quantity} | طباعة: ${it.printSides.join(' + ')}`
      )
      .join('\n');

    const message = `*طلب جديد لمطبعة 2BabyPrint رقم: ${order.orderNumber}*
---------------------------------------
👤 *العميل:* ${order.customerName}
📞 *الهاتف:* ${order.phone}
📍 *العنوان:* ${order.city} - ${order.address}
🚚 *نوع الشحن:* ${
      order.shippingType === 'express_uber'
        ? 'توصيل فوري مستعجل اليوم (أوبر سكوتر)'
        : 'شحن قياسي مجدول 48 ساعة'
    }
💳 *الدفع:* ${order.paymentMethod === 'instapay' ? 'إنستاباي' : 'محفظة إلكترونية'} (مرجع: ${
      order.instapayReference || 'مرفق الوصل'
    })
💰 *الإجمالي المدفوع:* ${order.total} ج.م
---------------------------------------
👕 *القطع المطلوبة مع تفاصيل التصميم:*
${itemsSummary}
${order.notes ? `\n📝 *ملاحظات خاصة:* ${order.notes}` : ''}
---------------------------------------
✅ تم تأكيد السداد وحفظ ملفات التصميم الأصلية بدقة 300 DPI`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Top badge */}
        <div className="p-6 text-center border-b border-stone-100 bg-[#FAF9F6]">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3 shadow-2xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            {t.orderSuccess.badge}
          </span>
          <h3 className="text-xl font-extrabold text-stone-900 mt-2">
            {t.orderSuccess.title}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {t.orderSuccess.orderNum}{' '}
            <span className="font-mono font-bold text-stone-800">{order.orderNumber}</span> ·{' '}
            {order.date}
          </p>

          {/* Receipt verification status badge */}
          {order.receiptVerified && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[11px] font-bold mt-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>تم التحقق من وصل السداد وتأكيد الدفع آلياً (مرجع: {order.instapayReference})</span>
            </div>
          )}
        </div>

        {/* Receipt Details */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-stone-700">
          {/* Status step tracker */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-amber-600" />
              <div>
                <span className="font-bold text-stone-900 block">{t.orderSuccess.statusTitle}</span>
                <span className="text-[11px] text-stone-500">
                  {order.shippingType === 'express_uber'
                    ? 'قيد التجهيز الفوري للتسليم لمندوب أوبر سكوتر اليوم'
                    : t.orderSuccess.statusDesc}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
              {order.shippingType === 'express_uber' ? 'شحن فوري اليوم ⚡' : t.orderSuccess.statusBadge}
            </span>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50/70 rounded-xl border border-stone-200/80">
            <div>
              <span className="text-stone-400 block text-[11px]">{t.orderSuccess.customer}</span>
              <span className="font-semibold text-stone-900">{order.customerName}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">{t.orderSuccess.phone}</span>
              <span className="font-mono font-semibold text-stone-900">{order.phone}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">{t.orderSuccess.address}</span>
              <span className="font-semibold text-stone-900">
                {order.city} - {order.address}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">طريقة الشحن والدفع</span>
              <span className="font-semibold text-stone-900">
                {order.shippingType === 'express_uber' ? 'أوبر سكوتر فوري' : 'شحن قياسي 48 ساعة'} ·{' '}
                {order.paymentMethod === 'instapay' ? 'إنستاباي' : 'محفظة إلكترونية'}
              </span>
            </div>
          </div>

          {/* Itemized summary */}
          <div>
            <span className="font-bold text-stone-900 block mb-2">{t.orderSuccess.customItems}</span>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-12 bg-stone-100 rounded border border-stone-200 p-0.5 relative overflow-hidden shrink-0">
                      <GarmentSilhouette
                        garmentType={item.garmentType}
                        colorHex={item.color.hex}
                        side="front"
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900 block truncate max-w-[200px]">
                        {item.productName}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {item.color.name} · {item.size} · {t.studio.quantity} {item.quantity} · (
                        {item.printSides.join(' + ')})
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    {item.unitPrice * item.quantity} {t.orderSuccess.currency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-bold text-stone-900">
            <span>{t.orderSuccess.totalPaid}</span>
            <span className="font-mono text-base text-amber-800">{order.total} {t.orderSuccess.currency}</span>
          </div>

          {/* Direct Print House & WhatsApp Dispatch Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleSendToPrinterWhatsApp}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال تفاصيل الأوردر لواتساب المطبعة</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadAllPrintFiles}
              className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>تحميل ملفات الطباعة 300 DPI</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            {t.orderSuccess.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
