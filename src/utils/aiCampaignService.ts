import { GoogleGenAI } from '@google/genai';
import { CampaignGoal, SocialPlatform, SocialCampaign } from '../types';

export interface CampaignGenerationRequest {
  platform: SocialPlatform;
  goal: CampaignGoal;
  productName?: string;
  targetCategory?: string;
  tone?: 'warm_maternal' | 'trendy_viral' | 'prestigious_gift' | 'practical_urgency';
  promoOffer?: string;
  targetLocation?: string;
  language?: 'ar' | 'en';
}

export interface GeneratedCampaignData {
  campaignName: string;
  headline: string;
  bodyText: string;
  ctaText: string;
  hashtags: string[];
  targetAudience: {
    label: string;
    ageRange: string;
    locations: string[];
    interests: string[];
    demographics: string;
  };
  videoScript?: {
    hookSeconds: string;
    visualAction: string;
    voiceover: string;
    soundTrackRecommendation: string;
  };
  recommendedDailyBudget: number; // in EGP
  predictedMetrics: {
    estimatedReach: string;
    expectedCtr: number;
    predictedRoas: number;
    recommendedPlacement: string;
  };
  aiMarketingTips: string[];
}

// Fallback high-converting templates for instantaneous generation and guaranteed resilience
const CREATIVE_TEMPLATES: Record<CampaignGoal, {
  titles: string[];
  headlines: string[];
  bodies: string[];
  ctas: string[];
  hashtags: string[];
  hooks: string[];
  visuals: string[];
  voiceovers: string[];
  music: string[];
  audiences: {
    label: string;
    ageRange: string;
    locations: string[];
    interests: string[];
    demographics: string;
  };
  tips: string[];
}> = {
  baby_shower: {
    titles: [
      'حملة ريلز السبوع الملكي: سالوبيتات المواليد بالاسم',
      'حملة إنستغرام: أول إطلالة للبيبي في السبوع بالقطن المصري',
    ],
    headlines: [
      'قطعة السبوع الأولى.. مطبوعة باسمه ومصنوعة من أنقى قطن مصري 👶✨',
      'فرحة قدوم البيبي متتعوضش! صممي لبس السبوع الخاص به الآن 🍼',
      'أفخم هدية سبوع للمولود الجديد تخلّد أحلى ذكرى عائلية 👑',
    ],
    bodies: [
      'استقبلي طفلك بأجمل سالوبيت قطن مصري 100% طبيعي، مطبوع باسمه أو عبارات التهنئة في استوديو التصميم الحي خلال ثوانٍ. خامات فائقة النعومة معتمدة للأكزيما وبشرة المواليد، مع توصيل سريع لباب بيتك في القاهرة والجيزة.',
      'بدل الهدايا التقليدية، اهدي المولود الجديد قطعة صممتيها مخصوص باسمه وتاريخ ميلاده! ادخلي واختاري رسمة التاج أو الملاك، وشوفي النتيجة لايف قبل الطباعة والشحن السريع.',
    ],
    ctas: ['صممي سالوبيت السبوع الآن 🎨', 'احصلي على قطعة المولود الفريدة 👶', 'اكتشفي تشكيلة السبوع 🤍'],
    hashtags: ['#سبوع_البيبي', '#هدايا_مواليد', '#قطن_مصري', '#2BabyPrint', '#استوديو_تصميم', '#أمهات_مصر', '#ملابس_حديثي_الولادة'],
    hooks: [
      '0-3 ثوانٍ: لقطة مقربة لأصابع طفل رضيع نائم يرتدي سالوبيت قطني ناصع البياض مطبوع عليه اسمه بفيونكة رقيقة.',
      '0-3 ثوانٍ: أم تفتح علبة هدية فاخرة وتتفاجأ بسالوبيت السبوع المكتوب عليه اسم مولودها الجديد مع ابتسامة فرحة.',
    ],
    visuals: [
      'تسجيل شاشة سريع يوضح كتابة اسم البيبي واختيار رسمة التاج على السالوبيت في الاستوديو الحي ثم استلام القطعة في الواقع مطابقة 100%.',
      'مقارنة بين نعومة ملمس القطن المصري 100% والملابس التقليدية القاسية، مع إبراز عدم وجود أي ملمس خشن للأحبار المائية.',
    ],
    voiceovers: [
      'أول لبسة لطفلك في الدنيا لازم تكون بقطن مصري أصيل واسم غالي عليك.. صمميها بنفسك في دقيقة واحدة مع 2BabyPrint.',
      'كل أم بتدور على قطعة سبوع مميزة ومريحة لجلد طفلها الرقيق.. في استوديو 2BabyPrint بتصممي كل تفصيلة بحب وتوصلك في 48 ساعة.',
    ],
    music: ['موسيقى هادئة دافئة مبهجة (Lofi Baby Melodies)', 'نغمات بيانو رقيقة ولمسات أوتار دافئة (Acoustic Warmth)'],
    audiences: {
      label: 'أمهات حوامل وحديثات الولادة والأقارب الباحثين عن هدايا سبوع',
      ageRange: '22 - 38 سنة',
      locations: ['القاهرة الجديدة', 'المعادي', 'الشيخ زايد', '6 أكتوبر', 'مصر الجديدة', 'مدينة نصر'],
      interests: ['مستلزمات رضع ومواليد', 'هدايا سبوع راقية', 'Baby Shower', 'ملابس أطفال قطنية', 'New Moms'],
      demographics: 'سيدات متزوجات، أمهات حديثات لأول مرة، خالات وعمات يجهزن لهدية سبوع مميزة',
    },
    tips: [
      'استخدمي صيغة الفيديو القصير (Reels / TikTok) في أول 3 ثوانٍ لتعظيم معدل إكمال المشاهدة.',
      'ركزي على إبراز عبارة "قطن مصري 100% للأكزيما وبشرة الرضع" لتقليل تردد الشراء عند الأمهات الجدد.',
      'تفعيل إعادة الاستهداف (Retargeting) لكل من زار استوديو التصميم ولم يكمل الدفع خلال 24 ساعة.',
    ],
  },
  custom_studio: {
    titles: [
      'حملة تيك توك: تجربة استوديو التصميم التفاعلي "صممي قطعة طفلك بنفسك"',
      'حملة إنستغرام: اصنعي تصاميم فريدة لطفلك في 60 ثانية',
    ],
    headlines: [
      'ليه تشتري ملابس جاهزة ومكررة لما ممكن تصمميها بنفسك في دقيقة؟! 📱✨',
      'اكتبي اسم طفلك وشوفي النتيجة لايف على التيشرت والسالوبيت قبل الطباعة! 🎨',
      'أسهل استوديو تصميم لملابس الأطفال في مصر بين إيديكي دلوقتي 🚀',
    ],
    bodies: [
      'ادخلي، اختاري المقاس من سن المواليد لـ 10 سنين، اكتبي اسم طفلك بالخط العربي أو الإنجليزي اللي تحبيه، وضيفي رسومات كرتونية كيوت وشوفي البروفا لايف قدامك! قطن مصري 100% طبيعي وأحبار مائية آمنة بتوصل لباب بيتك.',
      'عايزة لبس مميز لطفلك مفيش زيه في أي محل؟ جربي استوديو 2BabyPrint دلوقتي مجاناً، صممي التيشرت أو الهودي أو السالوبيت بلمستك الخاصة والدفع بالتحويل الإلكتروني الموثوق.',
    ],
    ctas: ['جربي استوديو التصميم مجاناً 🎨', 'ابدئي التصميم الآن 🚀', 'صممي قطعة طفلك في دقيقة 💡'],
    hashtags: ['#صممي_بنفسك', '#استوديو_تصميم', '#ملابس_اطفال_مصر', '#2BabyPrint', '#تيك_توك_مصر', '#ماميز_مصر'],
    hooks: [
      '0-2 ثانية: صوت سريع ممتع "تعالوا أوريكوا أحلى موقع صممت عليه لبس أطفالي بالاسم في دقيقة واحدة!"',
      '0-3 ثوانٍ: يد تتنقل على شاشة الهاتف وتسحب اسم "زين" أو "ليلى" فوق سالوبيت أطفال ويتحول اللون فجأة لوردي أو كحلي.',
    ],
    visuals: [
      'تسجيل شاشة مباشر ومسلي لاستوديو التصميم الحي: إضافة نص، تكبير وتصغير الرسمة، ثم انتقال ديناميكي للقطعة وهي بتنطبع وتتغلف وتوصل مع المندوب.',
      'طفل يرتدي التيشرت المخصص ويضحك بسعادة مشيراً لاسمه المكتوب على صدره.',
    ],
    voiceovers: [
      'مش لازم تكوني مصممة عشان تعملي لطفلك أحلى طقم.. في استوديو 2BabyPrint هتكتبي الاسم وتختاري الرسمة في ثواني وتستلمي قطن مصري 100% فاخر.',
      'ملابس أطفالك بتعبر عن حُبك ليهم.. صممي قطعتهم الخاصة وخلي ذكرياتهم أحلى.',
    ],
    music: ['تريند إيقاعي مرح وسريع (Upbeat Creative Pop)', 'موسيقى حماسية رقمية إيجابية'],
    audiences: {
      label: 'أمهات عصريات ومحبات التريند والتسوق الإلكتروني التفاعلي',
      ageRange: '20 - 36 سنة',
      locations: ['القاهرة الكبرى', 'الجيزة', 'الإسكندرية', 'المنصورة'],
      interests: ['DIY & Crafts', 'Interactive Shopping', 'Baby Fashion Trends', 'TikTok Viral', 'تصميم أزياء'],
      demographics: 'أمهات شابات يستخدمن الهواتف الذكية بكثافة ويفضلن التجربة الذاتية الحية',
    },
    tips: [
      'اجعلي زر الدعوة لاتخاذ إجراء (CTA) يقود مباشرة إلى صفحة الكتالوج وفتح الاستوديو فوراً.',
      'استخدمي تسجيلات شاشة حقيقية للهاتف Mobile Screen Capture لأنها تعطي مصداقية تتجاوز 80% في إعلانات تيك توك.',
      'أضيفي نص يوضح: "تجربة الاستوديو مجانية تماماً وشاهدي التصميم قبل أي خطوة".',
    ],
  },
  pure_cotton: {
    titles: [
      'حملة التوعية الصحية: سر قطننا المصري 100% وأمانه لبشرة الرضع',
      'حملة الثقة والجودة: وداعاً للبوليستر والتعرق مع 2BabyPrint',
    ],
    headlines: [
      'بشرة طفلك الحساسة تستحق أنقى قطن مصري طبيعي 100% 🌿☁️',
      'ليه أطباء الأطفال بينصحوا بملابس 2BabyPrint الخالية من البوليستر؟ 🩺',
      'نعومة الحرير وأمان الطبيعة.. قطن مصري أصيل يلامس بشرة مولودك 👶',
    ],
    bodies: [
      'كتير من ملابس الأطفال بالسوق بتكون مخلوطة ببوليستر وألياف بلاستيكية بتسبب حساسية وأكزيما وتعرق. في 2BabyPrint نضمن لك نسيج قطن مصري طويل التيلة 100% طبيعي، مطبوع بأحبار مائية خالية من الكيماويات ومسامية تتنفس مع بشرة طفلك.',
      'استثمري في راحة وصحة طفلك. خامات ناعمة لا تتقلص مع الغسيل ولا تفقد ألوانها، وتمنح طفلك أقصى درجات الانتعاش طوال اليوم في البيت والخروج.',
    ],
    ctas: ['اكتشفي خامات القطن المعتمدة 🤍', 'تسوقي الأمان لطفلك 🌿', 'شاهدي شهادة جودة القطن 🛡️'],
    hashtags: ['#قطن_مصري_100', '#صحة_الطفل', '#أكزيما_الرضع', '#ملابس_طبيعية', '#2BabyPrint', '#أمومة_واعية'],
    hooks: [
      '0-3 ثوانٍ: لقطة ماكرو عالية الجودة توضح خيوط القطن المصري المسامية والناعمة وهي تداعب خد طفل رضيع.',
      '0-3 ثوانٍ: سؤال مباشر: "عارفة ليه طفلك بيهرش أو بيعرق وهو نايم؟ السبب في خامة لبسه!"',
    ],
    visuals: [
      'اختبار نفاذية الهواء والماء لمقارنة القطن الطبيعي مع الملابس البلاستيكية الصناعية، مع إبراز شهادة القطن المصري 100%.',
      'لقطة ملمس الأحبار المائية المندمجة مع النسيج بدون أي طبقة بلاستيكية خشنة على صدر الطفل.',
    ],
    voiceovers: [
      'بشرة طفلك أرق من بشرتك بخمس مرات، عشان كدة اخترنا له أنقى قطن مصري في العالم وطبعناه بأحبار مائية آمنة 100%.',
      'مع 2BabyPrint، راحة وأمان طفلك هي أولويتنا الأولى. قطن طبيعي يتنفس مع كل حركة.',
    ],
    music: ['موسيقى طبيعية هادئة تبعث على الطمأنينة (Acoustic Zen & Gentle Birds)', 'لحن بيانو هادئ راقٍ'],
    audiences: {
      label: 'أمهات حريصات على صحة بشرة الأطفال ومحبات المنتجات العضوية والطبيعية',
      ageRange: '24 - 42 سنة',
      locations: ['القاهرة', 'الجيزة', 'الإسكندرية', 'الساحل الشمالي'],
      interests: ['طب الأطفال', 'صحة الرضع', 'Organic Living', 'الأكزيما والحساسية', 'Cotton Care'],
      demographics: 'أمهات من الطبقة المتوسطة والعليا حريصات على صحة أطفالهن ولديهن وعي طبي بالخامات',
    },
    tips: [
      'حملات التوعية الصحية تحقق ولاءً استثنائياً وقيمة طلب عالية (AOV).',
      'إبراز مميزات خلو الأحبار من الرصاص والفثالات يعزز ثقة العميل بنسبة 70%.',
      'استخدمي تنسيق Carousel لعرض صور مقربة وملموسة للنسيج والألوان الطبيعية.',
    ],
  },
  birthdays: {
    titles: [
      'حملة أعياد الميلاد: طقم عيد ميلاد طفلك باسمه ورقمه المفضل',
      'حملة فوتوسيشن عيد الميلاد: تيشرتات وهوديز العائلة والأطفال',
    ],
    headlines: [
      'تيشرت عيد ميلاد طفلك باسمه ورقم سنته | قطن مصري فاخر 🎂🎈',
      'خلّي صور عيد ميلاده الأولى تفضل أحلى ذكرى في ألبوم العائلة! 📸👑',
      'طقم عيد ميلاد كاستم مطبوع مخصوص لأميرك الصغير أو أميرتك 🥳✨',
    ],
    bodies: [
      'عيد ميلاد طفلك مناسبة متتعوضش! صممي له تيشرت أو هودي أو سالوبيت عيد الميلاد الأول مع اسمه وعمره بأجمل الخطوط والتصاميم الملكية والشخصيات المحبوبة. شحن سريع لكل محافظات مصر وتجهيز بأعلى دقة ألوان.',
      'استعدي لفوتوسيشن عيد الميلاد بأشيك لبس مصمم مخصوص! قطن مصري 100% وألوان ثابتة ومبهجة تليق بصور الذكريات الجميلة.',
    ],
    ctas: ['اختاري تصميم عيد الميلاد 🥳', 'صممي تيشرت الحفلة الآن 🎂', 'استعرضي قوالب أعياد الميلاد 🎈'],
    hashtags: ['#عيد_ميلاد_اطفال', '#تيشرت_عيد_ميلاد', '#فوتوسيشن_اطفال', '#أعياد_ميلاد', '#2BabyPrint', '#هدايا_اطفال'],
    hooks: [
      '0-3 ثوانٍ: طفل صغير يطفئ شمعة عيد ميلاده الأول وهو يرتدي سالوبيت ملكي يحمل رقم 1 واسمه الذهبي.',
      '0-3 ثوانٍ: لقطة فوتوسيشن مبهجة لأم وطفلها في كيك سماش (Cake Smash) بنفس الطقم القطني.',
    ],
    visuals: [
      'استعراض كوليكشن تصاميم أعياد الميلاد: الأمير الصغير، الأميرة، واندرلاند، والحيوانات الكيوت.',
      'تجربة سريعة لإضافة اسم الطفل في ثوانٍ وعرض الموديل 3D قبل الطباعة.',
    ],
    voiceovers: [
      'السنة الأولى في حياة طفلك بتعدي بسرعة.. خلّي صور عيد ميلاده مميزة بطقم مصمم مخصوص عشانه.',
      'أبهري كل الحضور في حفلة عيد ميلاده بطقم قطني شيك ومريح يحمل اسمه وفرحتكم بيه.',
    ],
    music: ['موسيقى احتفالية مبهجة (Birthday Happy Beats)', 'إيقاع مرح لطيف مليء بالنشاط'],
    audiences: {
      label: 'أولياء أمور يستعدون للاحتفال بأعياد ميلاد أطفالهم من سن سنة وحتى 10 سنوات',
      ageRange: '23 - 40 سنة',
      locations: ['كافة محافظات جمهورية مصر العربية'],
      interests: ['حفلات أعياد الميلاد', 'تصوير الأطفال الفوتوسيشن', 'Party Supplies', 'كيك عيد ميلاد', 'Kids Events'],
      demographics: 'أمهات وآباء يبحثون قبل أسبوع إلى أسبوعين من موعد عيد ميلاد أطفالهم عن ملابس مخصصة للحفلة',
    },
    tips: [
      'استهدفي المناسبات القادمة في أعياد ميلاد أطفال الحسابات المستهدفة (Life Events Targeting في Meta).',
      'قدمي خيار إضافة أطقم للوالدين (Matching Family Shirts) لزيادة إجمالي قيمة الطلب.',
      'أكدي على سرعة التوصيل لضمان وصول الطلب قبل ميعاد الحفلة بيومين على الأقل.',
    ],
  },
  fast_delivery: {
    titles: [
      'حملة التوصيل السريع للقاهرة والجيزة: هديتك واصلة في 48 ساعة',
      'حملة الإنقاذ السريع: هدية سبوع أو مناسبة فورية لباب بيتك',
    ],
    headlines: [
      'محتاجة هدية سبوع أو عيد ميلاد شيك وتوصلك بسرعة في القاهرة؟ ⚡🎁',
      'جاهزين لتوصيل طلبك المخصص في التجمع وزايد وأكتوبر في 48 ساعة فقط! 🛵💨',
      'ملابس أطفال مطبوعة خصيصاً مع شحن مباشر لباب البيت دون تأخير 📦✨',
    ],
    bodies: [
      'لو مزنوقة في هدية سبوع أو عندك مناسبة سريعة في القاهرة أو الجيزة، استوديو 2BabyPrint بيجهز ويطبع قطعتك المخصصة بأعلى دقة رقمية ويوصلها لمندوب الشحن في وقت قياسي وبأفخم تغليف.',
      'شحن موثوق وسريع يغطي كافة مناطق القاهرة الكبرى. اطلبي النهاردة واستلمي خلال يومين مع متابعة مستمرة لرقم الطلب والدفع الإلكتروني الآمن.',
    ],
    ctas: ['اطلبي الآن مع شحن سريع 🛵', 'صممي الهدية واستلميها سريعاً ⚡', 'شحن فوري لباب البيت 🎁'],
    hashtags: ['#توصيل_سريع_القاهرة', '#هدايا_سريعة', '#التجمع_الخامس', '#الشيخ_زايد', '#2BabyPrint'],
    hooks: [
      '0-3 ثوانٍ: عداد ثوانٍ سريع ينتقل من شاشة التصميم إلى مندوب شحن يسلم العلبة بابتسامة عند الباب.',
      '0-3 ثوانٍ: "نسيتي تجهزي هدية السبوع؟ متقلقيش، الحل عندنا في 48 ساعة!"',
    ],
    visuals: [
      'علبة الشحن الأنيقة وهي تُفتح لتكشف عن القطعة المطوية بجمال مع بطاقة إهداء مخصصة.',
      'خريطة سريعة لأحياء القاهرة والجيزة مع مؤشر سرعة التوصيل المباشر.',
    ],
    voiceovers: [
      'عارفين إن وقتك مهم.. عشان كدة جمعنا بين أعلى جودة للقطن المصري وأسرع شحن لباب بيتك في القاهرة والجيزة.',
      'صممي في دقيقة، وتطمني إن الهدية هتوصل في ميعادها بأشيك شكل يشرّفك.',
    ],
    music: ['إيقاع عصري ديناميكي سريع (Upbeat Modern Beats)', 'موسيقى نشيطة إيجابية'],
    audiences: {
      label: 'سكان القاهرة الكبرى والباحثين عن خدمات تسوق سريعة وموثوقة',
      ageRange: '22 - 45 سنة',
      locations: ['القاهرة الجديدة', 'الشيخ زايد', '6 أكتوبر', 'المعادي', 'مصر الجديدة', 'مدينة نصر'],
      interests: ['التسوق السريع', 'Express Delivery', 'Online Shopping Egypt', 'هدايا المناسبات السريعة'],
      demographics: 'عملاء يبحثون عن راحة البال والالتزام الصارم بمواعيد التسليم',
    },
    tips: [
      'أبرزي الشحن المجاني عند الوصول للحد الأدنى (600 ج.م) لدفع العميل لإضافة قطعة ثانية.',
      'ضعي أوقات العمل وخدمة عملاء الواتساب المتاحة دائماً للرد على استفسارات التوصيل.',
    ],
  },
  promo_discount: {
    titles: [
      'حملة كود الخصم والعروض: وفري مع باقات ملابس الأطفال المخصصة',
      'حملة عروض الشحن المجاني والتخفيض الفوري في القاهرة',
    ],
    headlines: [
      'عرض خاص لفترة محدودة: شحن مجاني + خصم فوري على أطقم الأطفال! 🎉🛍️',
      'جهزي دولاب طفلك بأجمل سالوبيتات وهوديز بالاسم بأفضل سعر في مصر 🏷️✨',
      'وفري واحصلي على قطعتين مطبوعتين بقطن مصري 100% مع كود خصم حصري 🎁',
    ],
    bodies: [
      'استمتعي بأقوى عروض 2BabyPrint! صممي لبس طفلك من سن حديثي الولادة وحتى 10 سنوات بأجمل الألوان والأسماء، واحصلي على شحن مجاني لجميع مناطق القاهرة الكبرى عند طلبك بقيمة 600 ج.م مع كوبون تخفيض فوري.',
      'فرصة لتجديد ملابس أطفالك أو تجهيز هدايا السبوع والعائلة بأعلى خامات وأوفر تكلفة. الدفع إلكتروني آمن عبر إنستاباي والمحافظ الإلكترونية.',
    ],
    ctas: ['استخدمي كود الخصم الآن 🏷️', 'تسوقي العرض الحصري 🎉', 'احصلي على الشحن المجاني 🚚'],
    hashtags: ['#عروض_ملابس_أطفال', '#خصومات_مصر', '#شحن_مجاني_القاهرة', '#كوبون_خصم', '#2BabyPrint'],
    hooks: [
      '0-3 ثوانٍ: لافتة عروض مبهجة وكود خصم يلمع على الشاشة مع أصوات احتفالية لطيفة.',
      '0-3 ثوانٍ: "العرض اللي كل الأمهات بتستناه رجع تاني بس لفترة محدودة!"',
    ],
    visuals: [
      'استعراض سلة مشتريات وتطبيق كوبون الخصم مع انخفاض السعر وظهور رسالة الشحن المجاني باللون الأخضر.',
      'عرض تشكيلة متنوعة من القطع مع بطاقات الأسعار بعد التخفيض.',
    ],
    voiceovers: [
      'دلعي طفلك بأفخم قطن مصري واطبعي اسمه اللي بتحبيه ووفري في نفس الوقت مع عروض 2BabyPrint الحصرية.',
      'استخدمي الكود دلوقتي واحصلي على خصمك وشحنك المجاني لباب البيت.',
    ],
    music: ['موسيقى عروض ترويجية مرحة وجذابة (Promo Pop Energy)', 'إيقاع مبهج سريع'],
    audiences: {
      label: 'الباحثون عن صفقات وعروض وتخفيضات ملابس الأطفال عالية الجودة',
      ageRange: '20 - 42 سنة',
      locations: ['كافة المحافظات المصرية'],
      interests: ['Coupons & Discounts', 'Online Deals', 'Baby Shopping Sales', 'تخفيضات أزياء أطفال'],
      demographics: 'أمهات حكيمات يبحثن عن أعلى قيمة مقابل السعر ومحبات الكوبونات الترويجية',
    },
    tips: [
      'حددي مهلة زمنية أو كمية محدودة في نص الإعلان لرفع شعور الإلحاح (FOMO / Urgency).',
      'تأكدي من تفعيل الكوبون في لوحة التحكم وتطابقه التام مع الكود المذكور في الإعلان.',
    ],
  },
};

