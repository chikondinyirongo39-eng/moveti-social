import type { Metadata } from 'next';
import './globals.css';
import MovetiNavigation from '@/components/MovetiNavigation';

export const metadata: Metadata = {
  title: 'MOVETI',
  description: 'MOVETI social music platform'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="pb-20">
        {children}
        <MovetiNavigation />
      </body>
    </html>
  );
}
