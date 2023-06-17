import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { stripe } from '@/libs/stripe';
import {
    upsertProductRecord,
    upsertPriceRecord,
    manageSubscriptionStatusChange
} from '@/libs/supabaseAdmin';

const relevantEvents = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
]);// set เก็บค่าเหตุการ event Webhooks จะส่งข้อมูลเหตุการณ์ดังกล่าวไปยังเซิร์ฟเวอร์

// {รับข้อมูล}
export async function POST(request: Request) { //request post 
    const body = await request.text(); // นำคำขออ่านเป็นข้อความ
    const sig = headers().get('Stripe-Signature'); //เก็บส่วนหัว Stripe-Signature

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) return;

        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        // ถ้าtrue สร้าง event  โดยใช้พารามิเตอร์ body (เนื้อหาของการร้องขอ) และ sig (Stripe-Signature) และ webhookSecret เป็นคีย์สำหรับยืนยันความถูกต้องของเหตุการณ์.
    } catch (error: any) {
        console.log('Error message: ' + error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }// หาก res error

    // {ใช้ฟั่งชั่นเพืออัพเดทจาก req}
    if (relevantEvents.has(event.type)) { // ถ้า ประเภท event อยู่ในrelevantEvents
        try {
            switch (event.type) {
                case 'product.created':
                case 'product.updated':
                    await upsertProductRecord(event.data.object as Stripe.Product);
                    break;
                //เรียกใช้ upsertProductRecord เพิ่มรายการ product
                case 'product.created':
                case 'product.updated':
                    await upsertPriceRecord(event.data.object as Stripe.Price);
                    //เรียกใช้ upsertPriceRecord เพิ่มรายการ price
                    break;
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription;  // แปลงevent เป็น stripe 
                    await manageSubscriptionStatusChange( // manageSubscriptionStatusChange ฟังชั่นจัดการสถานะ sub id,sub
                        subscription.id,
                        subscription.customer as string,
                        event.type === 'customer.subscription.created' // event === created ไหม พารามิเตอร์ที่ส่งไปมี id,customer =>mangesub
                    );
                    break;
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session; //event แปลง เป็น stripe
                    if (checkoutSession.mode === 'subscription') {
                        const subscriptionId = checkoutSession.subscription;
                        await manageSubscriptionStatusChange(
                            subscriptionId as string,
                            checkoutSession.customer as string,
                            true
                        );
                    }
                    break;
                default:
                    throw new Error('Unhanled relevant event!')
            }
        } catch (error) {
            console.log(error);
            return new NextResponse('Webhook error', { status: 400 });
        }
    }
    return NextResponse.json({ received: true }, { status: 200 }) // received" และค่า "true" เพื่อแสดงข้อมูลว่าการรับข้อมูลเป็นจริง
}

