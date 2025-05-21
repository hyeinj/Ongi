import type { Metadata } from 'next';
import './globals.css';
import { StageProvider } from '../store/stageContext';

export const metadata: Metadata = {
  title: '따온',
  description: '따온',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="font-lineseed">
      <body>
          <StageProvider>{children}</StageProvider>
      </body>
    </html>
  );
}
