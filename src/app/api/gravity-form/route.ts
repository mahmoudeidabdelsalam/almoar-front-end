import { NextResponse } from 'next/server';
import { getWordPressRestEndpoint } from '@/lib/wordpress/gravity-forms';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFormFields(value: unknown): value is Record<string, string | string[]> {
  return isRecord(value) && Object.values(value).every((fieldValue) =>
    typeof fieldValue === 'string' ||
    (Array.isArray(fieldValue) && fieldValue.every((item) => typeof item === 'string')),
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 100_000) {
    return NextResponse.json({ message: 'Form submission is too large.' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid form submission.' }, { status: 400 });
  }

  if (
    !isRecord(body) ||
    !Number.isSafeInteger(body.formId) ||
    typeof body.formId !== 'number' ||
    body.formId < 1 ||
    !isFormFields(body.fields)
  ) {
    return NextResponse.json({ message: 'Invalid form submission.' }, { status: 400 });
  }

  try {
    const response = await fetch(getWordPressRestEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ formId: body.formId, fields: body.fields }),
      cache: 'no-store',
    });
    const result: unknown = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('[WordPress Gravity Forms] Submission forwarding failed.', error);
    return NextResponse.json(
      { message: 'The form could not be submitted. Please try again later.' },
      { status: 502 },
    );
  }
}
