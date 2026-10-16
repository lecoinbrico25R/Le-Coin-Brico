import type { Metadata } from "next";
import "./globals.css";
import { TranslationProvider } from "@/context/TranslationContext";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
  title: "LE COIN BRICO - Coffres-forts et Outillage en Algérie",
  description: "Votre site de bricolage et de sécurité en Algérie. Coffres-forts, extracteurs et outillage professionnel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <TranslationProvider>
          <PublicLayout>
            {children}
          </PublicLayout>
        </TranslationProvider>
      </body>
    </html>
  );
}
