import Stripe from 'stripe'; // api stripe
import { createClient } from '@supabase/supabase-js' // supabase

import { Database } from '@/types_db';
import { Price, Product } from '@types';

import { stripe } from './stripe'; // env 
import { toDateTime } from './helpers'; // time

// {create supabase}
export const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',//ดึง env ถ้าไม่มีให้ค่าเริ่มต้น '' ค่าว่างเริ่มต้น
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// **{update product api stripe}
const upsertProductRecord = async (product: Stripe.Product) => {
    // รับproductจาก stripe : type stripe.product  แปลงข้อมูลเป็น Product from @types เป็นโครงส้ราง 
    const productData: Product = { //productData มี : Product from @types เป็นโครงส้ราง 
        id: product.id, //แปลงข้อมูลจาก product stripe ทีรับเข้ามา
        active: product.active,
        name: product.name,
        description: product.description ?? undefined,
        image: product.images?.[0] ?? null,
        metadata: product.metadata
    } // Product from @types

    const { error } = await supabaseAdmin // supabaseadmin =>...from => upsert([productData])
        .from('products')
        .upsert([productData])

    if (error) {  //=>if error throw 
        throw error;
    }

    console.log(`Product inserted/updated: ${product.id}`) // !error console.log update product
}

// **{update Price api stripe เหมือนกับด้านบนมั้ง}
const upsertPriceRecord = async (price: Stripe.Price) => {
    const priceData: Price = {
        id: price.id,
        product_id: typeof price.product === 'string' ? price.product : '', // === string ไหม ถ้าไม่ string ให้เป็นค่าว่าง
        active: price.active,
        currency: price.currency,
        description: price.nickname ?? undefined,
        type: price.type,
        unit_amount: price.unit_amount ?? undefined,
        interval: price.recurring?.interval,
        interval_count: price.recurring?.interval_count, // recurring มีค่า จะกำหนดค่าเป็น  price.recurring?.interval_count
        trial_period_days: price.recurring?.trial_period_days,
        metadata: price.metadata
    }

    const { error } = await supabaseAdmin
        .from('prices')
        .upsert([priceData])

    if (error) {
        throw error;
    }

    console.log(`Product inserted/updated: ${price.id}`)
}

// **{เรียกดูข้อมูลลูกค้าในฐานข้อมูล supabase} ({email,uuid} : {email:string,uuid:string}) กำหนด typeให้ email,uuid ที่รับเข้ามา
const createOrRetrieveACustomer = async ({ email, uuid }
    : {
        email: string,
        uuid: string
    }) => {
    const { data, error } = await supabaseAdmin // supabase => ...from customer (email,uuid)
        .from('customers')
        .select('stripe_customer_id')
        .eq('id', uuid) //ค่าของฟิลด์stripe id supabase == uuid ที่ใส่เข้ามา
        .single();

    if (error || !data?.stripe_customer_id) {
        const customerData: { metadata: { supabaseUUID: string }; email?: string }
            = {
            metadata: { supabaseUUID: uuid }
        } // if  erro | !data   สร้าง customerData กำหนด supabase uuid เป็น uuid ที่รับเข้ามา

        if (email) customerData.email = email; // ถ้ามี email ที่รับเข้ามาจะกำหนดให้เป็น customerData.email 

        const customer = await stripe.customers.create(customerData); //สร้างลูกค้าใหม่ stripe โดยใช้ข้อมูลcustomerData => customer
        const { error: supabaseError } = await supabaseAdmin // เข้าไปที่ supabase => ...from / insert => กำหนดค่า id ด้วย uuid / ค่า stripe ด้วย customer id
            .from('customers')
            .insert([{ id: uuid, stripe_customer_id: customer.id }])

        if (supabaseError) {
            throw supabaseError;
        } // ถ้า error จะ thorw หยุดการทำงาน

        console.log(`New customer create and inserted for ${uuid}`)
        return customer.id // ถ้าไม่error return customer.id
    };

    return data.stripe_customer_id //คืนค่า stripe id ที่ได้จาก supabaseกลับไป
}

// **{การชำระเงิน biling}
const copyBillingDetailsToCustomer = async (
    uuid: string,
    payment_method: Stripe.PaymentMethod
) => {
    const customer = payment_method.customer as string; // ดึงข้อมูล customer 
    const { name, phone, address } = payment_method.billing_details; // ดึงข้อมูล bill =>name,phone,address 
    if (!name || !phone || !address)
        return;

    await stripe.customers.update(customer, { name, phone, address });
    const { error } = await supabaseAdmin
        .from('users')
        .update({
            billing_address: { ...address },  // ...address คือการกระจายตัวแปร address{...}
            payment_method: { ...payment_method[payment_method.type] }
        })
        .eq('id', uuid);

    if (error)
        throw error;
}// async uuid payment => payment.customer = customer =>payment.bill = {name,phone,address},
// => if ! {...} return => stripe.customer update {...} => supabase update {...} => error throw

