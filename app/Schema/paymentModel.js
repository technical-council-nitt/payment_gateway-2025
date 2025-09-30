import mongoose from 'mongoose'
const PaymentSchema = new mongoose.Schema({
_id: String,
    amount: String,
    currency: String,
    status: String,
    created_at: Object,
    cashfree_order_id: String,
    order_id: String,
    payment_session_id: String,
    user_id: String,
    payment_id: String,
    payment_signature: String,
    cf_payment_id: String,
    name: String,
    updated_at: Object,

})
const PaymentModel=mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
export default  PaymentModel ;