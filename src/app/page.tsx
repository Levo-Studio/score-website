import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Eintragen } from "@/components/sections/Eintragen";
import { Halbjahre } from "@/components/sections/Halbjahre";
import { Block } from "@/components/sections/Block";
import { Faecher } from "@/components/sections/Faecher";
import { Ipad } from "@/components/sections/Ipad";
import { Privat } from "@/components/sections/Privat";
import { Laden } from "@/components/sections/Laden";
import { Code } from "@/components/sections/Code";
import {
  APP_STORE_URL,
  GITHUB_APP_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: SITE_NAME,
  applicationCategory: "EducationApplication",
  operatingSystem: "iOS, iPadOS",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  installUrl: APP_STORE_URL,
  downloadUrl: APP_STORE_URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  publisher: { "@type": "Organization", name: "Levo Studio" },
  sameAs: [APP_STORE_URL, GITHUB_APP_URL],
};

export default function Home() {
  return (
    <div className="relative overflow-x-clip bg-(--bg) text-(--ink)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Nav />
      <Hero />
      <Eintragen />
      <Halbjahre />
      <Block />
      <Faecher />
      <Ipad />
      <Privat />
      <Laden />
      <Code />
      <Footer />
    </div>
  );
}
