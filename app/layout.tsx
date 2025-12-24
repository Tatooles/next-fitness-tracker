import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lifting Log",
  description: "Log and track your workouts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSidebar />
              <div id="modal"></div>
              <div id="root" className="flex h-screen flex-col">
                {/* TODO: Put main in a container so it doesn't span the whole screen on desktop */}
                <main className="grow">
                  <SidebarTrigger />
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
