"use client";
import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <header>
        <nav className="flex items-center justify-between border-b-2 text-lg text-black">
          <Sheet>
            <SheetTrigger>
              <div className="p-5">
                <div className="flex h-[20px] w-[20px] flex-col justify-between overflow-hidden">
                  <div className="h-[2px] w-7 bg-slate-700"></div>
                  <div className="h-[2px] w-7 bg-slate-700"></div>
                  <div className="h-[2px] w-7 bg-slate-700 "></div>
                </div>
              </div>
            </SheetTrigger>
            <SheetContent side="left">
              <ul className="flex flex-col space-y-1">
                <Link onClick={() => setIsOpen(false)} href="/">
                  Home
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/workouts">
                  Workouts
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/exercises">
                  Exercises
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/settings">
                  Settings
                </Link>
              </ul>
            </SheetContent>
          </Sheet>
          <div className="p-5">
            <UserButton></UserButton>
          </div>
        </nav>
      </header>
    </>
  );
}
