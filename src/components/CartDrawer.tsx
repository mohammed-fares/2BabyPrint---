import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { GarmentSilhouette } from './DesignerStudio/GarmentSilhouette';
import { Translations, Language } from '../i18n/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  t: Translations;
  lang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  t,
  lang,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  // Free delivery in Cairo & Giza if order >= 600 EGP, otherwise 50 EGP
  const shippingThreshold = 600;
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div className={`w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in ${lang === 'ar' ? 'slide-in-from-left' : 'slide-in-from-right'} duration-250`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900">
              {t.cart.title} ({cartItems.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-stone-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 stroke-1" />
              <p className="text-sm font-semibold text-stone-600">{t.cart.emptyTitle}</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                {t.cart.emptySubtitle}
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-stone-200 rounded-xl bg-stone-50/60 space-y-3"
              >
                <div className="flex gap-3">
                  {/* Item Mockup Stage */}
                  <div className="w-20 h-24 bg-white rounded-lg border border-stone-200 p-1 flex items-center justify-center relative overflow-hidden shrink-0">
                    <GarmentSilhouette
                      garmentType={item.garmentType}
                      colorHex={item.color.hex}
                      side="front"
                      className="w-full h-full"
                    />
                    {item.mockupPreviewUrl && (
                      <div className="absolute top-[28%] w-10 h-12 flex items-center justify-center pointer-events-none">
                        <img
                          src={item.mockupPreviewUrl}
                          alt="Print artwork"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {item.productName}
                    </h4>

                    {/* Metadata text */}
                    <div className="text-[11px] text-stone-500 mt-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span>{t.cart.color} {item.color.name}</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: item.color.hex }}
                        />
                      </div>
                      <div>{t.cart.size} {item.size}</div>
                      <div>
                        {t.cart.sides} {item.printSides.includes('back') ? t.cart.bothSides : t.cart.frontOnly}
                      </div>
                    </div>

                    <div className="mt-2 text-xs font-bold text-stone-900 font-mono tabular-nums">
                      {item.unitPrice * item.quantity} {t.cart.currency}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                  <div className="flex items-center border border-stone-200 rounded-md bg-white">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-0.5 text-xs font-mono font-semibold text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{t.cart.subtotal}</span>
                <span className="font-mono tabular-nums font-semibold text-stone-900">
                  {subtotal} {t.cart.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.cart.shipping}</span>
                <span className="font-mono tabular-nums">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-semibold">{t.cart.freeShipping}</span>
                  ) : (
                    `${shipping} ${t.cart.currency}`
                  )}
                </span>
              </div>
              {subtotal < shippingThreshold && (
                <p className="text-[11px] text-amber-700">
                  {t.cart.shippingThresholdNotice(shippingThreshold - subtotal)}
                </p>
              )}
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>{t.cart.total}</span>
                <span className="font-mono tabular-nums text-base text-amber-800">
                  {total} {t.cart.currency}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>{t.cart.checkoutBtn}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.cart.guarantee}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
