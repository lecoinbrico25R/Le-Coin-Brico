"use client";

import { usePathname } from 'next/navigation';
import PublicLayout from '@/components/PublicLayout';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Si on est dans l'admin, on n'affiche PAS le layout public
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  // Sinon, on affiche le Header, le Hero et le Footer
  return <PublicLayout>{children}</PublicLayout>;
}
