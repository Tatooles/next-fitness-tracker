import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Lifting Log",
  description: "Log and track your workouts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Workouts",
      href: "/workouts",
    },
    {
      title: "Exercises",
      href: "/exercises",
    },
  ];
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div id="modal"></div>
          <Navbar sidebarItems={sidebarItems}></Navbar>
          <div id="root" className="flex h-screen flex-col">
            {/* TODO: Put main in a container so it doesn't span the whole screen on desktop */}
            <main className="grow">{children}</main>
            <footer className="py-2 text-center text-slate-700">
              Created by Kevin Tatooles
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
