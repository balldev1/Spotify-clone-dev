'use client';
import React, { useEffect, useState } from 'react'
import MediaItem from './MediaItem';
import LikeButton from './LikeButton';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { HiSpeakerXMark, HiSpeakerWave } from 'react-icons/hi2'
import Slider from './Slider';
import usePlayer from '@/hooks/usePlayer';
import useSound from 'use-sound';

interface PlayerContentProp {
    song: Song;
    songUrl: string
}

const PlayerContent: React.FC<PlayerContentProp> = ({ song, songUrl }) => {

    const player = usePlayer()
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave

    // onpaly Song 
    const onPlayNext = () => {
        if (player.ids.length === 0) {
            return;
        } //ids = 0 ไหม ถ้าใช่ return 

        const currentIndex = player.ids.findIndex((id) => id === player.activeId) //หา id เพลงที่เล่นอยู่ === activeidไหม
        const nextSong = player.ids[currentIndex + 1]; // nextsong คือ[0+1] = [1] เพลงถัดไป

        if (!nextSong) {
            return player.setId(player.ids[0])
        } // false ไม่มีเพลงจะกลับไปเล่นเพลงเดิม [0]

        player.setId(nextSong)
    } // true เอาค่าnextsong มาใส่ setid เล่นเพลงถัดไป

    const onPlayPrevious = () => {
        if (player.ids.length === 0) {
            return;
        } //ids = 0 ไหม ถ้าใช่ return 

        const currentIndex = player.ids.findIndex((id) => id === player.activeId) //หา id เพลงที่เล่นอยู่ === activeidไหม
        const previousSong = player.ids[currentIndex - 1]; // nextsong คือ[0+1] = [1] เพลงถัดไป

        if (!previousSong) {
            return player.setId(player.ids[player.ids.length - 1])
        } // false player.ids-1

        player.setId(previousSong)
    }

    const [play, { pause, sound }] = useSound(
        songUrl, {
        volume: volume,
        onplay: () => setIsPlaying(true),
        onend: () => {
            setIsPlaying(false)
            onPlayNext();
        },
        onpause: () => setIsPlaying(false),
        format: ['mp3']
    }
    )
    // useSound ใช้สำหรับเล่นเสียงโดยรับเส้นทางไฟล์เสียงและระดับเสียงเป็นอาร์กิวเมนต์
    // songUrl เส้นทางไฟล์เสียง ,volume ระดับเสียง , onplay เมือเล่นเพลง  set true BsPauseFill ,
    // onend เมือเพลงจบ set false , onplaynext เล่นเพลงถัดไป 
    // เมือกดหยุด set false  BsPlayFill 
    // format: ['mp3'] ไฟล์เสียงที่รับ
    // ใช้ usesound สร้าง  [play, { pause, sound }]

    useEffect(() => {
        sound?.play();

        return () => {
            sound?.unload();
        }
    }, [sound])
    //useEffect ใช้เพื่อเริ่มเล่นเสียงเมื่อ sound ไม่เท่ากับ null และยกเลิกการเล่นเสียงเมื่อ useEffect ถูกเรียกใช้ใหม่หรือถูกทำลาย


    const handlePlay = () => {
        if (!isPlaying) {
            play();
        } else {
            pause();
        }
    } //   handlePlay ใช้สลับการเล่นและหยุดเล่นเสียงขึ้นอยู่กับสถานะ isPlaying
    const toggleMute = () => {
        if (volume === 0) {
            setVolume(1);
        } else {
            setVolume(0);
        }
    } // toggleMute ใช้สลับการปิดและเปิดเสียงขึ้นอยู่กับระดับเสียงปัจจุบันที่เก็บใน volume


    return (
        <div className='grid grid-cols-2 md:grid-cols-3 h-full'>
            <div className='flex w-full justify-start'>
                <div className='flex items-center gap-x-4'>
                    <MediaItem data={song} />
                    <LikeButton songId={song.id} />
                </div>
            </div>

            {/* {md<} */}
            <div className='flex md:hidden col-auto w-full justify-end items-center '>
                <div onClick={handlePlay}
                    className='h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer'
                >
                    <Icon size={30} className='text-black' />
                </div>
            </div>

            {/* {md>} */}
            <div className='hidden h-full md:flex justify-center items-center w-full max-w[722px] gap-x-6'>
                <AiFillStepBackward onClick={onPlayPrevious}
                    size={30}
                    className='text-neutral-400 cursor-pointer hover:text-white transition' />
                <div onClick={handlePlay}
                    className='flex items-center justify-center h-10 w-10 rounded-full bg-white p1 cursor-pointer'>
                    <Icon size={30} className='text-black' />
                </div>
                <AiFillStepForward onClick={onPlayNext}
                    size={30}
                    className='text-neutral-400 cursor-pointer hover:text-white transition' />
            </div>

            <div className='hidden md:flex w-full justify-end pr-2'>
                <div className='flex items-center gap-x-2 w-[120px]'>
                    <VolumeIcon onClick={toggleMute}
                        className='cursor-pointer'
                        size={34}
                    />
                    <Slider value={volume}
                        onChange={(value) => setVolume(value)} />
                </div>
            </div>
        </div>
    )
}

export default PlayerContent

//npm i use-sound เล่นเสียง / ควบคุมเสียง / รับสถานะเสียง

// ในฟังก์ชัน useSound:
// รับ songUrl เป็นเส้นทางไฟล์เสียงและ volume เป็นระดับเสียง.
// กำหนด onPlay เพื่อเรียกใช้ฟังก์ชัน setIsPlaying(true) เมื่อเริ่มเล่นเสียง.
// กำหนด onend เพื่อเรียกใช้ฟังก์ชัน setIsPlaying(false) และ onPlayNext() เมื่อเสียงจบ.
// กำหนด onpause เพื่อเรียกใช้ฟังก์ชัน setIsPlaying(false) เมื่อหยุดเล่นเสียง.
// กำหนด format เป็น ['mp3'] ให้กับไฟล์เสียงที่รับเข้ามา.
// ใช้ useSound เพื่อสร้างตัวแปร play และ { pause, sound } จากการเรียกใช้ฟังก์ชัน.
// ในฟังก์ชัน useEffect:

// เมื่อ sound ไม่เท่ากับ null จะมีการเรียกใช้ sound.play() เพื่อเริ่มเล่นเสียง.
// การ return เป็นฟังก์ชันที่เรียก sound.unload() เมื่อ useEffect ถูกเรียกใช้ใหม่หรือถูกทำลาย เพื่อยกเลิกการเล่นเสียง.
// ในฟังก์ชัน handlePlay:

// ถ้า isPlaying เป็นเท็จ (false) จะเรียกใช้ play() เพื่อเริ่มเล่นเสียง.
// ถ้า isPlaying เป็นจริง (true) จะเรียกใช้ pause() เพื่อหยุดเล่นเสียง.
// ในฟังก์ชัน toggleMute:

// ถ้า volume เท่ากับ 0 จะกำหนด volume เป็น 1 เพื่อเปิดเสียง.
// ถ้า volume ไม่เท่ากับ 0 จะกำหนด volume เป็น 0 เพื่อปิดเสียง.