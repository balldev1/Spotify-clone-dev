import { Song } from '@/types';
import { createServerActionClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers'

const getSongsByUserId = async (): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    }) // api supabase music สร้างอินสแตนซ์  => ใช้ cookies => supabase => ส่งกลับเป็น object Promise<Song[]>

    const {
        data: sessionData,
        error: sessionError
    } = await supabase.auth.getSession(); //  get session => sessiondata,error

    if (sessionError) {
        console.log(sessionError.message);
        return []; // check if error []
    }

    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', sessionData.session?.user.id) // ?ไม่เป็นnull
        .order('created_at', { ascending: false }); // supabase => song =>.order > ไป < = data,error

    if (error) {
        console.log(error.message);
    } // check if error => message

    return (data as any) || []  // data => getsong , as any ไม่ให้ค่าเป็น null
} // สรุป getsongsByuserId =>  ดึงข้อมูลเพลง user ด้วย user id จาก supabase โดยใช้ session  



export default getSongsByUserId

// cookies: เป็นฟังก์ชันที่ใช้สำหรับจัดการกับค่า Cookies
// ใน Next.js โดยสามารถเพิ่ม, อ่าน, แก้ไข, หรือลบค่า Cookies ได้ตามความต้องการของแอปพลิเคชัน