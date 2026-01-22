# PremiumVIP Salon Booking (Vanilla HTML/CSS/JS + Supabase)

## 1) الإعداد السريع
1. ضع ملفات الموقع على أي استضافة Static (Netlify / Vercel Static / Cloudflare Pages / أي سيرفر).
2. عدّل `public/assets/config.js`:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. في Supabase:
   - Authentication → URL Configuration
     - Site URL = رابط موقعك
     - Redirect URLs أضف:
       - https://YOUR_DOMAIN/reset-password.html

## 2) Storage Buckets المطلوبة (للصور)
أنشئ Buckets:
- `salon-images`
- `staff-images`

واجعلها Public (أو أضف signed urls لاحقًا).
> إذا لم تجعلها Public ستحتاج تعديل الكود ليستخدم Signed URL.

## 3) أعمدة صور في قاعدة البيانات
إذا لم تكن موجودة عندك، نفّذ SQL:

```sql
alter table public.salons add column if not exists image_url text;
alter table public.specialists add column if not exists image_url text;
```

## 4) ملاحظة بخصوص الحجز (availability/create-booking)
صفحة `book.html` تتوقع أنك نشرت Edge Functions:
- availability
- create-booking

ثم ضع روابطها في `assets/config.js` (FN_AVAILABILITY / FN_CREATE_BOOKING).

## 5) صفحات أساسية
- `index.html` قائمة الصالونات
- `salon.html` تفاصيل صالون + خدمات + أخصائيات
- `book.html` اختيار موعد (يتطلب تسجيل دخول)
- `my-bookings.html` حجوزات العميل
- `dashboard.html` لوحة الموظفين
- `services.html` إدارة الخدمات
- `specialists.html` إدارة الأخصائيات + صور
- `settings.html` إعدادات الصالون + صورة الصالون + الفروع
- `login.html` / `forgot-password.html` / `reset-password.html` / `profile.html`

## 6) Responsive
الواجهة Mobile-first للعميل (index/salon/book) والداشبورد يعمل على الكمبيوتر ويتأقلم على الموبايل.
الخط العربي: Cairo.

## 7) تسجيل الصالون + موافقة الإدارة + التجربة (جديد)
تم إضافة صفحات:
- `register.html` بوابة اختيار (عميل / صالون)
- `register-customer.html` تسجيل عميل
- `register-salon.html` تسجيل صالون (ينشئ Salon بحالة pending)
- `waiting-approval.html` صفحة انتظار الموافقة
- `admin.html` / `admin-salons.html` / `admin-customers.html` شاشة إدارة المنصة

### قاعدة البيانات المطلوبة
نفّذ الملف:
- `sql/platform-admin-and-approval.sql`

### Bootstrap لأول Admin
بعد إنشاء حساب الإدارة عبر Supabase Auth:
- أدخل `user_id` الخاص به في جدول `platform_admins` من SQL Editor.

### ملاحظة أمنية مهمّة
إنشاء الصالون (salon/branch/owner role) الأفضل يتم عبر Edge Function باستخدام Service Role.
الواجهة جاهزة ويمكن تحويل خطوة إنشاء الصالون إلى Edge Function بسهولة.
