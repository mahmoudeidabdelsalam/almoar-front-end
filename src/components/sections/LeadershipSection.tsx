'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { TeamMember } from '@/types';
import { Award, X, BookOpen } from 'lucide-react';

interface LeadershipProps {
  members: TeamMember[];
}

export const LeadershipSection: React.FC<LeadershipProps> = ({ members }) => {
  const { locale, t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9F4] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101E39]/5 border border-[#101E39]/10 text-xs font-bold text-[#101E39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7913D]" />
            <span>{t.leadership_section.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101E39] tracking-tight">
            {t.leadership_section.title}
          </h2>

          <p className="text-base sm:text-lg text-[#5A677B]">
            {t.leadership_section.subtitle}
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#101E39]/10 shadow-md luxury-card flex flex-col group cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              {/* Image Portrait */}
              <div className="relative h-72 overflow-hidden bg-[#101E39]">
                <Image
                  src={member.image || '/images/board_chairman.jpg'}
                  alt={locale === 'ar' ? member.name.ar : member.name.en}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101E39] via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-3 inset-x-4">
                  <span className="text-[11px] font-bold text-[#B7913D] uppercase tracking-wider block">
                    {locale === 'ar' ? member.role.ar : member.role.en}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#101E39] group-hover:text-[#B7913D] transition-colors">
                    {locale === 'ar' ? member.name.ar : member.name.en}
                  </h3>
                  <p className="text-xs text-[#5A677B] mt-2 line-clamp-3 leading-relaxed">
                    {locale === 'ar' ? member.bio.ar : member.bio.en}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#101E39]/10 flex items-center justify-between text-xs font-semibold text-[#B7913D]">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t.leadership_section.view_bio}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biography Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="relative h-60 bg-[#101E39]">
              <Image
                src={selectedMember.image || '/images/board_chairman.jpg'}
                alt="Portrait"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101E39] via-[#101E39]/40 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 inset-x-6 text-white">
                <span className="text-xs font-bold text-[#B7913D] uppercase tracking-wider block mb-1">
                  {locale === 'ar' ? selectedMember.role.ar : selectedMember.role.en}
                </span>
                <h3 className="text-2xl font-bold">
                  {locale === 'ar' ? selectedMember.name.ar : selectedMember.name.en}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h4 className="text-sm font-bold text-[#101E39] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#B7913D]" />
                <span>{locale === 'ar' ? 'السيرة المهنية والخبرات القيادية' : 'Professional Background & Leadership'}</span>
              </h4>
              <p className="text-sm text-[#5A677B] leading-relaxed">
                {locale === 'ar' ? selectedMember.bio.ar : selectedMember.bio.en}
              </p>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2 rounded-full text-xs font-bold text-[#101E39] bg-[#F8F9F4] hover:bg-[#101E39] hover:text-white transition-all"
                >
                  {t.leadership_section.close_modal}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
