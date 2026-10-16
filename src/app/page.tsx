"use client";

import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/context/TranslationContext';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      {/* FEATURES */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3"><Truck className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.delivery')}</p><p className="text-sm text-gray-500">{t('home.features.deliveryDesc')}</p></div></div>
            <div className="flex items-center gap-3"><Shield className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.warranty')}</p><p className="text-sm text-gray-500">{t('home.features.warrantyDesc')}</p></div></div>
            <div className="flex items-center gap-3"><CreditCard className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.payment')}</p><p className="text-sm text-gray-500">{t('home.features.paymentDesc')}</p></div></div>
            <div className="flex items-center gap-3"><Headphones className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.support')}</p><p className="text-sm text-gray-500">{t('home.features.supportDesc')}</p></div></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#121212] mb-12">{t('home.howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: 1, title: t('home.step1'), desc: t('home.step1Desc') },
              { num: 2, title: t('home.step2'), desc: t('home.step2Desc') },
              { num: 3, title: t('home.step3'), desc: t('home.step3Desc') },
              { num: 4, title: t('home.step4'), desc: t('home.step4Desc') },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="bg-[#F7941D] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">{step.num}</div>
                <h3 className="font-bold text-[#121212] mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
