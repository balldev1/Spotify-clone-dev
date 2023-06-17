import { Price } from '@/types';

// {GET url}
export const getURL = () => {
    let url = process?.env?.NEXT_PUBLIC_SITE_URL ??
        process?.env?.NEXT_PUBLIC_VERCEL_URL ??
        'http://localhost:3000/';

    url = url.includes('http') ? url : `https://${url}`; //ถ้ามี httip ไม่เพิ่มถ้าไม่มีค่อยเพิ่ม
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/` //ถ้า url ...com' สุดท้ายไม่ใช่ / จะเพิ่ม / ที่สุดท้ายของ url เพื่อให้เป็น '...com/'

    return url
}

//url มีค่าเป็น URL ที่ได้จาก ...env หรือถ้าไม่มีก็ใช้ค่า http://localhost:3000/
// และหาก URL นั้นไม่เป็น HTTP URL จะแปลงเป็น HTTPS URL โดยเพิ่ม "https://" ไว้ข้างหน้า URL ที่ได้

// มีการตรวจสอบและเลือกใช้ค่า URL ของเว็บไซต์
//  NEXT_PUBLIC_SITE_URL และ NEXT_PUBLIC_VERCEL_URL
//  ถ้าไม่พบให้ใช้ค่าเริ่มต้นเป็น 'http://localhost:3000/'.

// {POST UPDATE}
export const postData = async ({ url, data }
    : {
        url: string;
        data?: { price: Price }
    }) => {
    console.log('POST REQUEST:', url, data)// รับ req url เป็น string ,data เป็น object

    const res: Response = await fetch(url, { // fetch ดึงข้อมูล url , ...data ส่งกลับไป  res
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        console.log('Error in Post', { url, data, res }); // !resตอบกลับเซเวอร์ผิด =>error

        throw new Error(res.statusText) //ส่งร้องขอไม่สำเร็จ หยุดทำงาน 
    }

    return res.json();
}
// postData ฟังชั่น POST ข้อมูลไปยัง URL ที่ระบุ โดยใช้ข้อมูลจาก data และส่งผลลัพธ์การร้องขอกลับในตัวแปร res

// { Time }
export const toDateTime = (secs: number) => {
    var t = new Date('1970-01-01T00:30:00Z');
    t.setSeconds(secs); //setSeconds เมธอดตั้งค่าวินาที
    return t
}