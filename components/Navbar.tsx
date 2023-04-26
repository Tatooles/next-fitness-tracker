"use client";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
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
            <Avatar>
              <AvatarImage src="https://github.com/tatooles.png" />
              <AvatarFallback>KT</AvatarFallback>
            </Avatar>
          </Link>
        </nav>
      </header>
    </>
  );
}
