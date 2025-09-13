import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import PaymentModel from '@/app/Schema/paymentModel';
export async function POST(request) {
    await mongoose.connect(process.env.MONGODB_URI);
     const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
   

  const options = {
    amount: 180 * 100, // Razorpay expects amount in paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
   
  };
    const formData = await request.formData();
     const response = await razorpay.orders.create(options);


    const newPayment = new PaymentModel({
        _id: response.id,
        
        amount: 180 * 100,
        currency: 'INR',
        status: 'PENDING',
        name: formData.get('teamName'),
        created_at: new Date(),
       
        order_id: formData.get('order_id'),
        payment_session_id: formData.get('payment_session_id'),
        user_id: formData.get('user_id'),
    });
    await newPayment.save();
       
  
    return NextResponse.json({ id: response.id, amount: response.amount, currency: response.currency });
  }