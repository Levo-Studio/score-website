import type { Metadata } from "next";
import { LegalLayout, LegalBlock, LegalPara, LegalText } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung gemäß § 5 DDG.",
};

export default function ImpressumPage() {
  return (
    <LegalLayout eyebrow="Impressum" title="Angaben gemäß § 5 DDG">
      <LegalBlock label="Anbieter">
        <LegalText>{"Levo Studio\nJulius Grimm\nEuropaplatz 2/1\n72072 Tübingen\nDeutschland"}</LegalText>
      </LegalBlock>

      <LegalBlock label="Kontakt">
        <LegalText>
          {"Telefon: "}
          <a href="tel:+4917661028522" className="text-(--acc) hover:opacity-70">
            +49 176 61028522
          </a>
          {"\nE-Mail: "}
          <a href="mailto:hello@levo-studio.com" className="text-(--acc) hover:opacity-70">
            hello@levo-studio.com
          </a>
          {"\nWhatsApp Business: "}
          <a href="https://wa.me/4917661028522" className="text-(--acc) hover:opacity-70">
            +49 176 61028522
          </a>
        </LegalText>
      </LegalBlock>

      <LegalBlock label="Sitz">
        <LegalText>{"Europaplatz 2/1\n72072 Tübingen\nDeutschland"}</LegalText>
      </LegalBlock>

      <LegalBlock label="Umsatzsteuer">
        <LegalText>Umsatzsteuer-Identifikationsnummer: in Beantragung</LegalText>
      </LegalBlock>

      <LegalBlock label="Inhaltlich verantwortlich">
        <LegalText>{"Julius Grimm\nEuropaplatz 2/1\n72072 Tübingen"}</LegalText>
      </LegalBlock>

      <LegalBlock label="Haftung für Inhalte">
        <LegalPara>
          Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den
          allgemeinen Gesetzen verantwortlich. Für Inhalte Dritter, auf die lediglich verwiesen
          wird, übernehmen wir keine Haftung.
        </LegalPara>
      </LegalBlock>

      <LegalBlock label="Haftung für Links">
        <LegalPara>
          Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir
          keinen Einfluss haben. Für diese Inhalte ist stets der jeweilige Anbieter oder
          Betreiber verantwortlich.
        </LegalPara>
      </LegalBlock>

      <LegalBlock label="Urheberrecht">
        <LegalPara>
          Die vom Betreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem
          deutschen Urheberrecht. Eine Verwendung über die Grenzen des Urheberrechts hinaus
          bedarf der vorherigen Zustimmung.
        </LegalPara>
      </LegalBlock>
    </LegalLayout>
  );
}
