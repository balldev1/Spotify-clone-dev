'use client'

import useGetSongByid from '@/hooks/useGetSongByid'
import useLoadSongUrl from '@/hooks/useLoadSongUrl'
import usePlayer from '@/hooks/usePlayer'
import React from 'react'
import PlayerContent from './PlayerContent'

const Player = () => {

    const player = usePlayer()
    const { song } = useGetSongByid(player.activeId);

    const songUrl = useLoadSongUrl(song!) // song! ไม่เป็นค่า null

    if (!song || !songUrl || !player.activeId) {
        return null;
    }

    return (
        <div className='fixed bottom-0 bg-black w-full py-2 h-[80px] px-4'>
            <PlayerContent key={songUrl}
                song={song}
                songUrl={songUrl} />
        </div>
    )
}

export default Player


// key={songUrl}songUrl เป็นคีย์ ค่า songUrl
// เป็นค่าที่ไม่ซ้ำกันสำหรับแต่ละองค์ประกอบในลูป
// ช่วยให้ React รู้ว่าองค์ประกอบแต่ละรายการมีความแตกต่างกันอย่างไร
// และจะทำการจัดการอัปเดตให้ถูกต้องตามคีย์ที่กำหนด