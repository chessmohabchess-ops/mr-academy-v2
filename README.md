# MR-Academy

منصة تعليمية عربية RTL مبنية كتطبيق Full-Stack باستخدام **Next.js App Router + PostgreSQL + Drizzle ORM**. البيانات المعروضة في الصفحة الرئيسية ولوحات الطالب والإدارة تأتي من قاعدة البيانات، وليست Mock Data.

## القرارات المعمارية

- **Frontend/Backend:** Next.js 16 App Router، Server Components وRoute Handlers.
- **Database:** PostgreSQL مع Drizzle، مفاتيح خارجية وفهارس وقيود Check وUnique.
- **Authentication:** جلسات Opaque آمنة داخل Cookies من نوع HttpOnly/SameSite، وتخزين Hash للرمز في قاعدة البيانات. كلمات المرور بـ bcrypt (cost 12).
- **Authorization:** فحص Server-side في Admin layout وواجهات API، مع IDOR checks للدروس والكورسات.
- **Validation:** Zod على الخادم وقيود PostgreSQL لأرقام المحمول المصرية.
- **Video:** موصل S3-compatible (AWS S3 / Cloudflare R2 / MinIO) يولد Signed URL لمدة 5 دقائق بعد فحص الحساب والتسجيل وعلاقة الدرس بالكورس.
- **Payments:** عقد `PaymentProvider` وموصل Paymob Intention API الحقيقي. Webhook HMAC-SHA512 هو مصدر الحقيقة.
- **Deployment:** Node.js runtime مع PostgreSQL وخدمة Object Storage خاصة.

## تشغيل محلي

1. ثبّت Node.js 20+ وPostgreSQL.
2. نفّذ `npm install`.
3. انسخ `.env.example` إلى `.env` واملأ `DATABASE_URL`، مثال محلي: `postgresql://postgres:postgres@127.0.0.1:5432/app_db`.
4. طبّق المخطط: `npx drizzle-kit push`.
5. أنشئ أول Admin بالطريقة الآمنة الموضحة أدناه.
6. شغّل: `npm run dev` ثم افتح `http://localhost:3000`.

## إنشاء أول Admin

ضع مؤقتًا في `.env`: `INITIAL_ADMIN_NAME` و`INITIAL_ADMIN_PHONE` و`INITIAL_ADMIN_EMAIL` و`INITIAL_ADMIN_PASSWORD` (12 حرفًا على الأقل)، ثم:

`npx tsx src/db/create-admin.ts`

الأداة ترفض العمل إذا كان هناك Admin بالفعل. احذف متغيرات الإعداد بعد التنفيذ. التسجيل العام ينشئ `STUDENT` فقط ولا يقبل Role من المتصفح.

## بيانات العرض والـSeed

`SEED_DEMO=true npx tsx src/db/seed.ts`

ينشئ 3 كورسات مع أقسام ودروس واختبارات، وحسابين واضحين للمعاينة فقط:

- Admin: `01111111111` / `Demo@12345`
- Student: `01000000000` / `Demo@12345`

الطالب التجريبي مسجل في أول كورس عبر Enrollment حقيقي. لا تشغّل Demo seed في الإنتاج، واحذف هذه الحسابات قبل الإطلاق.

## تجاوز الإدارة في Arena Preview

عند اكتشاف `E2B_SANDBOX` تسمح `requireAdmin()` بفتح `/admin` و`/admin/courses` مباشرة لتلبية المعاينة. زر **دخول سريع كـ Admin** في `/login` يفتح `/admin/courses`.

- للإغلاق صراحة: `PREVIEW_ADMIN_BYPASS=false`.
- لبيئة Preview خارج Arena فقط: `PREVIEW_ADMIN_BYPASS=true`.
- **في الإنتاج يجب ضبطه `false`**. عدم وجود E2B وعدم ضبط القيمة `true` يعني أن الإدارة محمية بجلسة Admin حقيقية.

