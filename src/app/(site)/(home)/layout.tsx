import { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function ({ children }: { children: ReactNode }) {
  return (
    <div className='flex w-dvw flex-col items-center bg-black'>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
