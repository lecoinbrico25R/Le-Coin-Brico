import type { Metadata } from "next";
import WhatsAppButton from '@/components/WhatsAppButton';
import "./globals.css";
import WhatsAppButton from '@/components/WhatsAppButton';
import { TranslationProvider } from "@/context/TranslationContext";
import WhatsAppButton from '@/components/WhatsAppButton';
import { CartProvider } from "@/context/CartContext";
import WhatsAppButton from '@/components/WhatsAppButton';
import { WishlistProvider } from "@/context/WishlistContext";
import WhatsAppButton from '@/components/WhatsAppButton';

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
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </TranslationProvider>
      <WhatsAppButton />
  </body>
    </html>
  );
}
