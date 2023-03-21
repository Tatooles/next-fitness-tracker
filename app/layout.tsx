"use client";
import { useState } from "react";
import "./globals.css";
import Sidebar from "./Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <body className="container mx-auto flex h-screen flex-col bg-[#171717]">
        <Sidebar isOpen={sidebarOpen} />
        <header>
          <nav className="flex justify-between p-5 text-lg text-white">
            <div onClick={() => setSidebarOpen(true)}>Menu</div>
            <div>Logo</div>
            <div>Profile</div>
          </nav>
        </header>
        <main className="grow bg-white">{children}</main>
        <footer className="text-center text-white">
          Created by Kevin Tatooles
        </footer>
      </body>
    </html>
  );
}
