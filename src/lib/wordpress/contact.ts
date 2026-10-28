import type { ContactFormPayload } from '@/types';

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL || '';

export async function submitContact(payload: ContactFormPayload): Promise<{ success: boolean; message: string; errors?: Record<string, string> }> {
  const errors: Record<string, string> = {};
  if (!payload.full_name || payload.full_name.trim().length < 2) {
    errors.full_name = 'يرجى إدخال الاسم الكريم بشكل صحيح.';
  }
  if (!payload.email || !/^\S+@\S+\.\S+$/.test(payload.email)) {
    errors.email = 'يرجى إدخال عنوان بريد إلكتروني صالح.';
  }
  if (!payload.message || payload.message.trim().length < 5) {
    errors.message = 'يرجى كتابة رسالتكم بالتفصيل (5 أحرف على الأقل).';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'يرجى التحقق من صحة الحقول المدخلة.',
      errors,
    };
  }

  if (!WP_API_URL) {
    return {
      success: false,
      message: 'تعذر إرسال الرسالة حالياً. يرجى المحاولة لاحقاً أو التواصل معنا مباشرة.',
    };
  }

  try {
    const lang = payload.lang || (typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'ar');
    const res = await fetch(`${WP_API_URL}/wp-json/alomar/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        lang,
        website: payload.website || '',
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || 'حدث خطأ أثناء إرسال الرسالة.',
        errors: data.errors,
      };
    }
    return {
      success: true,
      message: data.message || 'تم استلام رسالتكم بنجاح.',
    };
  } catch (error) {
    console.error('[WordPress CMS] Contact submission failed.', error);
    return {
      success: false,
      message: 'تعذر إرسال الرسالة حالياً. يرجى المحاولة لاحقاً أو التواصل معنا مباشرة.',
    };
  }
}
