export type Language = 'ar' | 'en';

export interface Translations {
  announcement: string;
  brandSub: string;
  nav: {
    all: string;
    infants: string;
    toddlers: string;
    youth: string;
    templates: string;
    sizeGuide: string;
    studio: string;
  };
  hero: {
    kicker: string;
    title1: string;
    title2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    proofCotton: string;
    proofInks: string;
    previewTag: string;
    previewDesc: string;
  };
  features: {
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
  };
  catalog: {
    tagline: string;
    title: string;
    tabAll: string;
    tabInfants: string;
    tabToddlers: string;
    tabYouth: string;
    bestSeller: string;
    customizeBtn: string;
    currency: string;
    openStudio: string;
  };
  templates: {
    tagline: string;
    title: string;
    subtitle: string;
    editBtn: string;
  };
  studio: {
    title: string;
    front: string;
    back: string;
    textTab: string;
    clipartsTab: string;
    uploadTab: string;
    templatesTab: string;
    colorsTab: string;
    printArea: string;
    undo: string;
    redo: string;
    exportDtf: string;
    addToCart: string;
    addingToCart: string;
    selectedColor: string;
    size: string;
    quantity: string;
    garmentColorsTitle: string;
    garmentColorsNote: string;
    readyTemplatesTitle: string;
    apply: string;
  };
  textTool: {
    editTitle: string;
    addTitle: string;
    placeholder: string;
    suggestions: string;
    fontFamily: string;
    textColor: string;
    fontSize: string;
    bold: string;
    italic: string;
    curved: string;
    applyBtn: string;
    addBtn: string;
  };
  clipartTool: {
    changeColor: string;
    searchPlaceholder: string;
    all: string;
    noResults: string;
  };
  uploadTool: {
    dragTitle: string;
    dragSubtitle: string;
    shapeTitle: string;
    shapeRect: string;
    shapeCircle: string;
    shapeHeart: string;
    tip: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    color: string;
    size: string;
    sides: string;
    frontOnly: string;
    bothSides: string;
    subtotal: string;
    shipping: string;
    freeShipping: string;
    shippingThresholdNotice: (amount: number) => string;
    total: string;
    checkoutBtn: string;
    guarantee: string;
    currency: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    customerTitle: string;
    name: string;
    namePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    city: string;
    address: string;
    addressPlaceholder: string;
    paymentTitle: string;
    fawry: string;
    fawryDesc: string;
    wallets: string;
    walletsDesc: string;
    valu: string;
    valuDesc: string;
    meeza: string;
    meezaDesc: string;
    cod: string;
    codDesc: string;
    summaryItems: string;
    summarySubtotal: string;
    summaryShipping: string;
    summaryTotal: string;
    submitBtn: (total: number) => string;
    submittingBtn: string;
    invoiceNotice: string;
    currency: string;
  };
  orderSuccess: {
    badge: string;
    title: string;
    orderNum: string;
    statusTitle: string;
    statusDesc: string;
    statusBadge: string;
    customer: string;
    phone: string;
    address: string;
    payment: string;
    customItems: string;
    totalPaid: string;
    downloadDtfBtn: string;
    backBtn: string;
    currency: string;
  };
  sizeGuide: {
    title: string;
    subtitle: string;
    infantsTitle: string;
    toddlersTitle: string;
    colSize: string;
    colAge: string;
    colWeight: string;
    colHeight: string;
    colChest: string;
    colLength: string;
    advice: string;
    closeBtn: string;
  };
  footer: {
    desc: string;
    madeWithLove: string;
    sectionsTitle: string;
    careTitle: string;
    washingTip: string;
    inkSafety: string;
    deliveryTime: string;
    paymentsTitle: string;
    paymentsDesc: string;
    ssl: string;
    copyright: string;
    privacy: string;
    terms: string;
    refund: string;
  };
}

