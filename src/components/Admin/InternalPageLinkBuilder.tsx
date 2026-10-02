import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Link,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Download,
  Sparkles,
  Layers,
  Palette,
  Truck,
  ShoppingBag,
  Home,
  Tag,
} from 'lucide-react';
import { Product, SocialPlatform } from '../../types';

interface InternalPageLinkBuilderProps {
  products: Product[];
  currentPlatform?: SocialPlatform;
  initialBabyName?: string;
  onUrlGenerated?: (url: string, pageKey: string) => void;
}

export const InternalPageLinkBuilder: React.FC<InternalPageLinkBuilderProps> = ({
  products,
  currentPlatform = 'instagram',
  initialBabyName = 'نوح 👑',
  onUrlGenerated,
}) => {
  const [targetPage, setTargetPage] = useState<'studio' | 'templates' | 'catalog' | 'express_checkout' | 'hero' | 'product'>('studio');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [prefilledBabyName, setPrefilledBabyName] = useState(initialBabyName);
  const [utmSource, setUtmSource] = useState<string>(currentPlatform);
  const [utmMedium, setUtmMedium] = useState('reel');
  const [utmCampaign, setUtmCampaign] = useState('sebou_royal_2026');
  const [utmContent, setUtmContent] = useState('baby_name_customization');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Page definitions
  const storePages = [
    {
      id: 'studio',
      title: 'استوديو التصميم الحي المباشر',
      desc: 'الأم تفتح الاستوديو فوراً مع إمكانية تمرير اسم الطفل محدد مسبقاً',
      icon: Palette,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'الأعلى تحويلاً للشراء',
    },
    {
      id: 'templates',
      title: 'معرض تصاميم وقوالب السبوع',
      desc: 'عرض كافة تيماء السبوع الملكي والمواليد وتيجان الأمير والأميرة',
      icon: Layers,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      badge: 'هدايا ومواليد',
    },
    {
      id: 'catalog',
      title: 'كتالوج كافة المنتجات والموديلات',
      desc: 'استعراض كل السالوبيتات والتيشرتات والهوديز ومقاسات 0-10 سنوات',
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      badge: 'الكتالوج الكامل',
    },
    {
      id: 'express_checkout',
      title: 'صفحة الشحن السريع وإنستاباي (أوبر سكوتر)',
      desc: 'شاشة الطلب المباشر الفوري مع التحويل السريع لحالات الطوارئ',
      icon: Truck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badge: 'شحن اليوم الفوري',
    },
    {
      id: 'product',
      title: 'صفحة منتج محدد بالاسم',
      desc: 'ربط مباشر بمنتج معين بجميع ألوانه ومقاساته وتفاصيله',
      icon: Tag,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      badge: 'منتج مخصص',
    },
    {
      id: 'hero',
      title: 'الصفحة الرئيسية للمتجر',
      desc: 'واجهة المتجر الرئيسية والسلايدر والعروض الترويجية الحالية',
      icon: Home,
      color: 'text-stone-700 bg-stone-100 border-stone-200',
      badge: 'الرئيسية',
    },
  ];

  // Build target landing URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://2babyprint.eg';
  let basePath = `${origin}/`;
  const params = new URLSearchParams();

  if (targetPage === 'studio') {
    basePath = `${origin}/#studio`;
    if (prefilledBabyName.trim()) {
      params.set('babyName', prefilledBabyName.trim());
    }
  } else if (targetPage === 'templates') {
    basePath = `${origin}/#templates`;
  } else if (targetPage === 'catalog') {
    basePath = `${origin}/#catalog`;
  } else if (targetPage === 'express_checkout') {
    basePath = `${origin}/#checkout`;
  } else if (targetPage === 'product') {
    basePath = `${origin}/#catalog`;
    if (selectedProductId) params.set('product', selectedProductId);
  } else if (targetPage === 'hero') {
    basePath = `${origin}/#hero`;
  }

  // Add UTM tags
  params.set('utm_source', utmSource);
  params.set('utm_medium', utmMedium);
  params.set('utm_campaign', utmCampaign.trim() || 'promo_2026');
  if (utmContent.trim()) params.set('utm_content', utmContent.trim());

  const fullGeneratedUrl = `${basePath}?${params.toString()}`;

  // Notify parent on change
  useEffect(() => {
    if (onUrlGenerated) {
      onUrlGenerated(fullGeneratedUrl, targetPage);
    }
  }, [fullGeneratedUrl, targetPage, onUrlGenerated]);

  // Generate QR Code
  useEffect(() => {
    QRCode.toDataURL(fullGeneratedUrl, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    })
      .then((dataUrl) => setQrCodeDataUrl(dataUrl))
      .catch((err) => console.error(err));
  }, [fullGeneratedUrl]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullGeneratedUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md">
          <Link className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-stone-900">
              أداة الربط بعناوين صفحات المتجر وروابط الـ UTM الذكية
            </h3>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
              Deep Linking & QR
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            توجيه العملاء مباشرة من الإعلان إلى استوديو التصميم بالاسم أو الكتالوج أو صفحة الشحن السريع
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Page Selector & UTM Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Target Page Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              1. اختاري صفحة الهبوط في المتجر:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {storePages.map((pg) => {
                const Icon = pg.icon;
                const isSelected = targetPage === pg.id;
                return (
                  <button
                    key={pg.id}
                    type="button"
                    onClick={() => setTargetPage(pg.id as any)}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold ring-1 ring-sky-400'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="font-bold text-xs">{pg.title}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 bg-white border border-stone-200 rounded font-semibold text-stone-600">
                        {pg.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{pg.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional: Studio Pre-filled Name */}
          {targetPage === 'studio' && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5">
              <label className="block text-xs font-bold text-amber-950">
                اسم الطفل المعبأ مسبقاً في الاستوديو عند نقر العميل:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={prefilledBabyName}
                  onChange={(e) => setPrefilledBabyName(e.target.value)}
                  placeholder="مثال: زين 👑، ليلى، نوح"
                  className="bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 w-full"
                />
              </div>
              <span className="text-[10px] text-amber-800 block">
                ميزة رائعة: العميل يفتح الاستوديو ويجد الاسم مكتوباً بالفعل على الموك آب!
              </span>
            </div>
          )}

          {/* Conditional: Product Selector */}
          {targetPage === 'product' && (
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 space-y-1.5">
              <label className="block text-xs font-bold text-rose-950">
                اختاري المنتج المراد ربطه بالإعلان:
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.price} ج.م)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* UTM Parameters Grid */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <span className="text-xs font-bold text-stone-900 block">
              2. وسوم تتبع الحملة (UTM Parameters):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">utm_source (المنصة):</label>
                <select
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-800"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="snapchat">Snapchat</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="google">Google Ads</option>
                  <option value="influencer">Influencer PR Gift</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">utm_medium (نوع المحتوى):</label>
                <select
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-800"
                >
                  <option value="reel">Reel / Video</option>
                  <option value="story">Story</option>
                  <option value="feed_post">Feed Post</option>
                  <option value="cpc">Sponsored Ad (CPC)</option>
                  <option value="bio_link">Bio Link</option>
                  <option value="chat_broadcast">Chat Broadcast</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">utm_campaign (اسم الحملة):</label>
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">utm_content (الزاوية):</label>
                <input
                  type="text"
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-mono text-stone-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Generated URL Card & QR Code */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
            <span className="text-xs font-bold text-stone-900 block">
              3. الرابط المولد ورمز الـ QR الخاص بالحملة:
            </span>

            {/* Generated URL Box */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-stone-500 block">الرابط الكامل المتتبع:</span>
              <div className="p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-800 break-all select-all">
                {fullGeneratedUrl}
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUrl ? 'تم نسخ الرابط ✓' : 'نسخ الرابط'}</span>
                </button>

                <a
                  href={fullGeneratedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                  title="فتح الرابط في نافذة جديدة"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.hash =
                    targetPage === 'studio'
                      ? `#studio?babyName=${encodeURIComponent(prefilledBabyName)}`
                      : targetPage === 'express_checkout'
                      ? '#checkout'
                      : `#${targetPage}`;
                }}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title="تجربة انتقال العميل المباشر داخل المتجر"
              >
                <Sparkles className="w-4 h-4" />
                <span>تجربة تجربة العميل الحية في المتجر الآن</span>
              </button>
            </div>

            {/* Live Landing Simulator Card */}
            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-xs space-y-1">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>تجربة العميل عند نقر الإعلان:</span>
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {targetPage === 'studio'
                  ? `يفتح استوديو التصميم الحي مع إدراج اسم "${prefilledBabyName}" تلقائياً على السالوبيت الملكي!`
                  : targetPage === 'express_checkout'
                  ? 'يفتح شاشة الدفع السريع المباشرة مع خيار الشحن الفوري (أوبر سكوتر) ورقم إنستاباي!'
                  : targetPage === 'templates'
                  ? 'توجيه العميل مباشرة لمعرض قوالب السبوع والمواليد لاختيار التيجان الملكية.'
                  : targetPage === 'product'
                  ? 'فتح صفحة المنتج المختار مباشرة مع تفاصيل المقاس واللون والسعر.'
                  : 'توجيه العميل إلى الواجهة الرئيسية للمتجر.'}
              </p>
            </div>

            {/* QR Code Container */}
            {qrCodeDataUrl && (
              <div className="p-4 bg-white rounded-2xl border border-stone-200 text-center space-y-2">
                <img
                  src={qrCodeDataUrl}
                  alt="Campaign QR Code"
                  className="w-36 h-36 mx-auto rounded-xl shadow-xs border border-stone-200 p-1"
                />
                <span className="text-[11px] text-stone-500 block">
                  رمز استجابة سريعة QR مباشر لربط التصاميم المطبوعة بالسوشيال
                </span>
                <a
                  href={qrCodeDataUrl}
                  download={`2BabyPrint_QR_${targetPage}_${Date.now()}.png`}
                  className="inline-flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-800 font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل رمز QR Code</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
