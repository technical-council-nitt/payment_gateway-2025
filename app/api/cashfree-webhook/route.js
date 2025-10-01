import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "../../lib/supabaseServer";
export async function POST(request) {
  try {
    
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
      .eq("team_id", data.data.customer_details.customer_id);

    if (Err) {
      console.error("Supabase update payment error:", Err);
      return NextResponse.json({ ok: false, error: Err.message }, { status: 500 });
    }
    
    // Always respond 200 OK
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
