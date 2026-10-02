import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Copy,
  Check,
  Smartphone,
  Music,
  Mic,
  Clock,
  Layers,
  Heart,
  Palette,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffectsPlayer';

interface VideoScene {
  id: number;
  timeRange: string;
  startSec: number;
  endSec: number;
  title: string;
  visualDesc: string;
  voiceoverLine: string;
  soundCue: 'baby_giggle' | 'typewriter' | 'press' | 'chime';
  soundLabel: string;
  badgeText: string;
  imageUrl: string;
}

interface ShortVideoReelStudioProps {
  initialBabyName?: string;
  productName?: string;
  targetLandingUrl?: string;
  onExportToSocial?: (scriptText: string) => void;
}

export const ShortVideoReelStudio: React.FC<ShortVideoReelStudioProps> = ({
  initialBabyName = 'نوح 👑',
  productName = 'سالوبيت سبوع قطن مصري فاخر',
  targetLandingUrl = 'https://2babyprint.eg/#studio',
  onExportToSocial,
}) => {
  const [babyName, setBabyName] = useState(initialBabyName);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 15 seconds
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVoiceoverEnabled, setIsVoiceoverEnabled] = useState(true);
  const [voiceAccent, setVoiceAccent] = useState<'ar-EG' | 'ar-SA'>('ar-EG');
  const [copiedNotice, setCopiedNotice] = useState(false);

  const scenes: VideoScene[] = [
    {
      id: 1,
      timeRange: '0 - 3 ثوانٍ',
      startSec: 0,
      endSec: 3,
      title: '1. الهوك البصري العاطفي (Hook)',
      visualDesc: 'لقطة مقربة لأصابع طفل رضيع نائم يرتدي سالوبيت قطني أبيض فائق النعومة، مع مظهر خامات القطن المصري الطبيعي 100%.',
      voiceoverLine: `أول فرحة لطفلك في السبوع لازم تبدأ بقطعة خاصة جداً مصنوعة باسمه..`,
      soundCue: 'baby_giggle',
      soundLabel: '👶 ضحكة بيبي ناعمة',
      badgeText: 'قطن مصري 100% لبشرة المواليد',
      imageUrl: '/src/assets/images/hero_baby_apparel_1790519873737.jpg',
    },
    {
      id: 2,
      timeRange: '3 - 7 ثوانٍ',
      startSec: 3,
      endSec: 7,
      title: '2. تجربة استوديو التصميم الحي (Studio UX)',
      visualDesc: `شاشة الموبايل توضح الأم وهي تكتب اسم "${babyName}" وتختار رسمة التاج الملكي في ثوانٍ مع المعاينة الفورية قبل الطلب.`,
      voiceoverLine: `ادخلي استوديو 2BabyPrint الحي، اكتبي اسم ${babyName} واختاري رسمتك المفضلة بنفسك!`,
      soundCue: 'typewriter',
      soundLabel: '⌨️ نقرات كتابة الاسم بالاستوديو',
      badgeText: 'معاينة مباشرة في الاستوديو',
      imageUrl: '/src/assets/images/product_romper_studio_1790519885828.jpg',
    },
    {
      id: 3,
      timeRange: '7 - 11 ثانية',
      startSec: 7,
      endSec: 11,
      title: '3. كواليس الطباعة الرقمية والتغليف (Behind the Scenes)',
      visualDesc: 'مكبس الطباعة الرقمية DTF بالبخار الناعم بدون أي ملمس خشن، وفحص نعومة الألوان المائية المقاومة للغسيل المتكرر، وتغليف الطرد الفاخر.',
      voiceoverLine: `طباعة رقمية بأحبار مائية بيئية معتمدة لا تسبب أي حساسية، وجودة تدوم مع كل غسلة.`,
      soundCue: 'press',
      soundLabel: '💨 صوت مكبس الطباعة بالبخار',
      badgeText: 'أحبار مائية ناعمة خالية من الحساسية',
      imageUrl: '/src/assets/images/product_hoodie_kids_1790519897372.jpg',
    },
    {
      id: 4,
      timeRange: '11 - 15 ثانية',
      startSec: 11,
      endSec: 15,
      title: '4. العرض الختامي والدعوة للإجراء (Call to Action)',
      visualDesc: `ظهور السالوبيت النهائي المطبوع عليه اسم "${babyName}" مع بوكس هدايا السبوع، وشريط التوصيل الفوري (أوبر سكوتر) في القاهرة والجيزة.`,
      voiceoverLine: `صممي قطعة السبوع الآن ويوصلك الطرد لباب بيتك فوراً مع خيار الشحن السريع!`,
      soundCue: 'chime',
      soundLabel: '✨ رنين النجاح وتأكيد الحجز',
      badgeText: 'متاح شحن اليوم (أوبر سكوتر) 🚀',
      imageUrl: '/src/assets/images/hero_baby_apparel_1790519873737.jpg',
    },
  ];

  // Current active scene based on currentTime
  const activeSceneIndex = Math.min(
    scenes.findIndex((s) => currentTime >= s.startSec && currentTime < s.endSec),
    scenes.length - 1
  );
  const currentScene = scenes[activeSceneIndex >= 0 ? activeSceneIndex : 0];

  // Playback timer ticker
  const playedSoundsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= 15) {
            setIsPlaying(false);
            soundEffects.stopVoiceover();
            return 0;
          }
          return parseFloat(next.toFixed(1));
        });
      }, 100);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Audio triggering on scene transition
  useEffect(() => {
    if (!isPlaying) return;

    scenes.forEach((scene) => {
      // Trigger sound when within 0.2s of start
      if (Math.abs(currentTime - scene.startSec) < 0.15 && !playedSoundsRef.current.has(scene.id)) {
        playedSoundsRef.current.add(scene.id);

        if (!isAudioMuted) {
          soundEffects.playEffect(scene.soundCue);
        }

        if (isVoiceoverEnabled) {
          soundEffects.speakVoiceover(scene.voiceoverLine, voiceAccent);
        }
      }
    });
  }, [currentTime, isPlaying, isAudioMuted, isVoiceoverEnabled, voiceAccent, scenes]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      soundEffects.stopVoiceover();
    } else {
      if (currentTime >= 14.8) {
        setCurrentTime(0);
        playedSoundsRef.current.clear();
      }
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    playedSoundsRef.current.clear();
    soundEffects.stopVoiceover();
    setIsPlaying(true);
  };

  // Export full script
  const fullScriptText = `🎬 سيناريو ومخطط تصوير فيديو ريلز / تيك توك (2BabyPrint Egypt):
المنتج: ${productName}
اسم الطفل المقترح: ${babyName}
المدة الكلية: 15 ثانية

المشهد 1 (0-3 ثوانٍ): ${scenes[0].title}
- اللقطة: ${scenes[0].visualDesc}
- التعليق الصوتي: "${scenes[0].voiceoverLine}"
- المؤثر الصوتي: ${scenes[0].soundLabel}

المشهد 2 (3-7 ثوانٍ): ${scenes[1].title}
- اللقطة: ${scenes[1].visualDesc}
- التعليق الصوتي: "${scenes[1].voiceoverLine}"
- المؤثر الصوتي: ${scenes[1].soundLabel}

المشهد 3 (7-11 ثانية): ${scenes[2].title}
- اللقطة: ${scenes[2].visualDesc}
- التعليق الصوتي: "${scenes[2].voiceoverLine}"
- المؤثر الصوتي: ${scenes[2].soundLabel}

المشهد 4 (11-15 ثانية): ${scenes[3].title}
- اللقطة: ${scenes[3].visualDesc}
- التعليق الصوتي: "${scenes[3].voiceoverLine}"
- المؤثر الصوتي: ${scenes[3].soundLabel}

رابط الصفحة المباشر: ${targetLandingUrl}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(fullScriptText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 text-white flex items-center justify-center shadow-md">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-stone-900">
                استوديو ومحاكي الفيديو القصير والريلز الذكي (9:16 Reel Simulator)
              </h3>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                AI Storyboard
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              توليد ومحاكاة فيديوهات ريلز وتيك توك التفاعلية مشهد بمشهد مع المؤثرات الصوتية والتعليق الصوتي المباشر
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyScript}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedNotice ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedNotice ? 'تم نسخ السيناريو ✓' : 'نسخ السيناريو الكامل'}</span>
          </button>

          {onExportToSocial && (
            <button
              type="button"
              onClick={() => onExportToSocial(fullScriptText)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>تصدير لوسائل التواصل</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left is Simulator, Right is Scene Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left (5 cols): Mobile Reel Frame Player */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[310px] bg-stone-950 text-white rounded-[40px] p-3 shadow-2xl border-4 border-stone-800 overflow-hidden relative font-sans">
            {/* Camera / Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-900 rounded-full z-30" />

            {/* Simulated 9:16 Video Canvas */}
            <div className="relative aspect-[9/16] rounded-[32px] overflow-hidden bg-stone-900 flex flex-col justify-between">
              {/* Active Scene Background Image */}
              <img
                src={currentScene.imageUrl}
                alt={currentScene.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 filter brightness-95"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-transparent to-stone-950/60 pointer-events-none" />

              {/* Top Bar inside Screen */}
              <div className="relative z-20 p-4 pt-6 flex items-center justify-between text-xs">
                <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-300 border border-white/10">
                  {currentScene.timeRange}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-md font-black animate-pulse">
                    REC
                  </span>
                  <span className="font-mono text-xs text-white/90">{currentTime.toFixed(1)}s / 15s</span>
                </div>
              </div>

              {/* Center Overlay: Baby Name Live Stamp on Romper */}
              <div className="relative z-20 px-4 text-center my-auto">
                <div className="inline-block bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400/60 shadow-lg transform hover:scale-105 transition-transform">
                  <span className="text-[10px] text-amber-300 block font-bold">استوديو 2BabyPrint الحي</span>
                  <span className="text-xl font-black text-white tracking-wide">{babyName}</span>
                </div>

                {/* Animated Badge */}
                <div className="mt-3">
                  <span className="inline-block bg-amber-500 text-stone-950 font-black text-[10px] px-3 py-1 rounded-full shadow-md animate-bounce">
                    {currentScene.badgeText}
                  </span>
                </div>
              </div>

              {/* Bottom Details & Subtitle */}
              <div className="relative z-20 p-4 space-y-2">
                {/* Simulated Audio Track Pill */}
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-stone-300 self-start">
                  <Music className="w-3 h-3 text-amber-400 animate-spin" />
                  <span className="truncate max-w-[180px]">{currentScene.soundLabel}</span>
                </div>

                {/* Dynamic Voiceover Subtitle Overlay */}
                <div className="bg-black/75 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-[11px] leading-snug text-white font-medium text-right">
                  <span className="text-amber-400 font-bold block mb-0.5 text-[10px]">🎙️ التعليق الصوتي:</span>
                  <p className="line-clamp-2">{currentScene.voiceoverLine}</p>
                </div>

                {/* Progress Bar Line */}
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-100"
                    style={{ width: `${(currentTime / 15) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="flex items-center justify-between px-2 pt-3 pb-1 text-white">
              <button
                type="button"
                onClick={handleRestart}
                className="p-2 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="إعادة تشغيل من البداية"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer font-bold"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAudioMuted(!isAudioMuted);
                  if (!isAudioMuted) soundEffects.stopVoiceover();
                }}
                className="p-2 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title={isAudioMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم الصوت'}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs text-stone-600">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>محاكي ريلز تفاعلي بأبعاد 9:16</span>
            </span>
          </div>
        </div>

        {/* Right (7 cols): Storyboard Scenes & Customizer */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Customizer Bar */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                اسم الطفل المعروض بالريلز:
              </label>
              <input
                type="text"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                placeholder="مثال: زين، ليلى، نوح"
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                لهجة التعليق الصوتي التلقائي:
              </label>
              <select
                value={voiceAccent}
                onChange={(e) => setVoiceAccent(e.target.value as any)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800"
              >
                <option value="ar-EG">مصرية دافئة (Egyptian)</option>
                <option value="ar-SA">خليجية فصحى (Gulf / Standard)</option>
              </select>
            </div>
          </div>

          {/* Scene by Scene Timeline */}
          <div className="space-y-3">
            {scenes.map((scene, idx) => {
              const isActive = activeSceneIndex === idx;
              return (
                <div
                  key={scene.id}
                  onClick={() => {
                    setCurrentTime(scene.startSec);
                    if (!isPlaying) {
                      soundEffects.playEffect(scene.soundCue);
                      if (isVoiceoverEnabled) soundEffects.speakVoiceover(scene.voiceoverLine, voiceAccent);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-50/70 border-amber-500 shadow-xs ring-1 ring-amber-400'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-stone-900 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                        {scene.id}
                      </span>
                      <h4 className="font-bold text-xs text-stone-900">{scene.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                        {scene.timeRange}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEffects.playEffect(scene.soundCue);
                        }}
                        className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[10px] font-bold"
                        title="تجربة الصوت"
                      >
                        {scene.soundLabel}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mb-2">
                    <strong className="text-stone-800">الكاميرا والمشهد: </strong>
                    {scene.visualDesc}
                  </p>

                  <div className="p-2.5 bg-white rounded-xl border border-stone-200/80 text-xs text-stone-800">
                    <span className="font-bold text-amber-800 block text-[10px] mb-0.5">
                      🎙️ جملة التعليق الصوتي:
                    </span>
                    <p className="italic">"{scene.voiceoverLine}"</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
