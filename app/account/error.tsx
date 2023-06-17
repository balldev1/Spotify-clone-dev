'use client'

import Box from '@/components/Box'
import React from 'react'

const error = () => {
    return (
        <Box className='h-full flex items-center justify-center'>
            <div className='text-neutral-400'>
                Something went worng.
            </div>
        </Box>
    )
}

export default error
