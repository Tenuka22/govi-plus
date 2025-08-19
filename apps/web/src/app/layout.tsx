import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '@workspace/ui/globals.css';
import { Toaster } from '@workspace/ui/components/sonner';
import Providers from '@/components/providers/providers';

const fontSans = Montserrat({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'govi-plus',
  description: 'govi-plus',
};

const APP_LAYOUT = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
};

export default APP_LAYOUT;
