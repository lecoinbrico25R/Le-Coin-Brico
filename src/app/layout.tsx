import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TranslationProvider } from '@/context/TranslationContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import WhatsAppButton from '@/components/WhatsAppButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LE COIN BRICO',
  description: 'La puissance entre vos mains - Coffres-forts, extracteurs et outillage professionnel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <TranslationProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </TranslationProvider>
        {/* Le bouton WhatsApp apparaît ici sur TOUTES les pages publiques */}
        <WhatsAppButton />
      </body>
    </html>
  );
}
