import { loadStripe, Stripe } from '@stripe/stripe-js' //โหลดและกำหนดค่า Stripe SDK

let stripePromise: Promise<Stripe | null>; //let stripePromise เป็น Promise ของ Stripe โดยกำหนดให้เป็นค่าเริ่มต้นเป็น null
// {getStripe}
export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
            ''
        );
    }

    return stripePromise;
};
// ถ้า stripe ยังไม่ถูกกำหนด ใช้ load ...env
//ส่งกลับ  stripe
// getStripe จะใช้ในการโหลดและใช้งาน Stripe SDK
//  ในส่วนอื่นของโค้ด โดยการเรียกใช้ getStripe
//   จะได้รับ Promise ของ Stripe object
// เพื่อใช้ในการดำเนินการต่างๆ เช่นการสร้าง Checkout Session
// หรือการทำรายการการชำระเงินกับ Stripe API ในแอปพลิเคชันของคุณ


// npm install @stripe/stripe.js เชื่อมต่อ stripe

