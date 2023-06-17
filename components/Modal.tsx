import React from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import { IoMdClose } from 'react-icons/io'

interface ModalProps{
    isOpen: boolean;
    onChange: (open: boolean) =>void; // open เปลี่ยนแปลง onchangeจะทำงาน
    title: string;
    description: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onChange,
    title,
    description,
    children
}) => {
  return (
    <Dialog.Root open= {isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-neutral-900/90  backdrop-blur-sm fixed inset-0'/>
          <Dialog.Content className='fixed drop-shadow-md border border-neutral-700
           top-[50%] left-[50%] max-h-full h-full md:h-auto md:max-h-[85vh]
           w-full md:w-[90vw] md:max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md 
           p-[25px] focus:outline-none bg-neutral-800 '> 
            <Dialog.Title className='text-xl text-center font-blod '>
              {title}
            </Dialog.Title>
            <Dialog.Description className='mb-5 text-sm leading-normal text-center'>
              {description}
            </Dialog.Description>
            <div>
              {children}
            </div>
            <Dialog.Close asChild>
              <button className='text-neutral-400 hover:text-white absolute  top-[10px] right-[10px]
               inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none'>
                <IoMdClose/>
              </button>
            </Dialog.Close>
          </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal

// npm install @radix-ui/react-dialog เป็นไลบรารี UI 
//ที่ช่วยในการสร้างและควบคุมกล่องโต้ตอบในแอปพลิเคชัน React 

// หน้าจอที่บังคับให้ผู้ใช้ต้องปิดกล่องโต้ตอบ (dialog) ก่อนที่จะเปลี่ยนไปยังเนื้อหา

// inset-0 จะทำให้องค์ประกอบมีขนาดเต็มหน้าจอและติดกับขอบสี่ด้าน

 //translate-x- / y เคลื่อนย้ายองคประกอบ

//  xs: หน้าจอเล็ก (extra small) กว้างน้อยที่สุด (เช่น 375px)
// sm: หน้าจอเล็ก (small) กว้างขึ้นเล็กน้อย (เช่น 576px)
// md: หน้าจอกลาง (medium) กว้างที่กว้างขึ้น (เช่น 768px)
// lg: หน้าจอใหญ่ (large)  (เช่น 992px)
// xl: หน้าจอใหญ่มาก (extra large) กว้างที่สุด (เช่น 1200px)