import type { Metadata } from "next";
import "./globals.css";
import { TranslationProvider } from "@/context/TranslationContext";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "LE COIN BRICO - Coffres-forts et Outillage en Algérie",
  description: "Votre site de bricolage et de sécurité en Algérie.",
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
          <ClientLayout>
            {children}
          </ClientLayout>
        </TranslationProvider>
      </body>
    </html>
  );
}
