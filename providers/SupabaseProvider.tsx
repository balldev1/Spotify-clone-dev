'use client'

import { Database } from '@/types_db'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react';

interface SupabasePrividerProps{
    children: React.ReactNode;
}


const SupabaseProvider: React.FC<SupabasePrividerProps> = ({
    children
}) => {
    const [supabaseClient] = useState(()=>
    createClientComponentClient<Database>()
    )

    return (
        <SessionContextProvider supabaseClient={supabaseClient}>
            {children}
        </SessionContextProvider>
  )
}

export default SupabaseProvider

// useState hook เพื่อกำหนดตัวแปร state ชื่อ supabaseClient ซึ่งจะเก็บค่าของ Supabaseclient 
// createClientComponentClient<Database>()  สร้าง ฐานข้อมูล dtb

// SessionContextProvider เป็นคอมโพเนนต์ที่ใช้ในการจัดการและแชร์ข้อมูลเกี่ยวกับเซสชัน 
// //  supabaseClient ที่ถูกส่งเข้าไปเป็นพรอพเพอร์ตี้จะถูกนำไปใช้ในการเชื่อมต่อกับ 
// Supabase API และจัดการเซสชันของผู้ใช้ แล้วนำมาเก็บไว้ใน useState
// การรับส่งข้อมูลและการยืนยันตัวตนของผู้ใช้ในระบบ Supabase

// npm i @supabase/auth-helpers-next , npm install @supabase/auth-helpers-react
// จัดการการรับรองตัวตนและการเข้าสู่ระบบในแอปพลิเคชัน Next.js
//  ที่ใช้ Supabase เป็นระบบฐานข้อมูลและระบบการรับรองตัวตน


{/* <SupabaseProvider> เป็นคอมโพเนนต์ที่คุณสร้างขึ้นเองเพื่อให้การเชื่อมต่อกับ Supabase 
สามารถใช้งานได้ทั่วทั้งแอปพลิเคชัน 
ซึ่งอาจมีโค้ดภายในเพิ่มเติมที่จัดการกับการเชื่อมต่อ Supabase และการจัดการเซสชัน */}
