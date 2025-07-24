import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs';
import Link from 'next/link';

const themeComponents = getThemeComponents();

export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...components,
    a({ href, children }) {
      return (
        <Link href={href} className='text-blue-400'>
          {children}
        </Link>
      );
    }
  };
}
