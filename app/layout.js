import "./globals.css";
import { spaceGrotesk, dmSans } from "./fonts";

export const metadata = {
  title: "Job Weave - Track Applications, Manage Assets, & Build Streaks",
  description: "Job Weave is the ultimate free tool for job seekers. Track applications, manage career assets, and build consistency with our streak tracker.",
  keywords: ["job tracker", "application tracker", "career assets", "job search tool", "resume manager", "streak tracker", "job weave", "the closure studio"],
  authors: [{ name: "The Closure Studio" }],
  creator: "The Closure Studio",
  publisher: "The Closure Studio",
  openGraph: {
    title: "Job Weave - Track Applications, Manage Assets, & Build Streaks",
    description: "Job Weave is the ultimate free tool for job seekers. Track applications, manage career assets, and build consistency with our streak tracker.",
    url: "https://jobweave.vercel.app",
    siteName: "Job Weave",
    images: [
      {
        url: "https://jobweave.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Job Weave Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Weave - Track Applications, Manage Assets, & Build Streaks",
    description: "The ultimate free tool for job seekers. Track applications, manage assets, and build streaks.",
    images: ["https://jobweave.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg", 
  },
  alternates: {
    canonical: "https://jobweave.vercel.app",
  },
};

import { AuthProvider } from "@/app/context/AuthContext";
import JsonLd from "./components/JsonLd";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
        <JsonLd />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
