import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import dynamic from "next/dynamic";

import Providers from "./providers";

import { siteConfig } from "@/config/site";
// eslint-disable-next-line import/order
import { fontSans } from "@/config/fonts";

//import { Navbar } from "@/components/navbar";
const Navbar = dynamic(() => import("@/components/navbar"), {
  ssr: false,
});

import ReduxProvider from "@/ReduxProvider/ReduxProvider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ReduxProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                {children}
              </main>
              <footer className="w-full flex items-center justify-center py-3">
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href="https://ror-portfolio.vercel.app/"
                  title="ROR2022"
                >
                  <span className="text-default-600">Powered by</span>
                  <p className="text-primary">ROR2022</p>
                </Link>
              </footer>
            </div>
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
