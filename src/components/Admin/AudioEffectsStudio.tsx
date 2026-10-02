import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  Play,
  RotateCcw,
  Mic,
  Music,
  Check,
  Download,
  Copy,
  Sliders,
  Radio,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffectsPlayer';

interface SoundItem {
  key: 'baby_giggle' | 'typewriter' | 'press' | 'chime' | 'lullaby';
  title: string;
  category: string;
  timing: string;
  description: string;
  idealFor: string;
  icon: string;
  color: string;
}

export const AudioEffectsStudio: React.FC = () => {
  const [activePlayingKey, setActivePlayingKey] = useState<string | null>(null);
  const [customVoiceoverText, setCustomVoiceoverText] = useState(
    'أول فرحة لطفلك في السبوع لازم تبدأ بقطعة خاصة جداً مصنوعة باسمه من أنقى قطن مصري.. صمميها بنفسك الآن في استوديو 2BabyPrint.'
  );
  const [voiceLang, setVoiceLang] = useState<'ar-EG' | 'ar-SA'>('ar-EG');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedSoundGuidance, setCopiedSoundGuidance] = useState(false);

  const sounds: SoundItem[] = [
    {
      key: 'baby_giggle',
      title: 'ضحكة طفل ناعمة (Baby Coo / Giggle)',
      category: 'عاطفة وجذب انتباه',
      timing: '0 - 2 ثوانٍ',
      description: 'نغمة صوتية تحاكي ضحكة طفل رضيع ناعمة لجذب انتباه الأمهات في أول ثانيتين من الريلز أو الفيديو الإعلاني.',
      idealFor: 'ريلز السبوع، ستوري الترحيب بالمولود، وإعلانات هدايا المواليد.',
      icon: '👶',
      color: 'from-amber-400 to-amber-600',
    },
    {
      key: 'typewriter',
      title: 'صوت كتابة الاسم بالاستوديو (Typewriter Pop)',
      category: 'تفاعل وتخصيص',
      timing: '3 - 6 ثوانٍ',
      description: 'نغمات نقر رقيقة تحاكي تجربة كتابة اسم المولود وتعديله لحظياً في استوديو التصميم الحي على الموك آب.',
      idealFor: 'فيديوهات كواليس التصميم، إعلانات أداة التخصيص التفاعلية.',
      icon: '⌨️',
      color: 'from-sky-400 to-sky-600',
    },
    {
      key: 'press',
      title: 'مكبس الطباعة الرقمية بالبخار (DTF Heat Press)',
      category: 'ثقة وجودة المصنع',
      timing: '7 - 10 ثوانٍ',
      description: 'صوت بخار خفيف يحاكي تثبيت الأحبار المائية البيئية بدقة على قماش القطن المصري بدون أي ملمس خشن.',
      idealFor: 'فيديوهات كواليس المطبعة، بناء الثقة الطبية للأكزيما وبشرة الرضع.',
      icon: '💨',
      color: 'from-rose-400 to-rose-600',
    },
    {
      key: 'chime',
      title: 'رنين البراند الفاخر والنجاح (Celestial Chime)',
      category: 'تأكيد الحجز والدعوة للإجراء',
      timing: '11 - 15 ثانية',
      description: 'رنين ذهبي متناغم رباعي النغمات يضفي طابع الفخامة الملكية ويحفز على إتمام الشراء الفوري واختيار الشحن السريع.',
      idealFor: 'نهاية الفيديوهات، ظهور كود الخصم، وتأكيد حجز الطلب.',
      icon: '✨',
      color: 'from-emerald-400 to-emerald-600',
    },
    {
      key: 'lullaby',
      title: 'صندوق موسيقى التهويدة (Music Box Lullaby)',
      category: 'سكينة وهدوء للأم والطفل',
      timing: 'خلفية كاملة',
      description: 'عزف رقيق على طريقة صندوق الموسيقى الكلاسيكي لتهدئة الطفل وإشعار الأم بالدفء والحنان العائلي.',
      idealFor: 'موسيقى خلفية لحملات المواليد الجدد والسبوع وأطقم النوم القطنية.',
      icon: '🎵',
      color: 'from-purple-400 to-purple-600',
    },
  ];

  const handlePlaySound = (key: 'baby_giggle' | 'typewriter' | 'press' | 'chime' | 'lullaby') => {
    setActivePlayingKey(key);
    soundEffects.playEffect(key);
    setTimeout(() => {
      setActivePlayingKey((curr) => (curr === key ? null : curr));
    }, 1500);
  };

  const handleTestVoiceover = () => {
    if (isSpeaking) {
      soundEffects.stopVoiceover();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      soundEffects.speakVoiceover(customVoiceoverText, voiceLang, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleCopyGuidance = () => {
    const text = `دليل المؤثرات الصوتية والموسيقى لحملات 2BabyPrint Egypt:
${sounds
  .map(
    (s, i) => `${i + 1}. [${s.timing}] ${s.title}:
- التصنيف: ${s.category}
- الاستخدام الأمثل: ${s.idealFor}
- الوصف الفني: ${s.description}`
  )
  .join('\n\n')}

نص التعليق الصوتي المقترح:
"${customVoiceoverText}"`;

    navigator.clipboard.writeText(text);
    setCopiedSoundGuidance(true);
    setTimeout(() => setCopiedSoundGuidance(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-stone-900">
                مركز المؤثرات الصوتية والنغمات والتعليق الصوتي (AI Audio & Sound FX)
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                Web Audio Synthesizer
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              توليد وعزف المؤثرات الصوتية للأطفال ومكبس الطباعة ورنين البراند مباشرة في المتصفح مع اختبار الصوت المباشر
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyGuidance}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          {copiedSoundGuidance ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copiedSoundGuidance ? 'تم نسخ التوجيهات ✓' : 'نسخ دليل المؤثرات للمونتاج'}</span>
        </button>
      </div>

      {/* Sound Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sounds.map((s) => {
          const isPlaying = activePlayingKey === s.key;
          return (
            <div
              key={s.key}
              className={`p-5 rounded-2xl border transition-all space-y-3 relative overflow-hidden ${
                isPlaying
                  ? 'border-amber-500 bg-amber-50/60 shadow-md ring-1 ring-amber-400'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              {/* Sound Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-xl shadow-2xs">
                    {s.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900 leading-snug">{s.title}</h4>
                    <span className="text-[10px] text-stone-500 block">{s.category}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                  {s.timing}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed min-h-[48px]">
                {s.description}
              </p>

              {/* Best Used For */}
              <div className="p-2 bg-stone-50 rounded-xl text-[11px] text-stone-700">
                <strong className="text-stone-900">الاستخدام الأمثل: </strong>
                <span>{s.idealFor}</span>
              </div>

              {/* Play Button */}
              <button
                type="button"
                onClick={() => handlePlaySound(s.key)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isPlaying ? 'animate-spin' : ''}`} />
                <span>{isPlaying ? 'جاري العزف التفاعلي...' : 'عزف المؤثر الصوتي الآن'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Voiceover Testing Lab (Speech Synthesis) */}
      <div className="p-6 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl shadow-sm border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-sm text-white">
              مختبر التعليق الصوتي المباشر (Spoken Voiceover Simulator):
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">اللهجة:</span>
            <select
              value={voiceLang}
              onChange={(e) => setVoiceLang(e.target.value as any)}
              className="bg-stone-800 border border-stone-700 text-white text-xs rounded-xl px-2.5 py-1 font-medium"
            >
              <option value="ar-EG">مصرية دافئة (Egyptian)</option>
              <option value="ar-SA">خليجية فصحى (Saudi / Gulf)</option>
            </select>
          </div>
        </div>

        <textarea
          rows={3}
          value={customVoiceoverText}
          onChange={(e) => setCustomVoiceoverText(e.target.value)}
          className="w-full bg-stone-950/80 border border-stone-700 rounded-xl p-3 text-xs leading-relaxed text-stone-100 placeholder-stone-500"
          placeholder="اكتبي نص التعليق الصوتي لتجربة نطقه الصوتي..."
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-stone-400">
            يستخدم محرك النطق الصوتي المباشر في المتصفح لمحاكاة صوت المعلق الإعلاني
          </span>

          <button
            type="button"
            onClick={handleTestVoiceover}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-black'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'إيقاف النطق الصوتي' : 'استماع للتعليق الصوتي الآن 🎙️'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
