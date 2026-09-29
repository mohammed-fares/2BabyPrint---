import React, { useState } from 'react';
import {
  Sparkles,
  Shirt,
  Palette,
  Truck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface HowItWorksTutorialProps {
  lang: Language;
  onStartDesigning: () => void;
  onExploreCatalog: () => void;
}

export const HowItWorksTutorial: React.FC<HowItWorksTutorialProps> = ({
  lang,
  onStartDesigning,
  onExploreCatalog,
}) => {
  const isEn = lang === 'en';
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      icon: Shirt,
      titleAr: '1. اختاري القطعة والمقاس المناسب',
      titleEn: '1. Pick the Garment & Size',
      descAr:
        'استعرضي تشكيلتنا من حديثي الولادة وحتى 10 سنوات: سالوبيتات سبوع قطنية، مرايل ناعمة، تيشرتات، أو هوديز شتوية بخامات قطن مصري 100% طبيعي.',
      descEn:
        'Browse our 100% certified Egyptian cotton collection from newborns to 10 years: pure white rompers, soft bibs, tees, or cozy hoodies.',
      tipAr: '💡 جدول المقاسات بالسنتيمتر والوزن متاح بضغطة زر لمساعدتك.',
      tipEn: '💡 Clear weight & height sizing charts are accessible in one tap.',
      color: 'from-amber-500 to-amber-600',
    },
    {
      step: 2,
      icon: Palette,
      titleAr: '2. صممي الاسم والرسومات في الاستوديو الحي',
      titleEn: '2. Customize in Live Studio',
      descAr:
        'ادخلي استوديو التصميم التفاعلي: اكتبي اسم طفلك بالخط العربي أو الإنجليزي، اختاري تيجان ملكية أو رسومات كرتونية، أو ارفعي رسمتك المفضلة وعايني النتيجة 3D قبل الطباعة.',
      descEn:
        'Open our interactive design studio: type your baby name in curated Arabic/English fonts, add crests or cute clipart, and preview 3D mockup live.',
      tipAr: '💡 التصميم مجاني بالكامل ويمكنك تعديله كما تحبين قبل الاعتماد.',
      tipEn: '💡 Designing is 100% free and editable anytime before checkout.',
      color: 'from-rose-500 to-amber-500',
    },
    {
      step: 3,
      icon: Truck,
      titleAr: '3. ادفعي بأمان واستلمي في 48 ساعة',
      titleEn: '3. Secure Pay & Fast 48h Delivery',
      descAr:
        'أكدي طلبك بالدفع الإلكتروني المسبق الموثوق (إنستاباي أو المحافظ الإلكترونية)، لتبدأ المطبعة فوراً بالطباعة الرقمية DTF والتغليف الفاخر والتوصيل لباب بيتك في القاهرة والجيزة.',
      descEn:
        'Confirm with secure verified prepayment (InstaPay or Smart Wallets), and our print house immediately begins DTF production with doorstep Cairo shipping.',
      tipAr: '💡 خيار الشحن الفوري مع أوبر سكوتر متاح لتسليم نفس اليوم!',
      tipEn: '💡 Instant Uber Scooter same-day dispatch option available!',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section className="py-12 md:py-18 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{isEn ? 'Simple & Easy 3-Step Guide' : 'دليل بسيط: كيف يعمل استوديو 2BabyPrint؟'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {isEn
              ? 'How to Create Cherished Baby Outfits in Minutes'
              : 'صممي قطعة طفلك واستلميها في 3 خطوات سهلة وممتعة'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            {isEn
              ? 'No design experience needed. Personalize memorable Egyptian cotton garments effortlessly from your phone.'
              : 'لا تحتاجي لأي خبرة سابقة بالتصميم. من هاتفك وبلمسات بسيطة تصنعين هدية سبوع أو طقم عيد ميلاد لا يُنسى.'}
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {steps.map((st) => {
            const Icon = st.icon;
            const isSelected = activeStep === st.step;
            return (
              <div
                key={st.step}
                onClick={() => setActiveStep(st.step)}
                className={`relative rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50/40 shadow-md ring-2 ring-amber-300/40 -translate-y-1'
                    : 'border-stone-200 bg-stone-50/60 hover:border-amber-200 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono font-extrabold text-xs px-2.5 py-1 rounded-full bg-stone-200/70 text-stone-700">
                      STEP {st.step}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base mb-2">
                    {isEn ? st.titleEn : st.titleAr}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {isEn ? st.descEn : st.descAr}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/80 text-[11px] text-amber-900 font-medium">
                  {isEn ? st.tipEn : st.tipAr}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Action Bar */}
        <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50 p-6 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">
                {isEn ? 'Ready to try it yourself?' : 'جاهزة لتجربة التصميم بنفسك الآن؟'}
              </h4>
              <p className="text-xs text-stone-600">
                {isEn
                  ? 'Pick any romper, tee, or hoodie and see your baby’s name right away.'
                  : 'اختاري أي قطعة من الكتالوج واكتبي اسم طفلك وشوفي النتيجة لايف مجاناً.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onExploreCatalog}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <span>{isEn ? 'Choose Garment & Start' : 'اختاري الموديل وابدئي'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
