import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-[70vh] flex items-center justify-center bg-[#F8F9F4] pt-24 pb-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-[#101E39]/10 space-y-6">
          <span className="text-6xl font-black text-[#101E39]">404</span>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#101E39]">الصفحة غير موجودة</h1>
            <p className="text-sm text-[#5A677B] leading-relaxed">
              عذراً، الصفحة التي تبحث عنها غير متوفرة أو قد تم نقلها.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-[#101E39] gold-gradient-bg shadow-md hover:scale-105 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>العودة إلى الصفحة الرئيسية</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
