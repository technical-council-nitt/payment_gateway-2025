"use client"
import Image from "next/image";
import axios from 'axios';

export default function Home() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      teamName: formData.get("teamName"),
      teamLeaderName: formData.get("teamLeaderName"),
      teamMember1Name: formData.get("teamMember1Name"),
      teamMember2Name: formData.get("teamMember2Name"),
      teamMember3Name: formData.get("teamMember3Name"),
    };

    try {
      const response = await axios.post('/api/payments/create_order', data);
      

      if (response.status === 200) {
        // Handle successful submission (e.g., redirect to payment page)
        window.location.href = '/payment';
        console.log('Form submitted successfully');
      } else {
        // Handle errors
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold underline">Confirm Team Details:</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4">
       <input type="text" name="teamName" placeholder="Enter Team Name" className="border border-gray-300 p-2 rounded mb-2" />
       <input type="text" placeholder="Team Leader Name" name="teamLeaderName" className="border border-gray-300 p-2 rounded mb-2" />

       <input type="text" placeholder="Team Member 1 Name" name="teamMember1Name" className="border border-gray-300 p-2 rounded mb-2" />
       <input type="text" placeholder="Team Member 2 Name" name="teamMember2Name" className="border border-gray-300 p-2 rounded mb-2" />
       <input type="text" placeholder="Team Member 3 Name" name="teamMember3Name" className="border border-gray-300 p-2 rounded mb-4" />
       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
         Proceed to Payment
       </button>
      </form>
    </div>
    </>
   

  );
}
