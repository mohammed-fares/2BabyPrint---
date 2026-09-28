import React from 'react';
import { OrderDetails } from '../types';
import { CheckCircle2, Package, Printer } from 'lucide-react';
import { GarmentSilhouette } from './DesignerStudio/GarmentSilhouette';
import { downloadDataUrl } from '../utils/canvasRenderer';
import { Translations, Language } from '../i18n/translations';

interface OrderSuccessModalProps {
  order: OrderDetails | null;
  onClose: () => void;
  t: Translations;
  lang: Language;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose, t, lang }) => {
  if (!order) return null;

  const handleDownloadAllPrintFiles = () => {
    order.items.forEach((item, index) => {
      if (item.mockupPreviewUrl) {
        downloadDataUrl(
          item.mockupPreviewUrl,
          `Order_${order.orderNumber}_Item_${index + 1}_DTF.png`
        );
      }
    });
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'fawry':
        return t.checkout.fawry;
      case 'wallets':
        return t.checkout.wallets;
      case 'valu':
        return t.checkout.valu;
      case 'meeza':
        return t.checkout.meeza;
      case 'cod':
      default:
        return t.checkout.cod;
    }
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
        </div>

        {/* Receipt Details */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700">
          {/* Status step tracker */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-amber-600" />
              <div>
                <span className="font-bold text-stone-900 block">{t.orderSuccess.statusTitle}</span>
                <span className="text-[11px] text-stone-500">
                  {t.orderSuccess.statusDesc}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
              {t.orderSuccess.statusBadge}
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
              <span className="text-stone-400 block text-[11px]">{t.orderSuccess.payment}</span>
              <span className="font-semibold text-stone-900">
                {getPaymentLabel(order.paymentMethod)}
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
                        {item.color.name} · {item.size} · {t.studio.quantity} {item.quantity}
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
          <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-sm font-bold text-stone-900">
            <span>{t.orderSuccess.totalPaid}</span>
            <span className="font-mono text-base text-amber-800">{order.total} {t.orderSuccess.currency}</span>
          </div>

          {/* Download print files for DTF production */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDownloadAllPrintFiles}
              className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.orderSuccess.downloadDtfBtn}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs transition-colors"
          >
            {t.orderSuccess.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
