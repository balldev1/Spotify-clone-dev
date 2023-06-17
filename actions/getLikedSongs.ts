import { Song } from '@/types';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers'

const getLikedSongs = async (): Promise<Song[]> => {
    const supabase = createServerActionClient({
        cookies: cookies
    }) // api supabase music สร้างอินสแตนซ์  => ใช้ cookies => supabase => ส่งกลับเป็น object Promise<Song[]>

    const { data: { session } } = await supabase.auth.getSession(); // supabase => data => เก็บเฉพาะ session


    const { data } = await supabase
        .from('liked_songs')
        .select('*, songs(*)')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
    // supabase => from song => select * => order เรียงลำดับข้อมูลจากวันที่สร้างไปเก่าสุด

    if (!data)
        return [];
    // } !data [] 

    return data.map((item) => ({
        ...item.songs
    })) // แปลงข้อมูลdata obj เพลงที่ถูกใจโดยการวนลูป => getlikesongs 
}


export default getLikedSongs;

// cookies: เป็นฟังก์ชันที่ใช้สำหรับจัดการกับค่า Cookies
// ใน Next.js โดยสามารถเพิ่ม, อ่าน, แก้ไข, หรือลบค่า Cookies ได้ตามความต้องการของแอปพลิเคชัน