export const translations: Record<Language, Translations> = {
  ar: {
    announcement: 'توصيل سريع للقاهرة والجيزة وجميع محافظات مصر · خامات قطن مصري 100% ناعمة وآمنة للرضع',
    brandSub: 'متجر طباعة ملابس أطفال بالطلب',
    nav: {
      all: 'جميع الموديلات',
      infants: 'حديثي الولادة (0-2 سنة)',
      toddlers: 'الأطفال (3-5 سنوات)',
      youth: 'اليافعين (6-10 سنوات)',
      templates: 'قوالب جاهزة',
      sizeGuide: 'دليل المقاسات',
      studio: 'استوديو التصميم',
    },
    hero: {
      kicker: 'أول متجر طباعة بالطلب لملابس الأطفال في مصر مع استوديو تصميم مباشر',
      title1: 'الملابس التي تحكي ذكريات طفلك الأولى،',
      title2: 'صممي قطعة فريدة من القطن المصري بكل حب.',
      subtitle: 'سواء كان سبوع البيبي، أو الاحتفال بعيد ميلاده الأول، استوديو 2BabyPrint يتيح لكِ كتابة اسم طفلك واختيار الخطوط والرسومات اللطيفة، مع طباعة رقمية DTF فائقة النعومة على أجود قطن مصري 100% آمن لبشرة المواليد.',
      ctaPrimary: 'ابدئي تصميم قطعة طفلك الآن',
      ctaSecondary: 'تصفحي قوالب السبوع وأعياد الميلاد',
      proofCotton: 'قطن مصري 100% طويل التيلة ناعم الملمس',
      proofInks: 'أحبار مائية آمنة وخالية تماماً من الكيماويات',
      previewTag: 'معاينة حية ومباشرة',
      previewDesc: 'شاهدي اسم طفلك وتصميمك على الموك آب قبل الطباعة',
    },
    features: {
      f1Title: 'قطن مصري 100% فائق النعومة',
      f1Desc: 'أقمشة قطنية مصرية طبيعية معتمدة، ناعمة ومضادة للحساسية مع أزرار كبس خالية من النيكل.',
      f2Title: 'طباعة DTF عالية الثبات والأمان',
      f2Desc: 'أحبار رقمية أوروبية معتمدة لا تتشقق ولا تبهت مع كثرة الغسيل وآمنة تماماً على بشرة الطفل.',
      f3Title: 'استوديو تصميم فوري وسهل',
      f3Desc: 'صممي اسم طفلك واختاري الخط العربي والرسومات والألوان مع إمكانية رفع صورة طفلك فوراً.',
      f4Title: 'توصيل سريع للقاهرة وكل مصر',
      f4Desc: 'شحن سريع لباب بيتك وخيارات دفع سهلة عبر فوري، إنستاباي، فودافون كاش، ڤاليو، أو الدفع عند الاستلام.',
    },
    catalog: {
      tagline: 'تشكيلة ملابس الأطفال القابلة للتخصيص بالطلب',
      title: 'اختاري الموديل وابدئي إضافة اسم ورسومات طفلك',
      tabAll: 'جميع القطع',
      tabInfants: 'حديثي الولادة (0-2 سنة)',
      tabToddlers: 'الأطفال (3-5 سنوات)',
      tabYouth: 'اليافعين (6-10 سنوات)',
      bestSeller: 'الأكثر طلباً في القاهرة',
      customizeBtn: 'تخصيص هذا الموديل',
      currency: 'ج.م',
      openStudio: 'فتح استوديو التصميم',
    },
    templates: {
      tagline: 'قوالب جاهزة ومحبوبة للمناسبات المصرية',
      title: 'تحبين تصميماً جاهزاً بنقرة واحدة؟',
      subtitle: 'اختاري قالباً جاهزاً للسبوع أو العيد أو أعياد الميلاد، وبدّلي اسم طفلك وتاريخ ميلاده في ثوانٍ.',
      editBtn: 'تعديل هذا القالب',
    },
    studio: {
      title: 'استوديو التصميم الحي 2BabyPrint',
      front: 'الواجهة الأمامية',
      back: 'الجهة الخلفية',
      textTab: 'نصوص وأسماء',
      clipartsTab: 'رسومات وأشكال',
      uploadTab: 'رفع صورة',
      templatesTab: 'قوالب جاهزة',
      colorsTab: 'لون القماش',
      printArea: 'منطقة الطباعة الآمنة',
      undo: 'تراجع',
      redo: 'إعادة',
      exportDtf: 'معاينة ملف الطباعة DTF',
      addToCart: 'إضافة للسلة',
      addingToCart: 'جارٍ تجهيز القطعة...',
      selectedColor: 'اللون المختار:',
      size: 'المقاس:',
      quantity: 'الكمية:',
      garmentColorsTitle: 'ألوان القماش المعتمدة',
      garmentColorsNote: 'جميع الأقمشة مصبوغة بألوان نباتية آمنة لا تتأثر بالغسيل المتكرر.',
      readyTemplatesTitle: 'اختاري قالباً لتطبيقه على القطعة:',
      apply: 'تطبيق',
    },
    textTool: {
      editTitle: 'تعديل النص المحدد',
      addTitle: 'كتابة اسم الطفل أو عبارة',
      placeholder: 'اكتبي هنا (مثال: ريان، نونو العيلة، سكر محلي)...',
      suggestions: 'اقتراحات سريعة بنقرة واحدة:',
      fontFamily: 'نوع الخط العربي',
      textColor: 'لون الطباعة',
      fontSize: 'حجم الخط',
      bold: 'عريض',
      italic: 'مائل',
      curved: 'نص مقوس (Arc)',
      applyBtn: 'تحديث النص في التصميم',
      addBtn: 'إضافة النص إلى قطعة الملابس',
    },
    clipartTool: {
      changeColor: 'تغيير لون الرسمة المحددة',
      searchPlaceholder: 'ابحثي عن رسمة (تاج، دبدوب، كعكة، فانوس، هلال)...',
      all: 'الكل',
      noResults: 'لم يتم العثور على رسومات مطابقة للبحث',
    },
    uploadTool: {
      dragTitle: 'اضغطي لرفع صورة طفلك أو اسحبيها هنا',
      dragSubtitle: 'يدعم ملفات PNG و JPG عالية الدقة حتى 15 ميجابايت',
      shapeTitle: 'شكل إطار الصورة على القماش',
      shapeRect: 'مربع عادي',
      shapeCircle: 'إطار دائري',
      shapeHeart: 'إطار قلب',
      tip: 'نصيحة طباعة: للحصول على أفضل دقة طباعة DTG على القماش، يفضل رفع صور واضحة المعالم وغير ضبابية.',
    },
    cart: {
      title: 'سلة المشتريات',
      emptyTitle: 'سلتكِ فارغة حالياً',
      emptySubtitle: 'اختاري قطعة ملابس وافتحي استوديو التصميم لكتابة اسم طفلك واختيار رسوماته المفضلة',
      color: 'اللون:',
      size: 'المقاس:',
      sides: 'الطباعة:',
      frontOnly: 'وجه أمامي',
      bothSides: 'وجهين (أمامي وخلفي)',
      subtotal: 'المجموع الفرعي:',
      shipping: 'الشحن والتوصيل (القاهرة والجيزة):',
      freeShipping: 'مجاناً',
      shippingThresholdNotice: (amount) => `أضيفي منتجات بقيمة ${amount} ج.م إضافية للحصول على شحن مجاني!`,
      total: 'المجموع النهائي:',
      checkoutBtn: 'متابعة إتمام الطلب (Checkout)',
      guarantee: 'دفع آمن 100% مع ضمان استبدال مجاني في حال وجود أي عيب طباعة',
      currency: 'ج.م',
    },
    checkout: {
      title: 'إتمام الطلب والشحن (داخل مصر)',
      subtitle: 'أدخلي بيانات الشحن في القاهرة أو المحافظات واختاري وسيلة الدفع المفضلة',
      customerTitle: 'معلومات المستلم وعنوان التوصيل',
      name: 'اسم المستلم (الأم أو الأب) *',
      namePlaceholder: 'مثال: نورهان الشريف',
      phone: 'رقم الهاتف المحمول (واتساب) *',
      phonePlaceholder: '01XXXXXXXXX',
      email: 'البريد الإلكتروني (لتأكيد الطلب)',
      city: 'المنطقة أو المحافظة *',
      address: 'العنوان التفصيلي (المنطقة، الشارع، العمارة، الشقة) *',
      addressPlaceholder: 'مثال: القاهرة الجديدة، التجمع الخامس، شارع التسعين، عمارة 14...',
      paymentTitle: 'طريقة الدفع المفضلة في مصر',
      fawry: 'فوري (Fawry / كود دفع فوري)',
      fawryDesc: 'ادفعي عبر كود فوري في أي سوبرماركت أو كشك',
      wallets: 'إنستاباي / فودافون كاش ومحافظ المحمول',
      walletsDesc: 'InstaPay, Vodafone Cash, Orange, Etisalat, WE',
      valu: 'ڤاليو (valU - قسط على راحتك)',
      valuDesc: 'تقسيط مريح من شهر وحتى 60 شهراً',
      meeza: 'بطاقة ميزة / فيزا وماستركارد',
      meezaDesc: 'دفع إلكتروني فوري وآمن بالبطاقات البنكية المصرية',
      cod: 'الدفع عند الاستلام (COD)',
      codDesc: 'ادفعي نقداً لمندوب الشحن عند استلام وتفقد القطعة',
      summaryItems: 'عدد القطع المخصصة:',
      summarySubtotal: 'قيمة المنتجات:',
      summaryShipping: 'تكلفة الشحن:',
      summaryTotal: 'المجموع الكلي المطلوب:',
      submitBtn: (total) => `تأكيد الطلب الآن (${total} ج.م)`,
      submittingBtn: 'جارٍ معالجة وتأكيد الطلب...',
      invoiceNotice: 'سيتم إرسال فاتورة تفصيلية ورابط تتبع الشحنة على الواتساب فوراً',
      currency: 'ج.م',
    },
    orderSuccess: {
      badge: 'تم تأكيد طلبكِ بنجاح',
      title: 'شكراً لثقتكِ بـ 2BabyPrint مصر!',
      orderNum: 'رقم الطلب:',
      statusTitle: 'حالة الطلب الحالية',
      statusDesc: 'تم إرسال ملفات التصميم إلى ماكينة الطباعة الرقمية (DTF) بالقاهرة',
      statusBadge: 'قيد التجهيز والطباعة',
      customer: 'اسم العميل:',
      phone: 'رقم المحمول:',
      address: 'عنوان التوصيل:',
      payment: 'وسيلة الدفع:',
      customItems: 'القطع المخصصة في طلبكِ:',
      totalPaid: 'المجموع المدفوع:',
      downloadDtfBtn: 'تحميل ملفات الطباعة عالية الدقة (DTF Files)',
      backBtn: 'العودة إلى المتجر',
      currency: 'ج.م',
    },
    sizeGuide: {
      title: 'دليل مقاسات ملابس الأطفال والرضع في مصر',
      subtitle: 'جدول معتمد يساعدكِ على اختيار المقاس المضبوط لطفلك بالاعتماد على الوزن والطول',
      infantsTitle: '1. سالوبيتات ومرايل الرضع (من سن يوم وحتى سنتين)',
      toddlersTitle: '2. التيشرتات والفساتين والهوديز (من 3 وحتى 10 سنوات)',
      colSize: 'المقاس',
      colAge: 'العمر التقريبي',
      colWeight: 'الوزن المناسب',
      colHeight: 'طول الطفل',
      colChest: 'محيط الصدر',
      colLength: 'طول القطعة',
      advice: 'نصيحة للأمهات: إذا كان طفلك بين مقاسين، ننصح دائماً باختيار المقاس الأكبر لضمان راحة الرضيع ونموه السريع خلال الأشهر الأولى!',
      closeBtn: 'فهمت، شكراً',
    },
    footer: {
      desc: 'أول متجر طباعة بالطلب متخصص لملابس الأطفال والرضع في مصر، نوفر أقمشة قطنية مصرية 100% فائقة النعومة مع استوديو تصميم حي يتيح لكِ تخليد أجمل ذكريات طفلك.',
      madeWithLove: 'صنع بكل حب للأمهات والآباء في القاهرة ومصر',
      sectionsTitle: 'أقسام المتجر',
      careTitle: 'خدمة العملاء والإرشادات',
      washingTip: 'إرشادات الغسيل: غسيل لطيف مقلوب بماء بارد (30°C) للحفاظ على ثبات الطباعة والقطن.',
      inkSafety: 'ضمان جودة الألوان: أحبار نباتية خالية من الرصاص والفثالات آمنة على الرضع.',
      deliveryTime: 'التوصيل والشحن: خلال 24-48 ساعة داخل القاهرة والجيزة، و2-4 أيام لباقي المحافظات.',
      paymentsTitle: 'وسائل الدفع المقبولة في مصر',
      paymentsDesc: 'نوفر جميع وسائل الدفع المعتمدة محلياً: إنستاباي، فودافون كاش، فوري، ڤاليو، ميزة، والدفع عند الاستلام.',
      ssl: 'شهادة أمان مشفرة 256-bit SSL',
      copyright: 'متجر 2BabyPrint مصر لطباعة ملابس الأطفال بالطلب. جميع الحقوق محفوظة.',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
      refund: 'سياسة الاستبدال والطباعة',
    },
  },
  en: {
    announcement: 'Fast Delivery in Cairo, Giza & All Egypt · 100% Premium Egyptian Organic Cotton for Babies',
    brandSub: 'Custom Kids & Baby Print On Demand',
    nav: {
      all: 'All Products',
      infants: 'Newborns & Infants (0-2 Y)',
      toddlers: 'Toddlers (3-5 Y)',
      youth: 'Youth (6-10 Y)',
      templates: 'Ready Templates',
      sizeGuide: 'Size Guide',
      studio: 'Live Design Studio',
    },
    hero: {
      kicker: 'Egypt’s Premier Custom Baby Apparel Store with Live Product Designer',
      title1: 'Clothes that tell your baby’s first memories,',
      title2: 'Crafted with 100% Egyptian Cotton with love.',
      subtitle: 'From newborn baby showers to the 1st birthday milestone, the 2BabyPrint interactive studio empowers parents to personalize names, playful typography, and cute artwork on ultra-soft Egyptian cotton fabrics safe for baby skin.',
      ctaPrimary: 'Start Designing Your Baby’s Outfit',
      ctaSecondary: 'Explore Ready-Made Templates',
      proofCotton: '100% Long-Staple Soft Egyptian Cotton',
      proofInks: 'Infant-Safe Water-Based Non-Toxic Inks',
      previewTag: 'Live 2D Customizer',
      previewDesc: 'Preview your baby’s name & artwork in real time before printing',
    },
    features: {
      f1Title: '100% Ultra-Soft Egyptian Cotton',
      f1Desc: 'Certified hypoallergenic Egyptian cotton fabrics with nickel-free snaps gentle on newborn delicate skin.',
      f2Title: 'Durable Infant-Safe DTF Printing',
      f2Desc: 'Eco-friendly European digital inks that never crack, peel, or fade through daily machine washes.',
      f3Title: 'Intuitive Arabic & English Studio',
      f3Desc: 'Customize baby names, curved typography, clipart library, or upload baby photos with circle/heart masks.',
      f4Title: 'Fast Cairo Delivery & Flexible Payments',
      f4Desc: 'Fast door-to-door delivery with Fawry, InstaPay, Vodafone Cash, valU installments, or Cash on Delivery.',
    },
    catalog: {
      tagline: 'Customizable Baby & Kids Apparel Collection',
      title: 'Pick a blank garment and launch the studio',
      tabAll: 'All Garments',
      tabInfants: 'Newborns (0-2 Y)',
      tabToddlers: 'Toddlers (3-5 Y)',
      tabYouth: 'Youth (6-10 Y)',
      bestSeller: 'Cairo Best Seller',
      customizeBtn: 'Customize This Model',
      currency: 'EGP',
      openStudio: 'Open Design Studio',
    },
    templates: {
      tagline: 'Inspiring Ready-to-Edit Celebration Designs',
      title: 'Need a stunning design in one click?',
      subtitle: 'Choose from beloved baby shower, birthday, and family templates. Swap names and dates in seconds.',
      editBtn: 'Customize This Template',
    },
    studio: {
      title: '2BabyPrint Live Product Designer',
      front: 'Front View',
      back: 'Back View',
      textTab: 'Text & Names',
      clipartsTab: 'Clipart & Graphics',
      uploadTab: 'Upload Photo',
      templatesTab: 'Ready Templates',
      colorsTab: 'Fabric Color',
      printArea: 'Safe Printable Zone',
      undo: 'Undo',
      redo: 'Redo',
      exportDtf: 'Preview 300 DPI DTF Print',
      addToCart: 'Add to Cart',
      addingToCart: 'Processing Garment...',
      selectedColor: 'Selected Color:',
      size: 'Size:',
      quantity: 'Quantity:',
      garmentColorsTitle: 'Approved Fabric Color Swatches',
      garmentColorsNote: 'All garments are crafted with plant-dyed cotton fabrics that resist repeated washing.',
      readyTemplatesTitle: 'Select a template to apply:',
      apply: 'Apply',
    },
    textTool: {
      editTitle: 'Edit Selected Text',
      addTitle: 'Add Baby Name or Quote',
      placeholder: 'Type here (e.g. Rayan, Little Prince, Sugar Sweet)...',
      suggestions: 'Quick 1-click suggestions:',
      fontFamily: 'Typography Font',
      textColor: 'Print Color',
      fontSize: 'Font Size',
      bold: 'Bold',
      italic: 'Italic',
      curved: 'Curved Text (Arc)',
      applyBtn: 'Update Text in Design',
      addBtn: 'Add Text to Garment',
    },
    clipartTool: {
      changeColor: 'Change Color of Selected Clipart',
      searchPlaceholder: 'Search graphics (crown, bear, cake, lantern, star)...',
      all: 'All',
      noResults: 'No cliparts found matching your search',
    },
    uploadTool: {
      dragTitle: 'Click to upload your baby’s photo or drag here',
      dragSubtitle: 'Supports high-res PNG, JPG up to 15MB',
      shapeTitle: 'Photo Mask Shape',
      shapeRect: 'Normal Rectangle',
      shapeCircle: 'Circle Mask',
      shapeHeart: 'Heart Mask',
      tip: 'Printing Tip: For crisp DTG/DTF results on fabric, upload high-resolution, unblurred photos.',
    },
    cart: {
      title: 'Shopping Bag',
      emptyTitle: 'Your bag is currently empty',
      emptySubtitle: 'Choose a garment and open the live studio to customize your baby’s name and cute graphics',
      color: 'Color:',
      size: 'Size:',
      sides: 'Print Sides:',
      frontOnly: 'Front Only',
      bothSides: 'Both Sides (Front & Back)',
      subtotal: 'Subtotal:',
      shipping: 'Shipping (Cairo & Giza):',
      freeShipping: 'Free',
      shippingThresholdNotice: (amount) => `Add ${amount} EGP more to qualify for Free Shipping!`,
      total: 'Final Total:',
      checkoutBtn: 'Proceed to Checkout',
      guarantee: '100% Secure checkout with free replacement guarantee on printing defects',
      currency: 'EGP',
    },
    checkout: {
      title: 'Order Checkout & Shipping (Egypt)',
      subtitle: 'Enter your shipping address in Cairo or Egyptian governorates and select payment method',
      customerTitle: 'Recipient & Delivery Address',
      name: 'Recipient Name (Mother or Father) *',
      namePlaceholder: 'e.g. Nourhan El-Sherif',
      phone: 'Mobile Number (WhatsApp) *',
      phonePlaceholder: '01XXXXXXXXX',
      email: 'Email (for confirmation)',
      city: 'Area or Governorate *',
      address: 'Detailed Address (Area, Street, Building, Apartment) *',
      addressPlaceholder: 'e.g. New Cairo, 5th Settlement, 90th St, Building 14...',
      paymentTitle: 'Preferred Payment Method in Egypt',
      fawry: 'Fawry (FawryPay Reference Code)',
      fawryDesc: 'Pay via Fawry code at any kiosk or supermarket',
      wallets: 'InstaPay & Mobile Wallets',
      walletsDesc: 'InstaPay, Vodafone Cash, Orange, Etisalat, WE Pay',
      valu: 'valU Installments',
      valuDesc: 'Flexible monthly installments up to 60 months',
      meeza: 'Meeza Card / Visa & Mastercard',
      meezaDesc: 'Instant, secure electronic payment with Egyptian bank cards',
      cod: 'Cash on Delivery (COD)',
      codDesc: 'Pay in cash to the courier upon delivery & inspection',
      summaryItems: 'Custom Items:',
      summarySubtotal: 'Items Subtotal:',
      summaryShipping: 'Shipping Fee:',
      summaryTotal: 'Total Payable:',
      submitBtn: (total) => `Confirm Order (${total} EGP)`,
      submittingBtn: 'Processing your order...',
      invoiceNotice: 'An itemized invoice and tracking link will be sent to your WhatsApp immediately',
      currency: 'EGP',
    },
    orderSuccess: {
      badge: 'Order Successfully Confirmed',
      title: 'Thank you for choosing 2BabyPrint Egypt!',
      orderNum: 'Order #:',
      statusTitle: 'Current Order Status',
      statusDesc: 'Design files sent to Cairo digital DTF printer',
      statusBadge: 'In Printing & Preparation',
      customer: 'Customer Name:',
      phone: 'Mobile:',
      address: 'Shipping Address:',
      payment: 'Payment Method:',
      customItems: 'Customized Garments in Order:',
      totalPaid: 'Total Paid:',
      downloadDtfBtn: 'Download High-Res 300 DPI DTF Files',
      backBtn: 'Return to Store',
      currency: 'EGP',
    },
    sizeGuide: {
      title: 'Baby & Kids Apparel Size Chart (Egypt)',
      subtitle: 'Standard sizing table based on baby weight (kg) and height (cm)',
      infantsTitle: '1. Infant Rompers & Bibs (0 - 24 Months)',
      toddlersTitle: '2. T-Shirts, Dresses & Hoodies (3 - 10 Years)',
      colSize: 'Size',
      colAge: 'Approx. Age',
      colWeight: 'Fit Weight',
      colHeight: 'Height',
      colChest: 'Chest',
      colLength: 'Length',
      advice: 'Mom Tip: If your baby is between two sizes, we always recommend picking the larger size to allow for rapid infant growth!',
      closeBtn: 'Got it, thanks',
    },
    footer: {
      desc: 'Egypt’s premier custom print-on-demand baby & kids apparel brand. We use 100% ultra-soft Egyptian cotton with a live design studio to immortalize your baby’s precious moments.',
      madeWithLove: 'Crafted with love for parents in Cairo & across Egypt',
      sectionsTitle: 'Store Sections',
      careTitle: 'Customer Care & Guidelines',
      washingTip: 'Care Tip: Gentle inside-out machine wash in cold water (30°C) to keep print and cotton pristine.',
      inkSafety: 'Safety: Non-toxic, lead-free water-based inks 100% infant-safe.',
      deliveryTime: 'Shipping: 24-48 hours across Cairo & Giza, 2-4 days for other governorates.',
      paymentsTitle: 'Accepted Egyptian Payment Gateways',
      paymentsDesc: 'We accept all major Egyptian payment methods: InstaPay, Vodafone Cash, Fawry, valU, Meeza, and COD.',
      ssl: '256-bit SSL Secure Checkout',
      copyright: '2BabyPrint Egypt. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      refund: 'Return & Print Policy',
    },
  },
};
