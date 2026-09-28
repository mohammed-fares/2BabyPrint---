import { Coupon } from '../types';

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 200,
    isActive: true,
    description: 'خصم ترحيبي 10% لعملاء القاهرة الجدد',
    usageCount: 42,
  },
  {
    id: 'cpn-2',
    code: 'CAIRO50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 400,
    isActive: true,
    description: 'خصم 50 ج.م على الطلبات بقيمة 400 ج.م فأكثر',
    usageCount: 18,
  },
  {
    id: 'cpn-3',
    code: 'MOM2026',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 500,
    isActive: true,
    description: 'خصم خاص للأمهات 15% على تصاميم حديثي الولادة',
    usageCount: 29,
  },
];
