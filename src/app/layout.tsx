import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Jahid Hasan | Full Stack Web Developer",
  description: "Full Stack Web Developer specializing in React, Next.js, and modern web technologies.",
  keywords: ["Full Stack Developer", "React", "Next.js", "TypeScript", "Web Developer"],
  authors: [{ name: "Jahid Hasan" }],
  openGraph: {
    title: "Jahid Hasan | Full Stack Web Developer",
    description: "Full Stack Web Developer specializing in React, Next.js, and modern web technologies.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('vsc-theme') || 'dark';
              document.documentElement.dataset.theme = theme;
            })()
          `
        }} />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#252526", color: "#d4d4d4", border: "1px solid #3c3c3c", fontSize: 13 },
          }}
        />
      </body>
    </html>
  );
}
