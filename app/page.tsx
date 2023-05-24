import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-10 text-3xl">Welcome</div>
      <Link
        href="/sign-in"
        className="mb-5 rounded-md bg-gray-600 p-2 text-white"
      >
        Login
      </Link>
      <Link href="/sign-up" className="rounded-md bg-gray-600 p-2 text-white">
        Sign Up
      </Link>
    </div>
  );
}
