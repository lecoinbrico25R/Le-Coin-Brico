"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const { language, t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { error } = await supabase.from('messages').insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }
      ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Erreur envoi message:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-[#121212] text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
              <img src="/images/logo.png" alt="LCB" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-xl">LE COIN BRICO</h1>
              <p className="text-xs text-gray-400">{t('footer.slogan') || 'La puissance entre vos mains'}</p>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-[#F7941D]">{t('header.home')}</Link>
            <Link href="/coffres-forts" className="hover:text-[#F7941D]">{t('header.safes')}</Link>
            <Link href="/extracteur" className="hover:text-[#F7941D]">{t('header.extractors')}</Link>
            <Link href="/postes-a-souder" className="hover:text-[#F7941D]">Postes à souder</Link>
            <Link href="/chargeur-batterie" className="hover:text-[#F7941D]">Chargeur batterie</Link>
            <Link href="/contact" className="text-[#F7941D] font-bold">{t('header.contact')}</Link>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-r from-[#121212] to-[#303030] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('contact.title') || 'Contactez-nous'}</h1>
          <p className="text-xl text-gray-300">{t('contact.subtitle') || 'Nous sommes à votre écoute'}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-[#121212]">{t('contact.formTitle') || 'Nos coordonnées'}</h2>
            
            <div className="flex items-start gap-4">
              <div className="bg-[#F7941D] p-3 rounded-lg text-white"><Phone size={24} /></div>
              <div>
                <h3 className="font-bold text-lg">{t('contact.phone')}</h3>
                <p className="text-gray-600">{t('contact.phoneValue')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#F7941D] p-3 rounded-lg text-white"><Mail size={24} /></div>
              <div>
                <h3 className="font-bold text-lg">{t('contact.email')}</h3>
                <p className="text-gray-600">{t('contact.emailValue')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#F7941D] p-3 rounded-lg text-white"><MapPin size={24} /></div>
              <div>
                <h3 className="font-bold text-lg">{t('contact.address')}</h3>
                <p className="text-gray-600">{t('contact.addressValue')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#F7941D] p-3 rounded-lg text-white"><Clock size={24} /></div>
              <div>
                <h3 className="font-bold text-lg">{t('contact.hours')}</h3>
                <p className="text-gray-600">{t('contact.hoursValue')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-6">{t('contact.formTitle') || 'Envoyez-nous un message'}</h2>
            
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
                <CheckCircle size={20} /> {t('contact.sent') || 'Message envoyé avec succès !'}
              </div>
            )}
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
                <AlertCircle size={20} /> {t('contact.error') || 'Erreur lors de l\'envoi. Réessayez.'}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">{t('contact.name')}</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder={t('contact.namePlaceholder')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#F7941D] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder={t('contact.emailPlaceholder')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#F7941D] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('contact.subject')}</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder={t('contact.subjectPlaceholder')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#F7941D] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('contact.message')}</label>
                <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder={t('contact.messagePlaceholder')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#F7941D] outline-none"></textarea>
              </div>
              <button type="submit" disabled={status === 'loading'} className="w-full bg-[#F7941D] hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                {status === 'loading' ? <><Loader2 className="animate-spin" size={20} /> {t('contact.sending')}</> : <><Send size={20} /> {t('contact.send')}</>}
              </button>
            </form>
          </div>

        </div>
      </div>

      <footer className="bg-[#121212] text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 LE COIN BRICO. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
}
