"use client";
import { useState } from "react";
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
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Are you sure absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <header>
        <nav className="flex items-center justify-between border-b-2 text-lg text-black">
          <div onClick={() => setSidebarOpen(true)} className="p-5">
            <div className="flex h-[20px] w-[20px] flex-col justify-between overflow-hidden">
              <div className="h-[2px] w-7 bg-slate-700"></div>
              <div className="h-[2px] w-7 bg-slate-700"></div>
              <div className="h-[2px] w-7 bg-slate-700 "></div>
            </div>
          </div>
          <div className="p-5">
            <UserButton></UserButton>
          </div>
        </nav>
      </header>
    </>
  );
}
