import { ClerkProvider } from "@clerk/nextjs/app-beta";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>
          <div id="modal"></div>
          <Navbar></Navbar>
          <div id="root" className="flex h-screen flex-col">
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
