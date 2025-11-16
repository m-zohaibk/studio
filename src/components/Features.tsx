import { Search, Filter, CheckCircle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Smart Crawling",
    description: "Our AI continuously monitors Funda for new listings that match your criteria, 24/7.",
  },
  {
    icon: Filter,
    title: "Intelligent Filtering",
    description: "Advanced algorithms qualify properties based on your preferences, budget, and requirements.",
  },
  {
    icon: CheckCircle,
    title: "Instant Qualification",
    description: "Get only the best matches. No time wasted on unsuitable properties.",
  },
  {
    icon: Calendar,
    title: "Quick Booking",
    description: "Be the first to book viewings. Speed gives you the competitive edge in hot markets.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How Lazy Nests Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Our AI-powered system handles everything from search to booking, 
            giving you the advantage in competitive housing markets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-lifted transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group"
            >
              <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-accent/10 border border-accent/20 rounded-2xl p-8 max-w-2xl">
            <p className="text-lg text-foreground font-medium mb-2">
              Being first increases your chances by up to 300%
            </p>
            <p className="text-muted-foreground">
              In competitive markets, the first viewer often gets the house. 
              Let Lazy Nests give you that edge.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
