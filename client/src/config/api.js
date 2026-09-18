/**
 * إعدادات رابط خادم الـ Backend (Backend API Configuration)
 * 
 * يمكنك تغيير الرابط هنا مباشرة، أو تعيينه من خلال متغير البيئة VITE_API_URL في ملف .env
 */

export const BACKEND_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:7000'
).replace(/\/+$/, '');

// تصدير كـ API_BASE_URL للتوافق
export const API_BASE_URL = BACKEND_URL;

// نقاط النهاية (API Endpoints)
export const API_ENDPOINTS = {
  content: `${BACKEND_URL}/api/content`,
  vetrine: `${BACKEND_URL}/api/vetrine`,
  liveCategories: `${BACKEND_URL}/api/live-channels/categories`,
  liveChannels: `${BACKEND_URL}/api/live-channels`,
  syncLiveChannels: `${BACKEND_URL}/api/live-channels/sync`,
  categoryCrud: `${BACKEND_URL}/api/live-channels/category`,
  channelCrud: `${BACKEND_URL}/api/live-channels/channel`,
};

export default BACKEND_URL;
