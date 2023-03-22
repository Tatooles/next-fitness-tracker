"use client";
import { useState } from "react";

export default function Sidebar({ isOpen }: any) {
  return (
    <div
      className={`fixed top-0 left-0 z-20 h-full w-40 bg-blue-500 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } duration-300 ease-in-out `}
    >
      <h2 className="text-2xl text-white">This is the sidebar</h2>
    </div>
  );
}
