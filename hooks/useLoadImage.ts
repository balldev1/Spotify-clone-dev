import React from 'react'
import { Song } from '@/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const useLoadImage = (song: Song) => {

  const supabaseClient = useSupabaseClient();

  if (!song) {
    return null
  }

  const { data: imageData } = supabaseClient
    .storage
    .from('images')
    .getPublicUrl(song.image_path)

  return imageData.publicUrl;
} // supabase => if !song null => supabase  data .storage.from/img.geturl =>return imageData =>useLoadImage เพือไปใช้งานต่อ 

export default useLoadImage

// getPublicUrl ใช้ใน Supabase Client เพื่อรับ URL สาธารณะของไฟล์ที่เก็บอยู่ใน Supabase Storage โดยใช้เส้นทาง (path)