import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import QueryProvider from '@/components/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Recipe Explorer Lite',
  description: 'Browse delicious recipes from around the world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <main className="min-h-screen bg-gray-50">
            <header className="bg-primary shadow-md">
              <div className="container mx-auto py-6 px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Recipe Explorer Lite</h1>
              </div>
            </header>
            <div className="container mx-auto py-8 px-4">
              {children}
            </div>
            <footer className="bg-dark text-white py-6">
              <div className="container mx-auto px-4 text-center">
                <p>© 2025 Recipe Explorer Lite</p>
              </div>
            </footer>
          </main>
          <Toaster position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
}