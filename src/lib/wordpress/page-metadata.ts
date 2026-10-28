import type { Metadata } from 'next';
import { wpClient } from './client';

export async function getPageMetadata(pageKey: string, fallback: Metadata): Promise<Metadata> {
  const content = await wpClient.getSiteContent();
  const banner = content.pageBanners[pageKey];
  return {
    ...fallback,
    title: banner?.seoTitle.ar || (content.previewMode ? fallback.title : undefined),
    description: banner?.seoDescription.ar || (content.previewMode ? fallback.description : undefined),
  };
}
