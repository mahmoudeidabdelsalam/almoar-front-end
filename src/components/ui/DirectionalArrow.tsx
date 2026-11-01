import { ArrowLeft, ArrowRight } from 'lucide-react';

type DirectionalArrowProps = {
  direction: 'next' | 'previous';
  dir: 'rtl' | 'ltr';
  className?: string;
};

export function DirectionalArrow({ direction, dir, className }: DirectionalArrowProps) {
  const pointsRight = (dir === 'ltr') === (direction === 'next');
  const Arrow = pointsRight ? ArrowRight : ArrowLeft;
  return <Arrow aria-hidden="true" className={className} />;
}
