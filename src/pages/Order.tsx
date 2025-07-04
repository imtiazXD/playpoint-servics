import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [formData, setFormData] = useState({
    gmail: "",
    password: "",
    playPointName: "",
    selectedPlan: "",
    paymentMethod: "",
    transactionId: "",
    fastDelivery: false,
    termsAccepted: false
  });
  const [submitting, setSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const plans = {
    basic: { name: "Basic Account", price: 150, delivery: "24hr" },
    premium: { name: "Premium Account", price: 250, delivery: "12hr" },
    express: { name: "Express Account", price: 350, delivery: "6hr" }
  };

  const calculateTotalPrice = () => {
    if (!formData.selectedPlan) return 0;
    const basePrice = plans[formData.selectedPlan as keyof typeof plans]?.price || 0;
    return basePrice + (formData.fastDelivery ? 50 : 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedPlan) {
      toast({
        title: "Plan Required",
        description: "Please select a plan to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          gmail: formData.gmail,
          password: formData.password,
          play_point_name: formData.playPointName || null,
          payment_method: formData.paymentMethod,
          transaction_id: formData.transactionId,
          fast_delivery: formData.fastDelivery,
          user_id: user?.id || null,
          status: 'pending'
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to submit order. Please try again.",
          variant: "destructive"
        });
        console.error('Error submitting order:', error);
      } else {
        toast({
          title: "Order Submitted Successfully!",
          description: "We'll start working on your account within 2 hours. Check your email for updates.",
        });

        // Reset form
        setFormData({
          gmail: "",
          password: "",
          playPointName: "",
          selectedPlan: "",
          paymentMethod: "",
          transactionId: "",
          fastDelivery: false,
          termsAccepted: false
        });

        // Redirect to dashboard if logged in
        if (user) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-6 md:py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-gradient-card border-border p-4 md:p-8 animate-slide-in">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 animate-bounce-gentle">Place Your Order</h1>
            <p className="text-sm md:text-base text-muted-foreground">Fill out the form below to get your Play Point account</p>
            {!user && (
              <p className="text-xs md:text-sm text-yellow-400 mt-2">
                💡 <a href="/auth" className="underline">Login or sign up</a> to track your orders
              </p>
            )}
          </div>

          {/* Pricing Plans */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4 animate-slide-in">Available Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-border rounded-lg p-4 bg-background/30 hover:shadow-glow transition-all duration-300 hover:scale-105 animate-slide-in" style={{animationDelay: '0.1s'}}>
                <div className="text-center">
                  <h4 className="font-bold text-foreground">Basic Account</h4>
                  <div className="text-xl font-bold text-primary">৳150</div>
                  <div className="text-sm text-muted-foreground">24hr Delivery</div>
                </div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-background/30 hover:shadow-intense transition-all duration-300 hover:scale-105 animate-slide-in" style={{animationDelay: '0.2s'}}>
                <div className="text-center">
                  <h4 className="font-bold text-foreground">Premium Account</h4>
                  <div className="text-xl font-bold text-primary">৳250</div>
                  <div className="text-sm text-muted-foreground">12hr Delivery</div>
                </div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-background/30 hover:shadow-glow transition-all duration-300 hover:scale-105 animate-slide-in" style={{animationDelay: '0.3s'}}>
                <div className="text-center">
                  <h4 className="font-bold text-foreground">Express Account</h4>
                  <div className="text-xl font-bold text-primary">৳350</div>
                  <div className="text-sm text-muted-foreground">6hr Delivery</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="gmail" className="text-foreground">Gmail Address *</Label>
              <Input
                id="gmail"
                type="email"
                placeholder="your.email@gmail.com"
                value={formData.gmail}
                onChange={(e) => setFormData({...formData, gmail: e.target.value})}
                required
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">This will be used to create your account</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Preferred Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a strong password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Select Plan *</Label>
              <Select value={formData.selectedPlan} onValueChange={(value) => setFormData({...formData, selectedPlan: value})}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Choose your plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Account - ৳150 (24hr delivery)</SelectItem>
                  <SelectItem value="premium">Premium Account - ৳250 (12hr delivery)</SelectItem>
                  <SelectItem value="express">Express Account - ৳350 (6hr delivery)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="playPointName" className="text-foreground">Play Point Name</Label>
              <Input
                id="playPointName"
                placeholder="Your gaming username (optional)"
                value={formData.playPointName}
                onChange={(e) => setFormData({...formData, playPointName: e.target.value})}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Payment Method *</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Choose payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bkash">bKash</SelectItem>
                  <SelectItem value="nagad">Nagad</SelectItem>
                  <SelectItem value="rocket">Rocket</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionId" className="text-foreground">Transaction ID *</Label>
              <Input
                id="transactionId"
                placeholder="Enter your payment transaction ID"
                value={formData.transactionId}
                onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                required
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">
                Send money to: 01XXXXXXXXX
                {formData.selectedPlan && (
                  <span className="block mt-1 font-medium text-primary">
                    Amount to send: ৳{calculateTotalPrice()}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="fastDelivery"
                checked={formData.fastDelivery}
                onCheckedChange={(checked) => setFormData({...formData, fastDelivery: checked as boolean})}
              />
              <Label htmlFor="fastDelivery" className="text-sm text-muted-foreground">
                Fast Delivery (+৳50 - Priority processing)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => setFormData({...formData, termsAccepted: checked as boolean})}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I accept the Terms & Conditions and Privacy Policy
              </Label>
            </div>

            <Button 
              type="submit" 
              variant="gaming" 
              className="w-full"
              disabled={!formData.gmail || !formData.password || !formData.selectedPlan || !formData.paymentMethod || !formData.transactionId || submitting}
            >
              {submitting ? "Submitting Order..." : "Submit Order"}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-muted/20 rounded-lg">
            <h3 className="font-bold text-foreground mb-2">Important Notes:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Account delivery within 6-24 hours</li>
              <li>• We'll email you the account details</li>
              <li>• Keep your transaction ID safe</li>
              <li>• Contact support for any issues</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Order;