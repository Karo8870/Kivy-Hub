'use client';

import '@/lib/fontawesome/css/fa.css';
import dynamic from 'next/dynamic';

const Page = dynamic(() => import('./loader'), {
  ssr: false
});

export default function () {
  return <Page />;
}
