"use client";
import Link from "next/link";

export default function Sidebar({ isOpen }: any) {
  return (
    <div
      className={`fixed top-0 left-0 z-20 h-full w-40 bg-gray-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } duration-300 ease-in-out `}
    >
      <ul className="p-5">
        <li className="mb-5 text-xl">
          <Link href="/">Home</Link>
        </li>
        <li className="mb-5 text-xl">
          <Link href="/">Workouts</Link>
        </li>
        <li className="mb-5 text-xl">
          <Link href="/">Records</Link>
        </li>
        <li className="mb-5 text-xl">
          <Link href="/">Settings</Link>
        </li>
      </ul>
    </div>
  );
}