// **{จัดการสถานะ sub เปลี่ยน status}
const manageSubscriptionStatusChange = async (
    subscriptionId: string,
    customerId: string,
    createAction = false
) => {
    // {supabaseadmin , id}
    const { data: customerData, error: noCustomerError } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (noCustomerError) throw noCustomerError;

    const { id: uuid } = customerData!; // !จะไม่เป็นค่า null /undefined

    // {ดูข้อมูล payment stripe. idsub }
    const subscription = await stripe.subscriptions.retrieve(
        subscriptionId,
        {
            expand: ['default_payment_method']
        }
    ) // เรียกดู stripe sub =>retrieve ขยาย => sub id  idที่ต้องการดู => expand ขยาย payment

    // {เอาข้อมูล subscription stripe มาไว้ที่subscriptionData}
    const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] = { // sub : ชนิดข้อมูลdatabase[แบบตาราง]
        id: subscription.id, // ใช้ subscription ที่ได้จาก  stripe.subscriptions.retrieve
        user_id: uuid,
        metadata: subscription.metadata,
        // ts-ignore
        status: subscription.status,
        price_id: subscription.items.data[0].price.id, // ...item data[0] เข้าถึงข้อมูลตัวแรก
        //@ts-ignore
        quantity: subscription.quantity,
        cancel_at_period_end: subscription.cancel_at_period_end,
        cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null, // แปลววันเวลา
        canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at).toISOString() : null,
        current_period_start: subscription.current_period_start ? toDateTime(subscription.current_period_start).toISOString() : null,
        current_period_end: subscription.current_period_end ? toDateTime(subscription.current_period_end).toISOString() : null,
        created: toDateTime(subscription.current_period_end).toISOString(),
        ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
        ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
        ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
        trial_start: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
        trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null, // หากมีค่าให้แปลง หากไม่มี null
    };

    // {upsert subscriptions supabase}
    const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert([subscriptionData]);
    if (error) throw error;
    console.log(
        `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
    );

    // upsert ข้อมูลในตารางใช้ข้อมูลจาก subscriptionData => subscriptions = > supabase

    if (createAction && subscription.default_payment_method && uuid)
        //@ts-ignore
        await copyBillingDetailsToCustomer(
            uuid,
            subscription.default_payment_method as Stripe.PaymentMethod
        );
};

export {
    upsertProductRecord,
    upsertPriceRecord,
    createOrRetrieveACustomer,
    manageSubscriptionStatusChange
}


//  ทำการค้นหาข้อมูลลูกค้าในตาราง customers ใน Supabase โดยใช้ uuid ในฟิลด์ id และเลือกเฉพาะฟิลด์ stripe_customer_id
// ถ้าเกิด error หรือไม่พบข้อมูลลูกค้า (data?.stripe_customer_id เป็น falsy) จะทำการสร้าง customerData ซึ่งเป็นออบเจกต์ที่มีส่วนข้อมูลดังนี้:
// metadata.supabaseUUID จะกำหนดเป็นค่า uuid ที่รับเข้ามา
// ถ้ามี email ที่รับเข้ามาจะกำหนดให้ customerData.email เป็นค่า email นั้น
// ใช้ Stripe API เพื่อสร้างลูกค้าใหม่โดยใช้ข้อมูลจาก customerData และทำการเพิ่มข้อมูลลูกค้าในตาราง customers
//  ใน Supabase โดยใช้ id เป็น uuid และ stripe_customer_id ที่ได้จาก Stripe API
// ถ้าเกิด error ในขณะที่ทำการเพิ่มข้อมูลลูกค้าใน Supabase จะทำการ throw error ออกมา
// แสดงข้อความ "New customer created and inserted for {uuid}" บนคอนโซล
// คืนค่า customer.id ที่ได้จาก Stripe API หากไม่เกิด error
// ถ้าไม่เกิด error ในการค้นหาข้อมูลลูกค้าใน Supabase จะคืนค่า data.stripe_customer_id ที่ได้จาก Supabase



//npm install @supabase/supabase-js เชื่อมฐานข้อมูล subabase

