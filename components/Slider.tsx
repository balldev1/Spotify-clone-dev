'use client'

import React from 'react'

import * as RadixSlider from '@radix-ui/react-slider'

interface SliderProps {
    value?: number;
    onChange?: (value: number) => void; // รับvalue เพือใช้งานslider
}

const Slider: React.FC<SliderProps> = ({ value = 1, onChange }) => {

    const handleChange = (newValue: number[]) => { // รับnewvalue เป็น array ของ number []
        onChange?.(newValue[0]) // เรียกใช้ array [0] 0 คือnumber แรก
    }

    return (
        <RadixSlider.Root defaultValue={[1]} value={[value]}
            onValueChange={handleChange} max={1} step={0.1} aria-label='Volume'
            className='relative flex items-center select-none touch-none w-full h-10'>
            <RadixSlider.Track
                className='bg-neutral-600 relative grow rounded-full h-[3px]'>
                <RadixSlider.Range className='absolute bg-white rounded-full h-full' />
            </RadixSlider.Track>
        </RadixSlider.Root>
    )
}

export default Slider

// RadixSlider.Root ค่าเริ่มต้น
// RadixSlider.Track แถบเสียง
// RadixSlider.range แถบเพิ่มเสียง


// npm i @radix-ui/react-slider สร้างสไลด

// aria - label  สไลด์เดอร์มีคำอธิบายสำหรับผู้ใช้

// defaultValue = { [1]} ค่าเริ่มต้น 1

// value = { [value]} ค่าปัจจุบัน = value

// onValueChange = { handleChange } เปลี่บยนแปลงค่าvalue ตาม handle

// max = {1} step = { 0.1} เพิ่มเสียงเต็มหลอด 1 value = 1 เต็มคาลาเบล

// select-none: กำหนดให้ไม่สามารถเลือก (select)

// touch-none: กำหนดให้ไม่สามารถเรียกใช้การสัมผัส (touch)

// grow  ขยาย