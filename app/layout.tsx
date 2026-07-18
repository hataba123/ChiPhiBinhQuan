import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bình quân sinh hoạt",
  description: "Theo dõi và tính bình quân chi phí sử dụng tài sản cá nhân.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
