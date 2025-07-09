import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/AuthProvider'
import AuthGuard from '@/components/AuthGuard'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pickleball Tournament Management",
  description: "Hệ thống quản lý giải đấu Pickleball",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <AuthGuard
            publicRoutes={[
              '/tournaments',
              '/tournaments/[id]',
              '/login',
              '/register'
            ]}
            protectedRoutes={[
              '/dashboard',
              '/admin',
              '/admin/[path]',
              '/tournaments/create',
              '/tournaments/my-tournaments',
              '/tournaments/[id]/events/[eventId]/register',
              '/profile'
            ]}
          >
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
