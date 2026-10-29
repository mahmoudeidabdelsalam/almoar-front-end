'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { submitContact } from '@/lib/wordpress/contact';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ContactPageContent, Sector } from '@/types';

export const ContactSection: React.FC<{ sectors?: Sector[]; pageContent?: ContactPageContent | null }> = ({ sectors = [], pageContent = null }) => {
  const { locale, t, content } = useLanguage();
  const address = {
    ar: pageContent?.address.ar || '',
    en: pageContent?.address.en || '',
  };
  const email = pageContent?.email || '';
  const phone = pageContent?.phone || '';
  const workingHours = {
    ar: pageContent?.workingHours.ar || '',
    en: pageContent?.workingHours.en || '',
  };
  const coordinates = pageContent?.coordinates.lat || pageContent?.coordinates.lng
    ? pageContent.coordinates
    : { lat: 0, lng: 0 };
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    sector_interest: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (!pageContent?.title[locale] && !content.previewMode && !email && !phone) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      const res = await submitContact(formData);
      if (res.success) {
        setSuccessMessage(res.message);
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          subject: '',
          sector_interest: '',
          message: '',
        });
      } else {
        if (res.errors) {
          setFieldErrors(res.errors);
        }
        setGeneralError(res.message);
      }
    } catch {
      setGeneralError('تعذر إرسال الرسالة، يرجى المحاولة لاحقاً أو الاتصال بنا مباشرة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9F4] relative" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101E39]/5 border border-[#101E39]/10 text-xs font-bold text-[#101E39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7913D]" />
            <span>{pageContent?.badge[locale] || (content.previewMode ? t.contact_section.badge : '')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101E39] tracking-tight">
            {pageContent?.title[locale] || (content.previewMode ? t.contact_section.title : '')}
          </h2>

          <p className="text-base sm:text-lg text-[#5A677B]">
            {pageContent?.description[locale] || (content.previewMode ? t.contact_section.subtitle : '')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#101E39] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B7913D]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B7913D]">
                {t.contact_section.hq_title}
              </span>
              <h3 className="text-2xl font-bold">
                {pageContent?.heading[locale] || (locale === 'ar'
                  ? `${content.settings.site_name.ar} — المركز الرئيسي`
                  : `${content.settings.site_name.en} HQ`)}
              </h3>
              {content.previewMode && <p className="text-white/70 text-sm leading-relaxed">
                {locale === 'ar'
                  ? 'يسرنا استقبال المستثمرين والشركاء في مقرنا الرئيسي بالرياض لمناقشة فرص التعاون والتطوير.'
                  : 'We welcome investors and institutional partners at our Riyadh headquarters to discuss transformative opportunities.'}
              </p>}
            </div>

            <div className="space-y-5 text-sm relative z-10">
              {(address.ar || address.en) && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/10 text-[#B7913D] flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block font-semibold">
                      {locale === 'ar' ? 'العنوان' : 'Address'}
                    </span>
                    <span className="text-white font-medium leading-relaxed block mt-0.5">
                      {locale === 'ar' ? address.ar : address.en}
                    </span>
                  </div>
                </div>
              )}
              {phone && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/10 text-[#B7913D] flex-shrink-0 mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block font-semibold">{t.contact_section.phone}</span>
                    <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} dir="ltr" className="text-white font-medium hover:text-[#B7913D] transition-colors block mt-0.5">
                      {phone}
                    </a>
                  </div>
                </div>
              )}
              {email && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/10 text-[#B7913D] flex-shrink-0 mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block font-semibold">{t.contact_section.email}</span>
                    <a href={`mailto:${email}`} className="text-white font-medium hover:text-[#B7913D] transition-colors block mt-0.5">
                      {email}
                    </a>
                  </div>
                </div>
              )}
              {(workingHours.ar || workingHours.en) && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/10 text-[#B7913D] flex-shrink-0 mt-1">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block font-semibold">{t.contact_section.hours}</span>
                    <span className="text-white font-medium block mt-0.5">
                      {locale === 'ar' ? workingHours.ar : workingHours.en}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Map Coordinates Box */}
            {coordinates.lat !== 0 && coordinates.lng !== 0 && <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/70">
              <span className="text-[#B7913D] font-bold block mb-1">
                {locale === 'ar' ? 'إحداثيات الموقع الجغرافي:' : 'GPS Coordinates:'}
              </span>
              <span>{coordinates.lat}° N, {coordinates.lng}° E — {address.ar}</span>
            </div>}
          </div>

          {/* Interactive Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#101E39]/10">
            {successMessage ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#1B4332]/10 text-[#1B4332] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#101E39]">{t.contact_section.success_title}</h3>
                <p className="text-sm text-[#5A677B] max-w-md mx-auto leading-relaxed">
                  {successMessage}
                </p>
                <button
                  type="button"
                  onClick={() => setSuccessMessage(null)}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-[#101E39] bg-[#F8F9F4] hover:bg-[#101E39] hover:text-white transition-all"
                >
                  {locale === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {pageContent?.formTitle[locale] && (
                  <h3 className="text-xl font-bold text-[#101E39]">{pageContent.formTitle[locale]}</h3>
                )}
                {generalError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{generalError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#101E39] block">
                      {t.contact_section.form_name} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      placeholder={locale === 'ar' ? 'مثال: عبد الله محمد' : 'e.g. Abdullah Mohammed'}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-[#101E39] bg-[#F8F9F4] focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.full_name
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-[#101E39]/15 focus:ring-[#B7913D]/30 focus:border-[#B7913D]'
                      }`}
                    />
                    {fieldErrors.full_name && (
                      <p className="text-xs text-red-500 font-medium">{fieldErrors.full_name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#101E39] block">
                      {t.contact_section.form_email} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@domain.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-[#101E39] bg-[#F8F9F4] focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.email
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-[#101E39]/15 focus:ring-[#B7913D]/30 focus:border-[#B7913D]'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-500 font-medium">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#101E39] block">
                      {t.contact_section.form_phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+966 5X XXX XXXX"
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl border border-[#101E39]/15 text-sm text-[#101E39] bg-[#F8F9F4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B7913D]/30 focus:border-[#B7913D] transition-all text-right"
                    />
                  </div>

                  {/* Sector / Subject */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#101E39] block">
                      {t.contact_section.form_sector}
                    </label>
                    <select
                      name="sector_interest"
                      value={formData.sector_interest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#101E39]/15 text-sm text-[#101E39] bg-[#F8F9F4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B7913D]/30 focus:border-[#B7913D] transition-all"
                    >
                      <option value="">{locale === 'ar' ? 'اختر مجال الاهتمام' : 'Select Sector of Interest'}</option>
                      {sectors.filter((sector) => sector.title[locale]).map((sector) => (
                        <option key={sector.id} value={sector.slug}>
                          {sector.title[locale]}
                        </option>
                      ))}
                      <option value="other">{locale === 'ar' ? 'استفسار عام / علاقات المستثمرين' : 'General / Investor Relations'}</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#101E39] block">
                    {t.contact_section.form_message} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder={
                      locale === 'ar'
                        ? 'يرجى كتابة استفساركم أو تفاصيل فرصة التعاون الاستثمارية...'
                        : 'Please write your inquiry or strategic collaboration details...'
                    }
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-[#101E39] bg-[#F8F9F4] focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.message
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#101E39]/15 focus:ring-[#B7913D]/30 focus:border-[#B7913D]'
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="text-xs text-red-500 font-medium">{fieldErrors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-sm md:text-base text-[#101E39] gold-gradient-bg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? t.contact_section.form_submitting : t.contact_section.form_submit}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
