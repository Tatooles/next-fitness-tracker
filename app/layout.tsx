import "./globals.css";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className=" bg-[#171717] h-screen container mx-auto flex flex-col">
        <header>
          <nav className="text-white flex justify-between p-5 text-lg">
            <div>Menu</div>
            <div>Logo</div>
            <div>Profile</div>
          </nav>
        </header>
        <main className="grow bg-white">{children}</main>
        <footer className="text-white text-center">
          Created by Kevin Tatooles
        </footer>
      </body>
    </html>
  );
}
