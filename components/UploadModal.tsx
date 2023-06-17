import React, { useState } from "react";
import { toast } from 'react-hot-toast'
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import uniqid from 'uniqid';


import useUploadModal from "@/hooks/useUploadModal";

import Input from "./Input";
import Button from "./Button";
import Modal from "./Modal";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";


const UploadModal = () => {
  const uploadModal = useUploadModal();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser()
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  }); // hook form 
  // FieldValues type ที่ใช้ใน React Hook Form 
  // เพื่อระบุชนิดของข้อมูลทั้งหมดในฟอร์ม (form)
   

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    } 
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true)

      const imageFile = values.image?.[0]; // รับ values => upload
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user){
        toast.error('Missing fields');
        return;
      }
      const uniqueID = uniqid();

      // **upload song 
      const {
        data: songData,
        error: songError,
      } = await supabaseClient.storage.from('songs') // =>  supabase / from songs
      .upload(`song-${values.title}-${uniqueID}`,   
      songFile,{
        cacheControl: '3600',
        upsert:false
      });

       // upload file  song => name title && id ที่ไม่ซ้ำกัน
       // cacheControl 3600วิ/1hr ,upsert false ถ้ามี file เดียวกัน จะไม่อัปเดต

      if (songError){
        setIsLoading(false);
        return toast.error('Failed song upload.')
      } // ถ้า error => ...false
  
      

      // **uploadimage
      const {
        data: imageData,
        error: imageError,
      } = await supabaseClient.storage.from('images') // => ฐานข้อมูล supabase / from songs
      .upload(`image-${values.title}-${uniqueID}`,   
      imageFile,{  
        cacheControl: '3600',
        upsert:false
      });

      if (imageError){
        setIsLoading(false);
        return toast.error('Failed image upload.')
      } 

      //

      const {
        error: supabaseError
      } = await supabaseClient.from('songs')
      .insert({
        user_id: user.id,
        title: values.title,
        author: values.author,
        image_path: imageData.path,
        song_path: songData.path
      }); // => supabase => song => insert ...{}  = supabaseError

      if (supabaseError){
        setIsLoading(false);
        return toast.error(supabaseError.message);
      } // true => set false => toast error 

      router.refresh();
      setIsLoading(false);
      toast.success('Song created!');
      reset();
      uploadModal.onClose();
      // refresh web => set false => toast success => reset form => close uploadmodal

    } catch (error) {
      toast.error('Someting went worng')
    } finally{
      setIsLoading(false);
    }
  };

  // SubmitHandler  type ที่ใช้ใน React Hook Form
  //  เพื่อระบุฟังก์ชันที่จะถูกเรียกเมื่อฟอร์มถูกส่ง (submitted)
  //  (ตามที่กำหนดใน FieldValues)

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={() => {
        onChange;
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })} // register ฟิลไตเติ้ลบังคับกรอก
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })} // register ฟิลไตเติ้ลบังคับกรอก
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type='file'
            accept='.mp3'
            disabled={isLoading}
            {...register("song", { required: true })} // register ฟิลไตเติ้ลบังคับกรอก
          />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            id="image"
            type='file'
            accept='image/*' // ไฟลรูปภาพเท่านั้น
            disabled={isLoading}
            {...register("image", { required: true })} // register ฟิลไตเติ้ลบังคับกรอก
          />
        </div>
        <Button disabled={isLoading} type='submit'>
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;

// npm i react-hook-form จัดการสถานะและการยืนยันข้อมูลของฟอร์ม
// npm i uniqid รหัสไม่ซ้ำ
// npm i -d @types/uniqid  ไฟลชนิดข้อมูล
