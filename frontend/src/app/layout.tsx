import type { Metadata } from 'next';
import './globals.css';
import { StageIndicatorProvider } from './_store/stageIndicator';

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
    <html lang="ko">
      <body>
        <StageIndicatorProvider>{children}</StageIndicatorProvider>
      </body>
    </html>
  );
}
