import React, { useState } from 'react';
import {
  SocialCampaign,
  SocialPlatform,
  CampaignGoal,
  CampaignStatus,
  Product,
  InfluencerPartner,
  InfluencerStage,
  SocialPostSchedule,
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
  Gift,
  Users,
  Share2,
  Calendar,
  Send,
  MessageCircle,
  CheckCircle2,
  Clock,
  Heart,
  Zap,
  BarChart3,
  Truck,
  Volume2,
  Music,
  Download,
  QrCode,
  Link as LinkIcon,
  Headphones,
  FileDown,
  Wand2,
  Facebook,
  Twitter,
} from 'lucide-react';
import {
  generateAiCampaign,
  analyzeAdCreativeQuality,
  CampaignGenerationRequest,
} from '../../utils/aiCampaignService';
import { INITIAL_INFLUENCERS, INITIAL_POST_SCHEDULES } from '../../data/initialInfluencers';
import { soundEffects } from '../../utils/soundEffectsPlayer';
import { UniversalExportModal } from './UniversalExportModal';
import { ShortVideoReelStudio } from './ShortVideoReelStudio';
import { AudioEffectsStudio } from './AudioEffectsStudio';
import { InternalPageLinkBuilder } from './InternalPageLinkBuilder';

export interface ConnectedSocialChannel {
  id: string;
  platform: 'instagram' | 'tiktok' | 'facebook' | 'whatsapp' | 'telegram' | 'twitter' | 'pinterest';
  name: string;
  handle: string;
  url: string;
  followers: string;
  status: 'connected' | 'active';
  notes: string;
}

export const DEFAULT_CONNECTED_CHANNELS: ConnectedSocialChannel[] = [
  {
    id: 'ch-ig',
    platform: 'instagram',
    name: 'Instagram Business',
    handle: '@2babyprint_eg',
    url: 'https://instagram.com/2babyprint_eg',
    followers: '42.5K متابع',
    status: 'connected',
    notes: 'تفاعل 6.2% • توجيه مباشر لرسائل الدايركت',
  },
  {
    id: 'ch-tt',
    platform: 'tiktok',
    name: 'TikTok Creator',
    handle: '@2babyprint_cairo',
    url: 'https://tiktok.com/@2babyprint_cairo',
    followers: '88.4K متابع',
    status: 'connected',
    notes: '1.2M مشاهدة شهرية • ريلز تصوير السبوع ومكبس DTF',
  },
  {
    id: 'ch-fb',
    platform: 'facebook',
    name: 'Facebook Page',
    handle: '2BabyPrint Egypt',
    url: 'https://facebook.com/2BabyPrintEgypt',
    followers: '65K معجب',
    status: 'connected',
    notes: 'رد فوري على رسائل ماسنجر وتأكيدات إنستاباي',
  },
  {
    id: 'ch-wa',
    platform: 'whatsapp',
    name: 'واتساب الأعمال والمطبعة',
    handle: '01019998877',
    url: 'https://wa.me/201019998877',
    followers: 'كتالوج معتمد',
    status: 'active',
    notes: 'أوامر الطباعة الفورية وإشعارات شحن أوبر سكوتر',
  },
  {
    id: 'ch-tg',
    platform: 'telegram',
    name: 'قناة تلجرام التشغيل',
    handle: '@BabyPrintProduction',
    url: 'https://t.me/BabyPrintProduction',
    followers: 'فريق العمل والمطبعة',
    status: 'active',
    notes: 'تلقي ملفات الطباعة 300 DPI عالية الدقة',
  },
  {
    id: 'ch-tw',
    platform: 'twitter',
    name: 'حساب X (تويتر)',
    handle: '@2BabyPrint',
    url: 'https://x.com/2BabyPrint',
    followers: '12K متابع',
    status: 'connected',
    notes: 'تغريدات العروض وتجارب العملاء',
  },
];

interface SocialAdsHubProps {
  campaigns: SocialCampaign[];
  onSaveCampaigns: (campaigns: SocialCampaign[]) => void;
  products: Product[];
  displayMode?: 'standard' | 'projector';
}

type HubTab =
  | 'monitor'
  | 'create_ai'
  | 'short_video'
  | 'audio_effects'
  | 'page_links'
  | 'influencers'
  | 'social_pages'
  | 'learning_engine'
  | 'simulator';

