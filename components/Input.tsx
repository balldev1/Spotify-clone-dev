import React, {forwardRef} from 'react'
import { twMerge } from 'tailwind-merge'

interface InputProps
 extends React.InputHTMLAttributes<HTMLAnchorElement> {}// สืบทอดคุณสมบัติ inputhtml


const Input = forwardRef<HTMLAnchorElement, InputProps>(({
    className,
    type,
    disabled,
    ...props
}, ref) =>{
    return (
        <input
        type={type}
        className={twMerge(`
        flex
        w-full
        rounded-md
        bg-neutral-700
        border
        border-transparent
        px-3
        py-3
        text-sm
        file:border-0
        file:bg-transparent
        file:text-sm
        file:font-medium
        placeholder:text-neutral-400
        disabled:cursor-not-allowed
        disabled:opacity-50
        focut:online-none
        `,className)}
        disabled={disabled}
        ref={ref}
        {...props}
        />
        
    )
})

Input.displayName = 'Input'

export default Input


// forwardRefสามารถส่ง ref ไปยังคอมโพเนนต์ลูก 

// ({...props}, ref) => { ... }: รับพร็อพเพอร์ตี้ทั้งหมดที่รับเข้ามาด้วย ...props และ ref 
// จะถูกส่งต่อไปยังอิลิเมนต์ <input> ที่ถูกสร้างขึ้น.

// cursor-not-allowed ถูกใช้เพื่อกำหนดว่าปุ่มนี้ถูกปิดใช้งานและไม่สามารถคลิกหรือกระทำอะไรได้