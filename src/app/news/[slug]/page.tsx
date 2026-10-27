import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { wpClient } from '@/lib/wordpress/client';
import { Calendar, Clock, ArrowRight, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const news = await wpClient.getNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await wpClient.getArticleBySlug(slug);
  if (!article) return { title: 'الخبر غير موجود | العمر القابضة' };

  return {
    title: `${article.title.ar} | العمر القابضة`,
    description: article.excerpt.ar,
  };
}

export default async function SingleNewsPage({ params }: Props) {
  const { slug } = await params;
  const article = await wpClient.getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allNews = await wpClient.getNews();
  const relatedNews = allNews.filter((n) => n.slug !== slug).slice(0, 2);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-[#5A677B]">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[#101E39]">الرئيسية</Link>
              <span>/</span>
              <Link href="/news" className="hover:text-[#101E39]">المركز الإعلامي</Link>
              <span>/</span>
              <span className="text-[#101E39] font-bold truncate max-w-xs">{article.title.ar}</span>
            </div>

            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 font-bold text-[#101E39] hover:text-[#B7913D]"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للأخبار</span>
            </Link>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold text-white bg-[#101E39]">
              {article.category.ar}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101E39] leading-tight tracking-tight">
              {article.title.ar}
            </h1>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-[#5A677B] pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#B7913D]" />
                <span>{article.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#B7913D]" />
                <span>زمن القراءة: {article.read_time}</span>
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src={article.image}
              alt={article.title.ar}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Body */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-[#101E39]/10 space-y-6 text-base sm:text-lg text-[#101E39]/90 leading-relaxed">
            <p className="font-semibold text-xl text-[#101E39] leading-relaxed">
              {article.excerpt.ar}
            </p>
            <hr className="border-[#101E39]/10 my-6" />
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{ __html: article.content.ar }}
            />
          </div>

          {/* Related Articles */}
          {relatedNews.length > 0 && (
            <div className="space-y-6 pt-10 border-t border-[#101E39]/10">
              <h3 className="text-2xl font-bold text-[#101E39]">أخبار ذات صلة</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedNews.map((n) => (
                  <Link
                    key={n.id}
                    href={`/news/${n.slug}`}
                    className="bg-white rounded-2xl p-5 border border-[#101E39]/10 shadow-sm hover:shadow-md transition-all flex gap-4 group"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={n.image}
                        alt={n.title.ar}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#B7913D] block">{n.date}</span>
                      <h4 className="font-bold text-[#101E39] text-sm group-hover:text-[#B7913D] transition-colors line-clamp-2">
                        {n.title.ar}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
