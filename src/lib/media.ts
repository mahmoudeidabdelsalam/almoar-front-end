/**
 * Returns a same-origin URL for remote images so the browser never has to
 * contact the CMS host directly. The Next.js image endpoint fetches the file
 * on the server and serves it from this site's own origin.
 *
 * This avoids cross-site problems such as third-party cookie blocking
 * (Safari, Chrome Incognito) and CMS hosts that gate direct browser access.
 *
 * Local paths, data URIs and SVG files are returned unchanged.
 * Width must be one of the configured image sizes (defaults include 384, 640, 1080).
 */
export function sameOriginImage(src: string | null | undefined, width = 640): string {
  if (!src) return '';
  if (!/^https?:\/\//i.test(src)) return src;
  if (/\.svg(\?|#|$)/i.test(src)) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
