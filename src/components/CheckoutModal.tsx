import React, { useState } from 'react';
import { CartItem, OrderDetails, PaymentMethodType, Coupon } from '../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Truck,
  Smartphone,
  Lock,
  Tag,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Translations, Language } from '../i18n/translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderPlaced: (order: OrderDetails) => void;
  coupons: Coupon[];
  t: Translations;
  lang: Language;
}

const CAIRO_DISTRICTS = [
  'التجمع الخامس والقاهرة الجديدة',
  'المعادي ودجلة',
  'مصر الجديدة والنزهة',
  'مدينة نصر',
  'الزمالك وجاردن سيتي ووسط البلد',
  'الدقي والمهندسين والعجوزة',
  'الشيخ زايد و6 أكتوبر',
  'شبرا وروض الفرج',
  'الهرم وفيصل والجيزة',
  'الشروق ومدينتي وبدر',
  'الإسكندرية والساحل الشمالي',
  'باقي محافظات مصر (الدلتا والصعيد)',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderPlaced,
  coupons,
  t,
  lang,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(CAIRO_DISTRICTS[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('instapay');
  const [instapayRef, setInstapayRef] = useState('');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [copiedInstapay, setCopiedInstapay] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= 600 || subtotal === 0 ? 0 : 45;

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.isActive);

    if (!found) {
      setCouponError('كود الخصم غير صحيح أو منتهي الصلاحية');
      return;
    }

    if (subtotal < found.minOrderAmount) {
      setCouponError(`الحد الأدنى للطلب لتفعيل هذا الكوبون هو ${found.minOrderAmount} ج.م`);
      return;
    }

    setAppliedCoupon(found);
    setCouponInput('');
  };

  const handleCopyInstapay = () => {
    navigator.clipboard.writeText('2babyprint@instapay');
    setCopiedInstapay(true);
    setTimeout(() => setCopiedInstapay(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) return;

    setIsSubmitting(true);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderDetails = {
      orderNumber: `2BP-${randomNum}`,
      date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      customerName,
      phone,
      email: email || 'customer@example.com',
      city,
      address,
      paymentMethod,
      instapayReference: instapayRef,
      items: cartItems,
      subtotal,
      shipping,
      discount,
      couponCode: appliedCoupon?.code,
      total,
      status: 'pending_review',
      notes,
      updatedAt: 'الآن',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[94vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              إتمام الطلب وتأكيد التنفيذ (Checkout)
            </h3>
            <p className="text-xs text-stone-500">
              توصيل لباب بيتك في القاهرة والجيزة مع وسائل دفع إلكترونية مسبقة وآمنة 100%
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-stone-800">
          {/* Important Notice regarding Elimination of Cash on Delivery */}
          <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">تنبيه هام بشأن سياسة الدفع:</span>
              <span>
                نظراً لأن جميع القطع يتم تجهيزها وطباعتها خصيصاً باسم وتصميم طفلك ولا يمكن إعادة بيعها، فإن الدفع متاح حصرياً عبر وسائل الدفع الإلكترونية المسبقة (إنستاباي، المحافظ الإلكترونية، فوري، أو البطاقات البنكية) لبدء حجز خامات القطن والطباعة الفورية.
              </span>
            </div>
          </div>

          {/* Customer Info Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>معلومات المستلم وعنوان التوصيل في القاهرة</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  اسم المستلم (الأم أو الأب) *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: نورهان الشريف"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:bg-white text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  رقم الهاتف المحمول (واتساب للتوصيل) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:bg-white text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  المنطقة أو الحي في القاهرة والجيزة *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:bg-white text-stone-900"
                >
                  {CAIRO_DISTRICTS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  البريد الإلكتروني (لتأكيد الفاتورة)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                العنوان التفصيلي (الشارع، العمارة، رقم الشقة) *
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="مثال: التجمع الخامس، شارع التسعين الجنوبي، عمارة 14، الدور الثالث، شقة 6..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:bg-white text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                ملاحظات خاصة للمطبعة أو المندوب (اختياري)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: التوصيل بعد الساعة 4 عصراً، أو هدية سبوع مغلفة..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>لديك كود خصم أو كوبون ترويجي؟</span>
              </span>
              <span className="text-[11px] text-stone-400">جربي كود: WELCOME10</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="أدخلي كود الكوبون هنا..."
                className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold uppercase"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg text-xs transition-colors"
              >
                تطبيق
              </button>
            </div>

            {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}

            {appliedCoupon && (
              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded flex items-center justify-between">
                <span>
                  ✓ تم تفعيل كوبون ({appliedCoupon.code}) بنجاح! خصم:{' '}
                  {appliedCoupon.discountType === 'percentage'
                    ? `${appliedCoupon.discountValue}%`
                    : `${appliedCoupon.discountValue} ج.م`}
                </span>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
                  className="text-stone-400 hover:text-red-600 text-xs font-normal"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>

          {/* Prepayment Methods (NO COD) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>وسائل الدفع الإلكترونية المعتمدة في مصر</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* InstaPay */}
              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'instapay'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'instapay'}
                    onChange={() => setPaymentMethod('instapay')}
                    className="accent-amber-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">إنستاباي (InstaPay)</span>
                    <span className="text-[11px] text-stone-500">تحويل لحظي مباشر بدون رسوم</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded self-end mt-2">
                  الأسرع والأكثر طلباً
                </span>
              </label>

              {/* Mobile Wallets (Vodafone Cash, etc.) */}
              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'wallets'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'wallets'}
                    onChange={() => setPaymentMethod('wallets')}
                    className="accent-amber-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">المحافظ الإلكترونية</span>
                    <span className="text-[11px] text-stone-500">فودافون كاش، اتصالات، أورانج، وي</span>
                  </div>
                </div>
                <Smartphone className="w-4 h-4 text-stone-400 self-end mt-2" />
              </label>

              {/* Fawry */}
              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'fawry'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'fawry'}
                    onChange={() => setPaymentMethod('fawry')}
                    className="accent-amber-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">فوري (Fawry)</span>
                    <span className="text-[11px] text-stone-500">دفع بكود فوري في أي كشك</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded self-end mt-2">
                  FawryPay
                </span>
              </label>

              {/* Cards / valU */}
              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-amber-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">بطاقات ميزة والبنكية</span>
                    <span className="text-[11px] text-stone-500">ميزة، فيزا، ماستركارد</span>
                  </div>
                </div>
                <CreditCard className="w-4 h-4 text-stone-400 self-end mt-2" />
              </label>
            </div>

            {/* InstaPay Details & Reference Box */}
            {paymentMethod === 'instapay' && (
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <span className="font-bold text-stone-900 block">
                  بيانات التحويل عبر تطبيق إنستاباي (InstaPay):
                </span>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-stone-200 font-mono">
                  <span>عنوان الدفع (IPA): <strong>2babyprint@instapay</strong></span>
                  <button
                    type="button"
                    onClick={handleCopyInstapay}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-[11px] flex items-center gap-1 font-sans text-stone-700"
                  >
                    {copiedInstapay ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedInstapay ? 'تم النسخ' : 'نسخ العنوان'}</span>
                  </button>
                </div>

                <div>
                  <label className="text-[11px] text-stone-500 block mb-1">
                    الرقم المرجعي للتحويل (Reference / RRN من تطبيق إنستاباي):
                  </label>
                  <input
                    type="text"
                    value={instapayRef}
                    onChange={(e) => setInstapayRef(e.target.value)}
                    placeholder="مثال: IPN-98421035..."
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pricing Breakdown Summary */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>عدد قطع الملابس المخصصة:</span>
              <span className="font-mono font-bold text-stone-900">{cartItems.length} قطع</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>قيمة المنتجات:</span>
              <span className="font-mono tabular-nums">{subtotal} ج.م</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>خصم الكوبون ({appliedCoupon?.code}):</span>
                <span className="font-mono tabular-nums">-{discount} ج.م</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>الشحن والتوصيل (القاهرة والجيزة):</span>
              <span className="font-mono tabular-nums">
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-semibold">شحن مجاني (أكثر من 600 ج.م)</span>
                ) : (
                  `${shipping} ج.م`
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>المجموع الكلي المطلوب سداده:</span>
              <span className="font-mono tabular-nums text-amber-800 text-base">
                {total} ج.م
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-98 disabled:opacity-50 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'جارٍ تأكيد الطلب وإرساله لقسم الطباعة...'
                  : `تأكيد الطلب وبدء الطباعة (${total} ج.م)`}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>يتم تحويل الطلب فورياً إلى المطبعة للبدء في طباعة خامات القطن المصري</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
