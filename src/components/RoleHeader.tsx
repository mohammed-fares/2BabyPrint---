import React from 'react';
import { AppRole, OrderDetails } from '../types';
import { ShieldCheck, Printer, Truck, LogOut, Lock, Store } from 'lucide-react';
import { Language } from '../i18n/translations';

interface RoleHeaderProps {
  currentRole: AppRole;
  onSelectRole: (role: AppRole) => void;
  orders: OrderDetails[];
  lang: Language;
  onLogout: () => void;
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({
  currentRole,
  onSelectRole,
  orders,
  lang,
  onLogout,
}) => {
  // Count active orders per department
  const printQueueCount = orders.filter(
    (o) => o.status === 'pending_review' || o.status === 'printing_dtf'
  ).length;

  const courierQueueCount = orders.filter(
    (o) => o.status === 'ready_for_shipping' || o.status === 'out_for_delivery'
  ).length;

  return (
    <div className="bg-stone-950 text-stone-200 border-b border-amber-500/30 text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Staff badge & Role Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 font-bold px-2.5 py-1 rounded-lg border border-amber-500/30 text-[11px]">
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'جلسة فريق العمل والإدارة النشطة' : 'Staff Operations Mode'}</span>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {/* 1. Admin Dashboard */}
            <button
              type="button"
              onClick={() => onSelectRole('admin')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                currentRole === 'admin'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'لوحة الإدارة' : 'Admin'}</span>
              <span className="bg-stone-800 text-[10px] px-1.5 rounded-full font-mono">
                {orders.length}
              </span>
            </button>

            {/* 2. Print Production Shop */}
            <button
              type="button"
              onClick={() => onSelectRole('printer')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                currentRole === 'printer'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'بوابة المطبعة' : 'Printer'}</span>
              {printQueueCount > 0 && (
                <span className="bg-amber-500 text-stone-950 text-[10px] px-1.5 rounded-full font-mono font-bold animate-pulse">
                  {printQueueCount}
                </span>
              )}
            </button>

            {/* 3. Courier & Delivery */}
            <button
              type="button"
              onClick={() => onSelectRole('courier')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                currentRole === 'courier'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'بوابة التوصيل' : 'Courier'}</span>
              {courierQueueCount > 0 && (
                <span className="bg-sky-400 text-stone-950 text-[10px] px-1.5 rounded-full font-mono font-bold">
                  {courierQueueCount}
                </span>
              )}
            </button>

            {/* View storefront preview */}
            <button
              type="button"
              onClick={() => onSelectRole('store')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                currentRole === 'store'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="معاينة المتجر كما يراه العميل"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'معاينة المتجر' : 'Store Preview'}</span>
            </button>
          </div>
        </div>

        {/* Exit Staff Mode / Logout Button */}
        <div>
          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 border border-red-800/50"
            title="تسجيل الخروج والعودة لوضع الزائر العادي"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'خروج من وضع الإدارة' : 'Exit Staff Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
