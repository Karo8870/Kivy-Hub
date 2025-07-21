import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function KivyButton({
  children,
  className,
  href
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href ?? '/'}
      className='cursor-pointer rounded-full bg-[linear-gradient(110deg,rgba(0,195,255,1)_0%,rgba(153,0,107,1)_100%)] p-[1px] backdrop-blur-[48px]'
    >
      <div
        className={cn(
          'flex h-12 w-40 items-center justify-center gap-2 rounded-full bg-[#38264C]',
          className
        )}
      >
        <img src='/logo.svg' alt='logo' className='min-h-5 min-w-5' />
        <label>{children}</label>
      </div>
    </Link>
  );
}
