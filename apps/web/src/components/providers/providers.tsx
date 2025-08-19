import type { ReactNode } from 'react';
import ThemeProvider from './theme-provider';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
};

export default Providers;
