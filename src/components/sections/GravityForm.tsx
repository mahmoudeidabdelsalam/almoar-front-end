'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { sanitizeNewsContent } from '@/lib/sanitize-news-content';
import type { GravityFormDefinition, GravityFormField } from '@/types';

interface GravityFormProps {
  form: GravityFormDefinition;
  title?: string;
  submitLabel?: string;
  className?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const arabicFieldLabels: Record<string, string> = {
  'About You': 'بياناتك',
  'Your Name': 'الاسم الكامل',
  'Your Address': 'العنوان',
  'How Can We Reach You?': 'كيف نتواصل معك؟',
  'Preferred Method of Contact': 'طريقة التواصل المفضلة',
  'Your Email Address': 'البريد الإلكتروني',
  'Your Phone': 'رقم الهاتف',
  'Best Time to Call You': 'الوقت الأنسب للتواصل',
  "What's on your mind?": 'ما الذي تود مناقشته؟',
  'Your Comments/Questions': 'تفاصيل الرسالة',
  First: 'الاسم الأول',
  Last: 'اسم العائلة',
  Street: 'الشارع',
  'Address Line 2': 'العنوان الإضافي',
  City: 'المدينة',
  State: 'المنطقة',
  'ZIP Code': 'الرمز البريدي',
  Country: 'الدولة',
};

function localizedLabel(label: string, locale: 'ar' | 'en'): string {
  return locale === 'ar' ? arabicFieldLabels[label] || label : label;
}

function isVisible(field: GravityFormField, values: Record<string, string>): boolean {
  const logic = field.conditionalLogic;
  if (!logic?.rules?.length) return true;

  const matches = logic.rules.map((rule) => {
    const actual = values[rule.fieldId] || '';
    switch (rule.operator) {
      case 'is':
        return actual === rule.value;
      case 'isnot':
        return actual !== rule.value;
      case 'contains':
        return actual.includes(rule.value);
      case 'doesnotcontain':
        return !actual.includes(rule.value);
      case 'greater_than':
        return Number(actual) > Number(rule.value);
      case 'less_than':
        return Number(actual) < Number(rule.value);
      case 'starts_with':
        return actual.startsWith(rule.value);
      case 'ends_with':
        return actual.endsWith(rule.value);
      default:
        return false;
    }
  });
  const satisfied = logic.logicType === 'any' ? matches.some(Boolean) : matches.every(Boolean);
  return logic.actionType === 'hide' ? !satisfied : satisfied;
}

function getErrorMessage(body: unknown): { message: string; fields: Record<string, string> } {
  if (!isRecord(body)) return { message: '', fields: {} };

  const data = isRecord(body.data) ? body.data : body;
  const rawErrors = data.errors;
  const fields: Record<string, string> = {};
  if (isRecord(rawErrors)) {
    for (const [fieldId, error] of Object.entries(rawErrors)) {
      if (typeof error === 'string') fields[fieldId] = error;
      else if (Array.isArray(error) && typeof error[0] === 'string') fields[fieldId] = error[0];
    }
  }

  return {
    message: typeof body.message === 'string' ? body.message : '',
    fields,
  };
}

export function GravityForm({ form, title, submitLabel, className = '' }: GravityFormProps) {
  const { locale, dir, t } = useLanguage();
  const [values, setValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (id: string, value: string) => {
    setValues((current) => ({ ...current, [id]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setGeneralError('');
    setFieldErrors({});

    try {
      const response = await fetch('/api/gravity-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: form.id, fields: values }),
      });
      const result: unknown = await response.json();

      if (!response.ok || !isRecord(result) || result.success !== true) {
        const error = getErrorMessage(result);
        setFieldErrors(error.fields);
        setGeneralError(error.message || t.contact_section.form_error);
        return;
      }

      if (result.confirmationType === 'redirect' && typeof result.confirmationRedirect === 'string' && result.confirmationRedirect) {
        window.location.assign(result.confirmationRedirect);
        return;
      }

      setConfirmation(
        typeof result.message === 'string' && result.message
          ? result.message
          : t.contact_section.success_title,
      );
      setValues({});
    } catch (error) {
      console.error('[Gravity Forms] Submission failed.', error);
      setGeneralError(t.contact_section.form_error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderControl = (field: GravityFormField, inputId = field.id, inputType = field.type, label = field.label) => {
    const id = `gravity-${form.id}-${inputId.replace(/\./g, '-')}`;
    const value = values[inputId] || '';
    const error = fieldErrors[field.id] || fieldErrors[inputId];
    const labelText = localizedLabel(label, locale);
    const commonProps = {
      id,
      name: inputId,
      value,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setValue(inputId, event.target.value),
      required: field.isRequired,
      'aria-invalid': Boolean(error),
      'aria-describedby': error ? `${id}-error` : undefined,
      dir: inputType === 'email' || inputType === 'phone' ? 'ltr' as const : dir,
      className: `min-h-10 w-full rounded-sm border bg-white px-3 py-2 text-sm text-[#12233F] outline-none transition focus:border-[#C3942E] focus:ring-2 focus:ring-[#C3942E]/20 ${error ? 'border-red-500' : 'border-[#D6D9DE]'}`,
    };

    return (
      <div className="min-w-0">
        <label htmlFor={id} className="mb-1.5 block text-[11px] font-medium text-[#233047]">
          {labelText}
          {field.isRequired && <span aria-hidden="true" className="ms-1 text-red-600">*</span>}
        </label>
        {inputType === 'textarea' ? (
          <textarea {...commonProps} rows={4} placeholder={field.placeholder || undefined} />
        ) : inputType === 'select' ? (
          <select {...commonProps}>
            <option value="">{locale === 'ar' ? 'اختر' : 'Select'}</option>
            {field.choices.map((choice, index) => (
              <option key={`${choice.value}-${index}`} value={choice.value}>{localizedLabel(choice.text, locale)}</option>
            ))}
          </select>
        ) : (
          <input
            {...commonProps}
            type={inputType === 'email' ? 'email' : inputType === 'phone' ? 'tel' : inputType === 'number' ? 'number' : 'text'}
            placeholder={field.placeholder || undefined}
          />
        )}
        {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-700">{error}</p>}
      </div>
    );
  };

  if (confirmation) {
    return (
      <div className={`rounded-lg border border-[#D6D9DE] bg-white p-8 text-center ${className}`} role="status" aria-live="polite">
        <h3 className="text-xl font-semibold text-[#12233F]">{locale === 'ar' ? 'شكرًا لتواصلكم' : 'Thank you for contacting us'}</h3>
        <div className="mt-3 text-sm leading-7 text-[#596273]" dangerouslySetInnerHTML={{ __html: sanitizeNewsContent(confirmation) }} />
        <button type="button" onClick={() => setConfirmation('')} className="mt-6 rounded-sm bg-[#C3942E] px-5 py-3 text-sm font-medium text-white hover:bg-[#A77C22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12233F]">
          {locale === 'ar' ? 'إرسال طلب آخر' : 'Send another inquiry'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`rounded-lg border border-[#D6D9DE] bg-white p-5 shadow-sm sm:p-7 ${className}`} noValidate>
      {title && <div className="mb-5">
        <h2 className="text-xl font-semibold text-[#12233F]">{title}</h2>
        <p className="mt-1 text-xs text-[#818896]">{locale === 'ar' ? 'يرجى تعبئة البيانات التالية وسنتواصل معكم في أقرب وقت.' : 'Complete the details below and our team will be in touch.'}</p>
      </div>}
      {generalError && <p role="alert" className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{generalError}</p>}
      <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
        {form.fields.map((field) => {
          if (!isVisible(field, values)) return null;
          if (field.type === 'section') {
            return <h3 key={field.id} className="col-span-full border-b border-[#E8E9EC] pb-2 pt-2 text-sm font-semibold text-[#12233F]">{localizedLabel(field.label, locale)}</h3>;
          }
          if (field.type === 'name' || field.type === 'address') {
            const inputs = field.inputs.filter((input) => !input.isHidden && input.id);
            return (
              <fieldset key={field.id} className="col-span-full">
                <legend className="mb-2 text-[11px] font-medium text-[#233047]">
                  {localizedLabel(field.label, locale)}
                  {field.isRequired && <span aria-hidden="true" className="ms-1 text-red-600">*</span>}
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {inputs.map((input) => (
                    <div key={input.id}>{renderControl(field, input.id, input.type || 'text', input.label)}</div>
                  ))}
                </div>
                {fieldErrors[field.id] && <p className="mt-1 text-xs text-red-700">{fieldErrors[field.id]}</p>}
              </fieldset>
            );
          }
          return (
            <div key={field.id} className={field.type === 'textarea' ? 'col-span-full' : ''}>
              {renderControl(field)}
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[10px] text-[#9298A2]">{locale === 'ar' ? 'جميع الحقول المطلوبة موضحة بعلامة *' : 'Required fields are marked with *'}</p>
        <button type="submit" disabled={isSubmitting} className="inline-flex min-w-32 items-center justify-center gap-2 rounded-sm bg-[#C3942E] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#A77C22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12233F] disabled:cursor-wait disabled:opacity-60">
          <span>{isSubmitting ? t.contact_section.form_submitting : submitLabel || form.buttonText || t.contact_section.form_submit}</span>
          <span aria-hidden="true" className="directional-icon">←</span>
        </button>
      </div>
    </form>
  );
}
