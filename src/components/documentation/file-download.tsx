import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import Link from 'next/link';

export function FileDownload({
  className,
  name,
  href,
  size
}: {
  className?: string;
  name: string;
  href: string;
  size: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'my-6 flex w-full justify-between gap-6 rounded-md border border-[#2e2e2e] bg-[#111111] p-4',
        className
      )}
    >
      <div className='flex items-center gap-4'>
        <Download className='h-5 w-5' />
        <label>{name}</label>
      </div>
      <span>{size}</span>
    </Link>
  );
}
