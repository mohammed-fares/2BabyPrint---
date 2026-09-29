import { InfluencerPartner, SocialPostSchedule } from '../types';

export const INITIAL_INFLUENCERS: InfluencerPartner[] = [
  {
    id: 'inf-1',
    name: 'سارة المهدي (Sara Mom Diariez)',
    handle: '@sara_mom_lifestyle',
    platform: 'instagram',
    followers: '280K',
    location: 'التجمع الخامس، القاهرة',
    momName: 'سارة',
    children: [
      { name: 'زين', age: '8 شهور', gender: 'boy', favoriteColor: 'كحلي ملكي' },
      { name: 'ليلى', age: '3 سنوات', gender: 'girl', favoriteColor: 'وردي ناعم' },
    ],
    customOutfitNotes: 'سالوبيت قطن مصري ملكي لزين مطبوع بالذهبي "زين قلب ماما" + تيشرت أبيض لليلى بفيونكة "الأخت الكبرى ليلى" + تيشرت تطابق للأم سارة',
    status: 'reel_published',
    promoCode: 'SARA_BABY15',
    ordersDriven: 47,
    totalSalesValue: 24850,
    aiPitchDraft: `أهلاً سارة حبيبتي 🌸، بنتابع يومياتك اللطيفة جداً مع زين وليلى ودفء عيلتك الجميلة!
بما إن زين كمل 8 شهور وليلى أصبحت الأخت الكبرى الرائعة، في استوديو 2BabyPrint حابين نهديكِ باقة براند VIP مصممة خصيصاً ليكم:
✨ سالوبيت قطن مصري 100% أنقى درجة لزين باسمه مطبوع بأحبار مائية بيئية آمنة لبشرته الحساسة.
✨ تيشرت مبهج لليلى مع تطريز رقمي أنيق باسمها.
✨ تيشرت قطني ناعم ليكي لإطلالة عائلية فوتوسيشن لا تُنسى.
يسعدنا استقبال مقاساتكم لنبدأ الطباعة والتوصيل الفوري مع كود خصم حصري لمتابعيكِ!`,
    lastContactDate: '2026-09-24',
  },
  {
    id: 'inf-2',
    name: 'نور الشناوي (Mama & Noah)',
    handle: '@nour_and_noah',
    platform: 'tiktok',
    followers: '520K',
    location: 'الشيخ زايد، الجيزة',
    momName: 'نور',
    children: [
      { name: 'نوح', age: 'حديث ولادة (شهرين)', gender: 'boy', favoriteColor: 'أبيض لؤلؤي' },
    ],
    customOutfitNotes: 'طقم سبوع ملكي فاخر: سالوبيت كيمونو قطن مصري 100% ناعم جداً بدون أي خياطة بارزة، مطبوع باسم "نوح" مع تاج ذهبي وأحبار طبية خالية من الرصاص',
    status: 'gift_in_production',
    promoCode: 'NOAH_GIFT',
    ordersDriven: 12,
    totalSalesValue: 6400,
    aiPitchDraft: `ألف مبروك وصول الملاك الصغير نوح يا نور! 🍼🤍
عارفين قد إيه الأم في أول شهور بتكون حريصة على كل خامة تلمس جلد طفلها من الحساسية.
في 2BabyPrint بنقدملك طقم سبوع واستقبال من أنقى قطن مصري طويل التيلة فائق النعومة، مطبوع باسم "نوح" بأحبار مائية خالية من الملمس الخشن.
الهدية في مرحلة التجهيز والطباعة الرقمية بالمطبعة مع توصيل خاص اليوم!`,
    lastContactDate: '2026-09-28',
  },
  {
    id: 'inf-3',
    name: 'مريم الألفي (Twin Little Stars)',
    handle: '@mariam_twins_cairo',
    platform: 'instagram',
    followers: '145K',
    location: 'مصر الجديدة، القاهرة',
    momName: 'مريم',
    children: [
      { name: 'آدم', age: 'سنتين', gender: 'boy', favoriteColor: 'أصفر خردلي' },
      { name: 'يحيى', age: 'سنتين', gender: 'boy', favoriteColor: 'سماوي باستيل' },
    ],
    customOutfitNotes: 'طقم توأم متطابق: تيشرت "Twin 1 آدم" وتيشرت "Twin 2 يحيى" بقطن صيفي فائق النعومة للمرح واللعب',
    status: 'details_confirmed',
    promoCode: 'TWINS10',
    ordersDriven: 0,
    totalSalesValue: 0,
    aiPitchDraft: `مرحباً مريم 🌟، التوأم آدم ويحيى خطفوا قلوبنا بضحكاتهم وستايلهم الكيوت!
حابين نبعتلكم طقم توأم مخصص بأسماء آدم ويحيى من خامات قطن طبيعي مقاوم للغسيل المتكرر، هيفرحوا جداً بارتدائه في خروجاتهم الجاية ونشارككم اللحظة الحلوة.`,
    lastContactDate: '2026-09-29',
  },
  {
    id: 'inf-4',
    name: 'ياسمين رضوان (Baby Chef & Mom)',
    handle: '@yasmine_babyfood',
    platform: 'instagram',
    followers: '310K',
    location: 'المعادي، القاهرة',
    momName: 'ياسمين',
    children: [
      { name: 'صوفيا', age: 'سنة ونصف', gender: 'girl', favoriteColor: 'خوخي ناعم' },
    ],
    customOutfitNotes: 'مريلة طعام قطنية مقاومة للبقع مطبوعة "الشيف صوفيا" + فستان قطني بناتي صيفي ناعم باسم صوفيا',
    status: 'identified',
    promoCode: 'SOFIA_YUM',
    ordersDriven: 0,
    totalSalesValue: 0,
    aiPitchDraft: `عزيزتي ياسمين 🍓، وصفاتك لغذاء الأطفال وتغذية صوفيا ملهمة لكل أم مصرية.
عايزين نهديكِ مريلة طعام قطنية خاصة وفستان صيفي بناتي مخصص مطبوع باسم "الشيف صوفيا" لتصوير فيديوهات وصفاتك بطابع مرح وجذاب ومحبوب للأمهات!`,
    lastContactDate: '2026-09-29',
  },
];

