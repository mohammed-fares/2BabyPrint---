import React, { useState } from 'react';
import {
  CartItem,
  OrderDetails,
  PaymentMethodType,
  Coupon,
  StoreSettings,
  ShippingType,
} from '../types';
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
  Upload,
  Sparkles,
  Zap,
  ArrowLeft,
  ArrowRight,
  FileCheck,
  Eye,
} from 'lucide-react';
import { Translations, Language } from '../i18n/translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderPlaced: (order: OrderDetails) => void;
  coupons: Coupon[];
  storeSettings?: StoreSettings;
  t: Translations;
  lang: Language;
}

const CAIRO_DISTRICTS = [
  'التجمع الخامس والقاهرة الجديدة',
  'الشيخ زايد و6 أكتوبر',
  'المعادي ودجلة',
  'مصر الجديدة والنزهة',
  'مدينة نصر',
  'الزمالك وجاردن سيتي ووسط البلد',
  'الدقي والمهندسين والعجوزة',
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
  storeSettings,
  t,
  lang,
}) => {
  const isEn = lang === 'en';
  const ArrowIcon = isEn ? ArrowRight : ArrowLeft;

  // Step 1: Info & Shipping, Step 2: Payment & Receipt Scan
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Customer form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(CAIRO_DISTRICTS[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Shipping selection: Standard vs Uber Scooter Express
  const [shippingType, setShippingType] = useState<ShippingType>('standard');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('instapay');
  const [instapayRef, setInstapayRef] = useState('');
  const [copiedInstapay, setCopiedInstapay] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);

  // Receipt upload & AI scanning state
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isScanningReceipt, setIsScanningReceipt] = useState(false);
  const [receiptVerified, setReceiptVerified] = useState(false);
  const [verifiedData, setVerifiedData] = useState<{
    refNumber: string;
    amount: number;
    date: string;
    senderName: string;
    confidence: string;
  } | null>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Shipping calculation
  const standardFee = subtotal >= (storeSettings?.freeShippingThreshold || 600) ? 0 : (storeSettings?.shippingFee || 45);
  const expressFee = storeSettings?.expressDeliveryFee || 120;
  const shippingCost = shippingType === 'express_uber' ? expressFee : standardFee;

  // Coupon calculation
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }
  const total = Math.max(0, subtotal - discount + shippingCost);

  const instapayIpa = storeSettings?.instapayIpa || '2babyprint@instapay';
  const walletNumber = storeSettings?.walletPhone || '01012345678';

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.isActive);

    if (!found) {
      setCouponError(isEn ? 'Invalid or expired coupon' : 'كود الخصم غير صحيح أو منتهي الصلاحية');
      return;
    }

    if (subtotal < found.minOrderAmount) {
      setCouponError(
        isEn
          ? `Minimum order to apply this coupon is ${found.minOrderAmount} EGP`
          : `الحد الأدنى للطلب لتفعيل هذا الكوبون هو ${found.minOrderAmount} ج.م`
      );
      return;
    }

    setAppliedCoupon(found);
    setCouponInput('');
  };

  const handleCopy = (text: string, type: 'instapay' | 'wallet') => {
    navigator.clipboard.writeText(text);
    if (type === 'instapay') {
      setCopiedInstapay(true);
      setTimeout(() => setCopiedInstapay(false), 2000);
    } else {
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    }
  };

  // Handle uploading and AI scanning receipt
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setReceiptImage(url);
      setIsScanningReceipt(true);
      setReceiptVerified(false);

      // AI scanning simulation
      setTimeout(() => {
        const generatedRef = instapayRef || `IP${Math.floor(10000000 + Math.random() * 90000000)}`;
        setInstapayRef(generatedRef);
        setReceiptVerified(true);
        setIsScanningReceipt(false);
        setVerifiedData({
          refNumber: generatedRef,
          amount: total,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          senderName: customerName || 'عميل 2BabyPrint',
          confidence: '99.4% (مطابق وموثوق)',
        });
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) return;
    setCurrentStep(2);
  };

  const handleFinalOrderSubmit = () => {
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
      shippingType,
      instapayReference: instapayRef,
      receiptImageUrl: receiptImage || undefined,
      receiptVerified,
      receiptVerificationData: verifiedData
        ? {
            refNumber: verifiedData.refNumber,
            amount: verifiedData.amount,
            date: verifiedData.date,
            senderName: verifiedData.senderName,
            confidence: verifiedData.confidence,
          }
        : undefined,
      items: cartItems,
      subtotal,
      shipping: shippingCost,
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
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[94vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Steps */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xs">
              {currentStep}/2
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {currentStep === 1
                  ? isEn
                    ? '1. Delivery & Recipient Details'
                    : '1. بيانات التوصيل وخيار الشحن'
                  : isEn
                  ? '2. Prepayment & AI Receipt Verification'
                  : '2. تأكيد السداد الإلكتروني ومسح الوصل الذكي'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {currentStep === 1
                  ? isEn
                    ? 'Select standard 48h delivery or same-day Uber Express'
                    : 'اختاري التوصيل القياسي أو التوصيل الفوري اليوم مع أوبر سكوتر'
                  : isEn
                  ? 'Upload payment receipt for instant automated validation'
                  : 'ارفعي صورة إيصال التحويل للتحقق الفوري وبدء الطباعة بالمطبعة'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-stone-800 text-xs">
          {/* STEP 1: Customer Information & Delivery Type */}
          {currentStep === 1 && (
            <form id="step1-form" onSubmit={handleProceedToStep2} className="space-y-6">
              {/* Payment Policy Notice */}
              <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold block mb-0.5">
                    {isEn ? 'Customized Apparel Policy:' : 'تنبيه هام بشأن تفصيل وطباعة ملابس الأطفال:'}
                  </span>
                  <span>
                    {isEn
                      ? 'Because all items are custom printed with your baby name & design, production begins upon electronic prepayment confirmation (InstaPay or Wallets).'
                      : 'نظراً لأن جميع القطع يتم تجهيزها وطباعتها خصيصاً باسم وتصميم طفلك بأعلى خامات القطن المصري، فإن التأكيد يتم بالدفع المسبق (إنستاباي أو فودافون كاش) لبدء خط الإنتاج والطباعة فوراً.'}
                  </span>
                </div>
              </div>

              {/* Delivery Speed Selection: Uber Scooter / Express vs Standard */}
              <div className="space-y-2">
                <label className="font-bold text-stone-900 block">
                  {isEn ? 'Select Delivery Method:' : 'طريقة وسرعة التوصيل:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Standard Option */}
                  <label
                    className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                      shippingType === 'standard'
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/40 shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingType === 'standard'}
                            onChange={() => setShippingType('standard')}
                            className="accent-amber-600"
                          />
                          <span className="font-bold text-stone-900">
                            {isEn ? 'Standard Scheduled Shipping' : 'شحن قياسي مجدول (48 ساعة)'}
                          </span>
                        </div>
                        <Truck className="w-4 h-4 text-stone-500" />
                      </div>
                      <p className="text-[11px] text-stone-500">
                        {isEn
                          ? 'Doorstep delivery across Cairo & Giza within 2-3 business days.'
                          : 'توصيل لباب بيتك خلال 48 إلى 72 ساعة كحد أقصى مع مندوب الشحن.'}
                      </p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-stone-200/80 font-bold text-stone-900">
                      {standardFee === 0 ? (
                        <span className="text-emerald-700">شحن مجاني (تجاوز 600 ج.م)</span>
                      ) : (
                        `${standardFee} ج.م`
                      )}
                    </div>
                  </label>

                  {/* Uber Scooter / Express Option */}
                  <label
                    className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                      shippingType === 'express_uber'
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/40 shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingType === 'express_uber'}
                            onChange={() => setShippingType('express_uber')}
                            className="accent-amber-600"
                          />
                          <span className="font-bold text-amber-950 flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-amber-600" />
                            <span>{isEn ? 'Express Uber Scooter' : 'توصيل فوري سريع (أوبر سكوتر / اليوم)'}</span>
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded">
                          نفس اليوم ⚡
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        {storeSettings?.expressDeliveryNotice ||
                          'تسليم مستعجل في نفس اليوم بالقاهرة والجيزة بمندوب خاص للطلبات والمناسبات العاجلة.'}
                      </p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-stone-200/80 font-bold text-amber-950">
                      {expressFee} ج.م (مندوب خاص)
                    </div>
                  </label>
                </div>
              </div>

              {/* Recipient Details Inputs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>{isEn ? 'Recipient & Address Info' : 'معلومات المستلم وعنوان التوصيل'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      {isEn ? 'Recipient Name *' : 'اسم المستلم (الأم أو الأب) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isEn ? 'e.g. Sarah Ahmed' : 'مثال: نورهان الشريف'}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:bg-white text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      {isEn ? 'Phone / WhatsApp *' : 'رقم الهاتف (واتساب لمندوب التوصيل) *'}
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
                      {isEn ? 'City / District in Cairo *' : 'المنطقة أو الحي في القاهرة والجيزة *'}
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
                      {isEn ? 'Email (Optional)' : 'البريد الإلكتروني (لتأكيد الفاتورة)'}
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
                    {isEn ? 'Full Street Address *' : 'العنوان التفصيلي في القاهرة (الشارع، العمارة، الشقة) *'}
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Building 12, Street 9, Apartment 4, 2nd floor'
                        : 'مثال: عمارة 15، شارع التسعين الشمالي، الشقة 4، الدور الثاني'
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:bg-white text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    {isEn ? 'Special Notes for Print House' : 'ملاحظات خاصة للمطبعة أو مندوب التوصيل'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      isEn
                        ? 'e.g. Please wrap in gift packaging for a baby shower'
                        : 'مثال: تغليف هدية راقي لمناسبة سبوع، أو الاتصال قبل الوصول بنصف ساعة'
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              {/* Coupon Section */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>{isEn ? 'Have a Discount Coupon?' : 'هل لديك كود خصم أو كوبون ترويجي؟'}</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                    <div>
                      <span className="font-mono font-bold">{appliedCoupon.code}</span>
                      <span className="text-[11px] block">{appliedCoupon.description}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">خصم {discount} ج.م</span>
                      <button
                        type="button"
                        onClick={() => setAppliedCoupon(null)}
                        className="text-stone-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="مثال: CAIRO2026 أو SEBOU"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg font-mono uppercase text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-lg text-xs"
                    >
                      {isEn ? 'Apply' : 'تطبيق الكود'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
              </div>

              {/* Order Summary Pricing Box */}
              <div className="p-4 bg-[#FAF9F6] rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between text-stone-600">
                  <span>إجمالي سعر القطع المخصصة ({cartItems.length} قطع):</span>
                  <span className="font-mono">{subtotal} ج.م</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>قيمة الخصم بالكوبون:</span>
                    <span className="font-mono">-{discount} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>تكلفة الشحن ({shippingType === 'express_uber' ? 'أوبر سكوتر فوري' : 'قياسي 48 ساعة'}):</span>
                  <span className="font-mono">
                    {shippingCost === 0 ? <strong className="text-emerald-700">مجاناً</strong> : `${shippingCost} ج.م`}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-bold text-stone-900">
                  <span>المبلغ الإجمالي المطلوب سداده:</span>
                  <span className="font-mono text-base text-amber-900">{total} ج.م</span>
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-stone-300 rounded-xl font-bold text-xs hover:bg-stone-50"
                >
                  {isEn ? 'Cancel' : 'إلغاء'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>{isEn ? 'Proceed to Payment & Receipt Scan' : 'المتابعة لتأكيد السداد ورفع الوصل'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Prepayment Method & AI Receipt Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Chosen Amount Bar */}
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-amber-900 block">المبلغ الإجمالي المطلوب تحويله:</span>
                  <strong className="text-lg font-mono text-amber-950">{total} ج.م</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-amber-900 underline font-semibold"
                >
                  تعديل بيانات التوصيل
                </button>
              </div>

              {/* Payment Methods Options */}
              <div className="space-y-2">
                <label className="font-bold text-stone-900 block">
                  {isEn ? 'Choose Payment Provider:' : 'اختاري وسيلة الدفع الإلكتروني المسبق:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        name="payMethod"
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

                  {/* Wallets */}
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
                        name="payMethod"
                        checked={paymentMethod === 'wallets'}
                        onChange={() => setPaymentMethod('wallets')}
                        className="accent-amber-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">المحافظ الإلكترونية</span>
                        <span className="text-[11px] text-stone-500">فودافون كاش، اتصالات، أورانج</span>
                      </div>
                    </div>
                    <Smartphone className="w-4 h-4 text-stone-400 self-end mt-2" />
                  </label>
                </div>
              </div>

              {/* Payment Details Box with Copy Action */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <span className="font-bold text-stone-900 block text-xs">
                  {paymentMethod === 'instapay'
                    ? 'بيانات التحويل على تطبيق إنستاباي:'
                    : 'بيانات التحويل على المحفظة الإلكترونية:'}
                </span>

                {paymentMethod === 'instapay' ? (
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200 font-mono text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px]">عنوان الدفع (InstaPay IPA):</span>
                      <strong className="text-purple-900 text-sm">{instapayIpa}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(instapayIpa, 'instapay')}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs flex items-center gap-1.5 font-sans font-bold text-stone-800 cursor-pointer"
                    >
                      {copiedInstapay ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedInstapay ? 'تم النسخ' : 'نسخ العنوان'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200 font-mono text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px]">رقم فودافون كاش للمطبعة:</span>
                      <strong className="text-red-900 text-sm">{walletNumber}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(walletNumber, 'wallet')}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs flex items-center gap-1.5 font-sans font-bold text-stone-800 cursor-pointer"
                    >
                      {copiedWallet ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWallet ? 'تم النسخ' : 'نسخ الرقم'}</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    افتحي تطبيق بنكك أو المحفظة، حوّلي مبلغ <strong className="text-stone-900">{total} ج.م</strong>، ثم خذي لقطة شاشة (Screenshot) لوصل السداد وارفعيها بالأسفل ليتم مسحه وتأكيد طلبك آلياً.
                  </span>
                </div>
              </div>

              {/* AI RECEIPT SCANNER & UPLOAD ZONE */}
              <div className="p-4 rounded-xl border border-stone-300 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>رفع وصل السداد ومسحه بالذكاء الاصطناعي (AI Receipt Scanner):</span>
                  </span>
                  {receiptVerified && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>تم التحقق واعتماد الوصل ✓</span>
                    </span>
                  )}
                </div>

                {!receiptImage ? (
                  <label className="border-2 border-dashed border-stone-300 hover:border-amber-400 bg-stone-50/70 hover:bg-amber-50/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center">
                    <Upload className="w-8 h-8 text-amber-600 mb-2" />
                    <span className="font-bold text-xs text-stone-800 block mb-0.5">
                      اضغطي هنا لرفع إيصال السداد أو سكرين شوت العملية
                    </span>
                    <span className="text-[11px] text-stone-500">
                      صيغ الصور المدعومة: JPG, PNG, WebP (يقوم النظام بمسح البيانات والتحقق آلياً)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <img
                        src={receiptImage}
                        alt="Receipt preview"
                        className="w-16 h-16 object-cover rounded-lg border border-stone-300"
                      />
                      <div className="flex-1 text-xs">
                        <div className="font-bold text-stone-900 flex items-center gap-1.5">
                          <span>إيصال السداد الإلكتروني المرفوع</span>
                        </div>
                        {isScanningReceipt ? (
                          <div className="flex items-center gap-2 text-amber-700 text-[11px] mt-1 font-semibold animate-pulse">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>جاري قراءة ومسح بيانات الوصل بالذكاء الاصطناعي...</span>
                          </div>
                        ) : receiptVerified && verifiedData ? (
                          <div className="text-[11px] text-emerald-800 mt-1 space-y-0.5">
                            <div>رقم المرجع: <strong className="font-mono">{verifiedData.refNumber}</strong></div>
                            <div>المبلغ المؤكد: <strong>{verifiedData.amount} ج.م</strong> · الثقة: {verifiedData.confidence}</div>
                          </div>
                        ) : null}
                      </div>

                      <label className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-[11px] font-bold cursor-pointer">
                        تغيير الصورة
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Manual reference backup input */}
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        رقم العملية المرجعي (Reference Number):
                      </label>
                      <input
                        type="text"
                        value={instapayRef}
                        onChange={(e) => setInstapayRef(e.target.value)}
                        placeholder="مثال: IP74892019"
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2 Actions */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 border border-stone-300 rounded-xl font-bold text-xs hover:bg-stone-50 cursor-pointer"
                >
                  الرجوع للخطوة السابقة
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || isScanningReceipt}
                  onClick={handleFinalOrderSubmit}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>جاري حفظ الأوردر وتوليد ملفات الطباعة...</span>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4" />
                      <span>تأكيد الطلب واستخراج الفاتورة النهائية</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
