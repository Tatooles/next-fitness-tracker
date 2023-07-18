import { useEffect } from "react";
import Link from "next/link";

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Function;
}) {
  useEffect(() => {
    // Prevent background scrolling when sidebar is open
    if (isOpen) {
      console.log("sidebar open");
      document.body.style.overflow = "hidden";
    } else {
      console.log("sidebar closed");
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

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
          <Link href="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
}
