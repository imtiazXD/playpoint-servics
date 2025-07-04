import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Home = () => {
  const pricingPlans = [
    {
      name: "Basic Account",
      price: "৳150",
      features: ["Gmail Setup", "Basic Profile", "24hr Delivery", "Support"]
    },
    {
      name: "Premium Account", 
      price: "৳250",
      features: ["Gmail Setup", "Full Profile", "12hr Delivery", "Priority Support", "Extra Security"]
    },
    {
      name: "Express Account",
      price: "৳350", 
      features: ["Gmail Setup", "Full Profile", "6hr Delivery", "VIP Support", "Max Security", "Free Backup"]
    }
  ];

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
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-slide-in">
            Get Your Play Point Account
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-in" style={{animationDelay: '0.2s'}}>
            Professional account creation service with guaranteed delivery. 
            Safe, secure, and affordable gaming accounts for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in" style={{animationDelay: '0.4s'}}>
            <Link to="/order">
              <Button variant="hero" className="animate-float w-full sm:w-auto">
                Order Now
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="outline" size="lg" className="w-full sm:w-auto hover:shadow-glow transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground animate-slide-in">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className="bg-gradient-card border-border p-4 md:p-6 hover:shadow-intense hover:scale-105 transition-all duration-300 animate-slide-in" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">{plan.name}</h3>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-4 md:mb-6">{plan.price}</div>
                  <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-sm md:text-base text-muted-foreground">✓ {feature}</li>
                    ))}
                  </ul>
                  <Link to="/order">
                    <Button variant="gaming" className="w-full">
                      Select Plan
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground animate-slide-in">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-gradient-card border-border p-4 md:p-6 hover:shadow-glow hover:scale-105 transition-all duration-300 animate-slide-in" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-accent text-lg md:text-xl animate-bounce-gentle" style={{animationDelay: `${i * 0.1}s`}}>★</span>
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">"{testimonial.comment}"</p>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Notice */}
      <section className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
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
        </div>
      </section>
    </div>
  );
};

export default Home;