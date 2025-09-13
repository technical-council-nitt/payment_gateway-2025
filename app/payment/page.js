"use client"
import Image from "next/image";
import Script from "next/script";

export default function Home() {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('/api/checkout', {
            method: 'POST',
            body: new FormData(event.target)
        });
        const data = await response.json();
        if (response.ok) {
            const options = {
                key: process.env.RAZORPAY_ID, // Enter the Key ID generated from the Dashboard
                amount: data.amount.toString(),
                currency: data.currency,
                name: "Acme Corp",
                description: "Test Transaction",
                order_id: data.id,
                handler: function (response) {
                    alert("Payment successful!");
                    console.log(response);
                },
            };
        
        const rzp1 = new Razorpay(options);
        rzp1.open();
        }
    }

  return (
    <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold underline">Confirm Payment:</h1>
      <form onSubmit={handleSubmit} method="POST" className="flex flex-col items-center mt-4">
       
       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
         Proceed 180
       </button>
      </form>
    </div>
    </>
   

  );
}
