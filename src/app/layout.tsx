import './globals.css'
import 'antd/dist/reset.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from './providers'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast, { Toaster } from 'react-hot-toast';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'H&Ks',
  description: 'E-commerce website for H&K'
}



export default function RootLayout({
  children,

}: {
  children: React.ReactNode
}) {

  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          <Toaster />
          <Header />
          <main>
              {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
