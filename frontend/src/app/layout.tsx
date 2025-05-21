import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StageProvider } from '../store/stageContext';
import { SelfEmpathyProvider } from '../store/SelfEmpathyContext';

export const metadata: Metadata = {
  title: '따온',
  description: '따온',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="font-lineseed">
      <body>
        <StageProvider>
          <SelfEmpathyProvider>{children}</SelfEmpathyProvider>
        </StageProvider>
      </body>
    </html>
  );
}
