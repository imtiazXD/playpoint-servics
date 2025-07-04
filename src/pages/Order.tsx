import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Order = () => {
  const [formData, setFormData] = useState({
    gmail: "",
    password: "",
    playPointName: "",
    paymentMethod: "",
    transactionId: "",
    termsAccepted: false
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    // Simulate order submission
    toast({
      title: "Order Submitted Successfully!",
      description: "We'll start working on your account within 2 hours. Check your email for updates.",
    });

    // Reset form
    setFormData({
      gmail: "",
      password: "",
      playPointName: "",
      paymentMethod: "",
      transactionId: "",
      termsAccepted: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-gradient-card border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Place Your Order</h1>
            <p className="text-muted-foreground">Fill out the form below to get your Play Point account</p>
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
                Send money to: 01XXXXXXXXX | Then enter the transaction ID here
              </p>
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
              disabled={!formData.gmail || !formData.password || !formData.paymentMethod || !formData.transactionId}
            >
              Submit Order
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