import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '따온',
  description: '따온',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  themeColor: '#ff6b6b',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '따온',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="font-lineseed">
      <body>{children}</body>
    </html>
  );
}
