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
      <body>
        <div id="modal"></div>
        <div
          id="root"
          className="container mx-auto flex h-screen flex-col bg-white"
        >
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <div
            onClick={() => setSidebarOpen(false)}
            className={`fixed top-0 bottom-0 left-0 right-0 z-10 bg-slate-700 bg-opacity-50 ${
              sidebarOpen ? "" : "hidden"
            }`}
          ></div>
          <header>
            <nav className="flex items-center justify-between border-b-2 p-5 text-lg text-black">
              <div
                onClick={() => setSidebarOpen(true)}
                className="flex h-[20px] w-[20px] flex-col justify-between overflow-hidden"
              >
                <div className="h-[2px] w-7 bg-slate-700"></div>
                <div className="h-[2px] w-7 bg-slate-700"></div>
                <div className="h-[2px] w-7 bg-slate-700 "></div>
              </div>
              <div className="flex items-center text-slate-700">Logo</div>
              <div className="text-s-700 flex items-center">Profile</div>
            </nav>
          </header>
          <main className="grow">{children}</main>
          <footer className="py-2 text-center text-slate-700">
            Created by Kevin Tatooles
          </footer>
        </div>
      </body>
    </html>
  );
}
