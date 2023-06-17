import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/libs/stripe';
import { getURL } from '@/libs/helpers';
import { createOrRetrieveACustomer } from '@/libs/supabaseAdmin';

// {สร้าง session ชำระเงิน}
export async function POST(
    request: Request
) {
    const { price, quantity = 1, metadata = {} } = await request.json(); // ดึงข้อมูล จาก req.json หากไม่มีค่ากำหนดqua =1 meta ={} 

    try {
        const supabase = createRouteHandlerClient({
            cookies
        });
        // รับsession cookiesยืนยันตัวตน เชื่อมกับ supabase

        const { data: { user } } = await supabase.auth.getUser(); // supabase => getUser =>data user

        const customer = await createOrRetrieveACustomer({ // เรียกดูข้อมูลฐานลูกค้า supabase id,email
            uuid: user?.id || '',
            email: user?.email || '' // uuid,email คือค่าจาก data{user} =>ใช้createOrRetri เรียกดูข้อมูล => customer
        })


        {/* สร้าง sessionจาก stripe การชำระเงิน */ }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], //รับชำระเงินด้วยบัตรเครดิตหรือเดบิต
            billing_address_collection: 'required', //เก็บข้อมูลลูกค้าcustomer 
            customer,
            line_items: [ //รายการสินค้า
                {
                    price: price.id,
                    quantity
                }
            ],
            mode: 'subscription', //สมัครสมาชิค
            allow_promotion_codes: true,
            subscription_data: {
                trial_from_plan: true, // ทดลองใช้ฟรี
                metadata
            },
            success_url: `${getURL()}/account`, // ชำระเงินเสร็จกลับ getURL /account
            cancel_url: `${getURL()}` // ไม่สำเร็จกลับหน้าแรก
        })

        return NextResponse.json({ sessionId: session.id }) // ตอบกลับเซอเวอร์ รูปแบบ res json / sessionid = session.id ที่ได้จากฟังชั่นนี้
    } catch (error: any) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 }); // => error 
    }
}
