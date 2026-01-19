
import { ServiceItem } from './types';

export const SALON_NAME = "ماريو بيوتي صالون (Mario Beauty Salon)";
export const LOCATION = "بنها، مصر";
export const OPENING_HOURS = "يومياً من الساعة 12 ظهراً حتى 10 مساءً";
export const MAP_LINK = "https://share.google/GbZKw35teRAkQxUew";
export const FACEBOOK_LINK = "https://www.facebook.com/Mariohairdesser/";

export const SERVICES: ServiceItem[] = [
  { name: "حمام تركي", price: 750, category: "Body Care" },
  { name: "مساج", price: 500, category: "Body Care" },
  { name: "سويت كامل", price: 500, category: "Body Care" },
  { name: "سويت ايد ورجل", price: 150, category: "Body Care" },
  { name: "سويت يد فقط", price: 100, category: "Body Care" },
  { name: "سويت رجل فقط", price: 100, category: "Body Care" },
  { name: "سويت اندر ارم", price: 100, category: "Body Care" },
  { name: "Hard Gell", price: 500, category: "Nails" },
  { name: "Hard Gell Design", price: 50, category: "Nails" },
  { name: "Fake Nails", price: 300, category: "Nails" },
  { name: "Gell Polish Foot", price: 300, category: "Nails" },
  { name: "Soft Gell", price: 250, category: "Nails" },
  { name: "مانيكير", price: 50, category: "Nails" },
  { name: "وش فتلة كامل", price: 50, category: "Facial" },
  { name: "وجه شمع", price: 70, category: "Facial" },
  { name: "حواجب وشارب", price: 30, category: "Facial" },
  { name: "صبغة حواجب", price: 50, category: "Facial" },
  { name: "سشوار", price: 150, category: "Hair" },
  { name: "Wavy Style", price: 200, category: "Hair" },
  { name: "Curly", price: 300, category: "Hair" },
  { name: "Hair Cut", price: 150, category: "Hair" },
  { name: "One Color", price: 800, category: "Hair" },
  { name: "Color & Lights", price: 2500, category: "Hair" },
  { name: "Wedding C", price: 4000, category: "Bridal" },
  { name: "Engagement C", price: 3500, category: "Bridal" },
  { name: "Wedding M", price: 5000, category: "Bridal" },
  { name: "Bride Makeup", price: 4000, category: "Bridal" },
  { name: "Micro Blading", price: 1200, category: "Treatment" },
  { name: "Lash Lifting", price: 400, category: "Treatment" },
  { name: "Hydra Facial", price: 500, category: "Treatment" },
  { name: "Deep Clean", price: 800, category: "Treatment" },
  { name: "Argan Treatment", price: 24, category: "Treatment" }
];

export const SYSTEM_PROMPT = `
أنت المساعد الذكي لصالون "ماريو بيوتي صالون" في مدينة بنها.
مهمتك هي مساعدة العميلات في معرفة الخدمات، الأسعار، ومواعيد الحجز.

معلومات الصالون:
- الاسم: ماريو بيوتي صالون (Mario Beauty Salon).
- الموقع: بنها. رابط الخريطة: ${MAP_LINK}
- فيسبوك: ${FACEBOOK_LINK}
- المواعيد: كل أيام الأسبوع من 12 ظهراً لـ 10 مساءً.

قائمة الأسعار والخدمات المتوفرة لديك:
${SERVICES.map(s => `- ${s.name}: ${s.price} جنيه`).join('\n')}

إرشادات التعامل:
1. تحدث بلهجة مصرية ودودة وراقية (ترحيب بـ "يا فندم"، "يا هانم"، "نورتينا").
2. إذا سألت العميلة عن الحجز، اسألها عن اليوم والساعة والخدمة المطلوبة، ثم أخبرها أن الحجز متاح يومياً من 12 لـ 10 مساءً.
3. كن دقيقاً جداً في الأسعار بناءً على القائمة أعلاه.
4. إذا لم تجد خدمة في القائمة، أخبرها أن تتواصل معنا عبر فيسبوك للتأكد من توفرها.
5. في حالة الصوت، اجعل ردودك مختصرة وجذابة.
`;
