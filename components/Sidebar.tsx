"use client";
import Link from "next/link";

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Function;
}) {
  return (
    <div
      className={`fixed top-0 left-0 z-20 h-full w-40 bg-white duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ul className="p-5">
        <li onClick={() => setIsOpen(false)} className="mb-5 text-xl">
          <Link href="/">Home</Link>
        </li>
        <li onClick={() => setIsOpen(false)} className="mb-5 text-xl">
          <Link href="/workouts">Workouts</Link>
        </li>
        <li onClick={() => setIsOpen(false)} className="mb-5 text-xl">
          <Link href="/exercises">Exercises</Link>
        </li>
        <li onClick={() => setIsOpen(false)} className="mb-5 text-xl">
          <Link href="/records">Records</Link>
        </li>
        <li onClick={() => setIsOpen(false)} className="mb-5 text-xl">
          <Link href="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
}
