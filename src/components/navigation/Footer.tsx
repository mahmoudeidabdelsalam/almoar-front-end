'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { locale, t } = useLanguage();

  return (
    <footer className="bg-[#0A1426] text-white border-t border-white/10 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Column 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/branding/alomar_logo_mark.png"
                  alt="Alomar Holding Mark"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-white text-xl font-bold tracking-tight block">
                  {locale === 'ar' ? 'العمر القابضة' : 'ALOMAR HOLDING'}
                </span>
                <span className="text-[#B7913D] text-xs tracking-wider uppercase font-semibold">
                  {locale === 'ar' ? 'استثمار برؤية أوسع' : 'Investment with a Broader Vision'}
                </span>
              </div>
            </Link>

            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              {t.footer.company_desc}
            </p>

            {/* Vision 2030 Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1B4332] ring-4 ring-[#1B4332]/30" />
              <span className="text-xs font-semibold text-white/90">
                {locale === 'ar' ? 'شريك استثماري فاعل لرؤية السعودية 2030' : 'Strategic Partner to Saudi Vision 2030'}
              </span>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold tracking-wider uppercase text-[#B7913D]">
              {t.footer.quick_links}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-colors flex items-center gap-1">
                  <span>{t.nav.home}</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:underline transition-colors flex items-center gap-1">
                  <span>{t.nav.about}</span>
                </Link>
              </li>
              <li>
                <Link href="/sectors" className="hover:text-white hover:underline transition-colors flex items-center gap-1">
                  <span>{t.nav.sectors}</span>
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-white hover:underline transition-colors flex items-center gap-1">
                  <span>{t.nav.companies}</span>
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white hover:underline transition-colors flex items-center gap-1">
                  <span>{t.nav.projects}</span>
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white hover:underline transition-colors flex items-center gap-1">
                  <span>{t.nav.news}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Sectors */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold tracking-wider uppercase text-[#B7913D]">
              {t.footer.sectors_links}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <Link href="/sectors#real-estate" className="hover:text-white transition-colors">
                  {locale === 'ar' ? 'التطوير العقاري والمجتمعات' : 'Real Estate Development'}
                </Link>
              </li>
              <li>
                <Link href="/sectors#venture" className="hover:text-white transition-colors">
                  {locale === 'ar' ? 'الاستثمار الجريء والتقنية' : 'Venture Capital & Tech'}
                </Link>
              </li>
              <li>
                <Link href="/sectors#commercial" className="hover:text-white transition-colors">
                  {locale === 'ar' ? 'المجمعات والأصول التجارية' : 'Commercial Assets'}
                </Link>
              </li>
              <li>
                <Link href="/sectors#asset-management" className="hover:text-white transition-colors">
                  {locale === 'ar' ? 'إدارة الثروات والصناديق' : 'Asset Management'}
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-white transition-colors flex items-center gap-1 text-[#B7913D]">
                  <span>{locale === 'ar' ? 'شركة داما للتطوير العقاري' : 'Dama Real Estate'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold tracking-wider uppercase text-[#B7913D]">
              {t.footer.contact_us}
            </h3>
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B7913D] mt-1 flex-shrink-0" />
                <span>
                  {locale === 'ar'
                    ? 'الرياض، طريق أنس بن مالك، حي الملقا، المملكة العربية السعودية'
                    : 'Anas Bin Malik Road, Al Malqa District, Riyadh, Saudi Arabia'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#B7913D] flex-shrink-0" />
                <a href="tel:+966114128888" dir="ltr" className="hover:text-white transition-colors">
                  +966 11 412 8888
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#B7913D] flex-shrink-0" />
                <a href="mailto:info@alomarholding.sa" className="hover:text-white transition-colors">
                  info@alomarholding.sa
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#B7913D] flex-shrink-0" />
                <span>
                  {locale === 'ar' ? 'الأحد - الخميس: 8:00 ص - 5:00 م' : 'Sun - Thu: 8:00 AM - 5:00 PM'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            <p>{t.footer.rights} — 2026</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t.footer.privacy}
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              {t.footer.terms}
            </Link>
            <span>•</span>
            <span className="text-[#B7913D]">{t.footer.vision_quote}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
