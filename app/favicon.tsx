import Sidebar from "@/components/Sidebar";
import "./globals.css";

import { Figtree } from "next/font/google";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongsByUserId from "@/actions/getSongsByUserId";


const font = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "Spotify Clone",
  description: "Listen to music!",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const userSong = await getSongsByUserId()

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar songs={userSong}>
              {children}
            </Sidebar>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
} //spb ฐานข้อมูล,user เรียกใช้hook,modalเปิดการใช้งาน

{
  /* <SupabaseProvider> เป็นคอมโพเนนต์ที่คุณสร้างขึ้นเองเพื่อให้การเชื่อมต่อกับ Supabase 
สามารถใช้งานได้ทั่วทั้งแอปพลิเคชัน 
ซึ่งอาจมีโค้ดภายในเพิ่มเติมที่จัดการกับการเชื่อมต่อ Supabase และการจัดการเซสชัน */
}

// children
// ค่าที่ถูกสร้างขึ้นในคอมโพเนนต์นี้จะถูกส่งออกเพื่อนำไปใช้ในส่วนอื่น ๆ
// ของแอปพลิเคชัน React ที่ได้นำเอา RootLayout มาใช้
