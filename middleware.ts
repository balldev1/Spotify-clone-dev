import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from 'next/server'

export async function middleware(req) {
    const  res = NextResponse.next(); // res ใช้ตอบกลับ 
    const supabase = createMiddlewareClient({req,res}) ;
    await supabase.auth.getSession(); 
    return res; // ส่งกลับ res
}

//ดึงsesion ผู้ใช้ จากการร้องของreq,res
//createMiddlewareClient เป็นฟังก์ชันที่สร้าง middlewareมีหน้าที่รับข้อมูล request และ response 
//NextResponse กำหนดการตอบกลับ res