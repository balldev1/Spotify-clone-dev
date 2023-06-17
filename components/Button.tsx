import React,{forwardRef} from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>{}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    children,
    disabled,
    type = 'button',
    ...props
},ref) =>{
    return ( 
        <button 
        type={type}
        className={twMerge(`
        w-full
        rounded-full
        bg-green-500
        border
        border-transparent
        px-3
        py-3
        disbled:cursor-not-allowed
        disbled:opacity-50
        text-black
        font-bold
        hover:opacity-75
        transition
        `,className
        )}
        disabled = {disabled}
        ref={ref}
        {...props}
        >
            {children}
        </button>
    )
})

Button.displayName = 'Button';

export default Button

// เมื่อองค์ประกอบมี disabled={true}
//  สถานะที่เปิดใช้งาน disabled:cursor-not-allowed และ disabled:opacity-50
//   จะถูกเปลี่ยนแปลงในสไตล์ CSS ขององค์ประกอบนั้น ตามกฎเลเยอร์ที่กำหนด

// interface ButtonProps
//     extends React.ButtonHTMLAttributes<HTMLButtonElement>{}
// การสร้างอินเทอร์เฟซ ButtonProps ดังกล่าวเป็นวิธีที่จะเพิ่มคุณสมบัติและพรอพตี้
// ที่ใช้กับองค์ประกอบปุ่มใน React โดยใช้คุณสมบัติที่มีอยู่แล้วจาก
//  React.ButtonHTMLAttributes<HTMLButtonElement> 
//  และสามารถกำหนดคุณสมบัติเพิ่มเติมตามต้องการใน ButtonProps 


// 1. ButtonProps ที่ extends (สืบทอด) คุณสมบัติจาก 
// React.ButtonHTMLAttributes<HTMLButtonElement> 
// เพื่อรับคุณสมบัติและพรอพเตี้ยที่ใช้กับองค์ประกอบ <button> ใน React

// 2. const Button forwardRef เพื่อส่งต่อ ref ไปยังองค์ประกอบ
//  <button> ที่สร้างขึ้น โดยรับพารามิเตอร์ props
//      และ ref ในการจัดการคุณสมบัติและการส่งต่อ ref ต่อไป

// 3.ในฟังก์ชัน Button, มีการรับพารามิเตอร์และตัวแปรต่าง ๆ ที่ใช้ในการสร้างองค์ประกอบ <button>:

// 4ตัวแปรที่จะรับclassName,children,disabled,type
// ...props: ตัวแปรสำหรับรับคุณสมบัติเพิ่มเติม