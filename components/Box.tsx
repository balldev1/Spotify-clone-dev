import React, { Children } from 'react'
import { twMerge } from 'tailwind-merge';


interface BoxProps{
    children: React.ReactNode;
    className?: string;
}


const Box:React.FC<BoxProps> = ({children,className}) => {
  return (
    <div
    className={twMerge(`
    bg-neutral-900
    rounded-lg
    h-fit
    w-full
    `,className)
    }
    >
      {children}
    </div>
  )
}

export default Box

// ip twMerge ผสาน classname sidebar children ,box

// npm i tailwind-merge ผสานรวมร่าง


