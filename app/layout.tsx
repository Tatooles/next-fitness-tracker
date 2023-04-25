import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs/app-beta";
import "../styles/globals.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [sidebarOpen, setSidebarOpen] = useState(false); // This can't be a client component with clerk...
  return (
    <html lang="en">
      <ClerkProvider>
        <body>
          <div id="modal"></div>
          <div id="root" className="flex h-screen flex-col">
            {/* <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div
              onClick={() => setSidebarOpen(false)}
              className={`fixed top-0 bottom-0 left-0 right-0 z-10 bg-slate-700 bg-opacity-50 ${
                sidebarOpen ? "" : "hidden"
              }`}
            ></div> */}
            <header>
              <nav className="flex items-center justify-between border-b-2 text-lg text-black">
                <div className="p-5">
                  <div className="flex h-[20px] w-[20px] flex-col justify-between overflow-hidden">
                    <div className="h-[2px] w-7 bg-slate-700"></div>
                    <div className="h-[2px] w-7 bg-slate-700"></div>
                    <div className="h-[2px] w-7 bg-slate-700 "></div>
                  </div>
                </div>
                <Link href="/home">
                  <div className="flex items-center p-5 text-slate-700">
                    Logo
                  </div>
                </Link>
                <Link className="p-5" href="/profile">
                  <Avatar>
                    <AvatarImage src="https://github.com/tatooles.png" />
                    <AvatarFallback>KT</AvatarFallback>
                  </Avatar>
                </Link>
              </nav>
            </header>
            <main className="grow">{children}</main>
            <footer className="py-2 text-center text-slate-700">
              Created by Kevin Tatooles
            </footer>
          </div>
        </body>
      </ClerkProvider>
    </html>
  );
}
