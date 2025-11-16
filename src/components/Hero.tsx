import { Button } from "@/components/ui/button";
import mascotImage from "@/assets/lazy-bird-mascot.png";
import { ArrowRight, Home, Search, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered House Hunting
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Find Your
                <span className="block text-primary mt-2">Dream Nest</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Let our smart AI bird do the searching while you relax. 
                Lazy Nests finds the perfect home on Funda, qualifies listings, 
                and helps you book viewings—before anyone else.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="text-lg gap-2 shadow-soft hover:shadow-lifted transition-all">
                  Start Your Search
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg gap-2">
                  <Search className="w-5 h-5" />
                  How It Works
                </Button>
              </div>

              <div className="flex items-center gap-8 justify-center md:justify-start pt-4">
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-foreground">2,500+</div>
                  <div className="text-sm text-muted-foreground">Houses Found</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-foreground">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-foreground">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Monitoring</div>
                </div>
              </div>
            </div>

            {/* Mascot Image */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md mx-auto">
                {/* Glow effect behind mascot */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
                
                {/* Mascot container */}
                <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 shadow-lifted border border-border/50">
                  <img 
                    src={mascotImage} 
                    alt="Lazy Nests Bird Mascot - Your AI Home Finding Assistant" 
                    className="w-full h-auto drop-shadow-2xl animate-float"
                  />
                  
                  {/* Floating badges */}
                  <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-soft animate-bounce-slow">
                    <Home className="w-5 h-5 inline mr-1" />
                    AI Powered
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground px-4 py-2 rounded-full shadow-soft animate-bounce-slow delay-300">
                    Fast & Easy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </section>
  );
};
