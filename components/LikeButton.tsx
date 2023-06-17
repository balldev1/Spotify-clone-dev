'use client'

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface LikeButtonProps {
    songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {

    const router = useRouter();
    const { supabaseClient } = useSessionContext();

    const authModal = useAuthModal();
    const { user } = useUser();

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!user?.id) {
            return;
        } // ใช่userไหม ถ้าใช่ไปต่อ

        const fetchData = async () => {
            const { data, error } = await supabaseClient
                .from('liked_songs')
                .select('*')
                .eq('user_id', user.id) // eq กำหนด เงื่อนไข  ค้นหาฟิล user_id ฐานข้อมูล === user.id ผู้ใช้งานอยู่ 
                .eq('song_id', songId)
                .single();

            if (!error && data) {
                setIsLiked(true)
            } // !error และมีข้อมูล data => setIsLiked(true)
        }

        fetchData()
    }, [songId, supabaseClient, user?.id]) // ทำงานเมือ songid supabase user เปลี่ยน

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

    const handleLike = async () => {
        if (!user) {
            return authModal.onOpen();
        } // !user => go register

        if (isLiked) {
            const { error } = await supabaseClient // => isLike true แสดงว่าผู้ใช้กดถูกใจแล้ว=> supabase => delete like  
                .from('liked_songs')
                .delete()
                .eq('user_id', user.id)
                .eq('song_id', songId)

            if (error) {
                toast.error('error.message') // if error => taost error 
            } else {
                setIsLiked(false)// !error => false 
            }
        } else { // or isliked false 
            const { error } = await supabaseClient
                .from('liked_songs')
                .insert({
                    user_id: user.id,
                    song_id: songId
                }) // supabase => ...from // ขอแทก ...insert

            if (error) {
                toast.error(error.message);  // if error message
            } else {
                setIsLiked(true)
                toast.success('Liked!')
            } // !error set true , toast liked!
        }

        router.refresh(); // refresh web
    }

    return (
        <button onClick={handleLike}
            className='hover:opacity-75 transition'
        >
            <Icon color={isLiked ? '#22c55e' : 'white'} size={25} />
        </button>
    )
}

export default LikeButton
