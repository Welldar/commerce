import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Header from './components/header';
import { AuthProvider } from './components/auth';
import { ProductsProvider } from './components/productsHook';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header></Header>
          <main>
            <ProductsProvider>{children}</ProductsProvider>
          </main>
        </AuthProvider>
        ;
      </body>
    </html>
  );
}
