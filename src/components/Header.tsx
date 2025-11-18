'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="absolute top-0 left-0 right-0 z-10 py-4 px-4 sm:px-6 lg:px-8">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold">
          <Image src="/lazy-bird-mascot.png" alt="LazyNest" width={60} height={60} className="w-16 h-16" />
          LazyNest
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="#how-it-works">{t('nav.how_it_works')}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#pricing">{t('nav.pricing')}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#faq">{t('nav.faq')}</Link>
          </Button>
          <Button asChild>
            <Link href="/search">{t('nav.start_search')}</Link>
          </Button>
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}