export const INITIAL_POST_SCHEDULES: SocialPostSchedule[] = [
  {
    id: 'post-1',
    platform: 'instagram',
    title: 'ريلز: تجربة طباعة اسم طفلك في استوديو 2BabyPrint الحي',
    content: `مش لازم تشتري لبس جاهز متكرر وموجود عند كل الناس! 👶✨
في استوديو 2BabyPrint، انتِ المصممة:
1️⃣ ادخلي على المتجر واختاري السالوبيت أو التيشرت.
2️⃣ اكتبي اسم طفلك واختاري الخط العربي والتاج الملكي.
3️⃣ شوفي المعاينة 3D لايف، واضغطي طلب.
بنطبعهولك بأعلى دقة على أنقى قطن مصري 100% ونوصله لباب بيتك!
الرابط في البايو للتصميم المجاني الآن 👆
#ملابس_أطفال #سبوع #هدايا_مواليد #قطن_مصري #2BabyPrint`,
    scheduledTime: 'اليوم، 7:30 مساءً (وقت الذروة لأمهات مصر)',
    status: 'scheduled',
    mediaType: 'reel',
    mediaUrl: '/src/assets/images/hero_baby_apparel_1790519873737.jpg',
    targetLink: 'https://2babyprint.eg/#catalog',
    engagement: {
      likes: 1420,
      shares: 312,
      comments: 89,
    },
  },
  {
    id: 'post-2',
    platform: 'tiktok',
    title: 'فيديو تيك توك ترند: سر نعومة لبس الأطفال والأكزيما',
    content: `ليه أمهات القاهرة بقوا يطلبوا سالوبيتات 2BabyPrint بالاسم؟ 🌿
لأن جلد البيبي أنعم من أي شيء في الدنيا، والطباعة العادية بتكون خشنة وتسبب حساسية.
احنا بنستخدم أحدث تكنولوجيا DTF بأحبار مائية عضوية 100% معتمدة طبياً، مع قطن مصري صافي لا يوبر ولا يتغير بعد الغسيل!
اطلبي قطعتك بخصم 15% بكود: BABY15
#امومة #اكزيما_الاطفال #قطن_مصري #امهات_تيك_توك #مواليد_جدد`,
    scheduledTime: 'غداً، 3:00 عصراً',
    status: 'draft',
    mediaType: 'reel',
    mediaUrl: '/src/assets/images/product_romper_studio_1790519885828.jpg',
    targetLink: 'https://2babyprint.eg/#catalog',
  },
  {
    id: 'post-3',
    platform: 'facebook',
    title: 'بوست فيسبوك وتساب: خدمة التوصيل الفوري السريع (أوبر سكوتر) لنفس اليوم',
    content: `مستعجلة على هدية السبوع أو الفوتوسيشن بكرة الصبح؟ 🚀🛵
استوديو 2BabyPrint بيقدملك خدمة التوصيل الفوري السريع في نفس اليوم عبر (أوبر سكوتر / مندوب خاص) داخل جميع مناطق القاهرة والجيزة.
صممي اسم طفلك في ثوانٍ، وسنوصلها مغلفة بهدية شيك لباب البيت فوراً!
تواصلوا معنا عبر واتساب الإدارة لطلبات التوصيل المستعجل.`,
    scheduledTime: 'الخميس، 5:00 مساءً',
    status: 'draft',
    mediaType: 'image',
    mediaUrl: '/src/assets/images/product_hoodie_kids_1790519897372.jpg',
    targetLink: 'https://2babyprint.eg/#checkout',
  },
];
