import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast";


const useGetSongByid = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [song, setSong] = useState<Song | undefined>(undefined)
    const { supabaseClient } = useSessionContext();

    useEffect(() => {
        if (!id) {
            return;
        }

        setIsLoading(true);

        const fetchSong = async () => {
            const { data, error } = await supabaseClient
                .from('songs')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                setIsLoading(false);
                return toast.error(error.message)
            }// supabase => data,error => .from/songs => if error set false 

            setSong(data as Song);
            setIsLoading(false)
        } // true => setsong data , setload false 


        fetchSong()
    }, [id, supabaseClient])

    return useMemo(() => ({
        isLoading,
        song
    }), [isLoading, song]) //ทำงานเมือ isloading ,song เปลี่ยนแปลง
} // useMemo บันทึกข้อมูล ส่งกลับ useGetSong byid

export default useGetSongByid