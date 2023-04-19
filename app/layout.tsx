"use client";
import { useState } from "react";
import Link from "next/link";
import "../styles/globals.css";
import Sidebar from "../components/Sidebar";

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
        <div id="root" className="flex h-screen flex-col bg-white">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <div
            onClick={() => setSidebarOpen(false)}
            className={`fixed top-0 bottom-0 left-0 right-0 z-10 bg-slate-700 bg-opacity-50 ${
              sidebarOpen ? "" : "hidden"
            }`}
          ></div>
          <header>
            <nav className="flex items-center justify-between border-b-2 text-lg text-black">
              <div onClick={() => setSidebarOpen(true)} className="p-5">
                <div className="flex h-[20px] w-[20px] flex-col justify-between overflow-hidden">
                  <div className="h-[2px] w-7 bg-slate-700"></div>
                  <div className="h-[2px] w-7 bg-slate-700"></div>
                  <div className="h-[2px] w-7 bg-slate-700 "></div>
                </div>
              </div>
              <Link href="/home">
                <div className="flex items-center p-5 text-slate-700">Logo</div>
              </Link>
              <Link className="p-5" href="/profile">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-700">
                  <svg
                    className="absolute -left-1 h-12 w-12 text-slate-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </Link>
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
