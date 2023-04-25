import Link from "next/link";

export default function Home() {
  // TODO: This page should probably be the login page
  // will redirect to the home page after login
  // or auto redirect if the user is already logged in
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
