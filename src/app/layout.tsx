import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TranslationProvider } from '@/context/TranslationContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
              
              {/* Bouton de changement de langue - À l'intérieur du Provider pour fonctionner */}
              <div className="fixed top-20 sm:top-24 right-4 z-[60]">
                <LanguageSwitcher />
              </div>
              
              {/* Bouton WhatsApp - en bas à droite */}
              <WhatsAppButton />
            </WishlistProvider>
          </CartProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
