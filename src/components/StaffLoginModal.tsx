import React, { useState } from 'react';
import { AppRole } from '../types';
import { Lock, ShieldCheck, Printer, Truck, X, KeyRound, ArrowRight } from 'lucide-react';
import { Language } from '../i18n/translations';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: AppRole) => void;
  lang: Language;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang,
}) => {
  const [selectedRole, setSelectedRole] = useState<AppRole>('admin');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Accept passcode '2026' or 'admin' or 'admin2026' or '1234'
    const normalized = passcode.trim().toLowerCase();
    if (['2026', 'admin', 'admin2026', '1234'].includes(normalized)) {
      onLoginSuccess(selectedRole);
      onClose();
      setPasscode('');
    } else {
      setError(
        lang === 'ar'
          ? 'رمز المرور غير صحيح. (الرمز التجريبي: 2026)'
          : 'Incorrect passcode. (Demo code: 2026)'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {lang === 'ar' ? 'بوابة دخول الإدارة وفريق العمل' : 'Staff & Operations Portal'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {lang === 'ar'
                  ? 'خاصة بمدير المتجر، فني المطبعة، ومسؤول التوصيل'
                  : 'Restricted to store managers, printers & couriers'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-5 text-xs text-stone-700">
          {/* Role selector cards */}
          <div>
            <label className="font-bold text-stone-800 block mb-2">
              {lang === 'ar' ? 'اختر الدور الوظيفي المطلوب:' : 'Select Staff Role:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === 'admin'
                    ? 'border-amber-500 bg-amber-50 text-stone-950 font-bold ring-2 ring-amber-400/40 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span className="text-[11px] font-bold text-center">
                  {lang === 'ar' ? 'مدير المتجر' : 'Admin'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('printer')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === 'printer'
                    ? 'border-amber-500 bg-amber-50 text-stone-950 font-bold ring-2 ring-amber-400/40 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Printer className="w-5 h-5 text-amber-600" />
                <span className="text-[11px] font-bold text-center">
                  {lang === 'ar' ? 'مسؤول المطبعة' : 'Printer'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('courier')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === 'courier'
                    ? 'border-amber-500 bg-amber-50 text-stone-950 font-bold ring-2 ring-amber-400/40 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Truck className="w-5 h-5 text-amber-600" />
                <span className="text-[11px] font-bold text-center">
                  {lang === 'ar' ? 'مسؤول الشحن' : 'Courier'}
                </span>
              </button>
            </div>
          </div>

          {/* Passcode input */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-800 flex items-center justify-between">
              <span>{lang === 'ar' ? 'رمز مرور الإدارة (PIN / Passcode):' : 'Staff Passcode:'}</span>
              <span className="text-[10px] text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded">
                رمز التجربة: 2026
              </span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={lang === 'ar' ? 'أدخل رمز المرور...' : 'Enter passcode...'}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono tracking-widest text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              />
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {error && (
              <p className="text-[11px] text-red-600 font-semibold pt-0.5 animate-in fade-in">
                {error}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <span>{lang === 'ar' ? 'تسجيل الدخول للمنظومة' : 'Login to Staff Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
