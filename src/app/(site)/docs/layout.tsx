import { Layout, Navbar } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';
import { ReactNode } from 'react';
import 'nextra-theme-docs/style.css';

// const banner = <Banner storageKey='some-key'>Nextra 4.0 is released 🎉</Banner>;
const navbar = (
  <Navbar
    logo={
      <div className='flex items-center justify-center gap-2'>
        <img src='/logo.svg' alt='logo' className='min-h-5 min-w-5' />
        Kivy
      </div>
    }
  />
);

export default async function ({ children }: { children: ReactNode }) {
  return (
    <Layout navbar={navbar} pageMap={await getPageMap('/docs')}>
      {children}
    </Layout>
  );
}
