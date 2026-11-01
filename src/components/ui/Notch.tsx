import { useId } from 'react';

type NotchProps = {
  className: string;
  fill: string;
};

export function Notch({ className, fill }: NotchProps) {
  const filterId = `notch-shadow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg
      width="420"
      height="50"
      viewBox="0 0 420 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    >
      <g filter={`url(#${filterId})`}>
        <path d="M10 4C100 4 120 34 210 34C300 34 320 4 410 4H10Z" fill={fill} />
      </g>
      <defs>
        <filter id={filterId} x="0" y="0" width="420" height="50" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="6" />
          <feGaussianBlur stdDeviation="5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.06 0 0 0 0 0.12 0 0 0 0.22 0 0 0 0.08 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
