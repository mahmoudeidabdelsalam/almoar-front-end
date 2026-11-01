import { useId } from 'react';

type NotchProps = {
  className: string;
  fill: string;
};

export function Notch({ className, fill }: NotchProps) {
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
      <g>
        <path d="M10 4C100 4 120 34 210 34C300 34 320 4 410 4H10Z" fill={fill} />
      </g>
    </svg>
  );
}
