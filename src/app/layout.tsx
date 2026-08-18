import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://devjahid.vercel.app"),
  applicationName: "Jahid Hasan",
  title: {
    default: "Jahid Hasan | Full-Stack Developer",
    template: "%s | Jahid Hasan",
  },
  description: "Full Stack Web Developer specializing in React, Next.js, and modern web technologies.",
  keywords: ["Full Stack Developer", "React", "Next.js", "PHP", "TypeScript", "Web Developer"],
  authors: [{ name: "Jahid Hasan" }],
  verification: {
    google: "FQrpQ-JTj_jGJKwA-INlE2iHr19jbyK_4JlqHIwBSzQ",
  },
  icons: {
    icon: [{ url: "/jahid-favicon-v2.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/jahid-apple-touch-icon-v2.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Jahid Hasan | Full Stack Web Developer",
    description: "Full Stack Web Developer specializing in React, Next.js, and modern web technologies.",
    siteName: "Jahid Hasan",
    url: "https://devjahid.vercel.app",
    type: "website",
    images: [
      {
        url: "/og-image-dimension.png",
        width: 1200,
        height: 630,
        alt: "Jahid Hasan — Full Stack Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jahid Hasan | Full Stack Web Developer",
    description: "Full Stack Web Developer specializing in React, Next.js, and modern web technologies.",
    images: ["/og-image-dimension.png"],
  },
};

import ClientLayout from "@/components/ui/ClientLayout";
import { getActiveTheme } from "@/lib/theme";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const frontendTheme = await getActiveTheme();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('vsc-theme') || 'dark';
              document.documentElement.dataset.theme = theme;
            })()
          `
        }} />
        <link rel="icon" type="image/png" sizes="512x512" href="/jahid-favicon-v2.png" />
        <link rel="apple-touch-icon" href="/jahid-apple-touch-icon-v2.png" />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KSVGM2F8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <ClientLayout frontendTheme={frontendTheme}>
          {children}
        </ClientLayout>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KSVGM2F8');`}
        </Script>
        <Analytics />
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
