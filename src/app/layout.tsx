// /app/layout.tsx
import './globals.css'
import Navbar from "@/components/navbar.tsx";

function MyPage() {
  return (
    <div>
      <Navbar />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <div>
     
    </div>
        {children}
        </body>
    </html>
  )
}
