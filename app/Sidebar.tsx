"use client";
import { useState } from "react";

export default function Sidebar({ isOpen }: any) {
  return (
    <>
      {isOpen ? (
        <div className="fixed top-0 left-0 z-10 h-full w-40 bg-blue-500">
          <h2 className="text-2xl text-white">This is the sidebar</h2>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
