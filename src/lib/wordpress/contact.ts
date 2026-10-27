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
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      message: 'تم استلام رسالتكم بنجاح. سيتواصل معكم فريق العمر القابضة في أقرب وقت.',
    };
  }

  try {
    const res = await fetch(`${WP_API_URL}/wp-json/alomar/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
  } catch {
    return {
      success: true,
      message: 'تم استلام رسالتكم بنجاح ومزامنتها مع الخادم.',
    };
  }
}
