'use client'

import qs from 'query-string'
import useDebounce from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'
import Input from './Input';



const SearchInput = () => {

    const router = useRouter();
    const [value, setValue] = useState<string>('');
    const debouncedValue = useDebounce<string>(value, 500) // 

    useEffect(() => {
        const query = {
            title: debouncedValue,
        }; // สร้าง obj title ค่า debouncedValue

        const url = qs.stringifyUrl({
            url: '/search',
            query: query
        }); //สร้าง url obj query

        router.push(url); // เส้นทาง url
    }, [debouncedValue, router])

    return (
        <Input placeholder='What do you want to listen to ?'
            value={value}
            onChange={(e) => setValue(e.target.value)} />
    )
}

export default SearchInput

// npm i query-string จัดการค่า string
