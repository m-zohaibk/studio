
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Feather } from 'lucide-react';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { LanguageProvider } from '@/components/i18n/LanguageProvider';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';


export const metadata: Metadata = {
  title: 'LazyNest',
  description: 'Find your dream home with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased bg-background text-foreground")}>
      <FirebaseClientProvider>
          <LanguageProvider>
            <header className="absolute top-0 left-0 right-0 z-10 py-4 px-4 sm:px-6 lg:px-8">
              <nav className="container mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold">
                  <Feather className="w-8 h-8 text-primary" />
                  LazyNest
                </Link>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" asChild>
                    <Link href="#how-it-works">How It Works</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="#faq">FAQ</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/search">Start Your Search</Link>
                  </Button>
                  <LanguageSwitcher />
                </div>
              </nav>
            </header>
              {children}
              <Toaster />
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