## إدارة المحتوى

من `/admin/courses`:

1. اضغط **كورس جديد** لإنشاء كورس وقسم ودرس أولي.
2. افتح بطاقة الكورس وعدّل الاسم والوصف والسعر والمدرس والمدة والحالة.
3. عدّل أسماء الدروس وأضف رابط فيديو HTTPS مباشر عند الحاجة.
4. اضغط **حفظ التعديلات**. الاسم والوصف والسعر يظهرون فورًا في الصفحة الرئيسية والكتالوج لأنهما يقرآن PostgreSQL مباشرة.

للإنتاج المدفوع، لا تستخدم رابط فيديو عام. ارفع الملف إلى bucket خاص وضع `storageKey` في `video_assets` أو أضف لاحقًا شاشة رفع تستخدم Presigned PUT. المسار الحالي يولد Presigned GET للمفاتيح الخاصة ولا يرسل مفاتيح التخزين للمتصفح.

## ربط تخزين الفيديو

املأ `VIDEO_STORAGE_ENDPOINT`, `VIDEO_STORAGE_BUCKET`, `VIDEO_STORAGE_REGION`, `VIDEO_STORAGE_ACCESS_KEY`, `VIDEO_STORAGE_SECRET_KEY`. يدعم الموصل خدمات S3-compatible. اجعل الـBucket خاصًا، امنع Public ACL، واضبط CORS على نطاق المنصة فقط. صلاحية التشغيل 300 ثانية ويتم إنشاؤها بعد:

1. Session صالحة.
2. حساب Active.
3. Enrollment Active وغير منتهٍ.
4. تطابق course/lesson.
5. تطابق الدرس مع الكورس المطلوب.

## ربط Paymob (مصر)

يلزم حساب تاجر Paymob وتفعيل طرق الدفع المطلوبة. التكامل يستخدم Intention API الرسمي وليس Mock Payment.

1. اضبط `PAYMENT_PROVIDER=PAYMOB`.
2. من Paymob Dashboard → Settings → API Keys انسخ Secret/Public/HMAC إلى `PAYMENT_SECRET_KEY`, `PAYMENT_PUBLIC_KEY`, `PAYMENT_WEBHOOK_SECRET`.
3. اضبط `PAYMOB_BASE_URL=https://accept.paymob.com`.
4. اضبط `PAYMOB_INTEGRATION_ID_CARD` من Payment Integrations. أضف IDs للمحفظة/الكشك عند تفعيلها.
5. اضبط `APP_URL` على HTTPS عام.
6. Webhook URL: `https://YOUR_DOMAIN/api/payments/paymob/webhook`.
7. Redirect UX: `https://YOUR_DOMAIN/payment/result`؛ لا يُستخدم لتأكيد الدفع.

الـWebhook يتحقق من HMAC-SHA512 بالترتيب الرسمي، transaction id، order id، amount، currency والحالة. التحديث يتم في transaction ويستخدم Unique provider transaction وUnique enrollment؛ التكرار لا ينشئ وصولًا ثانيًا. Paymob يدعم Refund للطرق المؤهلة؛ kiosk/Fawry قد لا يدعم الاسترداد ويجب إظهار ذلك تشغيليًا قبل استدعائه. InstaPay يحتاج منتج/اتفاق تاجر متاح من المزود؛ لا توجد محاكاة له داخل المشروع.

### اختبار الدفع

استخدم مفاتيح Test وIntegration IDs من نفس الوضع. أنشئ طالبًا، افتح كورسًا، ابدأ Checkout، ثم أكمل ببيانات Paymob Sandbox. تأكد من وصول POST الموقع إلى Webhook وأن `payments.status=PAID`, `orders.status=PAID`, `enrollments.status=ACTIVE`. الطالب غير المدفوع يتلقى 403 من playback endpoint حتى لو غيّر IDs يدويًا.

## الأمان والخصوصية

