import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

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
    {
      title: "Export",
      href: "/export",
    },
    {
      title: "Guide",
      href: "/guide",
    },
  ];
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div id="modal"></div>
            <Navbar sidebarItems={sidebarItems}></Navbar>
            <div id="root" className="flex h-screen flex-col">
              {/* TODO: Put main in a container so it doesn't span the whole screen on desktop */}
              <main className="grow">{children}</main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
