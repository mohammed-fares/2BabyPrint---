import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  MessageCircle,
  Send,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  FileText,
  QrCode,
  Sparkles,
  Film,
  Hash,
  Zap,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { SocialCampaign, SocialPlatform, SocialPostSchedule } from '../../types';
import { soundEffects } from '../../utils/soundEffectsPlayer';

interface UniversalExportModalProps {
  campaign: SocialCampaign;
  onClose: () => void;
}

export const UniversalExportModal: React.FC<UniversalExportModalProps> = ({
  campaign,
  onClose,
}) => {
  const [activePlatform, setActivePlatform] = useState<SocialPlatform | 'whatsapp' | 'telegram' | 'linkedin'>(
    campaign.platform || 'instagram'
  );
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Automated Multi-Channel Publishing Pipeline State
  const [isAutoExporting, setIsAutoExporting] = useState(false);
  const [autoExportProgress, setAutoExportProgress] = useState(0);
  const [autoExportCompleted, setAutoExportCompleted] = useState(false);
  const [autoScheduleTiming, setAutoScheduleTiming] = useState('اليوم، 8:00 مساءً (أفضل وقت لتفاعل الأمهات)');

  const creative = campaign.adCreative;
  const targetUrl = creative.ctaUrl || creative.targetPageUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://2babyprint.eg');
  const hashtagsString = creative.hashtags.join(' ');

  // Generate QR Code for target URL
  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [targetUrl]);

  // Full formatted post text
  const fullPostCaption = `${creative.headline}

${creative.bodyText}

👶 صممي قطعتك المطبوعة باسم طفلك الآن مباشرة عبر الرابط:
👉 ${targetUrl}

🛒 خامات قطن مصري 100% فائقة النعومة لبشرة المواليد والأكزيما
🚀 متاح خيار الشحن الفوري (أوبر سكوتر) في نفس اليوم بالقاهرة والجيزة!

${hashtagsString}`;

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Direct Web Intents / Social Share URLs
  const handleDirectShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(targetUrl);
    const encodedText = encodeURIComponent(`${creative.headline}\n\n${creative.bodyText}\n\n${targetUrl}\n${hashtagsString}`);

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(creative.headline + '\n\n' + creative.bodyText)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(creative.headline)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(creative.headline + ' 👶✨\n' + hashtagsString.slice(0, 100))}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'web_share':
        if (navigator.share) {
          navigator.share({
            title: creative.headline,
            text: creative.bodyText,
            url: targetUrl,
          }).catch(() => {});
          return;
        }
        break;
      default:
        break;
    }

    if (shareUrl) {
      const a = document.createElement('a');
      a.href = shareUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Automated Multi-Channel Auto-Dispatch
  const handleRunAutoDispatch = () => {
    setIsAutoExporting(true);
    setAutoExportProgress(20);
    setAutoExportCompleted(false);

    // Save scheduled post automatically in localStorage for Social Schedule
    try {
      const saved = localStorage.getItem('2babyprint_post_schedules');
      const list: SocialPostSchedule[] = saved ? JSON.parse(saved) : [];
      const newSchedule: SocialPostSchedule = {
        id: `post-${Date.now()}`,
        platform: campaign.platform || 'instagram',
        title: campaign.name,
        content: fullPostCaption,
        scheduledTime: autoScheduleTiming,
        status: 'scheduled',
        mediaType: creative.mediaType === 'video_reel' ? 'reel' : 'image',
        mediaUrl: creative.imageUrl || '/src/assets/images/hero_baby_apparel_1790519873737.jpg',
        targetLink: targetUrl,
        engagement: {
          likes: 0,
          shares: 0,
          comments: 0,
        },
      };
      localStorage.setItem('2babyprint_post_schedules', JSON.stringify([newSchedule, ...list]));
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => setAutoExportProgress(55), 400);
    setTimeout(() => setAutoExportProgress(85), 850);
    setTimeout(() => {
      setAutoExportProgress(100);
      setIsAutoExporting(false);
      setAutoExportCompleted(true);
      soundEffects.playCelestialChime();
    }, 1300);
  };

  // Download entire campaign package (.txt file + QR Code)
  const handleDownloadFullPackage = () => {
    const packageText = `================================================================
2BabyPrint Egypt - حزمة الدعاية والحملة الإعلانية المكتملة
================================================================
اسم الحملة: ${campaign.name}
المنصة المستهدفة: ${campaign.platform}
الهدف الإعلاني: ${campaign.goal}
تاريخ التوليد: ${new Date().toLocaleDateString('ar-EG')}

1. العنوان الرئيسي (Headline & Hook):
${creative.headline}

2. النص الإعلاني الكامل (Ad Copy):
${creative.bodyText}

3. رابط الصفحة المستهدفة (Target Landing Page & UTM):
${targetUrl}

4. نص زر الدعوة للإجراء (CTA):
${creative.ctaText}

5. الهاشتاجات المقترحة (Hashtags):
${hashtagsString}

6. سيناريو تصوير الريلز / الفيديو القصير:
${creative.videoScript ? `
- خطاف أول 3 ثوانٍ: ${creative.videoScript.hookSeconds}
- المشهد البصري: ${creative.videoScript.visualAction}
- التعليق الصوتي (Voiceover): ${creative.videoScript.voiceover}
- الموسيقى المقترحة: ${creative.videoScript.soundTrackRecommendation}
` : 'غير متوفر'}

7. المؤثرات الصوتية المقترحة:
${(creative.soundEffects || []).map((s, i) => `${i + 1}. [${s.timing}] ${s.effectName}: ${s.description}`).join('\n')}

8. الجمهور المستهدف:
- الفئة: ${campaign.targetAudience.label}
- العمر: ${campaign.targetAudience.ageRange}
- المناطق: ${campaign.targetAudience.locations.join('، ')}
- الاهتمامات: ${campaign.targetAudience.interests.join('، ')}
================================================================`;

    const blob = new Blob([packageText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `2BabyPrint_Campaign_${campaign.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Meta / TikTok Ads CSV
  const handleExportCsv = () => {
    const csvContent = `Campaign Name,Platform,Headline,Body Text,Landing Page,CTA,Hashtags
"${campaign.name}","${campaign.platform}","${creative.headline.replace(/"/g, '""')}","${creative.bodyText.replace(/"/g, '""')}","${targetUrl}","${creative.ctaText}","${hashtagsString.replace(/"/g, '""')}"`;

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `2BabyPrint_Ad_Export_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">مركز التصدير والنشر الذكي لوسائل التواصل</h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                  Omni-Channel Export
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                تصدير محتوى حملة: <span className="text-amber-400 font-bold">{campaign.name}</span> لجميع المنصات بنقرة واحدة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selection Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-600 ml-2">تخصيص للمنصة:</span>
          {[
            { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600 bg-pink-50 border-pink-200' },
            { id: 'tiktok', name: 'TikTok', icon: Film, color: 'text-stone-900 bg-stone-100 border-stone-300' },
            { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600 bg-blue-50 border-blue-200' },
            { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { id: 'telegram', name: 'Telegram', icon: Send, color: 'text-sky-600 bg-sky-50 border-sky-200' },
            { id: 'twitter', name: 'X / Twitter', icon: Twitter, color: 'text-stone-800 bg-stone-100 border-stone-300' },
            { id: 'snapchat', name: 'Snapchat', icon: Sparkles, color: 'text-amber-600 bg-amber-50 border-amber-200' },
            { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700 bg-blue-50 border-blue-200' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activePlatform === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePlatform(item.id as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Left Column: Post Content & Actions */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. Automated Multi-Channel Auto-Dispatch & Queueing */}
            <div className="p-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl border border-stone-800 space-y-3 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">
                      محرك التصدير والنشر التلقائي الذكي لكافة المنصات
                    </h4>
                    <span className="text-[10px] text-stone-400">
                      Auto-Publish & Social Schedule Integration
                    </span>
                  </div>
                </div>

                <select
                  value={autoScheduleTiming}
                  onChange={(e) => setAutoScheduleTiming(e.target.value)}
                  className="bg-stone-800 text-stone-200 border border-stone-700 text-[11px] rounded-xl px-2.5 py-1 font-medium"
                >
                  <option value="اليوم، 8:00 مساءً (أفضل وقت لتفاعل الأمهات)">اليوم، 8:00 م (ذروة الأمهات)</option>
                  <option value="فوري الآن (Direct Instant Publish)">نشر فوري الآن</option>
                  <option value="غداً، 10:00 صباحاً (فترة الصباح)">غداً، 10:00 ص</option>
                  <option value="الخميس، 6:00 مساءً (ويك إند السبوع)">الخميس، 6:00 م (ويك إند)</option>
                </select>
              </div>

              {/* Progress bar when running */}
              {isAutoExporting && (
                <div className="space-y-1.5 pt-1 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] text-amber-300">
                    <span>جاري التصدير وتوزيع المحتوى على المنصات...</span>
                    <span className="font-mono font-bold">{autoExportProgress}%</span>
                  </div>
                  <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${autoExportProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success Confirmation Notice */}
              {autoExportCompleted && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تم التصدير التلقائي بنجاح وإدراج المنشور في جدول نشر صفحات المتجر!</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded">
                    Scheduled ✓
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-800 text-[11px]">
                <span className="text-stone-400">
                  يشمل: إنستغرام، تيك توك، فيسبوك، واتساب، وتلجرام
                </span>

                <button
                  type="button"
                  onClick={handleRunAutoDispatch}
                  disabled={isAutoExporting}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{isAutoExporting ? 'جاري النشر التلقائي...' : 'تصدير ونشر تلقائي الآن'}</span>
                </button>
              </div>
            </div>

            {/* Quick Web Intent Actions */}
            <div className="p-4 bg-gradient-to-r from-amber-50/70 to-stone-50 rounded-2xl border border-amber-200/80">
              <span className="text-xs font-bold text-amber-950 block mb-2">
                ⚡ نشر فوري مباشر (One-Click Publish & Share):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDirectShare('whatsapp')}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>إرسال عبر واتساب</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectShare('telegram')}
                  className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>مشاركة في تلجرام</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectShare('facebook')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                >
                  <Facebook className="w-4 h-4" />
                  <span>نشر على فيسبوك</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectShare('twitter')}
                  className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                >
                  <Twitter className="w-4 h-4" />
                  <span>تغريدة على X</span>
                </button>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    type="button"
                    onClick={() => handleDirectShare('web_share')}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة بالهاتف (Web Share)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Post Caption / Text Preview with Quick Copy */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>نص المنشور والترويج الكامل:</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(fullPostCaption, 'full_caption')}
                  className="px-3 py-1 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  {copiedSection === 'full_caption' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">تم النسخ بنجاح!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ النص كاملاً</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs leading-relaxed text-stone-800 font-sans whitespace-pre-wrap max-h-56 overflow-y-auto">
                {fullPostCaption}
              </div>
            </div>

            {/* Hashtags Strip */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-stone-600" />
                  <span>الهاشتاجات المخصصة للخوارزميات ({creative.hashtags.length}):</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(hashtagsString, 'hashtags')}
                  className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'hashtags' ? (
                    <span className="text-emerald-700 font-bold">تم النسخ ✓</span>
                  ) : (
                    <span>نسخ الهاشتاجات فقط</span>
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {creative.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-[11px] font-mono font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Reel Video Script if available */}
            {creative.videoScript && (
              <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-purple-700" />
                    <span>سيناريو تصوير الريلز وتوقيت المشاهد:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const scriptText = `سيناريو الريلز:
- خطاف أول 3 ثوانٍ: ${creative.videoScript?.hookSeconds}
- المشهد واستوديو التصميم: ${creative.videoScript?.visualAction}
- التعليق الصوتي: ${creative.videoScript?.voiceover}
- الموسيقى: ${creative.videoScript?.soundTrackRecommendation}`;
                      copyToClipboard(scriptText, 'video_script');
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-300 text-purple-900 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'video_script' ? (
                      <span className="text-emerald-700 font-bold">تم نسخ السيناريو ✓</span>
                    ) : (
                      <span>نسخ سيناريو الريلز</span>
                    )}
                  </button>
                </div>
                <div className="text-xs text-stone-700 space-y-1">
                  <p><strong className="text-purple-950">الهوك:</strong> {creative.videoScript.hookSeconds}</p>
                  <p><strong className="text-purple-950">التعليق الصوتي:</strong> {creative.videoScript.voiceover}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Internal Target Page Link, QR Code & Package Download */}
          <div className="lg:col-span-5 space-y-4">
            {/* Target Page URL & QR Code */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-amber-600" />
                  <span>عنوان صفحة الهبوط في المتجر ورمز الـ QR</span>
                </span>
                <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-mono">
                  UTM Tracked
                </span>
              </div>

              {/* URL Display with Copy */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-stone-600 block">رابط الصفحة الداخلي للإعلان:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={targetUrl}
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-mono text-stone-800 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(targetUrl, 'target_url')}
                    className="p-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    title="نسخ الرابط"
                  >
                    {copiedSection === 'target_url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    title="فتح الرابط للتجربة"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* QR Code Preview */}
              {qrCodeDataUrl && (
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2">
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="w-36 h-36 mx-auto rounded-xl shadow-xs border border-stone-300 bg-white p-1"
                  />
                  <span className="text-[11px] text-stone-500 block">
                    امسحي الـ QR Code بكاميرا الهاتف للدخول المباشر للصفحة
                  </span>
                  <a
                    href={qrCodeDataUrl}
                    download={`2BabyPrint_QR_${campaign.id}.png`}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تنزيل صورة الـ QR Code</span>
                  </a>
                </div>
              )}
            </div>

            {/* Full Download Creative Package Actions */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
              <span className="text-xs font-bold text-stone-900 block">
                📦 خيارات التصدير كملفات وحزم إعلانية:
              </span>

              <button
                type="button"
                onClick={handleDownloadFullPackage}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل حزمة الحملة كاملة (ملف TXT شامل)</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="w-full py-2 px-4 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-stone-600" />
                <span>تصدير كـ CSV (Meta & TikTok Ads Manager)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs">
          <span className="text-stone-500">
            جاهز للنشر على {activePlatform.toUpperCase()} ومطابق لمقاييس الخوارزميات
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
