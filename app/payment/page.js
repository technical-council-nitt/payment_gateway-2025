/*"use client";

import { useEffect, useRef, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";

function Checkout() {
  const [order, setOrder] = useState(null);
  const cashfreeRef = useRef(null);

  useEffect(() => {
    const init = async () => {

      cashfreeRef.current = await load({ mode: "production" });


      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "user-id",
            teamName: "team-name",
          }),
        });

        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    init();
  }, []);

  const doPayment = async () => {
    if (!cashfreeRef.current) {
      console.error("Cashfree SDK not initialized yet");
      return;
    }
    if (!order?.payment_session_id) {
      console.error("Order not ready yet");
      return;
    }

    const checkoutOptions = {
      paymentSessionId: order.payment_session_id,
      // redirectTarget: document.getElementById("cf_checkout"),
      redirect : true,
      appearance: {
        width: "425px",
        height: "700px",
      },
    };

    cashfreeRef.current.checkout(checkoutOptions).then(async (result) => {
      if (result.error) {
        console.error("Payment error:", result.error);
      }
      if (result.redirect) {
        console.log("Payment will be redirected");
      }
      if (result.paymentDetails) {
        console.log("Payment completed:", result.paymentDetails);
        console.log(order);
       
        // const res = await fetch("/api/checkout", {
        //   method: "PUT",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     cashfree_order_id: order.id,
        //     userId: "user-id",
        //     teamName: "team-name",
        //   }),
        // });
        // const data = await res.json();
        // console.log("Payment status updated:", data);
        console.log("Payment completed:", result.paymentDetails.paymentMessage);
      }
    });
  };

  return (
    <div className="row">
      <p>Click below to open the checkout page here</p>
      <button
        type="button"
        className="btn btn-primary"
        id="renderBtn"
        onClick={doPayment}
        disabled={!order}
      >
        Pay Now
      </button>
    </div>
  );
}

export default Checkout;
*/
