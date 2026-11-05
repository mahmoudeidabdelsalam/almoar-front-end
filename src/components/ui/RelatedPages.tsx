import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Ref } from 'react';
import type { Locale } from '@/types';

interface RelatedPageLink {
  href: string;
  label: string;
  image?: string;
}

interface RelatedPagesProps {
  locale: Locale;
  links: RelatedPageLink[];
  className: string;
  gridClassName: string;
  navRef?: Ref<HTMLElement>;
}

export function RelatedPages({ locale, links, className, gridClassName, navRef }: RelatedPagesProps) {
  const isArabic = locale === 'ar';

  return (
    <nav
      ref={navRef}
      className={className}
      aria-label={isArabic ? 'صفحات ذات صلة' : 'Related pages'}
      dir={isArabic ? 'rtl' : 'ltr'}
      data-scroll-reveal={navRef ? '' : undefined}
    >
      <div className={gridClassName}>
        {links.map(({ href, label, image }, index) => {
          if (!href || !label) return null;
          const cardClassName = `related-page-card group${image ? ' related-page-card--has-image' : ''}`;
          const card = (
            <>
              {image && (
                <span className="related-page-card__image" aria-hidden="true">
                  <Image src={image} alt="" fill sizes="130px" className="object-cover" />
                </span>
              )}
              <span className="related-page-card__copy">
                <span className="related-page-card__eyebrow">{isArabic ? 'الاستمرار بالقراءة' : 'Continue reading'}</span>
                <span className="related-page-card__title">{isArabic ? 'الذهاب إلى' : 'Go to'}</span>
                <span className="related-page-card__destination">{label}</span>
              </span>
              <span className="related-page-card__arrow" aria-hidden="true"><ArrowLeft className="h-5 w-5" /></span>
            </>
          );

          if (/^(https?:|mailto:|tel:|\/\/)/i.test(href)) {
            const external = /^(https?:|\/\/)/i.test(href);
            return (
              <a
                key={`${href}-${index}`}
                href={href}
                className={cardClassName}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                {card}
              </a>
            );
          }

          return <Link key={`${href}-${index}`} href={href} className={cardClassName}>{card}</Link>;
        })}
      </div>
    </nav>
  );
}
