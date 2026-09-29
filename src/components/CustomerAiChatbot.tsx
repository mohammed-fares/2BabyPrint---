import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  ChevronDown,
  HelpCircle,
  Phone,
} from 'lucide-react';
import { StoreSettings } from '../types';
import { Language } from '../i18n/translations';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actionUrl?: string;
  actionLabel?: string;
}

interface CustomerAiChatbotProps {
  storeSettings?: StoreSettings;
  lang: Language;
  onOpenCatalog?: () => void;
  onOpenSizeGuide?: () => void;
}

export const CustomerAiChatbot: React.FC<CustomerAiChatbotProps> = ({
  storeSettings,
  lang,
  onOpenCatalog,
  onOpenSizeGuide,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const isEn = lang === 'en';

  const defaultPhone =
    storeSettings?.supportWhatsapp ||
    storeSettings?.contactWhatsapp ||
    storeSettings?.contactPhone ||
    '+201099887766';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: isEn
        ? 'Hello! 👋 I am your 2BabyPrint smart assistant. How can I help you customize your baby outfits today?'
        : 'أهلاً بكِ في 2BabyPrint! 👶✨ أنا مساعدك الذكي لمساعدتك في اختيار وتصميم ملابس طفلك بقطن مصري 100%. كيف يمكنني مساعدتك اليوم؟',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickQuestions = isEn
    ? [
        'Is the cotton safe for newborns?',
        'How fast is Cairo delivery?',
        'How does the design studio work?',
        'What payment methods do you accept?',
        'Talk to support on WhatsApp',
      ]
    : [
        'هل القطن آمن لحديثي الولادة والأكزيما؟',
        'ما هي مدة التوصيل داخل القاهرة والجيزة؟',
        'ازاي أصمم اسم طفلي في الاستوديو؟',
        'طرق الدفع الإلكتروني المتاحة؟',
        'توصيل فوري نفس اليوم (أوبر سكوتر)؟',
        'تحويل الاستفسار إلى واتساب الإدارة 💬',
      ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let actionUrl: string | undefined;
      let actionLabel: string | undefined;

      const cleanPhone = defaultPhone.replace(/[^0-9]/g, '');

      if (lower.includes('واتساب') || lower.includes('whatsapp') || lower.includes('ادارة') || lower.includes('دعم')) {
        reply = isEn
          ? 'Sure! I have prepared your inquiry to send directly to our WhatsApp support team.'
          : 'يسعدنا تواصلك مع خدمة العملاء والإدارة عبر واتساب للإجابة الفورية على استفسارك وتأكيد طلبك.';
        actionUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          `مرحباً استوديو 2BabyPrint، لدي استفسار:\n"${text}"`
        )}`;
        actionLabel = isEn ? 'Open WhatsApp Chat' : 'فتح محادثة واتساب الآن 💬';
      } else if (lower.includes('قطن') || lower.includes('أكزيما') || lower.includes('حساسية') || lower.includes('cotton')) {
        reply = isEn
          ? 'All our garments are crafted with 100% certified long-staple Egyptian cotton, paired with Oeko-Tex certified water-based inks that leave no rough touch on newborn skin.'
          : 'جميع ملابسنا مصنوعة من أنقى قطن مصري 100% طويل التيلة فائق النعومة، ومطبوعة بأحبار مائية بيئية آمنة معتمدة تماماً لخلوها من الرصاص وتناسب بشرة حديثي الولادة وحالات الأكزيما والحساسية.';
      } else if (lower.includes('توصيل') || lower.includes('شحن') || lower.includes('delivery') || lower.includes('أوبر') || lower.includes('سكوتر')) {
        reply = isEn
          ? 'Standard delivery across Cairo & Giza takes 48 hours. We also offer same-day Express delivery via Uber Scooter / dedicated courier!'
          : 'الشحن القياسي في القاهرة الكبرى والجيزة يستغرق 48 ساعة فقط. كما نوفر خيار الشحن الفوري السريع في نفس اليوم عبر (أوبر سكوتر / مندوب خاص) للطلبات والمناسبات العاجلة.';
      } else if (lower.includes('تصميم') || lower.includes('اسم') || lower.includes('استوديو') || lower.includes('studio') || lower.includes('design')) {
        reply = isEn
          ? 'It is super easy! Pick any romper or tee from the catalog, click "Customize", type your baby name in Arabic or English, and preview the 3D model live before printing.'
          : 'الأمر سهل وممتع جداً! اختاري أي موديل (سالوبيت، تيشرت، هودي)، واضغطي على زر "صممي بنفسك"، واكتبي اسم طفلك واختاري الخط العربي المميز (كايرو أو تجوال أو المراعي)، وشاهدي المعاينة 3D لايف قبل الطباعة.';
      } else if (lower.includes('دفع') || lower.includes('انستاباي') || lower.includes('instapay') || lower.includes('كاش') || lower.includes('payment')) {
        reply = isEn
          ? 'We accept electronic prepayments via InstaPay, Smart Wallets (Vodafone Cash, etc.), and Cards to guarantee instant priority printing of your personalized custom items.'
          : 'نعتمد الدفع الإلكتروني المسبق الموثوق عبر تطبيق إنستاباي (InstaPay) والمحافظ الإلكترونية (فودافون كاش، أورنج، اتصالات) لتأكيد حجز القطعة وبدء طباعتها رقمياً فوراً في المطبعة.';
      } else {
        reply = isEn
          ? 'Thank you for your question! You can customize any outfit now, or message our team directly on WhatsApp for custom requests.'
          : 'شكراً لاستفسارك! يمكنك بدء تصميم قطعتك فوراً من الكتالوج، أو إرسال هذا السؤال مباشرةً إلى رقم واتساب الإدارة لخدمتك فوراً.';
        actionUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          `مرحباً 2BabyPrint، لدي استفسار من الموقع:\n"${text}"`
        )}`;
        actionLabel = isEn ? 'Send to WhatsApp' : 'إرسال الاستفسار لواتساب الإدارة 📲';
      }

      const botReply: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionUrl,
        actionLabel,
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 600);
  };

  const handleEscalateToWhatsApp = () => {
    const cleanPhone = defaultPhone.replace(/[^0-9]/g, '');
    const summary = messages
      .filter((m) => m.sender === 'user')
      .map((m) => `• ${m.text}`)
      .join('\n');

    const msg = `مرحباً إدارة 2BabyPrint، كنت أتحدث مع المساعد الذكي في الموقع ولدي الاستفسار التالي:\n${
      summary || 'أود الاستفسار عن تفاصيل طباعة ملابس الأطفال'
    }`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed bottom-5 left-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-amber-300"
          title={isEn ? 'Ask our AI Assistant' : 'المتحدث الذكي واستفسارات العملاء'}
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-stone-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white animate-pulse" />
          </div>
          <span className="text-xs font-bold whitespace-nowrap">
            {isEn ? 'Smart Assistant' : 'مساعد 2BabyPrint الذكي'}
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-[350px] sm:w-[380px] h-[520px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 bg-stone-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{isEn ? '2BabyPrint AI Assistant' : 'المتحدث الذكي لخدمة العملاء'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                </h3>
                <span className="text-[10px] text-stone-400 block">
                  {isEn ? 'Instant answers & WhatsApp escalation' : 'إجابات فورية وربط مع واتساب الإدارة'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleEscalateToWhatsApp}
                className="p-1.5 text-stone-400 hover:text-emerald-400 rounded-lg transition-colors cursor-pointer"
                title={isEn ? 'Forward to WhatsApp' : 'إرسال إلى واتساب الإدارة'}
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick FAQ Chips */}
          <div className="bg-stone-50 border-b border-stone-200 p-2 overflow-x-auto flex gap-1.5 scrollbar-none text-[11px]">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-50 rounded-full whitespace-nowrap text-stone-700 transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#FAF9F6] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 shadow-2xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-stone-950 font-medium rounded-br-xs'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.actionUrl && (
                    <a
                      href={m.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-xs"
                    >
                      <span>{m.actionLabel || 'تواصل معنا'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <span className="block text-[9px] text-stone-400 mt-1 text-left" dir="ltr">
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start items-center text-stone-400 text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-stone-200 px-3 py-2 rounded-2xl flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Direct Action Bar */}
          <div className="px-3 py-2 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-900 font-medium flex items-center gap-1">
              <span>تحتاج لمساعدة موظف بشري؟</span>
            </span>
            <button
              type="button"
              onClick={handleEscalateToWhatsApp}
              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>واتساب الإدارة ({defaultPhone})</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={isEn ? 'Type your question...' : 'اكتبي سؤالك أو استفسارك هنا...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-stone-950 rounded-xl transition-all cursor-pointer"
              title={isEn ? 'Send' : 'إرسال'}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
