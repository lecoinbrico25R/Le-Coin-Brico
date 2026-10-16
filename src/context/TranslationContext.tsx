"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'ar';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    header: {
      delivery: "Livraison dans toute l'Algérie",
      help: "Besoin d'aide",
      account: "Mon compte",
      favorites: "Favoris",
      cart: "Panier",
      categories: "Toutes catégories",
      home: "Accueil",
      safes: "Coffres-forts",
      extractors: "Extracteur d'air",
      contact: "Contact",
      searchPlaceholder: "Rechercher un produit...",
      allCategories: "Toutes catégories"
    },
    home: {
      title: "La puissance",
      subtitle: "entre vos mains",
      description: "Découvrez notre sélection de coffres-forts et extracteurs de haute qualité.",
      cta: "Voir nos produits",
      categories: "Nos catégories principales",
      featured: "Nos produits récents",
      viewAll: "Voir tous les produits",
      howItWorks: "Comment ça marche ?",
      step1: "Choisissez votre produit",
      step1Desc: "Parcourez notre catalogue.",
      step2: "Passez commande",
      step2Desc: "Remplissez le formulaire.",
      step3: "Livraison rapide",
      step3Desc: "Nous livrons en 24-48h.",
      step4: "Paiement à la livraison",
      step4Desc: "Payez à la réception.",
      features: {
        delivery: "Livraison rapide",
        deliveryDesc: "Partout en Algérie",
        warranty: "Produits garantis",
        warrantyDesc: "Qualité assurée",
        payment: "Paiement à la livraison",
        paymentDesc: "Ou CIB / Dahabia",
        support: "Service client",
        supportDesc: "7j/7 à votre écoute"
      }
    },
    products: {
      view: "Voir le produit",
      filters: "Filtres",
      type: "Type",
      price: "Prix",
      found: "produits trouvés"
    },
    footer: {
      company: "LE COIN BRICO",
      slogan: "La puissance entre vos mains",
      navigation: "Navigation",
      info: "Informations",
      contact: "Contact",
      shipping: "Livraison",
      payment: "Paiement",
      contactPage: "Nous contacter",
      location: "📍 Cité ONAMA Constantine Algérie",
      phone: "0560 14 36 57",
      email: "✉️ le.coin.brico25@gmail.com",
      rights: "Tous droits réservés."
    },
    contact: {
      title: "Contactez-nous",
      subtitle: "Nous sommes à votre écoute",
      phone: "Téléphone",
      phoneValue: "0560 14 36 57",
      email: "Email",
      emailValue: "le.coin.brico25@gmail.com",
      address: "Adresse",
      addressValue: "Cité ONAMA Constantine Algérie",
      hours: "Horaires d'ouverture",
      hoursValue: "Dim - Jeu : 9h - 18h, Vendredi : Fermé, Samedi : 9h - 13h",
      formTitle: "Envoyez-nous un message",
      name: "Nom complet",
      namePlaceholder: "Votre nom",
      emailPlaceholder: "votre@email.com",
      subject: "Sujet",
      subjectPlaceholder: "Sujet de votre message",
      message: "Message",
      messagePlaceholder: "Votre message...",
      send: "Envoyer le message",
      sending: "Envoi en cours...",
      sent: "Message envoyé avec succès !",
      error: "Erreur lors de l'envoi"
    },
    safes: { title: "Nos Coffres-forts", subtitle: "Sécurité maximale" },
    extractors: { title: "Nos Extracteurs d'air", subtitle: "Outils professionnels" }
  },
  ar: {
    header: {
      delivery: "التوصيل عبر كامل التراب الوطني",
      help: "هل تحتاج مساعدة",
      account: "حسابي",
      favorites: "المفضلة",
      cart: "السلة",
      categories: "جميع الفئات",
      home: "الرئيسية",
      safes: "خزائن",
      extractors: "أجهزة استخراج الهواء",
      contact: "اتصل بنا",
      searchPlaceholder: "ابحث عن منتج...",
      allCategories: "جميع الفئات"
    },
    home: {
      title: "القوة",
      subtitle: "بين يديك",
      description: "اكتشف مجموعتنا من الخزائن وأجهزة استخراج الهواء عالية الجودة.",
      cta: "شاهد منتجاتنا",
      categories: "الفئات الرئيسية",
      featured: "منتجاتنا الحديثة",
      viewAll: "عرض جميع المنتجات",
      howItWorks: "كيف يعمل؟",
      step1: "اختر منتجك",
      step1Desc: "تصفح كتالوجنا.",
      step2: "قدم طلبك",
      step2Desc: "املأ الاستمارة.",
      step3: "توصيل سريع",
      step3Desc: "نوصل في 24-48 ساعة.",
      step4: "الدفع عند الاستلام",
      step4Desc: "ادفع عند الاستلام.",
      features: {
        delivery: "توصيل سريع",
        deliveryDesc: "عبر كامل التراب الوطني",
        warranty: "منتجات مضمونة",
        warrantyDesc: "جودة مضمونة",
        payment: "الدفع عند الاستلام",
        paymentDesc: "أو CIB / ذهبية",
        support: "خدمة العملاء",
        supportDesc: "7 أيام في الأسبوع"
      }
    },
    products: {
      view: "عرض المنتج",
      filters: "تصفية",
      type: "النوع",
      price: "السعر",
      found: "منتجات وجدت"
    },
    footer: {
      company: "LE COIN BRICO",
      slogan: "القوة بين يديك",
      navigation: "التنقل",
      info: "معلومات",
      contact: "اتصل بنا",
      shipping: "التوصيل",
      payment: "الدفع",
      contactPage: "اتصل بنا",
      location: "📍 حي أونامة قسنطينة الجزائر",
      phone: "0560 14 36 57",
      email: "✉️ le.coin.brico25@gmail.com",
      rights: "جميع الحقوق محفوظة."
    },
    contact: {
      title: "اتصل بنا",
      subtitle: "نحن في خدمتكم",
      phone: "الهاتف",
      phoneValue: "0560 14 36 57",
      email: "البريد الإلكتروني",
      emailValue: "le.coin.brico25@gmail.com",
      address: "العنوان",
      addressValue: "حي أونامة قسنطينة الجزائر",
      hours: "ساعات العمل",
      hoursValue: "الأحد - الخميس: 9ص - 6م، الجمعة: مغلق، السبت: 9ص - 1م",
      formTitle: "أرسل لنا رسالة",
      name: "الاسم الكامل",
      namePlaceholder: "اسمك",
      emailPlaceholder: "بريدك@مثال.com",
      subject: "الموضوع",
      subjectPlaceholder: "موضوع رسالتك",
      message: "الرسالة",
      messagePlaceholder: "رسالتك...",
      send: "إرسال الرسالة",
      sending: "جاري الإرسال...",
      sent: "تم إرسال الرسالة بنجاح!",
      error: "خطأ في الإرسال"
    },
    safes: { title: "خزائننا", subtitle: "أقصى أمان" },
    extractors: { title: "أجهزة استخراج الهواء", subtitle: "أدوات مهنية" }
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
