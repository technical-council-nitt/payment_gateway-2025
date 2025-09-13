import "./globals.css";

export const metadata = {
  title: "Payment Gateway",
  description: "A simple payment gateway app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}