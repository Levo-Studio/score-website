import type { Metadata } from "next";
import { Archivo, Public_Sans } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/constants";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "800"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Abi Planer",
    "Abitur Baden-Württemberg",
    "Abischnitt berechnen",
    "Block I Rechner",
    "Kursstufe",
    "Gymnasiale Oberstufe",
  ],
  authors: [{ name: "Levo Studio", url: SITE_URL }],
  creator: "Levo Studio",
  icons: {
    icon: [{ url: "/score-icon-petrol-dunkel-1024.png", sizes: "1024x1024", type: "image/png" }],
    apple: [{ url: "/score-icon-petrol-dunkel-1024.png" }],
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/score-og-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Score – Abi Planer für Baden-Württemberg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/score-og-1200x630.png"],
  },
  robots: { index: true, follow: true },
};

// Setzt das Theme vor dem ersten Paint, damit beim Laden nichts aufblitzt.
const themeScript = `(function(){try{var t=localStorage.getItem('score-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${archivo.variable} ${publicSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
