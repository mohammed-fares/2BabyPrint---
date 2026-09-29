import React, { useState } from 'react';
import {
  SocialCampaign,
  SocialPlatform,
  CampaignGoal,
  CampaignStatus,
  Product,
} from '../../types';
import {
  Megaphone,
  Sparkles,
  TrendingUp,
  Play,
  Pause,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  DollarSign,
  Eye,
  MousePointer,
  ShoppingBag,
  Film,
  Camera,
  Layers,
  Smartphone,
  Sliders,
  Filter,
  RefreshCw,
  Award,
  AlertCircle,
  Hash,
  ChevronDown,
  Info,
} from 'lucide-react';
import {
  generateAiCampaign,
  analyzeAdCreativeQuality,
  CampaignGenerationRequest,
} from '../../utils/aiCampaignService';

interface SocialAdsHubProps {
  campaigns: SocialCampaign[];
  onSaveCampaigns: (campaigns: SocialCampaign[]) => void;
  products: Product[];
}

type HubTab = 'monitor' | 'create_ai' | 'simulator';

export const SocialAdsHub: React.FC<SocialAdsHubProps> = ({
  campaigns,
  onSaveCampaigns,
  products,
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('monitor');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Campaign Form / AI Generator State
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [selectedGoal, setSelectedGoal] = useState<CampaignGoal>('baby_shower');
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0]?.name || 'سالوبيت قطني ناعم للأطفال');
  const [targetLocation, setTargetLocation] = useState('القاهرة الكبرى والجيزة');
  const [adTone, setAdTone] = useState<'warm_maternal' | 'trendy_viral' | 'prestigious_gift' | 'practical_urgency'>('warm_maternal');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [campaignSuccessNotice, setCampaignSuccessNotice] = useState(false);

  // Active Draft Creative in Generator
  const [draftCampaignName, setDraftCampaignName] = useState('حملة ريلز السبوع الملكي بالقطن المصري');
  const [draftHeadline, setDraftHeadline] = useState('قطعة السبوع الأولى.. مكتوبة باسمه ومصنوعة من أنقى قطن مصري 👶✨');
  const [draftBodyText, setDraftBodyText] = useState('استقبلي طفلك بأجمل سالوبيت قطن مصري 100% طبيعي، مطبوع باسمه أو عبارات التهنئة في استوديو التصميم الحي خلال ثوانٍ. خامات فائقة النعومة معتمدة للأكزيما وبشرة المواليد، مع توصيل سريع لباب بيتك في القاهرة والجيزة.');
  const [draftCta, setDraftCta] = useState('صممي سالوبيت السبوع الآن 🎨');
  const [draftHashtags, setDraftHashtags] = useState<string[]>([
    '#سبوع_البيبي',
    '#هدايا_مواليد',
    '#قطن_مصري',
    '#2BabyPrint',
    '#استوديو_تصميم',
    '#القاهرة',
  ]);
  const [draftHashtagInput, setDraftHashtagInput] = useState('');
  const [draftDailyBudget, setDraftDailyBudget] = useState(450);
  const [draftImageUrl, setDraftImageUrl] = useState('/src/assets/images/hero_baby_apparel_1790519873737.jpg');
  const [draftMediaType, setDraftMediaType] = useState<'image' | 'carousel' | 'video_reel'>('video_reel');
  const [draftVideoScript, setDraftVideoScript] = useState({
    hookSeconds: '0-3 ثوانٍ: لقطة مقربة لأصابع طفل رضيع نائم يرتدي سالوبيت قطني ناصع البياض مطبوع عليه اسمه بفيونكة رقيقة.',
    visualAction: 'انتقال شاشة الهاتف الذكي توضح استخدام استوديو التصميم الحي: الأم تكتب الاسم وتختار رسمة التاج، ثم لقطة حقيقية للمنتج أثناء طباعته بالـ DTF الرقمي الناعم وتغليفه الفاخر.',
    voiceover: 'أول لبسة لطفلك في الدنيا لازم تكون بقطن مصري أصيل واسم غالي عليك.. جربي استوديو 2BabyPrint وصممي قطعتك المخصصة في ثوانٍ.',
    soundTrackRecommendation: 'موسيقى هادئة دافئة مبهجة (Lofi Baby Melodies / Acoustic Joy)',
  });
  const [draftAudience, setDraftAudience] = useState({
    label: 'أمهات جدد وحوامل يجهزن للسبوع',
    ageRange: '22 - 38 سنة',
    locations: ['القاهرة الجديدة', 'المعادي', 'الشيخ زايد', '6 أكتوبر', 'مصر الجديدة', 'مدينة نصر'],
    interests: ['مستلزمات رضع ومواليد', 'هدايا سبوع راقية', 'ملابس قطن مصري للأطفال', 'حفلات سبوع'],
    demographics: 'سيدات متزوجات، أمهات لأول مرة، خالات وعمات يبحثن عن هدايا مميزة',
  });

  // Calculate Metrics from Campaigns
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const totalAdSpend = campaigns.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.metrics.conversions, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.metrics.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.metrics.clicks, 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';
  const avgRoas = campaigns.length > 0 ? (campaigns.reduce((acc, c) => acc + c.metrics.roas, 0) / campaigns.length).toFixed(2) : '0';

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    if (platformFilter === 'all') return true;
    return c.platform === platformFilter;
  });

  // AI Generation Trigger
  const handleGenerateAiCreative = async () => {
    setIsGeneratingAi(true);
    try {
      const req: CampaignGenerationRequest = {
        platform: selectedPlatform,
        goal: selectedGoal,
        productName: selectedProduct,
        targetLocation,
        tone: adTone,
        language: 'ar',
      };
      const result = await generateAiCampaign(req);
      setDraftCampaignName(result.campaignName);
      setDraftHeadline(result.headline);
      setDraftBodyText(result.bodyText);
      setDraftCta(result.ctaText);
      setDraftHashtags(result.hashtags);
      setDraftDailyBudget(result.recommendedDailyBudget);
      setDraftAudience(result.targetAudience);
      if (result.videoScript) {
        setDraftVideoScript(result.videoScript);
      }
    } catch (err) {
      console.error('Error generating AI campaign:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Launch and Save New Campaign
  const handleLaunchCampaign = (status: CampaignStatus = 'active') => {
    const newCamp: SocialCampaign = {
      id: `camp-${Date.now()}`,
      name: draftCampaignName || 'حملة ترويجية جديدة',
      platform: selectedPlatform,
      goal: selectedGoal,
      status,
      startDate: new Date().toISOString().split('T')[0],
      budgetPerDay: draftDailyBudget,
      totalSpent: 0,
      targetAudience: draftAudience,
      adCreative: {
        headline: draftHeadline,
        bodyText: draftBodyText,
        ctaText: draftCta,
        ctaUrl: '#catalog',
        hashtags: draftHashtags,
        mediaType: draftMediaType,
        imageUrl: draftImageUrl,
        videoScript: draftMediaType === 'video_reel' ? draftVideoScript : undefined,
      },
      metrics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
        cpa: 0,
        roas: 0,
      },
      aiNotes: 'حملة تم إنشاؤها بالذكاء الاصطناعي وجاهزة للمراقبة وتحقيق العائد الإعلاني.',
      createdAt: new Date().toISOString(),
    };

    onSaveCampaigns([newCamp, ...campaigns]);
    setCampaignSuccessNotice(true);
    setTimeout(() => {
      setCampaignSuccessNotice(false);
      setActiveTab('monitor');
    }, 1500);
  };

  // Toggle Campaign Status
  const handleToggleStatus = (id: string) => {
    const updated = campaigns.map((c) => {
      if (c.id === id) {
        const nextStatus: CampaignStatus = c.status === 'active' ? 'paused' : 'active';
        return { ...c, status: nextStatus };
      }
      return c;
    });
    onSaveCampaigns(updated);
  };

  // Delete Campaign
  const handleDeleteCampaign = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الحملة الإعلانية من السجل؟')) {
      onSaveCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  // Copy Full Campaign Package for Ads Manager
  const handleCopyPackage = (campaign: SocialCampaign) => {
    const text = `=== حزمة إعلان 2BabyPrint لمنصة ${campaign.platform.toUpperCase()} ===
اسم الحملة: ${campaign.name}
الهدف الإعلاني: ${campaign.goal}
الميزانية اليومية: ${campaign.budgetPerDay} ج.م

[العنوان Headline]
${campaign.adCreative.headline}

[النص الإعلاني Ad Copy]
${campaign.adCreative.bodyText}

[زر الإجراء CTA]
${campaign.adCreative.ctaText} (${campaign.adCreative.ctaUrl})

[الهاشتاجات]
${campaign.adCreative.hashtags.join(' ')}

[الجمهور المستهدف]
الفئة: ${campaign.targetAudience.label} (${campaign.targetAudience.ageRange})
المناطق: ${campaign.targetAudience.locations.join(', ')}
الاهتمامات: ${campaign.targetAudience.interests.join(', ')}
${campaign.adCreative.videoScript ? `\n[سيناريو ريلز/فيديو]:\n- البداية (Hook): ${campaign.adCreative.videoScript.hookSeconds}\n- المشهد البصري: ${campaign.adCreative.videoScript.visualAction}\n- التعليق الصوتي: ${campaign.adCreative.videoScript.voiceover}\n- الموسيقى: ${campaign.adCreative.videoScript.soundTrackRecommendation}` : ''}
`;
    navigator.clipboard.writeText(text);
    setCopiedId(campaign.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Quality check for current draft
  const draftQuality = analyzeAdCreativeQuality(draftHeadline, draftBodyText, draftCta);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 rounded-2xl shadow-sm border border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>نظام التسويق والإعلانات الممولة بالذكاء الاصطناعي (Meta, TikTok, Google)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-400" />
            <span>مركز الدعاية والحملات والمراقبة الذكية</span>
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
            أنشئي حملاتك الترويجية لمنصات إنستغرام، فيسبوك، تيك توك، وسناب شات مع سيناريوهات ريلز واستهداف دقيق لأمهات القاهرة ومحافظات مصر ومراقبة فورية للعائد على الإنفاق (ROAS).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('create_ai')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>إنشاء إعلان جديد بالذكاء الاصطناعي</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('monitor')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'monitor'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>مراقبة الحملات الحية ({campaigns.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create_ai')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'create_ai'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>منشئ الحملات وسيناريوهات الريلز (AI Studio)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span>محاكي الجودة وتوقعات العائد (ROAS Predictor)</span>
          </button>
        </div>

        {activeTab === 'monitor' && (
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-medium"
            >
              <option value="all">كافة المنصات ({campaigns.length})</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
              <option value="snapchat">Snapchat</option>
              <option value="google">Google Ads</option>
            </select>
          </div>
        )}
      </div>

      {/* SUCCESS NOTICE */}
      {campaignSuccessNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>تم إطلاق وتثبيت الحملة الإعلانية بنجاح وتفعيل المراقبة الحية!</span>
        </div>
      )}

      {/* 3. TAB 1: CAMPAIGNS MONITORING & ANALYTICS */}
      {activeTab === 'monitor' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 text-xs mb-1.5">
                <span>إجمالي الإنفاق الإعلاني</span>
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-stone-900 font-mono">
                {totalAdSpend.toLocaleString()} ج.م
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                عبر {activeCampaigns} حملات نشطة حالياً
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 text-xs mb-1.5">
                <span>الطلبات والمبيعات الناتجة</span>
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-800 font-mono">
                {totalConversions} طلب
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                متوسط تكلفة الاكتساب: {(totalConversions > 0 ? (totalAdSpend / totalConversions).toFixed(1) : 0)} ج.م / طلب
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 text-xs mb-1.5">
                <span>مرات الظهور والنقرات</span>
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-stone-900 font-mono">
                {totalImpressions.toLocaleString()}
              </div>
              <div className="text-[11px] text-blue-700 font-semibold mt-1">
                {totalClicks.toLocaleString()} نقرة مباشرة (CTR: {avgCtr}%)
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 text-xs mb-1.5">
                <span>متوسط العائد الإعلاني (ROAS)</span>
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-purple-900 font-mono">
                {avgRoas}x
              </div>
              <div className="text-[11px] text-purple-700 font-semibold mt-1">
                كل 1 ج.م إعلانات يولد {avgRoas} ج.م مبيعات
              </div>
            </div>
          </div>

          {/* Campaigns Table & Cards */}
          <div className="space-y-4">
            {filteredCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:border-amber-300 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Platform Badge */}
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg ${
                        camp.platform === 'instagram'
                          ? 'bg-pink-100 text-pink-700'
                          : camp.platform === 'tiktok'
                          ? 'bg-stone-900 text-white'
                          : camp.platform === 'facebook'
                          ? 'bg-blue-100 text-blue-700'
                          : camp.platform === 'snapchat'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {camp.platform}
                    </span>

                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{camp.name}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        الهدف:{' '}
                        <span className="font-semibold text-stone-700">
                          {camp.goal === 'baby_shower'
                            ? 'هدايا السبوع والمواليد'
                            : camp.goal === 'custom_studio'
                            ? 'تجربة استوديو التصميم الحي'
                            : camp.goal === 'pure_cotton'
                            ? 'خامات القطن المصري 100%'
                            : camp.goal === 'birthdays'
                            ? 'ملابس أعياد الميلاد'
                            : camp.goal === 'fast_delivery'
                            ? 'الشحن السريع 48 ساعة'
                            : 'عروض وتخفيضات'}
                        </span>{' '}
                        • الميزانية اليومية: {camp.budgetPerDay} ج.م • بدأت في: {camp.startDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end lg:self-center">
                    {/* Status Pill */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(camp.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        camp.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {camp.status === 'active' ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>نشطة (Active)</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>متوقفة (Paused)</span>
                        </>
                      )}
                    </button>

                    {/* Copy Full Package Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyPackage(camp)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="نسخ حزمة الإعلان بالكامل لمدير إعلانات فيسبوك أو تيك توك"
                    >
                      {copiedId === camp.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-500" />
                          <span>نسخ الحزمة الإعلانية</span>
                        </>
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCampaign(camp.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="حذف الحملة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-stone-50/70 p-3 rounded-xl border border-stone-100 text-center">
                  <div>
                    <span className="text-[11px] text-stone-500 block">الظهور (Impressions)</span>
                    <span className="font-bold text-stone-900 text-xs font-mono">{camp.metrics.impressions.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">النقرات (Clicks)</span>
                    <span className="font-bold text-stone-900 text-xs font-mono">{camp.metrics.clicks.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">معدل النقر (CTR)</span>
                    <span className="font-bold text-emerald-700 text-xs font-mono">{camp.metrics.ctr}%</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">الطلبات (Orders)</span>
                    <span className="font-bold text-stone-900 text-xs font-mono">{camp.metrics.conversions} طلب</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">تكلفة الطلب (CPA)</span>
                    <span className="font-bold text-stone-900 text-xs font-mono">{camp.metrics.cpa} ج.م</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">عائد الإنفاق (ROAS)</span>
                    <span className="font-black text-purple-700 text-xs font-mono">{camp.metrics.roas}x</span>
                  </div>
                </div>

                {/* Creative Preview Snippet & Audience */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  <div className="md:col-span-8 space-y-1.5">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{camp.adCreative.headline}</span>
                    </div>
                    <p className="text-stone-600 text-xs leading-relaxed line-clamp-2">
                      {camp.adCreative.bodyText}
                    </p>
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {camp.adCreative.hashtags.map((h, i) => (
                        <span key={i} className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-mono">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 bg-stone-100/60 p-3 rounded-xl border border-stone-200/60 space-y-1 text-[11px]">
                    <span className="font-bold text-stone-800 block">🎯 الجمهور المستهدف:</span>
                    <p className="text-stone-600">{camp.targetAudience.label} ({camp.targetAudience.ageRange})</p>
                    <p className="text-stone-500 line-clamp-1">📍 {camp.targetAudience.locations.join('، ')}</p>
                    {camp.aiNotes && (
                      <p className="text-amber-800 font-medium pt-1 text-[10px] flex items-center gap-1 border-t border-stone-200/80 mt-1">
                        <Info className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>{camp.aiNotes}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                <Megaphone className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h4 className="font-bold text-stone-700 text-sm">لا توجد حملات مسجلة بهذه المنصة</h4>
                <p className="text-xs text-stone-500 mt-1">يمكنك إنشاء أول حملة إعلانية بالذكاء الاصطناعي الآن بنقرة واحدة</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('create_ai')}
                  className="mt-4 px-4 py-2 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>بدء إنشاء حملة جديدة</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB 2: AI CAMPAIGN GENERATOR & CREATIVE STUDIO */}
      {activeTab === 'create_ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Prompt Options (Left/Start) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>إعدادات الحملة والذكاء الاصطناعي</span>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAiCreative}
                  disabled={isGeneratingAi}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAi ? 'جاري التوليد بالذكاء الاصطناعي...' : 'توليد أفكار الإعلان الآن ✨'}</span>
                </button>
              </div>

              {/* Platform Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">
                  1. منصة السوشيال ميديا المستهدفة:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(['instagram', 'tiktok', 'facebook', 'snapchat', 'google', 'pinterest'] as SocialPlatform[]).map((plt) => (
                    <button
                      key={plt}
                      type="button"
                      onClick={() => setSelectedPlatform(plt)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center capitalize transition-all cursor-pointer ${
                        selectedPlatform === plt
                          ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-400/40'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {plt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">
                  2. الهدف الترويجي الأساسي:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'baby_shower', title: 'هدايا السبوع والمواليد الجدد', desc: 'استهداف الأمهات الحوامل والأقارب' },
                    { id: 'custom_studio', title: 'تجربة استوديو التصميم الحي', desc: 'الترويج لأداة كتابة الاسم والتخصيص' },
                    { id: 'pure_cotton', title: 'خامات القطن المصري 100% والأكزيما', desc: 'بناء الثقة الطبية والراحة' },
                    { id: 'birthdays', title: 'تيشرتات وهوديز أعياد الميلاد', desc: 'احتفالات وتصوير وسن 1-10 سنوات' },
                    { id: 'fast_delivery', title: 'الشحن السريع 48 ساعة للقاهرة والجيزة', desc: 'هدايا عاجلة وحالات طارئة' },
                    { id: 'promo_discount', title: 'عروض تخفيض وكوبونات شحن مجاني', desc: 'زيادة المبيعات المباشرة' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGoal(g.id as CampaignGoal)}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        selectedGoal === g.id
                          ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold ring-1 ring-amber-400'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="block font-bold text-xs">{g.title}</span>
                      <span className="block text-[11px] text-stone-500 mt-0.5">{g.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product & Tone Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    المنتج أو الخدمة المراد إبرازها:
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 font-medium"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.price} ج.م)
                      </option>
                    ))}
                    <option value="استوديو التصميم التفاعلي الحي">استوديو التصميم التفاعلي الحي</option>
                    <option value="بوكس هدايا السبوع المتكامل">بوكس هدايا السبوع المتكامل</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    نبرة وصوت الإعلان (Tone of Voice):
                  </label>
                  <select
                    value={adTone}
                    onChange={(e) => setAdTone(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 font-medium"
                  >
                    <option value="warm_maternal">عاطفية دافئة محبوبة للأمهات</option>
                    <option value="trendy_viral">تريند شبابي سريع ومرح (TikTok Style)</option>
                    <option value="prestigious_gift">فاخرة وراقية كهدية ملكية</option>
                    <option value="practical_urgency">عملية ومقنعة (شحن فوري وعروض)</option>
                  </select>
                </div>
              </div>

              {/* Location & Daily Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    النطاق الجغرافي المستهدف:
                  </label>
                  <input
                    type="text"
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    placeholder="مثال: القاهرة الجديدة، الشيخ زايد، المعادي"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    الميزانية اليومية المقترحة (ج.م):
                  </label>
                  <input
                    type="number"
                    value={draftDailyBudget}
                    onChange={(e) => setDraftDailyBudget(Number(e.target.value))}
                    min={100}
                    step={50}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Generated / Editable Copywriting Box */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-600" />
                  <span>المحتوى الإعلاني والنص التسويقي (Ad Creative)</span>
                </span>
                <span className="text-[11px] font-semibold text-stone-500">قابلة للتحرير المباشر</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">اسم الحملة الإداري:</label>
                <input
                  type="text"
                  value={draftCampaignName}
                  onChange={(e) => setDraftCampaignName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">العنوان الرئيسي الجذاب (Hook & Headline):</label>
                <input
                  type="text"
                  value={draftHeadline}
                  onChange={(e) => setDraftHeadline(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">النص التسويقي المقنع (Ad Body Copy):</label>
                <textarea
                  rows={4}
                  value={draftBodyText}
                  onChange={(e) => setDraftBodyText(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs leading-relaxed text-stone-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">نص زر الإجراء (CTA):</label>
                  <input
                    type="text"
                    value={draftCta}
                    onChange={(e) => setDraftCta(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">صيغة المحتوى:</label>
                  <select
                    value={draftMediaType}
                    onChange={(e) => setDraftMediaType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900"
                  >
                    <option value="video_reel">فيديو ريلز / تيك توك (Video Reel)</option>
                    <option value="carousel">كاروسيل صور متعددة (Carousel)</option>
                    <option value="image">صورة إعلانية مفردة (Single Image)</option>
                  </select>
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">الهاشتاجات المقترحة بالذكاء الاصطناعي:</label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-stone-50 rounded-xl border border-stone-200">
                  {draftHashtags.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs bg-white text-stone-800 border border-stone-200 px-2 py-1 rounded-lg font-mono"
                    >
                      <span>{h}</span>
                      <button
                        type="button"
                        onClick={() => setDraftHashtags(draftHashtags.filter((_, idx) => idx !== i))}
                        className="text-stone-400 hover:text-rose-500 cursor-pointer text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="text"
                      value={draftHashtagInput}
                      onChange={(e) => setDraftHashtagInput(e.target.value)}
                      placeholder="#إضافة_هاشتاج"
                      className="text-xs bg-white border border-stone-300 rounded px-2 py-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (draftHashtagInput.trim()) {
                          const tag = draftHashtagInput.startsWith('#') ? draftHashtagInput.trim() : `#${draftHashtagInput.trim()}`;
                          setDraftHashtags([...draftHashtags, tag]);
                          setDraftHashtagInput('');
                        }
                      }}
                      className="px-2 py-0.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Reel Script Details */}
              {draftMediaType === 'video_reel' && (
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 space-y-3">
                  <h4 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-amber-700" />
                    <span>سيناريو تصوير الريلز / الفيديو القصير (Reel Script):</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-amber-900 block">⚡ خطاف أول 3 ثوانٍ (Hook):</span>
                      <p className="text-stone-700 mt-0.5">{draftVideoScript.hookSeconds}</p>
                    </div>
                    <div>
                      <span className="font-bold text-amber-900 block">🎬 المشهد البصري واستوديو التصميم:</span>
                      <p className="text-stone-700 mt-0.5">{draftVideoScript.visualAction}</p>
                    </div>
                    <div>
                      <span className="font-bold text-amber-900 block">🎙️ التعليق الصوتي (Voiceover):</span>
                      <p className="text-stone-700 mt-0.5">{draftVideoScript.voiceover}</p>
                    </div>
                    <div>
                      <span className="font-bold text-amber-900 block">🎵 الموسيقى المقترحة:</span>
                      <p className="text-stone-700 mt-0.5">{draftVideoScript.soundTrackRecommendation}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Launch Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleLaunchCampaign('active')}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>تثبيت وإطلاق الحملة في لوحة المراقبة</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchCampaign('draft')}
                  className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>حفظ كمسودة (Draft)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right/Side: Live Mockup Social Preview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Post Mockup */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-stone-700" />
                  <span>معاينة حية للإعلان على شاشة الموبايل ({selectedPlatform.toUpperCase()})</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Live Preview
                </span>
              </div>

              {/* Realistic Mockup Card */}
              <div className="max-w-xs mx-auto bg-stone-900 text-white rounded-3xl p-3 shadow-xl border-4 border-stone-800 overflow-hidden font-sans">
                {/* Simulated App Header */}
                <div className="flex items-center justify-between px-2 py-1 text-[11px] border-b border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">
                      2B
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1">
                        <span>2BabyPrint Egypt</span>
                        <span className="text-amber-400 text-[10px]">✓</span>
                      </div>
                      <span className="text-[9px] text-stone-400 block">Sponsored • إعلان ممول</span>
                    </div>
                  </div>
                  <span className="text-stone-400 font-mono text-xs">•••</span>
                </div>

                {/* Media Image / Video Area */}
                <div className="relative aspect-square my-2 rounded-2xl overflow-hidden bg-stone-950 group">
                  <img
                    src={draftImageUrl}
                    alt="Creative Ad"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                    <span className="text-[10px] bg-amber-500 text-stone-950 font-extrabold px-2 py-0.5 rounded-md inline-block self-start mb-1">
                      100% قطن مصري فاخر
                    </span>
                    <h5 className="font-black text-xs text-white leading-snug drop-shadow-md">
                      {draftHeadline}
                    </h5>
                  </div>
                  {draftMediaType === 'video_reel' && (
                    <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white p-1 rounded-full">
                      <Film className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* CTA Bar */}
                <div className="bg-amber-500 text-stone-950 font-black text-xs py-2 px-3 rounded-xl flex items-center justify-between mb-2 shadow-xs cursor-pointer hover:bg-amber-400 transition-colors">
                  <span>{draftCta}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>

                {/* Post Caption */}
                <div className="px-1 text-[11px] text-stone-300 space-y-1">
                  <p className="line-clamp-3 leading-relaxed">
                    <span className="font-bold text-white mr-1">2BabyPrint:</span>
                    {draftBodyText}
                  </p>
                  <p className="text-amber-400 text-[10px] font-mono leading-tight">
                    {draftHashtags.slice(0, 4).join(' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Ad Quality Score Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>مؤشر تقييم جودة الإعلان (AI Score)</span>
                </span>
                <span className="text-sm font-black font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {draftQuality.score} / 100
                </span>
              </div>

              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${draftQuality.score}%` }}
                />
              </div>

              <div className="space-y-1.5 text-[11px] pt-1">
                {draftQuality.strengths.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-emerald-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
                {draftQuality.improvements.map((imp, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-amber-800">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: SIMULATOR & ROAS PREDICTOR */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
            <div>
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>محاكي الذكاء الاصطناعي لتوقعات الأداء والعائد على الإنفاق (ROAS Predictor)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                توقعات دقيقة مبنية على خوارزميات منصات ميتا وتيك توك ومتوسط أسعار النقرات لملابس الأطفال في مصر
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-700 block">منصة Instagram Reels:</span>
                <div className="text-xl font-black text-stone-900 font-mono">4.85x ROAS</div>
                <p className="text-[11px] text-stone-500">
                  أعلى معدل شراء لهدايا السبوع وأطقم المواليد الجدد في مناطق القاهرة الجديدة والشيخ زايد والمعادي.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-700 block">منصة TikTok Spark Ads:</span>
                <div className="text-xl font-black text-emerald-700 font-mono">5.34x ROAS</div>
                <p className="text-[11px] text-stone-500">
                  أعلى تفاعل وسرعة انتشار لفيديوهات استوديو التصميم الحي "صممي قطعة طفلك بنفسك".
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-700 block">إعلانات Google Search:</span>
                <div className="text-xl font-black text-blue-700 font-mono">4.65x ROAS</div>
                <p className="text-[11px] text-stone-500">
                  استهداف مباشر للباحثين عن "طباعة سالوبيت سبوع" و"تيشرتات أعياد ميلاد أطفال بالاسم".
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 via-stone-50 to-amber-50 p-5 rounded-2xl border border-purple-200/60 space-y-3">
              <h4 className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>أهم نصائح وتوجيهات الذكاء الاصطناعي لتعظيم مبيعات 2BabyPrint:</span>
              </h4>
              <ul className="space-y-2 text-xs text-stone-700 list-disc list-inside">
                <li>
                  <strong className="text-stone-900">إبراز اسم الطفل في أول ثانيتين:</strong> الإعلانات التي تعرض اسم طفل حقيقي مطبوع على السالوبيت تحقق نقرات أعلى بنسبة 48%.
                </li>
                <li>
                  <strong className="text-stone-900">الثقة بالقطن المصري:</strong> التأكيد على خلو القماش من البوليستر تماماً يبدد مخاوف الحساسية عند 85% من الأمهات الجدد.
                </li>
                <li>
                  <strong className="text-stone-900">الدفع الإلكتروني المسبق:</strong> الإشارة الواضحة لسهولة التحويل عبر إنستاباي والمحافظ الإلكترونية تُسرع تأكيد الطلبات فوراً.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
