import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadSongUrl = (song: Song) => {
    const supabaseClient = useSupabaseClient();

    if (!song) {
        return '';
    }

    const { data: songData } = supabaseClient
        .storage
        .from('songs')
        .getPublicUrl(song.song_path)

    return songData.publicUrl
} // song =>supabase => !song return => true song =>supabase => .storage => get ...song =>return songDataUrl

export default useLoadSongUrl;

// useLoadSong ใช้โหลด URL เพลงจาก Supabase Storage
//  และคืนค่า URL เพื่อใช้ในการแสดงผลหรือการใช้งานอื่น ๆ ในคอมโพเนนต์อื่น ๆ