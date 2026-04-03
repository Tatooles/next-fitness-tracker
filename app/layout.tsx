import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarRouteTrigger } from "@/components/sidebar-route-trigger";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";

const appName = "Lifting Log";
const appDescription = "Log and track your workouts";

export const metadata: Metadata = {
  applicationName: appName,
  title: appName,
  description: appDescription,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: appName,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider afterSignOutUrl="/">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSidebar />
              <div id="modal"></div>
              <SidebarInset>
                <main>
                  <SidebarRouteTrigger />
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
          <SpeedInsights />
        </ClerkProvider>
        </body>
      </html>
  );
}
