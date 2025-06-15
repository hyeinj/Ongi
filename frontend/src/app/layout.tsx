import type { Metadata } from 'next';
import './globals.css';
import 'react-datepicker/dist/react-datepicker.css';
import InitDummyData from '@/app/_components/island/InitDummyData'; 

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
        {children}
         <InitDummyData />
      </body>
    </html>
  );
}
