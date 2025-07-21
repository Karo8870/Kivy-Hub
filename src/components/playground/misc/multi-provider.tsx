import { ComponentType, ReactNode } from 'react';

export function MultiProvider({
  providers,
  children
}: {
  providers: ComponentType<{ children: ReactNode }>[];
  children: ReactNode;
}) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}