- أرقام الطالب وولي الأمر والأم لا تظهر إلا للطالب في نطاقه المسموح أو داخل Admin.
- لا توضع أرقام الهاتف في URLs أو query params.
- لا يتم إرسال `passwordHash` أو Correct Answers للمتصفح.
- تسجيل الطلاب لا يقبل Role؛ الإنشاء دائمًا STUDENT.
- Cookies HttpOnly وSecure في الإنتاج.
- محدد محاولات على الدخول والتسجيل. في بيئة multi-instance استخدم Redis بدل الذاكرة المحلية.
- Audit logs لا تسجل Passwords أو Secrets أو payloads حساسة.
- حذف الكورس مرفوض عند وجود سجل مالي محمي بقيد FK.
- حذف الطالب في الإنتاج يجب أن يكون Anonymization workflow مع الاحتفاظ بالمرجع المالي الضروري؛ لا تحذف Orders/Payments القانونية بلا سياسة احتفاظ معتمدة.

## الجداول

`users`, `sessions`, `courses`, `sections`, `lessons`, `video_assets`, `enrollments`, `orders`, `payments`, `quizzes`, `questions`, `answers`, `quiz_attempts`, `quiz_responses`, `progress`, `coupons`, `coupon_redemptions`, `audit_logs`, `platform_settings`.

## النشر Production

1. استخدم PostgreSQL مُدارًا مع TLS ونسخ احتياطي Point-in-Time.
2. خزّن الأسرار في Secret Manager الخاص بالمنصة، وليس Git.
3. اضبط `PREVIEW_ADMIN_BYPASS=false` حتمًا.
4. استخدم HTTPS واضبط `APP_URL` على النطاق النهائي.
5. نفّذ `npm install`, `npx drizzle-kit push` (أو migrations مُراجعة), `npm run build`, ثم `npm run start` عبر مدير العمليات في منصة النشر.
6. اضبط Paymob webhook على النطاق النهائي واختبر Test ثم Live بمبالغ صغيرة.
7. اجعل Object Storage خاصًا ودوّر Access Keys دوريًا.
8. راقب أخطاء Webhook والمدفوعات المعلقة وأضف reconciliation job عند زيادة الحجم.

## Backup واستعادة PostgreSQL

نسخة مشفرة: `pg_dump --format=custom "$DATABASE_URL" > mr-academy.dump`

استعادة في قاعدة جديدة: `pg_restore --clean --if-exists --no-owner --dbname="$NEW_DATABASE_URL" mr-academy.dump`

اختبر الاستعادة دوريًا، وحدد retention قانوني للمدفوعات ومدة حذف البيانات الشخصية.

## فحوصات ما قبل الإطلاق

- تسجيل/دخول/خروج وجلسة منتهية وحساب موقوف.
- طالب لا يفتح `/admin` عند إغلاق Preview bypass.
- Course A لا يمنح Lesson من Course B.
- Enrollment revoked/suspended يوقف Signed URL فورًا.
- Webhook خاطئ أو مكرر أو مبلغ/عملة غير مطابق لا يفتح الكورس.
- Coupon منتهي/متوقف/مستنفد لا يغير السعر.
- Correct answers لا تظهر في HTML أو API الأسئلة.
- اختبر Mobile/Tablet/Desktop وقارئ لوحة المفاتيح ورسائل الخطأ.

## TODO خارجي صريح

- إضافة credentials وحساب Paymob وتفعيل Visa/Fawry/InstaPay بحسب عقد التاجر.
- إنشاء bucket خاص ورفع ملفات الفيديو الفعلية.
- ربط مزود Email/SMS إن أُريد استرجاع كلمة مرور آلي؛ حاليًا الاسترجاع الآمن عبر الدعم `01023316767` بدل ادعاء إرسال رسالة غير موجودة.
- استخدام Redis managed للـrate limiting عند التشغيل على أكثر من instance.
