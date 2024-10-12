import { getLatestCheerpxScriptUrl } from "@/lib/get-latest-cheerpx-script-url";
import "@xterm/xterm/css/xterm.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { CheerpxProvider } from "../providers/cheerpx";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Product name!",
  description: "Play multiplayer CTF games with friends!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const scriptUrl = await getLatestCheerpxScriptUrl();
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div id="root" className="min-h-[100svh] flex flex-col">
          <CheerpxProvider src={scriptUrl}>{children}</CheerpxProvider>
        </div>
      </body>
    </html>
  );
}
