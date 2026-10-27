'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X, Globe, PhoneCall } from 'lucide-react';

export const Header: React.FC = () => {
  const { locale, toggleLocale, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/sectors', label: t.nav.sectors },
    { href: '/companies', label: t.nav.companies },
    { href: '/projects', label: t.nav.projects },
    { href: '/news', label: t.nav.news },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-header py-3 shadow-lg shadow-black/20'
            : 'bg-[#101E39]/80 backdrop-blur-md py-4 md:py-5 border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="relative w-10 h-10 md:w-11 md:h-11 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/branding/alomar_logo_mark.png"
                  alt="Alomar Holding Logo Mark"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-lg md:text-xl font-bold tracking-tight leading-none">
                  {locale === 'ar' ? 'العمر القابضة' : 'ALOMAR HOLDING'}
                </span>
                <span className="text-[#B7913D] text-[10px] md:text-xs tracking-widest uppercase font-medium mt-1">
                  {locale === 'ar' ? 'استثمار برؤية أوسع' : 'Investment with a Broader Vision'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/10 font-semibold'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Controls (Language + Contact CTA) */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                onClick={toggleLocale}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 transition-all border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#B7913D]"
                aria-label="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#B7913D]" />
                <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold text-[#101E39] gold-gradient-bg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.nav.contact}</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={toggleLocale}
                className="p-2 rounded-full text-white/80 hover:text-white bg-white/10 focus:outline-none"
                aria-label="Toggle language"
              >
                <span className="text-xs font-bold text-[#B7913D]">{locale === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-white/90 hover:text-white bg-white/10 hover:bg-white/20 focus:outline-none"
                aria-label="Open navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-full bg-[#101E39] border-b border-white/15 shadow-2xl py-6 px-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'text-white bg-white/15 font-semibold text-[#B7913D]'
                        : 'text-white/85 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 mt-2 border-t border-white/10">
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[#101E39] gold-gradient-bg shadow-lg"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t.nav.contact}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
