'use client'
import React, { useEffect } from 'react'
import Modal from './Modal'
import { useSessionContext, useSupabaseClient } from'@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared' // themแบบฟอร์ม
import useAuthModal from '@/hooks/useAuthModal'

const AuthModal = () => {
    const supabaseClient = useSupabaseClient(); //แบบฟอร์มเข้าระบบ
    const router = useRouter();
    const { session } = useSessionContext()
    const { onClose, isOpen} = useAuthModal()

    useEffect(()=>{
        if (session) {
            router.refresh();
            onClose();
        }
    },[session,router,onClose])

    // เมือ session เปลี่ยน refresh แล้ว onClose

    const onChange = (open: boolean) =>{
        if (!open){
            onClose();
        }
    }

  return (
    <Modal title='welcome back' description='Login to your account'
    isOpen={isOpen} onChange={onChange} >
        <Auth 
        theme='dark'
        providers={['github']}
        magicLink
        supabaseClient={supabaseClient}
        appearance={{
            theme: ThemeSupa,
            variables : {
                default : {
                    colors:{
                        brand: '#404040',
                        brandAccent: '#22c55e'
                    }
                }
            }
        }}
        />
    </Modal>
  )
}

export default AuthModal

// ืnpm i @supabase/auth-ui-react สร้างอินเทอร์เฟซผู้ใช้งาน
// npm i @supdabase/auth-ui-shared ยืนยันตัวต้น เซลชัน แบบฟอม
// (Login),  (Register), (Password Recovery) และอื่น ๆ 

