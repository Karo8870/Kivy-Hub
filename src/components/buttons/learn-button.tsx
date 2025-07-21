import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function LearnButton({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      className={cn(
        'h-12 rounded-full border-1 border-[#414141] bg-[#414141]/20 px-7 backdrop-blur-[48px]',
        className
      )}
    >
      {children}
    </button>
  );
}
