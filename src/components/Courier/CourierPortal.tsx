import React, { useState } from 'react';
import { OrderDetails } from '../../types';
import {
  Truck,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface CourierPortalProps {
  orders: OrderDetails[];
  onUpdateOrderStatus: (orderNumber: string, status: OrderDetails['status']) => void;
}

export const CourierPortal: React.FC<CourierPortalProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [filter, setFilter] = useState<'all' | 'ready' | 'out_for_delivery' | 'delivered'>('all');

  const courierOrders = orders.filter((o) => {
    if (filter === 'ready') return o.status === 'ready_for_shipping';
    if (filter === 'out_for_delivery') return o.status === 'out_for_delivery';
    if (filter === 'delivered') return o.status === 'delivered';
    return (
      o.status === 'ready_for_shipping' ||
      o.status === 'out_for_delivery' ||
      o.status === 'delivered'
    );
  });

  return (
    <div className="min-h-screen bg-stone-100/90 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Portal Header */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900">
                  بوابة الشحن والتوصيل (مندوبي القاهرة والجيزة)
                </h1>
                <span className="text-xs bg-sky-100 text-sky-900 font-semibold px-2 py-0.5 rounded">
                  أسطول التوصيل
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                توزيع ومتابعة تسليم ملابس الأطفال المطبوعة لباب منزل العائلات في القاهرة والمحافظات
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              الكل ({courierOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('ready')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                filter === 'ready'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              جاهز للاستلام ({orders.filter((o) => o.status === 'ready_for_shipping').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('out_for_delivery')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                filter === 'out_for_delivery'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              قيد التوصيل ({orders.filter((o) => o.status === 'out_for_delivery').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('delivered')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                filter === 'delivered'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              تم التسليم ({orders.filter((o) => o.status === 'delivered').length})
            </button>
          </div>
        </div>

        {/* Courier Cards List */}
        {courierOrders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-400 space-y-3">
            <Package className="w-12 h-12 mx-auto text-stone-300" />
            <h3 className="text-base font-bold text-stone-800">لا توجد شحنات مطابقة للفلتر المحدد</h3>
            <p className="text-xs text-stone-500">سيتم إشعارك فور اكتمال طباعة أي طلب في المطبعة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courierOrders.map((order) => {
              const formattedPhone = order.phone.replace(/^0/, '+20');

              return (
                <div
                  key={order.orderNumber}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <span className="font-mono font-bold text-sm text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-stone-400 mr-2">{order.date}</span>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          order.status === 'ready_for_shipping'
                            ? 'bg-amber-100 text-amber-900'
                            : order.status === 'out_for_delivery'
                            ? 'bg-sky-100 text-sky-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {order.status === 'ready_for_shipping' && <Clock className="w-3.5 h-3.5" />}
                        {order.status === 'out_for_delivery' && <Truck className="w-3.5 h-3.5" />}
                        {order.status === 'delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>
                          {order.status === 'ready_for_shipping'
                            ? 'جاهز للاستلام من المطبعة'
                            : order.status === 'out_for_delivery'
                            ? 'مع المندوب - قيد التوصيل'
                            : 'تم التسليم بنجاح'}
                        </span>
                      </span>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[11px]">اسم العميل / الأم:</span>
                        <span className="font-bold text-sm text-stone-900">{order.customerName}</span>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-stone-900 block">{order.city}</span>
                          <span className="text-stone-600 leading-relaxed block mt-0.5">
                            {order.address}
                          </span>
                        </div>
                      </div>

                      {/* Direct WhatsApp & Call Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={`https://wa.me/${formattedPhone.replace(/\+/g, '')}?text=${encodeURIComponent(
                            `مرحباً أستاذة ${order.customerName}، معكم مندوب متجر 2BabyPrint لتوصيل طلبكم رقم ${order.orderNumber} لملابس الأطفال المخصصة.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>محادثة واتساب</span>
                        </a>

                        <a
                          href={`tel:${order.phone}`}
                          className="py-2 px-3 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors font-mono"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{order.phone}</span>
                        </a>
                      </div>

                      {/* Payment Notice (Prepaid, No COD) */}
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold">مدفوع مسبقاً بالكامل (تحصيل 0 ج.م)</span>
                        </div>
                        <span className="font-mono font-bold">{order.total} ج.م</span>
                      </div>
                    </div>
                  </div>

                  {/* Courier Action Button */}
                  <div className="pt-3 border-t border-stone-100">
                    {order.status === 'ready_for_shipping' && (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.orderNumber, 'out_for_delivery')}
                        className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                      >
                        <Truck className="w-4 h-4" />
                        <span>استلام الشحنة من المطبعة والتحرك للعميل</span>
                      </button>
                    )}

                    {order.status === 'out_for_delivery' && (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.orderNumber, 'delivered')}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تأكيد تسليم الطلب للعميل بنجاح ✅</span>
                      </button>
                    )}

                    {order.status === 'delivered' && (
                      <div className="text-center text-xs font-semibold text-emerald-700 py-1">
                        ✓ تم التوصيل واستلام العميل للطلب بنجاح
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
