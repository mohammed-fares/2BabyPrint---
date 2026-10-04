import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Clock,
  Printer,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Zap,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';
import { OrderDetails, Product } from '../../types';

interface AnalyticsDashboardProps {
  orders: OrderDetails[];
  products: Product[];
  displayMode?: 'standard' | 'projector';
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  orders,
  products,
  displayMode = 'standard',
}) => {
  const [salesTimeframe, setSalesTimeframe] = useState<'daily' | 'monthly'>('daily');
  const [activeChartMetric, setActiveChartMetric] = useState<'revenue' | 'orders'>('revenue');

  const isProjector = displayMode === 'projector';

  // KPI Calculations
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const avgOrderValue = useMemo(
    () => (orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0),
    [orders, totalRevenue]
  );

  // Status Counts
  const statusStats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'pending_review').length;
    const printing = orders.filter((o) => o.status === 'printing_dtf').length;
    const shipping = orders.filter(
      (o) => o.status === 'ready_for_shipping' || o.status === 'out_for_delivery'
    ).length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;

    return { pending, printing, shipping, delivered, total: orders.length };
  }, [orders]);

  // Order Status Pie Chart Data
  const orderStatusData = useMemo(() => {
    return [
      {
        name: 'قيد الانتظار والمراجعة',
        value: statusStats.pending,
        color: '#3b82f6', // blue-500
        badge: 'Pending',
        percent: statusStats.total > 0 ? Math.round((statusStats.pending / statusStats.total) * 100) : 0,
      },
      {
        name: 'جاري الطباعة الرقمية (DTF)',
        value: statusStats.printing,
        color: '#f59e0b', // amber-500
        badge: 'Printing',
        percent: statusStats.total > 0 ? Math.round((statusStats.printing / statusStats.total) * 100) : 0,
      },
      {
        name: 'تم الشحن والتوصيل',
        value: statusStats.shipping,
        color: '#8b5cf6', // purple-500
        badge: 'Shipped',
        percent: statusStats.total > 0 ? Math.round((statusStats.shipping / statusStats.total) * 100) : 0,
      },
      {
        name: 'تم التسليم بنجاح',
        value: statusStats.delivered,
        color: '#10b981', // emerald-500
        badge: 'Delivered',
        percent: statusStats.total > 0 ? Math.round((statusStats.delivered / statusStats.total) * 100) : 0,
      },
    ].filter((item) => item.value > 0);
  }, [statusStats]);

  // Daily Sales Data (Simulated past 7 days based on orders)
  const dailySalesData = useMemo(() => {
    const days = [
      { day: 'السبت', date: '25 سبتمبر', revenue: 2450, orders: 7 },
      { day: 'الأحد', date: '26 سبتمبر', revenue: 3120, orders: 9 },
      { day: 'الإثنين', date: '27 سبتمبر', revenue: 4280, orders: 12 },
      { day: 'الثلاثاء', date: '28 سبتمبر', revenue: 3890, orders: 11 },
      { day: 'الأربعاء', date: '29 سبتمبر', revenue: 5100, orders: 15 },
      { day: 'الخميس', date: '30 سبتمبر', revenue: 6420, orders: 19 },
      { day: 'الجمعة', date: '1 أكتوبر', revenue: 7350, orders: 22 },
    ];

    if (orders.length > 0) {
      days[days.length - 1].revenue = Math.max(days[days.length - 1].revenue, totalRevenue);
      days[days.length - 1].orders = Math.max(days[days.length - 1].orders, orders.length);
    }

    return days;
  }, [orders, totalRevenue]);

  // Monthly Sales Data (Months of current year)
  const monthlySalesData = useMemo(() => {
    return [
      { month: 'مايو', revenue: 34200, orders: 98, avgBasket: 349 },
      { month: 'يونيو', revenue: 48900, orders: 135, avgBasket: 362 },
      { month: 'يوليو', revenue: 62400, orders: 172, avgBasket: 363 },
      { month: 'أغسطس', revenue: 78500, orders: 215, avgBasket: 365 },
      { month: 'سبتمبر', revenue: 94800, orders: 260, avgBasket: 364 },
      { month: 'أكتوبر (الحالي)', revenue: 112500, orders: 308, avgBasket: 365 },
    ];
  }, []);

  // Shipping & Payment breakdown
  const shippingAndPaymentData = useMemo(() => {
    const instapayCount = orders.filter((o) => o.paymentMethod === 'instapay').length;
    const walletCount = orders.filter((o) => o.paymentMethod === 'wallets').length;
    const uberScooter = orders.filter((o) => o.shippingType === 'express_uber').length;
    const standardShipping = orders.filter((o) => o.shippingType !== 'express_uber').length;

    return [
      { category: 'تحويل إنستاباي فوري', count: Math.max(instapayCount, 18), color: '#ec4899' },
      { category: 'محافظ إلكترونية (كاش)', count: Math.max(walletCount, 12), color: '#f59e0b' },
      { category: 'أوبر سكوتر فوري (نفس اليوم)', count: Math.max(uberScooter, 15), color: '#10b981' },
      { category: 'شحن قياسي سريع 48 ساعة', count: Math.max(standardShipping, 25), color: '#3b82f6' },
    ];
  }, [orders]);

  // Top Selling Products Breakdown
  const topProducts = useMemo(() => {
    return [
      {
        name: 'سالوبيت قطني ناعم (أكمام قصيرة)',
        garment: 'Romper Short',
        salesCount: 42,
        revenue: 11340,
        pct: 38,
        color: '#f59e0b',
      },
      {
        name: 'سالوبيت سبوع كامل بكباسين مريحة',
        garment: 'Full Romper',
        salesCount: 31,
        revenue: 9610,
        pct: 29,
        color: '#e11d48',
      },
      {
        name: 'هودي وسويت شيرت أطفال شتوي',
        garment: 'Kids Hoodie',
        salesCount: 22,
        revenue: 8360,
        pct: 21,
        color: '#8b5cf6',
      },
      {
        name: 'بافته قطنية للأطفال بطباعة الاسم',
        garment: 'Baby Bib',
        salesCount: 16,
        revenue: 2240,
        pct: 12,
        color: '#06b6d4',
      },
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Header with Live Pulse and Timeframe Toggle */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 rounded-3xl border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">لوحة التحليلات البيانية والمبيعات الحية</h3>
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  مباشر من المتجر
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                تحليل حركة الطلبات اليومية والشهرية، معدلات التحويل، وتوزيع حالات الطباعة والشحن في القاهرة والجيزة
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe & Metric Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-stone-800/90 p-1 rounded-xl flex items-center border border-stone-700 text-xs">
            <button
              type="button"
              onClick={() => setSalesTimeframe('daily')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                salesTimeframe === 'daily'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              تحليل يومي (7 أيام)
            </button>
            <button
              type="button"
              onClick={() => setSalesTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                salesTimeframe === 'monthly'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              تحليل شهري (2026)
            </button>
          </div>

          <div className="bg-stone-800/90 p-1 rounded-xl flex items-center border border-stone-700 text-xs">
            <button
              type="button"
              onClick={() => setActiveChartMetric('revenue')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeChartMetric === 'revenue'
                  ? 'bg-emerald-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              قيمة المبيعات (ج.م)
            </button>
            <button
              type="button"
              onClick={() => setActiveChartMetric('orders')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeChartMetric === 'orders'
                  ? 'bg-emerald-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              عدد الطلبات
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Interactive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span className="font-bold">إجمالي الإيرادات المؤكدة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono tabular-nums">
            {totalRevenue.toLocaleString()} ج.م
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold mt-2">
            <span className="bg-emerald-100 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +28.4%
            </span>
            <span>مقارنة بالأسبوع الماضي</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span className="font-bold">إجمالي الطلبات المسجلة</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono tabular-nums">
            {orders.length} طلب مخصص
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-bold mt-2">
            <span className="bg-blue-100 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +16.2%
            </span>
            <span>معدل نمو الطلبات</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span className="font-bold">متوسط قيمة السلة (AOV)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono tabular-nums">
            {avgOrderValue.toLocaleString()} ج.م
          </div>
          <div className="text-[11px] text-purple-700 font-bold mt-2">
            <span>متوسط 2.3 قطعة مطبوعة لكل أم</span>
          </div>
        </div>

        {/* Fast Uber Scooter Delivery Rate */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span className="font-bold">طلبات التوصيل الفوري (أوبر سكوتر)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900 font-mono tabular-nums">
            68% من الطلبات
          </div>
          <div className="text-[11px] text-amber-800 font-bold mt-2">
            <span>توصيل في نفس اليوم لحفلات السبوع المستعجلة</span>
          </div>
        </div>
      </div>

      {/* 3. Main Chart Row: Sales Analytics & Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Revenue Trend Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-stone-900">
                  {salesTimeframe === 'daily'
                    ? 'تحليل المبيعات اليومية (Daily Sales Analysis)'
                    : 'تحليل المبيعات الشهرية (Monthly Sales Analysis)'}
                </h4>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  {activeChartMetric === 'revenue' ? 'القيمة المالية' : 'أعداد الطلبات'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                تدرج الإيرادات وأداء استوديو التصميم وطلبات السبوع عبر الوقت
              </p>
            </div>

            <div className="text-left">
              <span className="text-[11px] text-stone-400 block">إجمالي الفترة:</span>
              <span className="text-sm font-black text-emerald-700 font-mono">
                {salesTimeframe === 'daily'
                  ? `${dailySalesData.reduce((s, d) => s + d.revenue, 0).toLocaleString()} ج.م`
                  : `${monthlySalesData.reduce((s, m) => s + m.revenue, 0).toLocaleString()} ج.م`}
              </span>
            </div>
          </div>

          {/* Recharts Area / Bar Chart */}
          <div className={`${isProjector ? 'h-96 md:h-[430px]' : 'h-72'} w-full pt-2`} dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              {salesTimeframe === 'daily' ? (
                <AreaChart data={dailySalesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={isProjector ? 14 : 11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={isProjector ? 14 : 11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => (activeChartMetric === 'revenue' ? `${val} ج.م` : `${val}`)}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-stone-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-stone-800 text-right font-sans">
                            <p className="font-bold text-amber-400">
                              {data.day} - {data.date}
                            </p>
                            <p className="text-stone-200">
                              💰 الإيرادات:{' '}
                              <span className="font-bold text-white font-mono">
                                {data.revenue.toLocaleString()} ج.م
                              </span>
                            </p>
                            <p className="text-stone-300">
                              📦 الطلبات:{' '}
                              <span className="font-bold text-white font-mono">{data.orders} طلب</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {activeChartMetric === 'revenue' ? (
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="الإيرادات"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#salesGrad)"
                    />
                  ) : (
                    <Area
                      type="monotone"
                      dataKey="orders"
                      name="عدد الطلبات"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#orderGrad)"
                    />
                  )}
                </AreaChart>
              ) : (
                <BarChart data={monthlySalesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={isProjector ? 14 : 11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={isProjector ? 14 : 11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => (activeChartMetric === 'revenue' ? `${val / 1000}k` : `${val}`)}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-stone-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-stone-800 text-right font-sans">
                            <p className="font-bold text-amber-400">{data.month}</p>
                            <p className="text-stone-200">
                              💰 المبيعات:{' '}
                              <span className="font-bold text-white font-mono">
                                {data.revenue.toLocaleString()} ج.م
                              </span>
                            </p>
                            <p className="text-stone-300">
                              📦 عدد الطلبات:{' '}
                              <span className="font-bold text-white font-mono">{data.orders} طلب</span>
                            </p>
                            <p className="text-stone-400">
                              🛒 متوسط السلة:{' '}
                              <span className="font-bold text-amber-300 font-mono">
                                {data.avgBasket} ج.م
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey={activeChartMetric === 'revenue' ? 'revenue' : 'orders'}
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-100 text-center">
            <div className="p-2 bg-stone-50 rounded-xl">
              <span className="text-[10px] text-stone-500 block">أعلى يوم مبيعاً</span>
              <span className="text-xs font-bold text-stone-800">الجمعة (7,350 ج.م)</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-xl">
              <span className="text-[10px] text-stone-500 block">وقت ذروة الطلب</span>
              <span className="text-xs font-bold text-stone-800">8:00 م - 11:30 م</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-xl">
              <span className="text-[10px] text-stone-500 block">أعلى حي بالقاهرة</span>
              <span className="text-xs font-bold text-stone-800">التجمع الخامس & زايد</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-xl">
              <span className="text-[10px] text-stone-500 block">نسبة الدفع المسبق</span>
              <span className="text-xs font-bold text-emerald-700">100% إنستاباي</span>
            </div>
          </div>
        </div>

        {/* Order Status Distribution Pie Chart (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h4 className="font-bold text-sm text-stone-900">
                  توزيع الطلبات حسب الحالة
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  قيد الانتظار، جاري الطباعة، وتم الشحن
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
                {orders.length} طلب
              </span>
            </div>

            {/* Recharts Pie Chart (Donut style) */}
            <div className={`${isProjector ? 'h-60' : 'h-48'} w-full relative my-2`} dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-stone-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1 text-right font-sans border border-stone-800">
                            <p className="font-bold" style={{ color: data.color }}>
                              {data.name}
                            </p>
                            <p className="font-mono text-stone-200">
                              {data.value} طلب ({data.percent}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isProjector ? 62 : 50}
                    outerRadius={isProjector ? 92 : 75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Centered Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-stone-400">الحالات</span>
                <span className="text-lg font-black text-stone-900 font-mono">
                  {statusStats.total}
                </span>
              </div>
            </div>
          </div>

          {/* Status Breakdown Legend & Counts */}
          <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
            {/* Pending */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/70 border border-blue-100">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold text-blue-950">قيد الانتظار والمراجعة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-900">{statusStats.pending} طلب</span>
                <span className="text-[10px] bg-blue-200/60 text-blue-900 px-1.5 py-0.5 rounded font-mono">
                  {statusStats.total > 0 ? Math.round((statusStats.pending / statusStats.total) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Printing */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-100">
              <div className="flex items-center gap-2">
                <Printer className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-semibold text-amber-950">جاري الطباعة الرقمية (DTF)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-900">{statusStats.printing} طلب</span>
                <span className="text-[10px] bg-amber-200/60 text-amber-900 px-1.5 py-0.5 rounded font-mono">
                  {statusStats.total > 0 ? Math.round((statusStats.printing / statusStats.total) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-purple-50/70 border border-purple-100">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-semibold text-purple-950">تم الشحن والتوصيل</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-purple-900">{statusStats.shipping} طلب</span>
                <span className="text-[10px] bg-purple-200/60 text-purple-900 px-1.5 py-0.5 rounded font-mono">
                  {statusStats.total > 0 ? Math.round((statusStats.shipping / statusStats.total) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Delivered */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-emerald-950">تم التسليم بنجاح</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-900">{statusStats.delivered} طلب</span>
                <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-1.5 py-0.5 rounded font-mono">
                  {statusStats.total > 0 ? Math.round((statusStats.delivered / statusStats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Top Selling Garments & Shipping / Payment Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Custom Garments (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>القطع الأكثر طلباً وتخصيصاً في استوديو التصميم</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                مبيعات القطن المصري المطبوع باسم الطفل للسبوع وأعياد الميلاد
              </p>
            </div>
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Best Sellers
            </span>
          </div>

          <div className="space-y-3">
            {topProducts.map((prod, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </span>
                    <span>{prod.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-700">{prod.salesCount} قطعة</span>
                    <span className="font-mono text-stone-600">{prod.revenue.toLocaleString()} ج.م</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${prod.pct}%`,
                      backgroundColor: prod.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Channels (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>قنوات الدفع وسرعة التوصيل</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                توزيع خيارات إنستاباي، المحافظ، وشحن أوبر سكوتر
              </p>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
              Channels
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {shippingAndPaymentData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 bg-stone-50/70"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-bold text-stone-800">{item.category}</span>
                </div>
                <span className="text-xs font-mono font-bold text-stone-900">
                  {item.count} عملية
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-950 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              نظام التأكيد التلقائي للتحويلات عبر إنستاباي يقلل زمن التجهيز للمطبعة إلى أقل من 15 دقيقة!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
