
'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookUser, CheckCircle, Search, Sparkles, Target } from "lucide-react";
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
              <Sparkles className="w-4 h-4" />
              {t('hero.tagline')}
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4 leading-tight">
              {t('hero.title1')} <br />
              <span className="text-primary">{t('hero.title2')}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              {t('hero.subtitle')}
            </p>
            <div className="flex items-center gap-4">
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
            <div className="mt-12 grid grid-cols-3 gap-6 text-center w-full max-w-lg">
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
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-2xl ring-1 ring-black/5">
                <Image
                    src="/lazy-bird-mascot.png"
                    alt="A small bird in its nest"
                    width={450}
                    height={450}
                    priority
                    className="rounded-2xl"
                    data-ai-hint="bird nest"
                />
            </div>
             <div className="absolute top-8 -right-8 inline-flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-full shadow-lg">
                <Sparkles className="w-5 h-5" /> AI Powered
            </div>
             <div className="absolute bottom-8 -left-8 inline-flex items-center gap-2 px-4 py-2 text-blue-500 rounded-full shadow-lg">
                <CheckCircle className="w-5 h-5" /> Fast & Easy
            </div>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-headline font-bold mb-4">{t('how_it_works.title')}</h2>
            <p className="text-lg text-muted-foreground mb-12">
              {t('how_it_works.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-border/50 text-center">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                    <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('how_it_works.step1.title')}</h3>
                <p className="text-muted-foreground">{t('how_it_works.step1.description')}</p>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-border/50 text-center">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                    <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('how_it_works.step2.title')}</h3>
                <p className="text-muted-foreground">{t('how_it_works.step2.description')}</p>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-border/50 text-center">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('how_it_works.step3.title')}</h3>
                <p className="text-muted-foreground">{t('how_it_works.step3.description')}</p>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-border/50 text-center">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                    <BookUser className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('how_it_works.step4.title')}</h3>
                <p className="text-muted-foreground">{t('how_it_works.step4.description')}</p>
            </div>
          </div>
           <div className="mt-16 text-center bg-white border-2 border-dashed border-primary/50 rounded-2xl p-8 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-primary mb-2">{t('how_it_works.edge.title')}</h3>
                <p className="text-muted-foreground">{t('how_it_works.edge.description')}</p>
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
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

      {/* Footer */}
      <footer className="py-8 bg-primary/5">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} LazyNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
