// app/layout.tsx
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { Providers } from "./providers";
import ThemeToggle from "@/components/ToggerTheme";

export const metadata = {
  title: "Duc Anh",
  description: "Duc Anh",
  icons: {
    icon: "/favicon.ico", // phải đúng đường dẫn và tồn tại file
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <Providers>
          <ThemeToggle />
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="md:pl-64 flex-1 mt-20">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
