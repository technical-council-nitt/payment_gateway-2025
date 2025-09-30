
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import PaymentModel from "@/app/Schema/paymentModel";
import crypto from "crypto";


function verifyCashfreeSignature({ cf_order_id ,signature}) {
  const secretKey = process.env.CASHFREE_SECRET;
  const rawSignature = cf_order_id + secretKey;
  const generatedSignature = crypto.createHash("sha256").update(rawSignature).digest("hex");
  return generatedSignature === signature;
}
export async function POST(request) {
  await mongoose.connect(process.env.MONGODB_URI);

  const body = await request.json();
console.log(body);
  const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_ID,
    process.env.CASHFREE_SECRET
  );

  try {

    const orderRequest = {
      order_amount: "1",
      order_currency: "INR",
      customer_details: {
        customer_id: body.userId || "guest_user",
        customer_name: body.teamName || "Anonymous",
        customer_email: "example@gmail.com",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url:
          "https://b694e83d278d.ngrok-free.app/",
          notify_url: 
          "https://b694e83d278d.ngrok-free.app/api/cashfree-webhook",
         
      },
      order_note: "Team registration payment",
    };

    const response = await cashfree.PGCreateOrder(orderRequest);
    const order = response.data;
    console.log("Cashfree Order Response:", order);

    // Save to MongoDB
    const newPayment = new PaymentModel({
      _id: order.order_id,
      amount: order.order_amount,
      currency: order.order_currency,
      status: "PENDING",
      name: body.teamName ?? null,
      created_at: new Date(),
      order_id: order.order_id,
      payment_session_id: order.payment_session_id,
      user_id: body.userId ?? null,

    });

    await newPayment.save();

    return NextResponse.json({
      id: order.order_id,
      amount: order.order_amount,
      currency: order.order_currency,
      payment_session_id: order.payment_session_id,

    });
  } catch (err) {
    console.error("Cashfree order creation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function PUT(request) {
  await mongoose.connect(process.env.MONGODB_URI);

  const body = await request.json();

  const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_ID,
    process.env.CASHFREE_SECRET
  );

  try {
    const order = await cashfree.PGFetchOrder(body.cashfree_order_id);


    let payment = await PaymentModel.findById(order.data.order_id);


    if (!payment) {
      payment = new PaymentModel({
        _id: order.data.order_id,
        amount: order.data.order_amount,
        currency: order.data.order_currency,
        status: order.data.order_status,
        name: body.teamName ?? null,
        created_at: new Date(),
        order_id: order.data.order_id,
        payment_session_id: order.data.payment_session_id,
        user_id: body.userId ?? null,
      });
    }
    else {
      payment.status = order.data.order_status;
      payment.amount = order.data.order_amount;
      payment.currency = order.data.order_currency;
      payment.updated_at = new Date();
    }
    

    await payment.save();

    return NextResponse.json({
      id: order.data.order_id,
      amount: order.data.order_amount,
      currency: order.data.order_currency,
      status: payment.status,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}