export const SocialAdsHub: React.FC<SocialAdsHubProps> = ({
  campaigns,
  onSaveCampaigns,
  products,
  displayMode = 'standard',
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('monitor');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Influencers & PR Gifting State
  const [influencers, setInfluencers] = useState<InfluencerPartner[]>(() => {
    try {
      const saved = localStorage.getItem('2babyprint_influencers');
      return saved ? JSON.parse(saved) : INITIAL_INFLUENCERS;
    } catch {
      return INITIAL_INFLUENCERS;
    }
  });

  const [isAddInfluencerModalOpen, setIsAddInfluencerModalOpen] = useState(false);
  const [newInfName, setNewInfName] = useState('');
  const [newInfHandle, setNewInfHandle] = useState('');
  const [newInfPlatform, setNewInfPlatform] = useState<'instagram' | 'tiktok' | 'facebook'>('instagram');
  const [newInfFollowers, setNewInfFollowers] = useState('');
  const [newInfLocation, setNewInfLocation] = useState('القاهرة الجديدة');
  const [newInfMomName, setNewInfMomName] = useState('');
  const [newInfChildName, setNewInfChildName] = useState('');
  const [newInfChildAge, setNewInfChildAge] = useState('');
  const [newInfCustomNotes, setNewInfCustomNotes] = useState('');
  const [newInfPromoCode, setNewInfPromoCode] = useState('');

  // Social Post Scheduling State
  const [postSchedules, setPostSchedules] = useState<SocialPostSchedule[]>(() => {
    try {
      const saved = localStorage.getItem('2babyprint_post_schedules');
      return saved ? JSON.parse(saved) : INITIAL_POST_SCHEDULES;
    } catch {
      return INITIAL_POST_SCHEDULES;
    }
  });

  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [newPostPlatform, setNewPostPlatform] = useState<SocialPlatform>('instagram');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTime, setNewPostTime] = useState('اليوم، 8:00 مساءً');
  const [newPostMediaType, setNewPostMediaType] = useState<'reel' | 'image' | 'story' | 'carousel'>('reel');

  const handleUpdateInfluencers = (updated: InfluencerPartner[]) => {
    setInfluencers(updated);
    try {
      localStorage.setItem('2babyprint_influencers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePosts = (updated: SocialPostSchedule[]) => {
    setPostSchedules(updated);
    try {
      localStorage.setItem('2babyprint_post_schedules', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Connected Real Social Channels State (Persisted in browser)
  const [connectedChannels, setConnectedChannels] = useState<ConnectedSocialChannel[]>(() => {
    try {
      const saved = localStorage.getItem('2babyprint_connected_channels');
      return saved ? JSON.parse(saved) : DEFAULT_CONNECTED_CHANNELS;
    } catch {
      return DEFAULT_CONNECTED_CHANNELS;
    }
  });
  const [isEditChannelsModalOpen, setIsEditChannelsModalOpen] = useState(false);
  const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ConnectedSocialChannel | null>(null);

  // New Custom Channel State
  const [newChannelPlatform, setNewChannelPlatform] = useState<ConnectedSocialChannel['platform']>('facebook');
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelHandle, setNewChannelHandle] = useState('');
  const [newChannelUrl, setNewChannelUrl] = useState('');
  const [newChannelFollowers, setNewChannelFollowers] = useState('');
  const [newChannelNotes, setNewChannelNotes] = useState('');

  const handleUpdateChannels = (updated: ConnectedSocialChannel[]) => {
    setConnectedChannels(updated);
    try {
      localStorage.setItem('2babyprint_connected_channels', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveChannelEdit = (channel: ConnectedSocialChannel) => {
    const updated = connectedChannels.map((c) => (c.id === channel.id ? channel : c));
    handleUpdateChannels(updated);
    setEditingChannel(null);
    soundEffects.playCelestialChime();
  };

  const handleAddNewChannel = () => {
    if (!newChannelName.trim() || !newChannelUrl.trim()) return;
    const newChan: ConnectedSocialChannel = {
      id: `ch-${Date.now()}`,
      platform: newChannelPlatform,
      name: newChannelName.trim(),
      handle: newChannelHandle.trim() || `@${newChannelName.toLowerCase().replace(/\s+/g, '_')}`,
      url: newChannelUrl.trim(),
      followers: newChannelFollowers.trim() || 'حساب رسمي نشط',
      status: 'active',
      notes: newChannelNotes.trim() || 'نشر فوري وتوجيه لمتجر 2BabyPrint',
    };
    handleUpdateChannels([newChan, ...connectedChannels]);
    setIsAddChannelModalOpen(false);
    setNewChannelName('');
    setNewChannelHandle('');
    setNewChannelUrl('');
    setNewChannelFollowers('');
    setNewChannelNotes('');
    soundEffects.playCelestialChime();
  };

  const handleDeleteChannel = (id: string) => {
    if (confirm('هل أنت متأكد من إزالة ربط هذه القناة من لوحة التحكم؟')) {
      handleUpdateChannels(connectedChannels.filter((c) => c.id !== id));
    }
  };

  // Direct Live Publish of a scheduled post (فوري وحقيقي)
  const handlePublishPostLive = (post: SocialPostSchedule) => {
    const updated = postSchedules.map((p) =>
      p.id === post.id ? { ...p, status: 'published' as const } : p
    );
    handleUpdatePosts(updated);
    soundEffects.playCelestialChime();

    const targetUrl = post.targetLink || (typeof window !== 'undefined' ? window.location.origin : 'https://2babyprint.eg');
    const fullMessage = `${post.title}\n\n${post.content}\n\n🛒 رابط المتجر وتصميم قطعتك:\n${targetUrl}`;
    const textEncoded = encodeURIComponent(fullMessage);
    const linkEncoded = encodeURIComponent(targetUrl);

    let shareUrl = '';
    if (post.platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${linkEncoded}&quote=${encodeURIComponent(post.content)}`;
    } else if (post.platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content)}&url=${linkEncoded}`;
    } else if (post.platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${textEncoded}`;
    } else if (post.platform === 'telegram') {
      shareUrl = `https://t.me/share/url?url=${linkEncoded}&text=${encodeURIComponent(post.content)}`;
    } else {
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: fullMessage,
          url: targetUrl,
        }).catch(() => {});
        return;
      } else {
        navigator.clipboard.writeText(fullMessage);
        const channel = connectedChannels.find((c) => c.platform === post.platform);
        if (channel?.url) {
          window.open(channel.url, '_blank');
        } else {
          window.open(`https://${post.platform}.com/`, '_blank');
        }
        return;
      }
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleDeletePostSchedule = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنشور من جدول النشر؟')) {
      handleUpdatePosts(postSchedules.filter((p) => p.id !== id));
    }
  };

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

  // Marketing Angles & Strategies
  const [marketingAngle, setMarketingAngle] = useState<'sebou' | 'eczema_cotton' | 'mom_designer' | 'gift_prestige' | 'express_uber'>('sebou');

  // Website Target Page & UTM Link Builder
  const [targetPageKey, setTargetPageKey] = useState<'studio' | 'templates' | 'catalog' | 'express_checkout' | 'hero' | 'product'>('studio');
  const [selectedTargetProductId, setSelectedTargetProductId] = useState<string>(products[0]?.id || '');
  const [utmCampaignSlug, setUtmCampaignSlug] = useState('sebou_royal_2026');
  const [showQrModal, setShowQrModal] = useState(false);

  // Sound Effects State
  const [draftSoundEffects, setDraftSoundEffects] = useState<
    {
      effectName: string;
      timing: string;
      description: string;
      audioType: 'baby_giggle' | 'chime' | 'typewriter' | 'press' | 'lullaby';
    }[]
  >([
    {
      effectName: 'ضحكة طفل ناعمة في أول ثانيتين',
      timing: '0 - 2 ثوانٍ',
      description: 'تجذب اهتمام الأمهات عاطفياً في الثانية الأولى',
      audioType: 'baby_giggle',
    },
    {
      effectName: 'صوت نقرات كتابة الاسم بالاستوديو',
      timing: '3 - 6 ثوانٍ',
      description: 'صوت تفاعلي رقيق يحاكي تجربة كتابة اسم الطفل على الموك آب',
      audioType: 'typewriter',
    },
    {
      effectName: 'صوت مكبس الطباعة الرقمية DTF',
      timing: '7 - 10 ثوانٍ',
      description: 'صوت بخار لطيف يبرز تثبيت الحبر المائي بدون ملمس خشن',
      audioType: 'press',
    },
    {
      effectName: 'نغمة التأكيد الفاخرة للبراند',
      timing: '11 - 15 ثانية',
      description: 'رنين نجاح متناغم لتحفيز إتمام الطلب الفوري وتأكيد الحجز',
      audioType: 'chime',
    },
  ]);
  const [activePlayingSound, setActivePlayingSound] = useState<string | null>(null);

  // Visual Creative Customizer
  const [visualCustomName, setVisualCustomName] = useState('نوح 👑');
  const [visualAspectRatio, setVisualAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');

  // Universal Social Export Modal
  const [exportModalCampaign, setExportModalCampaign] = useState<SocialCampaign | null>(null);
  const [exportPlatformTab, setExportPlatformTab] = useState<'instagram' | 'tiktok' | 'facebook' | 'whatsapp' | 'web_share'>('instagram');
  const [copiedExportNotice, setCopiedExportNotice] = useState(false);

  // Campaign Execution & Publishing Suite (يدوي أو أوتوماتيك)
  const [executionMode, setExecutionMode] = useState<'auto' | 'manual'>('auto');
  const [autoPublishTiming, setAutoPublishTiming] = useState('اليوم، 8:00 مساءً (وقت الذروة للأمهات)');
  const [isAutoPublishing, setIsAutoPublishing] = useState(false);
  const [autoPublishProgress, setAutoPublishProgress] = useState(0);
  const [autoPublishSuccess, setAutoPublishSuccess] = useState(false);
  const [copiedCaptionSuccess, setCopiedCaptionSuccess] = useState(false);

  const handlePlaySound = (type: 'baby_giggle' | 'chime' | 'typewriter' | 'press' | 'lullaby') => {
    setActivePlayingSound(type);
    soundEffects.playEffect(type);
    setTimeout(() => setActivePlayingSound(null), 1200);
  };

  const getTargetLandingUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://2babyprint.eg';
    let path = `${origin}/`;
    if (targetPageKey === 'studio') path = `${origin}/#studio`;
    else if (targetPageKey === 'templates') path = `${origin}/#templates`;
    else if (targetPageKey === 'catalog') path = `${origin}/#catalog`;
    else if (targetPageKey === 'express_checkout') path = `${origin}/#checkout`;
    else if (targetPageKey === 'hero') path = `${origin}/#hero`;
    else if (targetPageKey === 'product') path = `${origin}/#catalog?product=${selectedTargetProductId}`;

    const cleanSlug = utmCampaignSlug.trim() || 'baby_print_promo';
    return `${path}${path.includes('?') ? '&' : '?'}utm_source=${selectedPlatform}&utm_medium=${draftMediaType === 'video_reel' ? 'reel' : 'feed'}&utm_campaign=${encodeURIComponent(cleanSlug)}&utm_content=${encodeURIComponent(marketingAngle)}`;
  };

  const handleDownloadAdCreative = () => {
    const canvas = document.createElement('canvas');
    const width = visualAspectRatio === '9:16' ? 1080 : visualAspectRatio === '1:1' ? 1080 : 1920;
    const height = visualAspectRatio === '9:16' ? 1920 : visualAspectRatio === '1:1' ? 1080 : 1080;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      // Dark gradient at bottom
      const grad = ctx.createLinearGradient(0, height * 0.45, 0, height);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.7, 'rgba(28,25,23,0.85)');
      grad.addColorStop(1, 'rgba(12,10,9,0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Brand Title
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('2BabyPrint Egypt 👶✨', width - 60, 80);

      // Name Stamp Box
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      const boxW = 500;
      const boxH = 120;
      const boxX = (width - boxW) / 2;
      const boxY = height * 0.42;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('طباعة رقمية DTF معتمدة', width / 2, boxY + 40);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(visualCustomName || 'نوح 👑', width / 2, boxY + 95);

      // Headline
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('✨ 100% قطن مصري فائق النعومة', width - 80, height - 190);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(draftHeadline.slice(0, 40), width - 80, height - 130);

      // CTA button
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(80, height - 95, 340, 55);
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(draftCta || 'صممي قطعتك الآن 🎨', 250, height - 60);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `2BabyPrint_Ad_${visualAspectRatio.replace(':', '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = draftImageUrl;
  };

  // Campaign Execution & Auto-Publishing Handler (أوتوماتيك أو يدوي)
  const handleExecuteCampaign = (mode: 'auto' | 'manual', manualPlatform?: string) => {
    const fullTargetUrl = getTargetLandingUrl();
    const fullCaption = `${draftHeadline}\n\n${draftBodyText}\n\n👶 صممي قطعتك المطبوعة باسم طفلك الآن مباشرة:\n👉 ${fullTargetUrl}\n\n${draftHashtags.join(' ')}`;

    if (mode === 'auto') {
      setIsAutoPublishing(true);
      setAutoPublishProgress(25);
      setAutoPublishSuccess(false);

      // Create new scheduled post for the social schedules tab
      const newPost: SocialPostSchedule = {
        id: `post-${Date.now()}`,
        platform: selectedPlatform,
        title: draftCampaignName || 'حملة ترويجية جديدة',
        content: fullCaption,
        scheduledTime: autoPublishTiming,
        status: 'scheduled',
        mediaType: draftMediaType === 'video_reel' ? 'reel' : 'image',
        mediaUrl: draftImageUrl,
        targetLink: fullTargetUrl,
        engagement: { likes: 0, shares: 0, comments: 0 },
      };

      const updatedPosts = [newPost, ...postSchedules];
      handleUpdatePosts(updatedPosts);

      setTimeout(() => setAutoPublishProgress(65), 350);
      setTimeout(() => setAutoPublishProgress(90), 750);
      setTimeout(() => {
        setAutoPublishProgress(100);
        setIsAutoPublishing(false);
        setAutoPublishSuccess(true);
        soundEffects.playCelestialChime();
        // Also persist campaign as active
        handleLaunchCampaign('active');
      }, 1100);
    } else {
      // Manual Social Share
      const encodedUrl = encodeURIComponent(fullTargetUrl);
      const encodedText = encodeURIComponent(`${draftHeadline}\n\n${draftBodyText}\n\n${fullTargetUrl}\n${draftHashtags.join(' ')}`);

      let shareUrl = '';
      if (manualPlatform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
      } else if (manualPlatform === 'telegram') {
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(draftHeadline + '\n\n' + draftBodyText)}`;
      } else if (manualPlatform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      } else if (manualPlatform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(draftHeadline + ' 👶✨')}&url=${encodedUrl}`;
      } else {
        if (navigator.share) {
          navigator.share({
            title: draftHeadline,
            text: draftBodyText,
            url: fullTargetUrl,
          }).catch(() => {});
          return;
        }
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank');
      }
    }
  };

  // Download complete campaign package text file
  const handleDownloadFullCampaignKit = () => {
    const fullTargetUrl = getTargetLandingUrl();
    const content = `================================================================
2BabyPrint Egypt - حزمة الدعاية والحملة الإعلانية المتكاملة
================================================================
اسم الحملة: ${draftCampaignName}
المنصة: ${selectedPlatform.toUpperCase()}
الهدف: ${selectedGoal}
تاريخ التوليد: ${new Date().toLocaleDateString('ar-EG')}

1. العنوان الرئيسي الجذاب (Hook & Headline):
${draftHeadline}

2. النص الإعلاني المقنع (Ad Body Copy):
${draftBodyText}

3. رابط الصفحة المستهدفة المتتبع (UTM Target Link):
${fullTargetUrl}

4. زر الإجراء (CTA):
${draftCta}

5. الهاشتاجات المقترحة:
${draftHashtags.join(' ')}

6. سيناريو تصوير الريلز / الفيديو القصير (9:16):
- خطاف أول 3 ثوانٍ: ${draftVideoScript.hookSeconds}
- المشهد واستوديو التصميم: ${draftVideoScript.visualAction}
- التعليق الصوتي: ${draftVideoScript.voiceover}
- الموسيقى والمؤثرات: ${draftVideoScript.soundTrackRecommendation}

7. الجمهور المستهدف:
- الفئة: ${draftAudience.label} (${draftAudience.ageRange})
- المناطق: ${draftAudience.locations.join('، ')}
- الاهتمامات: ${draftAudience.interests.join('، ')}
================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `2BabyPrint_Campaign_${draftCampaignName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Apply strategic AI marketing angle preset
  const handleApplyMarketingAnglePreset = (angle: 'sebou' | 'eczema_cotton' | 'mom_designer' | 'express_uber') => {
    setMarketingAngle(angle);
    soundEffects.playCelestialChime();

    if (angle === 'sebou') {
      setDraftCampaignName('حملة ريلز السبوع الملكي بالقطن المصري');
      setDraftHeadline('قطعة السبوع الأولى.. مكتوبة باسمه ومصنوعة من أنقى قطن مصري 👶✨');
      setDraftBodyText('استقبلي طفلك بأجمل سالوبيت قطن مصري 100% طبيعي، مطبوع باسمه أو عبارات التهنئة في استوديو التصميم الحي خلال ثوانٍ. خامات فائقة النعومة معتمدة للأكزيما وبشرة المواليد، مع توصيل سريع لباب بيتك في القاهرة والجيزة.');
      setDraftCta('صممي سالوبيت السبوع الآن 🎨');
      setTargetPageKey('studio');
      setVisualCustomName('نوح 👑');
    } else if (angle === 'eczema_cotton') {
      setDraftCampaignName('حملة أمان القطن المصري وبشرة المواليد الحساسة');
      setDraftHeadline('راحة بشرة طفلك بدون بوليستر أو أحبار كيميائية قاسية.. قطن مصري 100% 🌿');
      setDraftBodyText('لأن بشرة حديثي الولادة رقيقة ومعرضة للتحسس والأكزيما، جميع سالوبيتات وبافتات 2BabyPrint منسوجة من قطن مصري فائق النعومة، ومطبوعة بأحدث تقنية DTF المائية الآمنة طبياً والمعتمدة للبشرة الحساسة.');
      setDraftCta('اكتشفي خامات القطن المعتمدة للأكزيما 🌿');
      setTargetPageKey('templates');
      setVisualCustomName('ليلى 🌸');
    } else if (angle === 'mom_designer') {
      setDraftCampaignName('حملة تجربة استوديو التصميم الحي - صممي قطعة طفلك بنفسك');
      setDraftHeadline('صممي سالوبيت طفلك بنفسك وشوفي اسمه يلمع على الشاشة خلال ثوانٍ 🎨👑');
      setDraftBodyText('جربي متعة الأم المصممة! ادخلي استوديو 2BabyPrint الحي، اكتبي اسم طفلك، اختاري التاج الملكي أو فيونكة السبوع، وشاهدي الموك آب يتحدث أمامك فوراً بجودة فائقة الدقة قبل أي طلب.');
      setDraftCta('ابدأي التصميم الحي مجاناً 🎨');
      setTargetPageKey('studio');
      setVisualCustomName('زين 👑');
    } else if (angle === 'express_uber') {
      setDraftCampaignName('حملة هدايا السبوع العاجلة والشحن الفوري أوبر سكوتر');
      setDraftHeadline('مزنوقة في هدية سبوع فخمة؟ بوكس هدايا مخصص باسم البيبي يوصلك اليوم في القاهرة 🛵✨');
      setDraftBodyText('ما تشيليش هم الوقت! اختاري سالوبيت السبوع مع البافتة الملكية، واكتبي اسم البيبي، واختاري خدمة الشحن الفوري بأوبر سكوتر للتوصيل في نفس اليوم لجميع أحياء القاهرة الكبرى والجيزة مع دفع سريع عبر إنستاباي.');
      setDraftCta('اطلبي الشحن الفوري السريع الآن 🛵');
      setTargetPageKey('express_checkout');
      setVisualCustomName('حمزة 👑');
    }
  };

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
      if (result.soundEffects) {
        setDraftSoundEffects(result.soundEffects);
      }
    } catch (err) {
      console.error('Error generating AI campaign:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleDownloadMediaKitTxt = (campaign: SocialCampaign) => {
    const landingUrl = campaign.adCreative.ctaUrl || getTargetLandingUrl();
    const content = `========================================================
2BabyPrint Egypt - Media Kit & Campaign Assets
اسم الحملة: ${campaign.name}
المنصة: ${campaign.platform.toUpperCase()}
الهدف الإعلاني: ${campaign.goal}
تاريخ الإطلاق: ${campaign.startDate}
الميزانية اليومية: ${campaign.budgetPerDay} ج.م
رابط الهبوط وتتبع UTM: ${landingUrl}
========================================================

[1] نصوص ومنشورات إنستغرام (Instagram Reels & Post):
العنوان: ${campaign.adCreative.headline}
الكابشن:
${campaign.adCreative.bodyText}

الهاشتاجات:
${campaign.adCreative.hashtags.join(' ')}

الدعوة لاتخاذ إجراء: ${campaign.adCreative.ctaText}

--------------------------------------------------------
[2] سكريبت فيديو ريلز / تيك توك 15 ثانية (Short Video Storyboard):
${campaign.adCreative.videoScript ? `- أول 3 ثوانٍ (Hook): ${campaign.adCreative.videoScript.hookSeconds}
- المشهد البصري: ${campaign.adCreative.videoScript.visualAction}
- التعليق الصوتي: ${campaign.adCreative.videoScript.voiceover}
- الموسيقى المقترحة: ${campaign.adCreative.videoScript.soundTrackRecommendation}` : 'غير محدد'}

--------------------------------------------------------
[3] المؤثرات الصوتية المقترحة (Sound Effects):
${(campaign.adCreative.soundEffects || draftSoundEffects).map((s, i) => `${i + 1}. [${s.timing}] ${s.effectName}: ${s.description}`).join('\n')}

--------------------------------------------------------
[4] رسالة برودكاست واتساب (WhatsApp Broadcast / Community):
🎉 *${campaign.adCreative.headline}*

${campaign.adCreative.bodyText}

✨ *مميزات استوديو 2BabyPrint:*
• 100% قطن مصري طويل التيلة فائق النعومة.
• أحبار مائية عضوية معتمدة آمنة لبشرة حديثي الولادة وحالات الأكزيما.
• شحن فوري سريع اليوم في القاهرة والجيزة (أوبر سكوتر).

🛒 *اطلبي وصممي قطعة طفلك الآن مباشرة عبر الرابط:*
${landingUrl}

--------------------------------------------------------
[5] مواصفات الجمهور المستهدف (Audience Targeting):
الفئة: ${campaign.targetAudience.label} (${campaign.targetAudience.ageRange})
المناطق: ${campaign.targetAudience.locations.join('، ')}
الاهتمامات: ${campaign.targetAudience.interests.join('، ')}
الديموغرافيا: ${campaign.targetAudience.demographics}
========================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `2BabyPrint_MediaKit_${campaign.platform}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Launch and Save New Campaign
  const handleLaunchCampaign = (status: CampaignStatus = 'active') => {
    const fullTargetUrl = getTargetLandingUrl();
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
        ctaUrl: fullTargetUrl,
        hashtags: draftHashtags,
        mediaType: draftMediaType,
        imageUrl: draftImageUrl,
        videoScript: draftMediaType === 'video_reel' ? draftVideoScript : undefined,
        soundEffects: draftSoundEffects,
        targetPageKey,
        targetPageUrl: fullTargetUrl,
        utmParams: {
          source: selectedPlatform,
          medium: draftMediaType === 'video_reel' ? 'reel' : 'feed',
          campaign: utmCampaignSlug,
          content: marketingAngle,
        },
        aspectRatio: visualAspectRatio,
        visualCustomName,
        marketingAngle,
      },
      metrics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
        cpa: 0,
        roas: 0,
      },
      aiNotes: 'حملة تم إنشاؤها بالذكاء الاصطناعي مع رابط تتبع UTM ومؤثرات صوتية مخصصة.',
      createdAt: new Date().toISOString(),
    };

    onSaveCampaigns([newCamp, ...campaigns]);
    setCampaignSuccessNotice(true);
    setTimeout(() => {
      setCampaignSuccessNotice(false);
      setActiveTab('monitor');
    }, 1500);
  };

  // Instant Omni-Channel Export for Current Draft
  const handleExportDraftToSocial = () => {
    const fullTargetUrl = getTargetLandingUrl();
    const draftCamp: SocialCampaign = {
      id: `draft-${Date.now()}`,
      name: draftCampaignName || 'حملة ترويجية جديدة',
      platform: selectedPlatform,
      goal: selectedGoal,
      status: 'draft',
      startDate: new Date().toISOString().split('T')[0],
      budgetPerDay: draftDailyBudget,
      totalSpent: 0,
      targetAudience: draftAudience,
      adCreative: {
        headline: draftHeadline,
        bodyText: draftBodyText,
        ctaText: draftCta,
        ctaUrl: fullTargetUrl,
        hashtags: draftHashtags,
        mediaType: draftMediaType,
        imageUrl: draftImageUrl,
        videoScript: draftMediaType === 'video_reel' ? draftVideoScript : undefined,
        soundEffects: draftSoundEffects,
        targetPageKey,
        targetPageUrl: fullTargetUrl,
        utmParams: {
          source: selectedPlatform,
          medium: draftMediaType === 'video_reel' ? 'reel' : 'feed',
          campaign: utmCampaignSlug,
          content: marketingAngle,
        },
        aspectRatio: visualAspectRatio,
        visualCustomName,
        marketingAngle,
      },
      metrics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
        cpa: 0,
        roas: 0,
      },
      createdAt: new Date().toISOString(),
    };
    setExportModalCampaign(draftCamp);
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

  // Filtered campaigns & metrics calculations
  const filteredCampaigns = campaigns.filter((c) => {
    if (platformFilter === 'all') return true;
    return c.platform === platformFilter;
  });

  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const totalAdSpend = campaigns.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + (c.metrics?.impressions || 0), 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + (c.metrics?.clicks || 0), 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + (c.metrics?.conversions || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '3.8';
  const avgRoas = campaigns.length > 0 ? (campaigns.reduce((acc, c) => acc + (c.metrics?.roas || 0), 0) / campaigns.length).toFixed(1) : '4.6';

  const isProjector = displayMode === 'projector';

  return (
    <div className={`space-y-6 ${isProjector ? 'text-base' : ''}`}>
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 rounded-2xl shadow-sm border border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>نظام التسويق والإعلانات الممولة بالذكاء الاصطناعي (Meta, TikTok, Google)</span>
            {isProjector && (
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/50 px-2 py-0.5 rounded-full text-[11px] font-bold">
                📽️ شاشة عرض كبيرة
              </span>
            )}
          </div>
          <h2 className={`${isProjector ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'} font-black tracking-tight text-white flex items-center gap-2`}>
            <Megaphone className="w-6 h-6 text-amber-400" />
            <span>مركز الدعاية والحملات والمراقبة الذكية</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            أنشئي حملاتك الترويجية لمنصات إنستغرام، فيسبوك، تيك توك، وسناب شات مع سيناريوهات ريلز واستهداف دقيق لأمهات القاهرة ومحافظات مصر ومراقبة فورية للعائد على الإنفاق (ROAS).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('create_ai')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>إنشاء إعلان جديد بالذكاء الاصطناعي</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-stone-200 pb-2">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto scrollbar-none w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('monitor')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'monitor'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>مراقبة الحملات ({campaigns.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('create_ai')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'create_ai'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>منشئ الحملات والصور</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('short_video')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'short_video'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Film className="w-4 h-4 text-purple-600" />
            <span>فيديو ريلز وتيك توك قصير</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio_effects')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'audio_effects'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Volume2 className="w-4 h-4 text-rose-600" />
            <span>المؤثرات الصوتية والتعليق</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('page_links')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'page_links'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-sky-600" />
            <span>الربط بصفحات المتجر و QR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('influencers')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'influencers'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Gift className="w-4 h-4 text-rose-600" />
            <span>المؤثرات وهدايا الدعاية ({influencers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social_pages')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'social_pages'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Share2 className="w-4 h-4 text-sky-600" />
            <span>صفحات السوشيال وجدول النشر</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('learning_engine')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'learning_engine'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>محرك التعلّم الذكي وتحليل السوق</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span>محاكي العائد (ROAS)</span>
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
              <div className={`${isProjector ? 'text-3xl lg:text-4xl' : 'text-2xl'} font-black text-stone-900 font-mono`}>
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
              <div className={`${isProjector ? 'text-3xl lg:text-4xl' : 'text-2xl'} font-black text-emerald-800 font-mono`}>
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
              <div className={`${isProjector ? 'text-3xl lg:text-4xl' : 'text-2xl'} font-black text-stone-900 font-mono`}>
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
              <div className={`${isProjector ? 'text-3xl lg:text-4xl' : 'text-2xl'} font-black text-purple-900 font-mono`}>
                {avgRoas}x
              </div>
              <div className="text-[11px] text-purple-700 font-semibold mt-1">
                كل 1 ج.م إعلانات يولد {avgRoas} ج.م مبيعات
              </div>
            </div>
          </div>

          {/* Campaigns Table & Cards */}
          <div className="space-y-4">
            {filteredCampaigns.map((camp: SocialCampaign) => (
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
                    {/* Export to Socials Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setExportModalCampaign(camp);
                        setExportPlatformTab(
                          camp.platform === 'tiktok'
                            ? 'tiktok'
                            : camp.platform === 'facebook'
                            ? 'facebook'
                            : 'instagram'
                        );
                      }}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                      title="تصدير ومشاركة الإعلان إلى إنستغرام، تيك توك، فيسبوك، واتساب"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>تصدير لوسائل التواصل</span>
                    </button>

                    {/* Download Media Kit */}
                    <button
                      type="button"
                      onClick={() => handleDownloadMediaKitTxt(camp)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                      title="تحميل كملف نصي Media Kit (.txt)"
                    >
                      <FileDown className="w-4 h-4" />
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
                          <span>نسخ الحزمة</span>
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
                      {camp.adCreative.hashtags.map((h: string, i: number) => (
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

            {/* AI Marketing Angles & Instant Idea Bank */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-xs text-amber-950">
                    بنك الأفكار التسويقية والزوايا النفسية بالذكاء الاصطناعي (AI Angles):
                  </span>
                </div>
                <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  انقري لتطبيق الفكرة فوراً
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  {
                    id: 'sebou',
                    title: '👑 عاطفة السبوع الأول والتاج الملكي',
                    desc: 'تركز على دموع الفرح وذكرى أول قطعة مطبوعة باسم المولود لاستقبال المهنئين',
                    color: 'border-amber-400 bg-white hover:bg-amber-50/60',
                  },
                  {
                    id: 'eczema_cotton',
                    title: '🌿 أمان القطن الطبيعي 100% للأكزيما',
                    desc: 'تركز على الأقمشة الطبية بدون بوليستر أو أصباغ قاسية لحماية جلد الرضع',
                    color: 'border-emerald-400 bg-white hover:bg-emerald-50/60',
                  },
                  {
                    id: 'mom_designer',
                    title: '🎨 صممي سالوبيت طفلك بنفسك (Live Studio)',
                    desc: 'تركز على تجربة الأم كمصممة ترى الاسم وتختار التيجان في ثوانٍ معدودة',
                    color: 'border-purple-400 bg-white hover:bg-purple-50/60',
                  },
                  {
                    id: 'express_uber',
                    title: '🛵 هدايا السبوع العاجلة والشحن الفوري',
                    desc: 'تركز على إنقاذ الأقارب بهدية فخمة تصل خلال ساعات عبر أوبر سكوتر',
                    color: 'border-rose-400 bg-white hover:bg-rose-50/60',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleApplyMarketingAnglePreset(item.id as any)}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer shadow-2xs ${item.color} ${
                      marketingAngle === item.id ? 'ring-2 ring-amber-500 font-bold' : ''
                    }`}
                  >
                    <span className="block font-bold text-xs text-stone-900">{item.title}</span>
                    <span className="block text-[11px] text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </span>
                  </button>
                ))}
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

              {/* Campaign Execution & Publishing Suite (تعميل وتنفيذ المحتوى الدعائي يدوي أو أوتوماتيك) */}
              <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 rounded-2xl border border-stone-800 space-y-4 shadow-md mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">
                        تعميل وتنفيذ المحتوى الإعلاني ونشره (يدوي أو أوتوماتيك)
                      </h4>
                      <p className="text-[10px] text-stone-400">
                        Creative Execution, Multi-Channel Auto-Dispatch & Assets Download
                      </p>
                    </div>
                  </div>

                  {/* Mode Switcher */}
                  <div className="bg-stone-800 p-1 rounded-xl flex items-center border border-stone-700 text-xs">
                    <button
                      type="button"
                      onClick={() => setExecutionMode('auto')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        executionMode === 'auto'
                          ? 'bg-amber-500 text-stone-950 shadow-xs'
                          : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>نشر أوتوماتيكي ذكي</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExecutionMode('manual')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        executionMode === 'manual'
                          ? 'bg-amber-500 text-stone-950 shadow-xs'
                          : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>نشر يدوي ومشاركة</span>
                    </button>
                  </div>
                </div>

                {/* 1. Automated Dispatch Mode */}
                {executionMode === 'auto' && (
                  <div className="space-y-3 p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-amber-400 block">
                          ⚡ جدولة وتصدير المحتوى أوتوماتيكياً:
                        </span>
                        <span className="text-[11px] text-stone-400 block">
                          يتم إدراج المنشور مباشرة في جدول نشر صفحات المتجر وتثبيته في مراقب الحملات
                        </span>
                      </div>

                      <select
                        value={autoPublishTiming}
                        onChange={(e) => setAutoPublishTiming(e.target.value)}
                        className="bg-stone-900 text-stone-200 border border-stone-700 text-xs rounded-xl px-3 py-2 font-medium"
                      >
                        <option value="اليوم، 8:00 مساءً (وقت الذروة للأمهات)">اليوم، 8:00 م (ذروة الأمهات)</option>
                        <option value="فوري الآن (Direct Auto-Dispatch)">نشر فوري الآن أوتوماتيك</option>
                        <option value="غداً، 10:00 صباحاً (فترة الصباح)">غداً، 10:00 ص</option>
                        <option value="الخميس، 6:00 مساءً (ويك إند حفلات السبوع)">الخميس، 6:00 م (ويك إند)</option>
                      </select>
                    </div>

                    {/* Progress Bar when Running */}
                    {isAutoPublishing && (
                      <div className="space-y-1.5 pt-1 animate-in fade-in">
                        <div className="flex items-center justify-between text-[11px] text-amber-300">
                          <span>جاري تعميل وتوزيع الحملة أوتوماتيكياً على قنوات التواصل...</span>
                          <span className="font-mono font-bold">{autoPublishProgress}%</span>
                        </div>
                        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                            style={{ width: `${autoPublishProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Success Notice */}
                    {autoPublishSuccess && (
                      <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>تم تعميل ونشر الحملة أوتوماتيكياً بنجاح وإدراجها بجدول النشر!</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded">
                          Published & Active ✓
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-800">
                      <span className="text-[11px] text-stone-400">
                        المنصات: إنستغرام، تيك توك، فيسبوك، واتساب وتلجرام
                      </span>

                      <button
                        type="button"
                        onClick={() => handleExecuteCampaign('auto')}
                        disabled={isAutoPublishing}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 fill-current" />
                        <span>{isAutoPublishing ? 'جاري النشر الأوتوماتيكي...' : '⚡ تعميل وتنفيذ النشر الأوتوماتيكي الآن'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Manual Direct Share Mode */}
                {executionMode === 'manual' && (
                  <div className="space-y-3 p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                    <span className="text-xs font-bold text-stone-300 block">
                      📲 النشر اليدوي المباشر عبر التطبيقات ومشاركة الروابط:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleExecuteCampaign('manual', 'whatsapp')}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>إرسال عبر واتساب</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExecuteCampaign('manual', 'telegram')}
                        className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>مشاركة في تلجرام</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExecuteCampaign('manual', 'facebook')}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                      >
                        <Facebook className="w-4 h-4" />
                        <span>مشاركة على فيسبوك</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExecuteCampaign('manual', 'twitter')}
                        className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer border border-stone-700"
                      >
                        <Twitter className="w-4 h-4" />
                        <span>تغريد على X</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExecuteCampaign('manual', 'web_share')}
                        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>مشاركة عبر الجهاز</span>
                      </button>
                    </div>

                    {/* Quick copy bar */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800">
                      <button
                        type="button"
                        onClick={() => {
                          const fullCaption = `${draftHeadline}\n\n${draftBodyText}\n\n👉 ${getTargetLandingUrl()}\n\n${draftHashtags.join(' ')}`;
                          navigator.clipboard.writeText(fullCaption);
                          setCopiedCaptionSuccess(true);
                          setTimeout(() => setCopiedCaptionSuccess(false), 2000);
                        }}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCaptionSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCaptionSuccess ? 'تم نسخ النص الكامل ✓' : 'نسخ النص والهاشتاجات'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(getTargetLandingUrl());
                          soundEffects.playCelestialChime();
                        }}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-sky-400 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>نسخ رابط الصفحة المستهدفة (UTM)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Direct Assets Download Section (تحميل مواد الحملة) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800 text-xs">
                  <span className="text-stone-300 font-bold flex items-center gap-1">
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>تحميل وتعميل ملفات الحملة:</span>
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadAdCreative}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل البانر المصمم (PNG)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadFullCampaignKit}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>تحميل الحزمة والسيناريو (.txt)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Standard Additional Hub Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleLaunchCampaign('active')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>تثبيت وإطلاق في السجل</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportDraftToSocial}
                  className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>نافذة التصدير الشاملة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('short_video')}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>محاكي الريلز (9:16)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('audio_effects')}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>المؤثرات الصوتية</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('page_links')}
                  className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>رابط المتجر و QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchCampaign('draft')}
                  className="px-3 py-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 font-semibold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>حفظ كمسودة</span>
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

      {/* 6. TAB 4: INFLUENCERS & PR GIFTING PIPELINE */}
      {activeTab === 'influencers' && (
        <div className="space-y-6">
          {/* Header & KPI Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 block">إجمالي المؤثرات الشريكات</span>
              <span className="text-xl font-bold text-stone-900 mt-1 block">{influencers.length}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 block">هدايا قيد التجهيز بالمطبعة</span>
              <span className="text-xl font-bold text-amber-600 mt-1 block">
                {influencers.filter((i) => i.status === 'gift_in_production').length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 block">فيديوهات وريلز منشورة</span>
              <span className="text-xl font-bold text-purple-600 mt-1 block">
                {influencers.filter((i) => i.status === 'reel_published' || i.status === 'active_ambassador').length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 block">مبيعات محققة من أكواد الخصم</span>
              <span className="text-xl font-bold text-emerald-600 mt-1 block">
                {influencers.reduce((acc, i) => acc + (i.totalSalesValue || 0), 0).toLocaleString()} ج.م
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
            <div>
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Gift className="w-4 h-4 text-rose-600" />
                <span>برنامج الدعاية والإهداءات المخصصة للمؤثرات وأطفالهن (PR Gifting)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                إرسال ملابس قطنية بأسماء أطفال المؤثرات وصياغة رسائل دعائية ترغيبية تزيد انتشار المتجر على إنستغرام وتيك توك
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddInfluencerModalOpen(true)}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-98 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>إضافة مؤثرة / صانعة محتوى جديدة</span>
            </button>
          </div>

          {/* Influencer Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {influencers.map((inf) => (
              <div
                key={inf.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-amber-400 transition-all shadow-2xs space-y-4"
              >
                {/* Influencer Profile Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 font-bold text-base">
                      {(inf.momName || inf.name || 'M').slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-sm">{inf.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {inf.platform === 'instagram' ? '📸 إنستغرام' : inf.platform === 'tiktok' ? '🎵 تيك توك' : '📘 فيسبوك'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5 font-mono">
                        <span>{inf.handle}</span>
                        <span>•</span>
                        <span>{inf.followers} متابع</span>
                        <span>•</span>
                        <span>{inf.location}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`هل ترغب في حذف ${inf.name} من قائمة المؤثرات؟`)) {
                        handleUpdateInfluencers(influencers.filter((i) => i.id !== inf.id));
                      }
                    }}
                    className="text-stone-400 hover:text-red-600 p-1 rounded-lg transition-colors cursor-pointer"
                    title="حذف المؤثرة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Children & Personalization Details */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>الأطفال المستهدفون بالهدية المخصصة:</span>
                    </span>
                    <span className="text-[11px] text-stone-500">مطبوعة بالأسماء</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(inf.children || []).map((ch, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2.5 py-1 bg-white border border-stone-200 text-stone-800 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <span>{ch.gender === 'boy' ? '👶' : '👧'}</span>
                        <span>{ch.name} ({ch.age})</span>
                        {ch.favoriteColor && <span className="text-[10px] text-stone-500">[{ch.favoriteColor}]</span>}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200/60 mt-1">
                    <strong className="text-stone-800">تفاصيل الطقم المهداة: </strong>
                    <span>{inf.customOutfitNotes}</span>
                  </div>
                </div>

                {/* Stage Pipeline & Promo Performance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      مرحلة التواصل والتعاون:
                    </label>
                    <select
                      value={inf.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as InfluencerStage;
                        handleUpdateInfluencers(
                          influencers.map((i) => (i.id === inf.id ? { ...i, status: newStatus } : i))
                        );
                      }}
                      className="w-full text-xs font-bold p-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800"
                    >
                      <option value="identified">🔍 تم تحديد الحساب (Identified)</option>
                      <option value="contacted">💬 تم التواصل المبدئي (Contacted)</option>
                      <option value="details_confirmed">📝 تم تأكيد المقاسات والعنوان</option>
                      <option value="gift_in_production">🏭 الهدية قيد الطباعة بالمطبعة</option>
                      <option value="delivered">📦 تم تسليم الهدية للمؤثرة</option>
                      <option value="reel_published">✨ تم نشر الريلز والمراجعة</option>
                      <option value="active_ambassador">👑 سفيرة دائمة للبراند</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      كود الخصم والمبيعات:
                    </label>
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-emerald-800">{inf.promoCode || inf.couponCode || 'لا يوجد'}</span>
                        <div className="text-[10px] text-emerald-700">{inf.ordersDriven || 0} طلب مسجل</div>
                      </div>
                      <span className="font-black text-emerald-900 font-mono text-sm">
                        {(inf.totalSalesValue || 0).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Persuasive Pitch Action */}
                <div className="border-t border-stone-100 pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>رسالة العرض الترغيبي المقترحة (AI Pitch):</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (inf.aiPitchDraft) {
                          navigator.clipboard.writeText(inf.aiPitchDraft);
                          setCopiedId(`pitch-${inf.id}`);
                          setTimeout(() => setCopiedId(null), 2500);
                        }
                      }}
                      className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === `pitch-${inf.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ نص العرض لـ DM</span>
                        </>
                      )}
                    </button>
                  </div>

                  {inf.aiPitchDraft && (
                    <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-stone-700 leading-relaxed max-h-28 overflow-y-auto whitespace-pre-line font-sans">
                      {inf.aiPitchDraft}
                    </div>
                  )}

                  {/* Dispatch PR Order to Print House WhatsApp */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`https://wa.me/201019998877?text=${encodeURIComponent(
                        `*أمر تشغيل هدية دعاية PR لمؤثرة: ${inf.name}*\n` +
                        `👤 الحساب: ${inf.handle} (${inf.followers || inf.followersCount || ''})\n` +
                        `👶 أسماء الأطفال: ${(inf.children || []).map((c) => `${c.name} (${c.age})`).join(' + ')}\n` +
                        `👕 تفاصيل القطع المطلوبة: ${inf.customOutfitNotes || inf.giftOrderDetails || ''}\n` +
                        `📍 العنوان: ${inf.location || ''}\n` +
                        `🌟 التغليف: بوكس VIP فاخر للبراند مع كرت إهداء شخصي.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>إرسال أمر الهدية لواتساب المطبعة للطباعة الفورية</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal: Add New Influencer */}
          {isAddInfluencerModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                    <Gift className="w-5 h-5 text-rose-600" />
                    <span>إضافة مؤثرة / صانعة محتوى جديدة للإهداءات</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddInfluencerModalOpen(false)}
                    className="text-stone-400 hover:text-stone-600 p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">اسم الأم أو القناة:</label>
                      <input
                        type="text"
                        value={newInfName}
                        onChange={(e) => setNewInfName(e.target.value)}
                        placeholder="مثال: ياسمين صبري (ماما ياسمين)"
                        className="w-full p-2.5 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">اسم المستخدم (Handle):</label>
                      <input
                        type="text"
                        value={newInfHandle}
                        onChange={(e) => setNewInfHandle(e.target.value)}
                        placeholder="@yasmine_baby"
                        className="w-full p-2.5 border border-stone-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">المنصة:</label>
                      <select
                        value={newInfPlatform}
                        onChange={(e) => setNewInfPlatform(e.target.value as any)}
                        className="w-full p-2.5 border border-stone-300 rounded-xl"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="facebook">Facebook</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">عدد المتابعين:</label>
                      <input
                        type="text"
                        value={newInfFollowers}
                        onChange={(e) => setNewInfFollowers(e.target.value)}
                        placeholder="مثال: 150K"
                        className="w-full p-2.5 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">المدينة / المنطقة:</label>
                      <input
                        type="text"
                        value={newInfLocation}
                        onChange={(e) => setNewInfLocation(e.target.value)}
                        placeholder="القاهرة الجديدة"
                        className="w-full p-2.5 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <span className="font-bold text-stone-800 block">بيانات الطفل/الأطفال لتخصيص الملابس:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newInfChildName}
                        onChange={(e) => setNewInfChildName(e.target.value)}
                        placeholder="اسم الطفل (مثال: مالك)"
                        className="p-2 border border-stone-300 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        value={newInfChildAge}
                        onChange={(e) => setNewInfChildAge(e.target.value)}
                        placeholder="العمر (مثال: 6 شهور)"
                        className="p-2 border border-stone-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">تفاصيل ومواصفات طقم الهدية المخصصة:</label>
                    <textarea
                      rows={2}
                      value={newInfCustomNotes}
                      onChange={(e) => setNewInfCustomNotes(e.target.value)}
                      placeholder="مثال: سالوبيت قطن مصري ملكي مطبوع عليه اسم مالك بالخط الديواني + تيشيرت متطابق للأم"
                      className="w-full p-2.5 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">كود الخصم المخصص لمتابعيها:</label>
                    <input
                      type="text"
                      value={newInfPromoCode}
                      onChange={(e) => setNewInfPromoCode(e.target.value)}
                      placeholder="MALEK10"
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-stone-200 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddInfluencerModalOpen(false)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-800 text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newInfName || !newInfHandle) return;
                      const newInf: InfluencerPartner = {
                        id: `inf-${Date.now()}`,
                        name: newInfName,
                        handle: newInfHandle,
                        platform: newInfPlatform,
                        followers: newInfFollowers || '50K',
                        location: newInfLocation || 'القاهرة',
                        momName: newInfMomName || newInfName.split(' ')[0],
                        children: [
                          {
                            name: newInfChildName || 'البيبي',
                            age: newInfChildAge || 'سنة',
                            gender: 'boy',
                          },
                        ],
                        customOutfitNotes: newInfCustomNotes || 'طقم سالوبيت قطن مصري مخصص بالاسم',
                        status: 'identified',
                        promoCode: newInfPromoCode || 'VIP10',
                        ordersDriven: 0,
                        totalSalesValue: 0,
                        aiPitchDraft: `أهلاً يا جميلة 🌸 بنتابع يومياتك الرقيقة وحابين نهديكِ ونهدي ${newInfChildName || 'طفلك'} طقم قطن مصري 100% أنقى درجة مطبوع باسمه خصيصاً في استوديو 2BabyPrint لحماية بشرته من الحساسية وتخليد أجمل صوره. يسعدنا استقبال مقاساتكم!`,
                        lastContactDate: new Date().toISOString().split('T')[0],
                      };
                      handleUpdateInfluencers([newInf, ...influencers]);
                      setIsAddInfluencerModalOpen(false);
                      setNewInfName('');
                      setNewInfHandle('');
                      setNewInfChildName('');
                      setNewInfChildAge('');
                      setNewInfCustomNotes('');
                      setNewInfPromoCode('');
                    }}
                    className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold"
                  >
                    حفظ المؤثرة وبدء التواصل
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. TAB 5: REAL SOCIAL PAGES & CONTENT CALENDAR */}
      {activeTab === 'social_pages' && (
        <div className="space-y-6">
          {/* Linked Social Pages Overview */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-sky-600" />
                  <span>الصفحات والحسابات الرسمية المرتبطة بمتجر 2BabyPrint</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  ربط الحسابات الحقيقية، اختبار الروابط المباشرة، الجدولة والنشر الفعلي بدون أي بيانات وهمية
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddChannelModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ربط حساب / منصة جديدة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditChannelsModalOpen(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>تعديل الحسابات المرتبطة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddPostModalOpen(true)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>جدولة منشور جديد</span>
                </button>
              </div>
            </div>

            {/* Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {connectedChannels.map((ch) => (
                <div
                  key={ch.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:border-amber-400 transition-all space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{ch.name}</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono">
                        جاهز للنشر ✅
                      </span>
                      {connectedChannels.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteChannel(ch.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="إزالة ربط الحساب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="font-mono text-xs font-bold text-stone-800 dir-ltr text-right">
                    {ch.handle}
                  </div>

                  <div className="text-[11px] text-stone-500 line-clamp-1">
                    {ch.followers} • {ch.notes}
                  </div>

                  <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => window.open(ch.url, '_blank')}
                      className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>زيارة واختبار الرابط</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingChannel(ch)}
                      className="text-stone-600 hover:text-stone-900 font-semibold text-[11px] cursor-pointer"
                    >
                      تعديل البيانات ✏️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Schedule Queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>جدول النشر التفاعلي والمحتوى المجدول ({postSchedules.length}):</span>
              </h4>
              <span className="text-xs text-stone-500">
                يمكنك النشر المباشر لأي منشور فوراً بضغطة زر
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {postSchedules.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-4 shadow-2xs hover:border-amber-400 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 capitalize">
                        {post.platform === 'instagram'
                          ? '📸 Instagram'
                          : post.platform === 'tiktok'
                          ? '🎵 TikTok'
                          : post.platform === 'facebook'
                          ? '📘 Facebook'
                          : post.platform === 'whatsapp'
                          ? '💬 WhatsApp'
                          : post.platform}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : post.status === 'scheduled'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {post.status === 'published' ? 'منشور بالفعل ✓' : post.status === 'scheduled' ? 'مجدول للنشر' : 'مسودة'}
                      </span>
                    </div>

                    <h5 className="font-bold text-stone-900 text-xs leading-snug">{post.title}</h5>

                    <p className="text-xs text-stone-600 line-clamp-4 leading-relaxed whitespace-pre-line font-sans bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{post.scheduledTime}</span>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(post.content);
                          setCopiedId(post.id);
                          setTimeout(() => setCopiedId(null), 2500);
                        }}
                        className="text-xs font-bold text-stone-700 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === post.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ الكابشن</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePostSchedule(post.id)}
                        className="text-stone-400 hover:text-rose-600 text-xs font-semibold cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>

                    {/* Live Publish Action Button */}
                    <button
                      type="button"
                      onClick={() => handlePublishPostLive(post)}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{post.status === 'published' ? 'إعادة النشر للمنصة الحقيقية' : '🚀 نشر فوري للمنصة الحقيقية'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal: Edit Channel Single */}
          {editingChannel && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-600" />
                    <span>تعديل ربط منصة {editingChannel.name}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingChannel(null)}
                    className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">اسم الحساب / Handle:</label>
                    <input
                      type="text"
                      value={editingChannel.handle}
                      onChange={(e) => setEditingChannel({ ...editingChannel, handle: e.target.value })}
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-mono text-left"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">رابط الصفحة أو القناة الفعلي (URL):</label>
                    <input
                      type="text"
                      value={editingChannel.url}
                      onChange={(e) => setEditingChannel({ ...editingChannel, url: e.target.value })}
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-mono text-left"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">عدد المتابعين / إحصائية الحساب:</label>
                    <input
                      type="text"
                      value={editingChannel.followers}
                      onChange={(e) => setEditingChannel({ ...editingChannel, followers: e.target.value })}
                      className="w-full p-2.5 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">ملاحظات وقنوات التوجيه:</label>
                    <input
                      type="text"
                      value={editingChannel.notes}
                      onChange={(e) => setEditingChannel({ ...editingChannel, notes: e.target.value })}
                      className="w-full p-2.5 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-stone-200 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingChannel(null)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-800 text-xs font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveChannelEdit(editingChannel)}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-black cursor-pointer shadow-xs"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Edit All Channels List */}
          {isEditChannelsModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-amber-600" />
                      <span>إدارة وربط الحسابات الرسمية على السوشيال ميديا</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      تحديث روابط حسابات المتجر الحقيقية لنشر الحملات وتوجيه العملاء الفعلي
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditChannelsModalOpen(false)}
                    className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs divide-y divide-stone-100">
                  {connectedChannels.map((channel, idx) => (
                    <div key={channel.id} className="pt-3 first:pt-0 space-y-2">
                      <div className="font-bold text-stone-900 flex items-center justify-between">
                        <span>{channel.name}</span>
                        <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded">
                          {channel.platform}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-stone-500 mb-0.5">اسم الحساب / الرقم:</label>
                          <input
                            type="text"
                            value={channel.handle}
                            onChange={(e) => {
                              const updated = [...connectedChannels];
                              updated[idx].handle = e.target.value;
                              setConnectedChannels(updated);
                            }}
                            className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-stone-500 mb-0.5">الرابط المباشر (URL):</label>
                          <input
                            type="text"
                            value={channel.url}
                            onChange={(e) => {
                              const updated = [...connectedChannels];
                              updated[idx].url = e.target.value;
                              setConnectedChannels(updated);
                            }}
                            className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-stone-200 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateChannels(connectedChannels);
                      setIsEditChannelsModalOpen(false);
                      soundEffects.playCelestialChime();
                    }}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl text-xs shadow-sm cursor-pointer"
                  >
                    حفظ كافة الحسابات الرسمية
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Add Custom Channel */}
          {isAddChannelModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-emerald-600" />
                    <span>ربط صفحة أو حساب جديد بالمتجر</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddChannelModalOpen(false)}
                    className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">المنصة:</label>
                    <select
                      value={newChannelPlatform}
                      onChange={(e) => setNewChannelPlatform(e.target.value as any)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl bg-stone-50 text-stone-800"
                    >
                      <option value="facebook">📘 Facebook Page / Group</option>
                      <option value="instagram">📸 Instagram Business</option>
                      <option value="tiktok">🎵 TikTok Creator</option>
                      <option value="whatsapp">💬 WhatsApp Business / Catalog</option>
                      <option value="telegram">✈️ Telegram Production Channel</option>
                      <option value="twitter">🐦 X (Twitter)</option>
                      <option value="pinterest">📌 Pinterest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">اسم الحساب / الصفحة:</label>
                    <input
                      type="text"
                      placeholder="مثال: صفحة فيسبوك 2BabyPrint مصر"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">المعرف / اسم المستخدم (Handle):</label>
                    <input
                      type="text"
                      placeholder="@2babyprint_eg"
                      value={newChannelHandle}
                      onChange={(e) => setNewChannelHandle(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-mono text-left"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">الرابط الفعلي للحساب (URL):</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/your-page"
                      value={newChannelUrl}
                      onChange={(e) => setNewChannelUrl(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-mono text-left"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">إحصائية المتابعين:</label>
                      <input
                        type="text"
                        placeholder="مثال: 50K متابع"
                        value={newChannelFollowers}
                        onChange={(e) => setNewChannelFollowers(e.target.value)}
                        className="w-full p-2.5 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">ملاحظات التوجيه:</label>
                      <input
                        type="text"
                        placeholder="نشر ريلز السبوع"
                        value={newChannelNotes}
                        onChange={(e) => setNewChannelNotes(e.target.value)}
                        className="w-full p-2.5 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-stone-200 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddChannelModalOpen(false)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-800 text-xs font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewChannel}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs"
                  >
                    حفظ وربط الحساب فوراً
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Add Scheduled Post */}
          {isAddPostModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <span>جدولة منشور جديد على السوشيال ميديا</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddPostModalOpen(false)}
                    className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">المنصة المستهدفة:</label>
                      <select
                        value={newPostPlatform}
                        onChange={(e) => setNewPostPlatform(e.target.value as any)}
                        className="w-full p-2.5 border border-stone-300 rounded-xl bg-stone-50"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="facebook">Facebook</option>
                        <option value="whatsapp">واتساب WhatsApp</option>
                        <option value="telegram">تلجرام Telegram</option>
                        <option value="twitter">تويتر X</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">نوع المحتوى:</label>
                      <select
                        value={newPostMediaType}
                        onChange={(e) => setNewPostMediaType(e.target.value as any)}
                        className="w-full p-2.5 border border-stone-300 rounded-xl bg-stone-50"
                      >
                        <option value="reel">فيديو ريلز (Reel)</option>
                        <option value="image">صورة فردية (Post)</option>
                        <option value="carousel">ألبوم صور (Carousel)</option>
                        <option value="story">ستوري (Story)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">عنوان الفكرة / المنشور:</label>
                    <input
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="مثال: ريلز استوديو التصميم وتجربة الأم"
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">نص المنشور والهاشتاجات (الكابشن):</label>
                    <textarea
                      rows={4}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="اكتبي محتوى المنشور الجذاب والهاشتاجات ورابط المتجر..."
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-sans"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">موعد النشر المقترح:</label>
                    <input
                      type="text"
                      value={newPostTime}
                      onChange={(e) => setNewPostTime(e.target.value)}
                      placeholder="اليوم، 8:00 مساءً"
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-stone-200 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddPostModalOpen(false)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-800 text-xs font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newPostTitle || !newPostContent) return;
                      const newP: SocialPostSchedule = {
                        id: `post-${Date.now()}`,
                        platform: newPostPlatform,
                        title: newPostTitle,
                        content: newPostContent,
                        scheduledTime: newPostTime,
                        status: 'scheduled',
                        mediaType: newPostMediaType,
                        mediaUrl: '/src/assets/images/hero_baby_apparel_1790519873737.jpg',
                        targetLink: 'https://2babyprint.eg/#catalog',
                      };
                      handleUpdatePosts([newP, ...postSchedules]);
                      setIsAddPostModalOpen(false);
                      setNewPostTitle('');
                      setNewPostContent('');
                      soundEffects.playCelestialChime();
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-black cursor-pointer shadow-xs"
                  >
                    حفظ وجدولة المنشور
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. TAB 6: CONTINUOUS AI CAMPAIGN LEARNING ENGINE & MARKET OPTIMIZER */}
      {activeTab === 'learning_engine' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-6 rounded-2xl shadow-sm border border-stone-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Zap className="w-4 h-4" />
              <span>محرك التعلّم الذاتي المستمر للحملات وتحليل سلوك السوق (Continuous AI Engine)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              التعلم التلقائي من نتائج الإعلانات السابقة وإدارة السوق وفق الأداء الفعلي
            </h3>
            <p className="text-xs text-stone-300 max-w-3xl leading-relaxed">
              يقوم هذا النظام بتحليل نسب النقر (CTR)، والعائد على الإنفاق (ROAS)، ومتوسط قيمة سلة التسوق للمناطق الجغرافية في القاهرة الكبرى، لتعديل الرسائل الإعلانية وترشيح استراتيجيات الإنتاج والدعاية تلقائياً.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <BarChart3 className="w-4 h-4 text-amber-600" />
                <span>أعلى الشرائح تحويلاً للشراء</span>
              </div>
              <div className="space-y-2 text-xs text-stone-700">
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                  <div className="font-bold text-stone-900">أمهات حوامل يجهزن للسبوع (الأسبوع 32-36)</div>
                  <div className="text-[11px] text-stone-600 mt-1">
                    يحققن عائد إعلاني 5.8x ROAS. الأكثر طلباً: سالوبيتات قطن بيضاء مع التاج الملكي واسم البيبي.
                  </div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900">هدايا الخالات والعمات وأعياد الميلاد الأولى</div>
                  <div className="text-[11px] text-stone-600 mt-1">
                    يحققن أعلى سلة مشتريات (طقم أطفال + تيشيرت مطابق للأم والأب).
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-800">
                <Film className="w-4 h-4 text-purple-600" />
                <span>أفضل زوايا وتكتيكات المحتوى الإعلاني</span>
              </div>
              <div className="space-y-2 text-xs text-stone-700">
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/60">
                  <div className="font-bold text-stone-900">فيديو كواليس طباعة الـ DTF ولمس القماش</div>
                  <div className="text-[11px] text-stone-600 mt-1">
                    يقلل معدل الارتداد بنسبة 42%، ويزيد ثقة العميل بأن الأحبار مائية ناعمة لا تؤذي جلد الرضيع.
                  </div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900">تجربة الأم أثناء كتابة الاسم بالاستوديو الحي</div>
                  <div className="text-[11px] text-stone-600 mt-1">
                    العميل يشعر أنه الصانع المباشر لقطعة طفله مما يرفع قرار الإتمام بنسبة 35%.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>سلوكيات التوصيل والتحويل السريع</span>
              </div>
              <div className="space-y-2 text-xs text-stone-700">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
                  <div className="font-bold text-stone-900">خيار التوصيل الفوري (أوبر سكوتر)</div>
                  <div className="text-[11px] text-stone-600 mt-1">
                    28% من طلبات عطلة نهاية الأسبوع تختار التوصيل المستعجل لحضور مناسبات سبوع أو جلسات تصوير فجائية.
                  </div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900">الدفع عبر إنستاباي والمحافظ</div>
                  <div className="text-[11px] text-stone-600 mt-1">
                    رفع سرعة إرسال أوامر الطباعة للمطبعة من 4 ساعات إلى أقل من 15 دقيقة بعد رفع إيصال التحويل.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Recommendations from AI */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>توصيات الذكاء الاصطناعي التشغيلية للأسبوع القادم:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">1. رفع ميزانية إعلانات السبوع بنسبة 20%</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">أولوية عالية</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  تظهر بيانات السوق ارتفاعاً في معدلات المواليد في الربع الحالي بالقاهرة، مما يجعل زيادة ميزانية حملة السبوع تعود بـ ROAS يقارب 5.2x.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">2. إرسال 5 باقات إهداء إضافية لصانعات محتوى التيك توك</span>
                  <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded">توسع وانتشار</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  فيديوهات فتح الطرد (Unboxing) لملابس الأطفال بأسماء الصغار تحقق تفاعلاً طبيعياً أعلى بـ 3 أضعاف من الإعلانات الصامتة.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. TAB: SHORT VIDEO & REEL SIMULATOR */}
      {activeTab === 'short_video' && (
        <ShortVideoReelStudio
          initialBabyName={visualCustomName || 'نوح 👑'}
          productName={selectedProduct}
          targetLandingUrl={getTargetLandingUrl()}
          onExportToSocial={(_scriptText) => {
            handleExportDraftToSocial();
          }}
        />
      )}

      {/* 10. TAB: AUDIO EFFECTS & VOICEOVER STUDIO */}
      {activeTab === 'audio_effects' && (
        <AudioEffectsStudio />
      )}

      {/* 11. TAB: INTERNAL STORE PAGE LINKS & UTM QR BUILDER */}
      {activeTab === 'page_links' && (
        <InternalPageLinkBuilder
          products={products}
          currentPlatform={selectedPlatform}
          initialBabyName={visualCustomName || 'نوح 👑'}
          onUrlGenerated={(_url, pageKey) => {
            setTargetPageKey(pageKey as any);
          }}
        />
      )}

      {/* UNIVERSAL OMNI-CHANNEL EXPORT MODAL */}
      {exportModalCampaign && (
        <UniversalExportModal
          campaign={exportModalCampaign}
          onClose={() => setExportModalCampaign(null)}
        />
      )}
    </div>
  );
};

