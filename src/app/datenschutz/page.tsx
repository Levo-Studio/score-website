import type { Metadata } from "next";
import { LegalLayout, LegalBlock, LegalPara, LegalText } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Wie Score mit deinen Daten umgeht: kein Konto, kein Server, keine Analytics.",
};

export default function DatenschutzPage() {
  return (
    <LegalLayout
      eyebrow="Datenschutzerklärung"
      title="Deine Noten bleiben bei dir"
      intro="Stand: August 2026. Kurz gesagt: kein Konto, kein Server, keine Analytics. Score speichert alles auf deinem Gerät und synchronisiert es über deine eigene iCloud."
    >
      <LegalBlock label="Wo deine Noten liegen">
        <LegalPara>
          Alle Fächer, Halbjahre und einzelnen Leistungen werden auf deinem Gerät gespeichert
          und über deine eigene iCloud zwischen iPhone und iPad synchronisiert. Es gibt kein
          Konto bei uns, kein Login und keinen Server, auf dem deine Noten landen.
        </LegalPara>
      </LegalBlock>

      <LegalBlock label="Verschlüsselung">
        <LegalPara>
          Alle gespeicherten Felder sind verschlüsselt. Apple sieht als Betreiber von iCloud
          die Struktur deiner Daten — also dass es Fächer, Halbjahre und Noten gibt —, nicht
          aber ihre Werte.
        </LegalPara>
      </LegalBlock>

      <LegalBlock label="Was wir erheben">
        <LegalPara>
          Nichts. Score enthält keine Analytics, kein Crash-Tracking, keine Werbe-IDs und kein
          Nutzungsprofil. Wir wissen nicht, ob und wie du die App benutzt.
        </LegalPara>
      </LegalBlock>

      <LegalBlock label="iCloud und CloudKit">
        <LegalPara>
          Die Synchronisierung läuft über CloudKit in deinem persönlichen iCloud-Konto. Für die
          Speicherung dort ist Apple nach den eigenen Datenschutzbestimmungen verantwortlich.
          Wir haben auf diesen Bereich keinen Zugriff.
        </LegalPara>
      </LegalBlock>

      <LegalBlock label="Löschen">
        <LegalPara>
          Löschst du die App, gehen die lokalen Daten mit. Den iCloud-Anteil entfernst du in
          den iOS-Einstellungen unter iCloud, oder du exportierst deine Daten vorher in Score
          und löschst sie danach.
        </LegalPara>
      </LegalBlock>

      <LegalBlock label="Diese Website">
        <LegalPara>
          Kein Tracking, keine Cookies, kein Consent-Banner. Der Hoster speichert technisch
          notwendige Zugriffsdaten in Server-Logs, gehostet in Europa. Diese Logs werden nicht
          mit deiner Nutzung der App verknüpft.
        </LegalPara>
      </LegalBlock>

      <LegalBlock label="Deine Rechte">
        <LegalPara>
          Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch nach DSGVO. Da wir selbst keine
          personenbezogenen Daten von dir verarbeiten, betrifft eine Anfrage in der Regel nur
          die Server-Logs dieser Website.
        </LegalPara>
      </LegalBlock>

      <LegalBlock label="Verantwortlicher">
        <LegalText>
          {"Julius Grimm · Levo Studio\nEuropaplatz 2/1, 72072 Tübingen, Deutschland\n"}
          <a href="mailto:hello@levo-studio.com" className="text-(--acc) hover:opacity-70">
            hello@levo-studio.com
          </a>
        </LegalText>
      </LegalBlock>

      <LegalBlock label="Änderungen">
        <LegalPara>
          Ändert sich an der Verarbeitung etwas, aktualisieren wir diese Seite und passen das
          Datum oben an.
        </LegalPara>
      </LegalBlock>
    </LegalLayout>
  );
}
