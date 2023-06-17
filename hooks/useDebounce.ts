import React, { useEffect, useState } from 'react'

function useDebounce<T>(value: T, delay?: number): T { //ชนิดข้อมูลเป็น T 
    const [debounceValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value) // set useState
        }, delay || 500); // ดีเล 5 วิ

        return () => {
            clearTimeout(timer); // รับ timer => ยกเลิก setTimeout
        }
    }, [value, delay]) // เมือค่า value delay เปลี่ยน+=> effectทำงาน

    return debounceValue;
}

export default useDebounce;