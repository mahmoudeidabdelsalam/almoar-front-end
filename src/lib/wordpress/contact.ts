import type { ContactFormPayload } from '@/types';

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || process.env.WORDPRESS_GRAPHQL_URL || '';

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

  if (!WP_GRAPHQL_URL) {
    return {
      success: false,
      message: 'تعذر إرسال الرسالة حالياً. يرجى المحاولة لاحقاً أو التواصل معنا مباشرة.',
    };
  }

  try {
    const lang = payload.lang || (typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'ar');
    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation SubmitAlomarContact($input: SubmitAlomarContactInput!) {
          submitAlomarContact(input: $input) {
            success
            message
            inquiryId
          }
        }`,
        variables: {
          input: {
            fullName: payload.full_name,
            email: payload.email,
            phone: payload.phone || '',
            subject: payload.subject || '',
            message: payload.message,
            lang,
            website: payload.website || '',
          },
        },
      }),
    });
    const body = await res.json() as {
      data?: { submitAlomarContact?: { success?: boolean; message?: string; inquiryId?: number | null } };
      errors?: Array<{ message?: string }>;
    };
    if (!res.ok || body.errors?.length) {
      return {
        success: false,
        message: body.errors?.[0]?.message || 'حدث خطأ أثناء إرسال الرسالة.',
      };
    }
    const data = body.data?.submitAlomarContact;
    return {
      success: data?.success === true,
      message: data?.message || 'تم استلام رسالتكم بنجاح.',
    };
  } catch (error) {
    console.error('[WordPress CMS] Contact submission failed.', error);
    return {
      success: false,
      message: 'تعذر إرسال الرسالة حالياً. يرجى المحاولة لاحقاً أو التواصل معنا مباشرة.',
    };
  }
}
