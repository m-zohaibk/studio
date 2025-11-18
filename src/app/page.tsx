
'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();
  const faqs = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1')
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2')
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3')
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4')
    },
    {
        question: t('faq.q5'),
        answer: t('faq.a5')
    }
  ];

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            <Sparkles className="w-4 h-4" />
            {t('hero.tagline')}
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4 leading-tight">
            {t('hero.title1')} <br />
            <span className="text-primary">{t('hero.title2')}</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <Button size="lg" asChild>
              <Link href="/search">
                {t('nav.start_search')} <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">
                <Search className="w-5 h-5 mr-2" /> {t('nav.how_it_works')}
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-8 text-center w-full max-w-2xl mb-16">
            <div>
              <p className="text-3xl font-bold">2,500+</p>
              <p className="text-sm text-muted-foreground">{t('hero.stats.houses')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">95%</p>
              <p className="text-sm text-muted-foreground">{t('hero.stats.success')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm text-muted-foreground">{t('hero.stats.monitoring')}</p>
            </div>
          </div>
          <div className="relative flex items-center justify-center w-full max-w-4xl">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-2xl ring-1 ring-black/5 w-full">
              <Image
                src="/demo_thumbnail.gif"
                alt="A small bird in its nest"
                width={1000}
                height={1000}
                priority
                className="rounded-2xl w-full h-auto"
                data-ai-hint="bird nest"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Meet Your Buddy Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex justify-center mb-6">
              <Image
                src="/lazy-bird-mascot.png"
                alt="LazyNest Buddy"
                width={120}
                height={120}
                className="w-32 h-32"
              />
            </div>
            <h2 className="text-4xl font-headline font-bold mb-4">{t('buddy.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('buddy.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-primary/10 rounded-full w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                <Image
                  src="/bird_search.png"
                  alt="Searching"
                  width={112}
                  height={112}
                  className="w-28 h-28"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('how_it_works.step1.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t('how_it_works.step1.description')}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-primary/10 rounded-full w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                <Image
                  src="/smart_bird.png"
                  alt="Analyzing"
                  width={112}
                  height={112}
                  className="w-28 h-28"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('how_it_works.step2.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t('how_it_works.step2.description')}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-primary/10 rounded-full w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                <Image
                  src="/quick_bird.jpg"
                  alt="Beat the Crowd"
                  width={112}
                  height={112}
                  className="w-28 h-28"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('how_it_works.step3.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t('how_it_works.step3.description')}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-primary/10 rounded-full w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                <Image
                  src="/chilling-bird.png"
                  alt="Books Viewings"
                  width={112}
                  height={112}
                  className="w-28 h-28"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('how_it_works.step4.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t('how_it_works.step4.description')}</p>
            </div>
          </div>
          <div className="mt-16 text-center bg-primary/5 border-2 border-dashed border-primary/50 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-2">{t('how_it_works.edge.title')}</h3>
            <p className="text-muted-foreground">{t('how_it_works.edge.description')}</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-headline font-bold text-primary mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>

            {/* 30 Day Money Back Guarantee Section */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/30 rounded-2xl p-8 backdrop-blur-sm shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between text-left gap-6">
                  <div className="flex-1">
                    <h4 className="text-2xl font-headline font-bold text-primary mb-4">
                      {t('pricing.guarantee.title')}
                    </h4>
                    <p className="text-muted-foreground text-lg">
                      {t('pricing.guarantee.description')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Image
                      src="/30days_orange.png"
                      alt="30 Day Money Back Guarantee"
                      width={160}
                      height={160}
                      className="w-32 h-32 md:w-40 md:h-40 drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Monthly Package */}
              <div className="relative bg-white border-2 border-border rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                {/* Title */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <Sparkles className="h-8 w-8 text-primary mr-3" />
                    <h3 className="text-2xl md:text-3xl font-headline font-bold text-foreground">
                      {t('pricing.monthly.title')}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{t('pricing.monthly.description')}</p>
                </div>

                {/* Pricing */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-headline font-bold text-primary">
                      {t('pricing.monthly.price')}
                    </span>
                    <span className="text-xl text-muted-foreground ml-2">
                      {t('pricing.monthly.period')}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.monitoring')}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.matching')}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.alerts')}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.booking')}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.support')}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.updates')}</span>
                    </li>
                  </ul>
                </div>

                {/* CTA */}
                <Button size="lg" className="w-full text-lg" asChild>
                  <Link href="/search">{t('pricing.monthly.cta')}</Link>
                </Button>

                {/* Microcopy */}
                <p className="text-sm text-muted-foreground text-center mt-4">
                  {t('pricing.microcopy')}
                </p>
              </div>

              {/* Yearly Package - Popular */}
              <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    {t('pricing.yearly.save')}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <Sparkles className="h-8 w-8 text-primary mr-3" />
                    <h3 className="text-2xl md:text-3xl font-headline font-bold text-foreground">
                      {t('pricing.yearly.title')}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{t('pricing.yearly.description')}</p>
                </div>

                {/* Pricing */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-headline font-bold text-primary">
                      {t('pricing.yearly.price')}
                    </span>
                    <span className="text-xl text-muted-foreground ml-2">
                      {t('pricing.yearly.period')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('pricing.yearly.monthly_equivalent')}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.monitoring')}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.matching')}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.alerts')}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.booking')}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.support')}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{t('pricing.features.updates')}</span>
                    </li>
                  </ul>
                </div>

                {/* CTA */}
                <Button size="lg" className="w-full text-lg" asChild>
                  <Link href="/search">{t('pricing.yearly.cta')}</Link>
                </Button>

                {/* Microcopy */}
                <p className="text-sm text-muted-foreground text-center mt-4">
                  {t('pricing.microcopy')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-headline font-bold mb-4">{t('faq.title')}</h2>
            <p className="text-lg text-muted-foreground mb-12">
              {t('faq.subtitle')}
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-lg font-medium text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('cta.subtitle')}
            </p>
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/search">
                {t('nav.start_search')} <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-primary/5">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} LazyNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
