"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

import useSubscribeModal from '@/hooks/useSubscribeModal';
import { useUser } from '@/hooks/useUser';
import { postData } from '@/libs/helpers';
import { getStripe } from '@/libs/stripeClient';
import { Price, ProductWithPrice } from '@/types';

import Modal from './Modal';
import Button from './Button';

interface SubscribeModalProps {
    products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
    const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency,
        minimumFractionDigits: 0
    }).format((price?.unit_amount || 0) / 100);

    return priceString;
}; // รับ price  Intl.NumberFormat จัดรูปแบบสกุลเงิน => en-us Eng => minimumFractionDigits: 0 จำนวนเต็มไม่มีทศนิยม
//  currency: price.currency, =>....format() เมื่อได้ค่าตัวเลขที่จัดรูปแล้ว ก็จะถูกนำมาหารด้วย 100 เพื่อแปลงจากหน่วยเงินเป็นสกุลเงินตามรูปแบบที่กำหนดใน Intl.NumberFormat



const SubscribeModal: React.FC<SubscribeModalProps> = ({
    products
}) => {
    const subscribeModal = useSubscribeModal();
    const { user, isLoading, subscription } = useUser();

    const [priceIdLoading, setPriceIdLoading] = useState<string>();

    const onChange = (open: boolean) => {
        if (!open) {
            subscribeModal.onClose();
        }
    }

    const handleCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);
        if (!user) { // !user underfined
            setPriceIdLoading(undefined);
            return toast.error('Must be logged in');
        }

        if (subscription) { // sub undefined
            setPriceIdLoading(undefined);
            return toast('Already subscribed');
        }

        // {checkout}
        try { // !sub => ส่งไปหน้า sub
            const { sessionId } = await postData({ //สร้าง session ชำระเงิน stripe api
                url: '/api/create-checkout-session',
                data: { price }
            });

            const stripe = await getStripe(); // getStripe รับ obj stripe 
            stripe?.redirectToCheckout({ sessionId }); // redirectToCheckout() ของอ็อบเจกต์ Stripe เพื่อเปิดหน้าชำระเงินผ่าน Stripe Checkout โดยใช้ sessionId ที่ได้รับจาก postdata
        } catch (error) {
            return toast.error((error as Error)?.message);
        } finally {
            setPriceIdLoading(undefined);
        }
    };//สร้าง session ชำระเงิน postData => รับobj  Stripe โดยใช้ getStripe() => 
    //=> redirectToCheckout() obj Stripe เปิดหน้า Checkout โดยใช้ sessionId ที่ได้รับจากการสร้าง session ในขั้นตอนที่ 1

    let content = (
        <div className="text-center">
            No products available.
        </div>
    ) // let content div 

    if (products.length) { //ถ้า ใน products มีสินค้า
        content = (
            <div>
                {products.map((product) => {
                    if (!product.prices?.length) { // ถ้าfalse !product.prices ถ้าไม่มี prices
                        return (
                            <div key={product.id}>
                                No prices available
                            </div>
                        );
                    }

                    return product.prices.map((price) => ( // ถ้า true สินค้ามี price
                        <Button
                            key={price.id}
                            onClick={() => handleCheckout(price)}
                            disabled={isLoading || price.id === priceIdLoading} // ถ้า true ปุ่มจะถูกปิดใช้งาน 
                            className="mb-4"
                        >
                            {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
                        </Button>
                    ))
                })}
            </div>
        )
    }

    if (subscription) {
        content = (
            <div className="text-center">
                Already subscribed.
            </div>
        )
    } // ถ้า subscription แล้ว

    return (
        <Modal
            title="Only for premium users"
            description="Listen to music with Spotify Premium"
            isOpen={subscribeModal.isOpen}
            onChange={onChange}
        >
            {content}
        </Modal>
    );
}

export default SubscribeModal