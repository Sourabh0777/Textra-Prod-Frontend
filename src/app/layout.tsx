import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import DashboardLayout from "@/components/layout/dashboard-layout";

export const metadata: Metadata = {
  title: "Bike Service CRM",
  description: "Manage your bike service business with ease",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
