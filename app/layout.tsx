import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/components/providers";
import "@/styles/main.css";

export const metadata: Metadata = {
  title: "Fun.xyz - Challenge",
  description: "Checkout, built for web3",
  openGraph: {
    title: "Fun.xyz - Challenge",
    description: "Checkout, built for web3",
    url: "https://fun.xyz/",
    siteName: "Fun",
    images: [
      {
        url: "https://fun.xyz/fun.svg",
        alt: "Fun.xyz - Challenge",
      },
    ],
    type: "website",
  },
  icons: {
    icon: "https://fun.xyz/fun-dark.svg",
  },
  publisher: "Fun",
};

const inter = localFont({
  src: "./fonts/inter/variable.ttf",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
