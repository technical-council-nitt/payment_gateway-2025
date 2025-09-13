import Image from "next/image";

export default function Home() {
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold underline">Confirm Payment:</h1>
      <form action="/api/checkout" method="POST" className="flex flex-col items-center mt-4">
       
       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
         Proceed 180
       </button>
      </form>
    </div>
    </>
   

  );
}
