"use client";
import React from "react";
import Button from "./Button";

import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";

import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { toast } from 'react-hot-toast'
import usePlayer from "@/hooks/usePlayer";


interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const player = usePlayer();
  const authModal = useAuthModal();

  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    // reset any playing song
    player.reset()
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out!')
    }
  }; // signout supabase => refresh => if true error / false Logout ! ข้อความขึ้นโชว์ logout toast!

  return (
    <div
      className={twMerge(
        `h-fit bg-gradient-to-b from-emerald-800 p-6 `,
        className
      )}
    >
      <div className=" w-full mb-4 flex items-center justify-between ">
        <div
          className=" hidden  md:flex gap-x-2 items-center
          "
        >
          <button
            onClick={() => router.back()}
            className=" rounded-full  bg-black  flex  items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className=" rounded-full   bg-black flex   items-center justify-center hover:opacity-75  transition "
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>

        <div className=" flex md:hidden gap-x-2 items-center ">
          <button className=" rounded-full p-2  bg-white flex  items-center  justify-center  hover:opacity-75 transition ">
            <HiHome className="text-black" size={20} />
          </button>
          <button className=" rounded-full p-2  bg-white flex  items-center  justify-center  hover:opacity-75 transition ">
            <BiSearch className="text-black" size={20} />
          </button>
        </div>

        <div className="  flex  justify-between   items-center gap-x-4  ">
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button onClick={handleLogout}
                className="bg-white px-6 py-2">
                Logout
              </Button>
              <Button onClick={() => router.push('/account')}
                className="bg-white">
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className=" bg-transparent  text-neutral-300  "
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className=" bg-white  px-6   py-2 "
                >
                  LogIn
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};

export default Header;

// md:hidden ซ้อนหน้าจอขนาดกลางขึ้นไป เล็กแสดง

// เมื่อเราระบุ React.ReactNode เป็นประเภทของ props
//  หรือผลลัพธ์ที่คอมโพเนนต์สามารถส่งกลับได้
//   จะทำให้เราสามารถส่งค่าข้อมูลที่เป็น children หรือองค์ประกอบอื่น ๆ
// ไปยังคอมโพเนนต์นั้น ๆ ได้อย่างยืดหยุ่น โดยไม่จำกัดให้เป็นประเภทเดียวกันเท่านั้น
//  และสามารถรับข้อมูลต่าง ๆ ได้ตามความต้องการของแต่ละคอมโพเนนต์

//    bg-gradient-to-b ไล่สี

// twMerge  ,className เป็นพรอพส์ที่รับค่าคลาส CSS
//  เพิ่มเติมจากภายนอก เพื่อให้ผู้ใช้งานสามารถ
//  กำหนดคลาส CSS เพิ่มเติมได้ตามต้องการ
