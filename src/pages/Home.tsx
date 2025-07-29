import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedCard } from "@/components/ui/animated-card";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { FloatingElement } from "@/components/ui/floating-elements";
import { useStaggeredAnimation } from "@/hooks/useScrollAnimation";

const Home = () => {
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { containerRef: plansRef, visibleItems } = useStaggeredAnimation(3, 200);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('order_plans')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: true });

        if (error) throw error;
        
        setPricingPlans(data || []);
      } catch (error) {
        console.error('Error fetching plans:', error);
        // Fallback to hardcoded plans if fetch fails
        setPricingPlans([
          {
            name: "Basic Account",
            price: 150,
            features: ["Gmail Setup", "Basic Profile", "24hr Delivery", "Support"]
          },
          {
            name: "Premium Account", 
            price: 250,
            features: ["Gmail Setup", "Full Profile", "12hr Delivery", "Priority Support", "Extra Security"]
          },
          {
            name: "Express Account",
            price: 350, 
            features: ["Gmail Setup", "Full Profile", "6hr Delivery", "VIP Support", "Max Security", "Free Backup"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const testimonials = [
    {
      name: "Ahmed Khan",
      comment: "Got my account in just 8 hours! Professional service.",
      rating: 5
    },
    {
      name: "Fatima Rahman", 
      comment: "Very reliable and secure. Highly recommended!",
      rating: 5
    },
    {
      name: "Rakib Hassan",
      comment: "Best prices and fast delivery. Will order again.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto text-center">
          <FloatingElement floatDirection="up" duration={4} intensity={8}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              <TypewriterText 
                text="Get Your Play Point Account" 
                speed={100}
                startDelay={500}
              />
            </h1>
          </FloatingElement>
          <AnimatedCard 
            animationType="fade-up" 
            delay={1500}
            hoverEffect={false}
            className="mb-8"
          >
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional account creation service with guaranteed delivery. 
            Safe, secure, and affordable gaming accounts for everyone.
            </p>
          </AnimatedCard>
          <AnimatedCard 
            animationType="scale" 
            delay={2000}
            hoverEffect={false}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order">
              <Button variant="hero" className="animate-float w-full sm:w-auto hover:animate-heartbeat">
                Order Now
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="outline" size="lg" className="w-full sm:w-auto hover:shadow-glow hover:animate-wiggle transition-all duration-300">
                Learn More
              </Button>
            </Link>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <AnimatedCard animationType="fade-up" className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Choose Your Plan
            </h2>
          </AnimatedCard>
          <div 
            ref={plansRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
          >
            {loading ? (
              <AnimatedCard className="col-span-full text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-2 skeleton-pulse">Loading plans...</p>
              </AnimatedCard>
            ) : pricingPlans.map((plan, index) => (
              <AnimatedCard
                key={plan.id || index}
                animationType={index % 2 === 0 ? 'fade-up' : 'scale'}
                delay={index * 200}
                className={cn(
                  "bg-gradient-card border-border p-4 md:p-6 hover:shadow-intense transition-all duration-300",
                  visibleItems.includes(index) && "animate-scale-in",
                  index === 1 && "hover:animate-heartbeat" // Premium plan gets heartbeat
                )}
              >
                <Card className="h-full">
                  <div className="text-center p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">{plan.name}</h3>
                  <FloatingElement floatDirection="up" duration={2} intensity={3}>
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-4 md:mb-6">৳{plan.price}</div>
                  </FloatingElement>
                  <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    {(plan.features || []).map((feature, i) => (
                      <li 
                        key={i} 
                        className="text-sm md:text-base text-muted-foreground animate-fade-in-left"
                        style={{ animationDelay: `${(index * 200) + (i * 100)}ms` }}
                      >
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/order">
                    <Button variant="gaming" className="w-full hover:animate-shake">
                      Select Plan
                    </Button>
                  </Link>
                  </div>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <AnimatedCard animationType="rotate" className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              What Our Customers Say
            </h2>
          </AnimatedCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard
                key={index}
                animationType={index === 1 ? 'scale' : 'fade-up'}
                delay={index * 150}
                className="bg-gradient-card border-border p-4 md:p-6 hover:shadow-glow transition-all duration-300"
              >
                <Card className="h-full">
                  <div className="text-center p-4 md:p-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FloatingElement 
                        key={i} 
                        floatDirection="up" 
                        duration={2 + i * 0.2} 
                        intensity={5}
                      >
                        <span className="text-accent text-lg md:text-xl">★</span>
                      </FloatingElement>
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">"{testimonial.comment}"</p>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  </div>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Notice */}
      <section className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <AnimatedCard animationType="fade-up" hoverEffect={false}>
            <p className="text-sm text-muted-foreground">
            By using our service, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms & Conditions
            </Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            </p>
          </AnimatedCard>
        </div>
      </section>
    </div>
  );
};

export default Home;