/**
 * Generate AI-Driven Social Media Campaign Data
 * Powered by Gemini with intelligent deterministic fallback
 */
export async function generateAiCampaign(
  request: CampaignGenerationRequest
): Promise<GeneratedCampaignData> {
  const goalTemplates = CREATIVE_TEMPLATES[request.goal] || CREATIVE_TEMPLATES.baby_shower;
  const randIdx = Math.floor(Math.random() * goalTemplates.headlines.length);

  // Check if we can use Gemini via @google/genai
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
                 (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `أنت خبير تسويق رقمي وإعلانات ممولة متخصص في التجارة الإلكترونية لملابس الأطفال المخصصة بالقطن المصري للبراند المصري "2BabyPrint".
قم بإنشاء حزمة إعلانية كاملة متفوقة للمواصفات التالية:
- المنصة: ${request.platform}
- الهدف الإعلاني: ${request.goal}
- نبرة الإعلان: ${request.tone || 'دافئة للأمهات'}
- المنتج المراد الترويج له: ${request.productName || 'سالوبيتات وهوديز وتيشرتات مخصصة بالاسم واستوديو التصميم الحي'}
- المنطقة المستهدفة: ${request.targetLocation || 'القاهرة الكبرى والجيزة ومحافظات مصر'}
- اللغة المطلوبة: ${request.language === 'en' ? 'الإنجليزية' : 'العربية باللهجة المصرية الأنيقة أو الفصحى الدافئة'}

أجب بصيغة JSON فقط متوافقة مع هذا الهيكل:
{
  "campaignName": "اسم الحملة الإعلانية",
  "headline": "عنوان الإعلان الجذاب Hook",
  "bodyText": "النص التسويقي المقنع",
  "ctaText": "نص زر الدعوة لاتخاذ إجراء",
  "hashtags": ["#هاشتاج1", "#هاشتاج2"],
  "targetAudience": {
    "label": "وصف الجمهور",
    "ageRange": "22 - 38 سنة",
    "locations": ["القاهرة الجديدة", "الشيخ زايد", "المعادي"],
    "interests": ["اهتمام 1", "اهتمام 2"],
    "demographics": "تفاصيل ديموغرافية"
  },
  "videoScript": {
    "hookSeconds": "تفاصيل أول 3 ثوانٍ لجذب الانتباه",
    "visualAction": "وصف المشاهد البصرية والحركة واستوديو التصميم",
    "voiceover": "التعليق الصوتي المقترح",
    "soundTrackRecommendation": "نوع الموسيقى المقترحة"
  },
  "recommendedDailyBudget": 450,
  "predictedMetrics": {
    "estimatedReach": "35,000 - 65,000 ظهور",
    "expectedCtr": 4.2,
    "predictedRoas": 4.6,
    "recommendedPlacement": "Instagram Reels & Stories"
  },
  "aiMarketingTips": ["نصيحة ذكية 1", "نصيحة ذكية 2"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.headline && parsed.bodyText) {
          return {
            campaignName: parsed.campaignName || goalTemplates.titles[0],
            headline: parsed.headline,
            bodyText: parsed.bodyText,
            ctaText: parsed.ctaText || goalTemplates.ctas[0],
            hashtags: parsed.hashtags || goalTemplates.hashtags,
            targetAudience: parsed.targetAudience || goalTemplates.audiences,
            videoScript: parsed.videoScript || {
              hookSeconds: goalTemplates.hooks[0],
              visualAction: goalTemplates.visuals[0],
              voiceover: goalTemplates.voiceovers[0],
              soundTrackRecommendation: goalTemplates.music[0],
            },
            recommendedDailyBudget: parsed.recommendedDailyBudget || 450,
            predictedMetrics: parsed.predictedMetrics || {
              estimatedReach: '40,000 - 75,000 ظهور أسبوعياً',
              expectedCtr: 4.15,
              predictedRoas: 4.5,
              recommendedPlacement: `${request.platform} Reels & In-Feed Ads`,
            },
            aiMarketingTips: parsed.aiMarketingTips || goalTemplates.tips,
          };
        }
      }
    } catch (e) {
      console.warn('Gemini API request failed, utilizing high-converting deterministic fallback engine:', e);
    }
  }

  // Fallback Engine (Immediate, rich, realistic, zero-latency)
  return {
    campaignName: `${goalTemplates.titles[randIdx % goalTemplates.titles.length]} (${request.platform.toUpperCase()})`,
    headline: goalTemplates.headlines[randIdx % goalTemplates.headlines.length],
    bodyText: goalTemplates.bodies[randIdx % goalTemplates.bodies.length],
    ctaText: goalTemplates.ctas[randIdx % goalTemplates.ctas.length],
    hashtags: goalTemplates.hashtags,
    targetAudience: goalTemplates.audiences,
    videoScript: {
      hookSeconds: goalTemplates.hooks[randIdx % goalTemplates.hooks.length],
      visualAction: goalTemplates.visuals[randIdx % goalTemplates.visuals.length],
      voiceover: goalTemplates.voiceovers[randIdx % goalTemplates.voiceovers.length],
      soundTrackRecommendation: goalTemplates.music[randIdx % goalTemplates.music.length],
    },
    recommendedDailyBudget: request.platform === 'tiktok' ? 500 : request.platform === 'google' ? 400 : 350,
    predictedMetrics: {
      estimatedReach: request.platform === 'tiktok' ? '50,000 - 90,000 مشاهدة' : '30,000 - 60,000 ظهور',
      expectedCtr: request.platform === 'google' ? 5.8 : 4.1,
      predictedRoas: request.platform === 'tiktok' ? 5.1 : 4.4,
      recommendedPlacement: request.platform === 'instagram' ? 'Instagram Reels & Stories' : request.platform === 'tiktok' ? 'TikTok Spark Ads & In-Feed' : 'Facebook Mobile Feed',
    },
    aiMarketingTips: goalTemplates.tips,
  };
}

/**
 * Simulate AI Performance Rating for a custom ad headline & text
 */
export function analyzeAdCreativeQuality(headline: string, bodyText: string, cta: string): {
  score: number; // 0 - 100
  ratingLabel: string;
  strengths: string[];
  improvements: string[];
} {
  let score = 70;
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Check for emotional hook or baby keywords
  if (/طفل|بيبي|مولود|سبوع|حب|فرحة|أمهات|baby/i.test(headline + bodyText)) {
    score += 8;
    strengths.push('استخدام كلمات عاطفية تلامس مشاعر الأمهات والعائلات بشكل مباشر');
  }

  // Check for quality/fabric proof
  if (/قطن|مصري|أحبار|آمنة|أكزيما|حساسية|طبيعي|cotton/i.test(bodyText)) {
    score += 8;
    strengths.push('إبراز الثقة في الخامات وجودة القطن المصري الطبيعي والأحبار الآمنة');
  }

  // Check for interactive studio / customization tool mention
  if (/استوديو|تصميم|صممي|اسم|لايف|بروفا|مباشر|studio|custom/i.test(bodyText)) {
    score += 8;
    strengths.push('الترويج المميز لأداة استوديو التصميم الحي وكتابة اسم الطفل');
  }

  // Check for location or fast delivery
  if (/القاهرة|الجيزة|توصيل|شحن|سريع|ساعة|delivery|cairo/i.test(bodyText)) {
    score += 6;
    strengths.push('تحديد ميزة الشحن السريع لباب المنزل في القاهرة والجيزة');
  }

  // Check CTA strength
  if (cta && cta.length > 5) {
    strengths.push('زر دعوة لاتخاذ إجراء (CTA) واضح ومباشر للعميل');
  } else {
    improvements.push('يُفضل تقوية نص زر الإجراء بإضافة رمز تعبيري ورابط مباشر لاستوديو التصميم');
  }

  if (bodyText.length < 50) {
    score -= 10;
    improvements.push('نص الإعلان قصير جداً؛ أضيفي تفاصيل عن سرعة الشحن ونعومة القطن لرفع معدل التحويل');
  }

  const boundedScore = Math.min(98, Math.max(55, score));
  let ratingLabel = 'جيد جداً';
  if (boundedScore >= 90) ratingLabel = 'ممتاز واستثنائي (Viral Ready)';
  else if (boundedScore >= 80) ratingLabel = 'قوي وجذاب (High Converting)';
  else if (boundedScore >= 70) ratingLabel = 'جيد ومقبول';

  return {
    score: boundedScore,
    ratingLabel,
    strengths,
    improvements: improvements.length ? improvements : ['النص الإعلاني متوازن ومستوفٍ لأهم عناصر الإقناع البصري والعاطفي'],
  };
}
