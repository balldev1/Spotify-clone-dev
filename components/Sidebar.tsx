'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react';
import { HiHome } from 'react-icons/hi'
import { BiSearch } from 'react-icons/bi'

import React from 'react'
import Box from './Box';
import SidebarItem from './SidebarItem';
import Library from './Library';
import { Song } from '@/types';
import usePlayer from '@/hooks/usePlayer';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {

  const pathname = usePathname();
  const player = usePlayer();

  const routes = useMemo(() => [
    {
      icon: HiHome,
      label: 'Home',
      active: pathname !== '/search',
      href: '/',
    },
    {
      icon: BiSearch,
      label: 'Search',
      active: pathname === '/search',
      href: '/search'
    }
  ], [pathname]);

  return ( //player.activeId && 'h-[calc(100% - 80px) แสดงเมือ true
    <div className={twMerge(`flex h-full`
      , player.activeId && 'h-[calc(100%-80px)')}>
      <div
        className='  hidden md:flex  flex-col gap-y-2 bg-black h-full w-[300px] p-2 '>
        <Box>
          <div className=' flex flex-col gap-y-4 px-5  py-4 '>
            {routes.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
              />
            ))}
          </div>
        </Box>
        <Box className='overflow-y-auto h-full'>
          <Library songs={songs} />
        </Box>
      </div>

      <main className='h-full flex-1 overflow-y-auto py-2'>
        {children}
      </main>
    </div>
  )
}

export default Sidebar

// *import
//  usePathname กำหนดเส้นทาง

// -----

// *code
// const routes home ให้ไป / , search ให้ไป /search

// {...item} ส่งคืนค่าทุกคียของ router = label, icon, active,href

// -----

// *css
// overflow-y-auto ช่วยให้ผู้ใช้สามารถเลื่อนเนื้อหาในแนวตั้งได้เมื่อเนื้อหา
// ยาวเกินกว่าพื้นที่ที่กำหนดให้แสดงผลได้ในตัวองค์ประกอบนั้น ๆ

// -----

// *other
// children: React.ReactNode; เป็นพารามิเตอร์children ใน TypeScript
// ให้เป็นชนิดข้อมูลของ React Node
// ที่สามารถเป็นได้ทุกองค์ประกอบที่เป็นส่วนหนึ่งของ JSX ใน React.
//  ซึ่งใช้สำหรับรับเนื้อหาภายใน Sidebar
//   หรือส่วนสำหรับแสดงผลภายใน Sidebar



// h-[calc(100% - 80px)] ใช้ในการกำหนดความสูงขององค์ประกอบให้เต็มพื้นที่หรือลดลง 80 พิกเซล
// เมื่อคำนวณจากความสูงเต็ม (100%) ลบด้วย 80 พิกเซล
// ซึ่งจะแปลว่าองค์ประกอบนี้จะมีความสูงที่เท่ากับความสูงเต็มของพื้นที่ที่ตั้งองค์ประกอบอยู่ลบด้วย 80 พิกเซล

// ตัวอย่างเช่น หากพื้นที่ที่ตั้งองค์ประกอบมีความสูงเท่ากับ 500 พิกเซล แล้วกำหนดคลาส
// h-[calc(100% - 80px)] ให้กับองค์ประกอบนี้ จะทำให้องค์ประกอบมีความสูงเท่ากับ 420 พิกเซล (500 - 80)