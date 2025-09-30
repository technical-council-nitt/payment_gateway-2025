import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import PaymentModel from "@/app/Schema/paymentModel";
import { supabaseAdmin } from "../../lib/supabaseServer";
export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const rawBody = await request.text(); // read raw body
    const signature = request.headers.get("x-webhook-signature");
    const timestamp = request.headers.get("x-webhook-timestamp");

    const secretKey = process.env.CASHFREE_SECRET;

    // ✅ Generate signature
    const bodyToSign = timestamp + rawBody;
    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(bodyToSign)
      .digest("base64");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }
console.log("Signature verified high five! ✋");
    const data = JSON.parse(rawBody);
    console.log("✅ Webhook received:", data);

    const { error: Err } = await supabaseAdmin
      .from("payments")
      .update({ status: data.data.payment.payment_status,
        transaction_id: data.data.payment.cf_payment_id,
        })
      .eq("team_id", "131825");

    if (Err) {
      console.error("Supabase update payment error:", Err);
      return NextResponse.json({ ok: false, error: Err.message }, { status: 500 });
    }
    

    // Process the webhook data
    // const  payment= await PaymentModel.findById(data.data.order.order_id);
    // if (payment) {
    //   payment.status = data.data.payment.payment_status;
    //   payment.cf_payment_id = data.data.payment.cf_payment_id;
    //   payment.updated_at = new Date();
    //   await payment.save();
    //   console.log("Payment status updated:", payment);
    // } else {
            
    //   const newPayment = new PaymentModel({
    //     _id: data.order.data.order_id,
    //     amount: data.data.order.order_amount,
    //     currency: data.data.order.order_currency,
    //     status: data.data.payment.payment_status,
    //     name: data.data.order.customer_details.customer_name,
    //     created_at: new Date(data.data.order.created_at),
    //     updated_at: new Date(),
    //     order_id: data.data.order.order_id,
    //     payment_session_id: data.data.order.payment_session_id,
    //     cf_payment_id: data.data.order.cf_payment_id,
    //   });
    //   await newPayment.save();
    //   console.log("New payment record created:", newPayment);
    // }
    
    
    // Always respond 200 OK
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}