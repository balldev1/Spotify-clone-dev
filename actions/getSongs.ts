import { Song } from '@/types';
import { createServerActionClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers'

const getSongs = async (): Promise<Song[]>=>{
    const supabase = createServerComponentClient({
        cookies: cookies
    }) // api supabase music สร้างอินสแตนซ์  => ใช้ cookies => supabase => ส่งกลับเป็น object Promise<Song[]>

    const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false })
    // supabase => from song => select * => order เรียงลำดับข้อมูลจากวันที่สร้างไปเก่าสุด

    if (error) {
        console.log(error)
    } 

    return (data as any) || [] // as any แปลงชนิดข้อมูล ป้องกันข้อมูลเป็น null
}

export default getSongs

// cookies: เป็นฟังก์ชันที่ใช้สำหรับจัดการกับค่า Cookies 
// ใน Next.js โดยสามารถเพิ่ม, อ่าน, แก้ไข, หรือลบค่า Cookies ได้ตามความต้องการของแอปพลิเคชัน