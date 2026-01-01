import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/shared/Providers';
import ThemeInitializer from '@/components/shared/ThemeInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dear - 우리만의 공간',
  description: '커플 다이어리 & 메신저',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ThemeInitializer />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}