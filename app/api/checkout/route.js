
import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { supabaseAdmin } from "../../lib/supabaseServer";
import crypto from "crypto";


function verifyCashfreeSignature({ cf_order_id, signature }) {
  const secretKey = process.env.CASHFREE_SECRET;
  const rawSignature = cf_order_id + secretKey;
  const generatedSignature = crypto.createHash("sha256").update(rawSignature).digest("hex");
  return generatedSignature === signature;
}
export async function POST(request) {
 

  const body = await request.json();
  console.log(body);
  const cashfree = new Cashfree(
    CFEnvironment.PRODUCTION,
    process.env.CASHFREE_ID,
    process.env.CASHFREE_SECRET
  );

  try {

    const orderRequest = {
      order_amount: process.env.registration_fee,
      order_currency: "INR",
      customer_details: {
        customer_id: body.teamId || "guest_user",
        // customer_name: body.teamName || "Anonymous",
        // customer_email: "example@gmail.com",
        customer_phone: body.teamName || "Anonymous",
      },
      order_meta: {
        return_url:
          "https://register.transfinitte.org/",
        notify_url:
          "https://backend.transfinitte.org/api/cashfree-webhook",

      },
      order_note: "Team registration payment",
    };

    const response = await cashfree.PGCreateOrder(orderRequest);
    const order = response.data;
    console.log("Cashfree Order Response:", order);
    const { error: InsertErr } = await supabaseAdmin
      .from("payments")
      .insert({
        team_id: body.teamId,
        expiry_time: new Date(order.order_expiry_time),
        order_id: order.order_id,
        payment_session_id: order.payment_session_id,
        status: "Pending",
        raw_payload: order,
        created_at: new Date(),
      })
      .select();

    if (InsertErr) {
      console.error("Supabase insert error:", InsertErr);
      return NextResponse.json({ ok: false, error: InsertErr.message }, { status: 500 });
    }

    // const { error: TeamErr } = await supabaseAdmin
    //   .from("teams")
    //   .update({ payment_status: "Pending" })
    //   .eq("team_id", team_id);

    // if (TeamErr) {
    //   console.error("Supabase update team error:", TeamErr);
    //   return NextResponse.json({ ok: false, error: TeamErr.message }, { status: 500 });
    // }
   

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
