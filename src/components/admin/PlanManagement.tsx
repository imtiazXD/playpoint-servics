import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string | null;
  features: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const PlanManagement = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    features: "",
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('order_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to fetch plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const planData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description || null,
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : null,
        is_active: formData.is_active
      };

      if (editingPlan) {
        const { error } = await supabase
          .from('order_plans')
          .update(planData)
          .eq('id', editingPlan.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Plan updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('order_plans')
          .insert([planData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Plan created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingPlan(null);
      setFormData({ name: "", price: "", description: "", features: "", is_active: true });
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error",
        description: "Failed to save plan",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      description: plan.description || "",
      features: plan.features ? plan.features.join(', ') : "",
      is_active: plan.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      const { error } = await supabase
        .from('order_plans')
        .delete()
        .eq('id', planId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Plan deleted successfully",
      });
      
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingPlan(null);
    setFormData({ name: "", price: "", description: "", features: "", is_active: true });
  };

  return (
    <Card className="bg-gradient-card border-border animate-slide-in">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-lg md:text-xl font-bold text-foreground">Plan Management</h2>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="gaming" className="animate-glow-pulse">
                <Plus className="h-4 w-4 mr-2" />
                Add New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-gradient-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Plan Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter plan name"
                      required
                      className="bg-background/50 border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-foreground">Price (৳)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Enter price"
                      required
                      className="bg-background/50 border-border text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter plan description"
                    className="bg-background/50 border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="features" className="text-foreground">Features (comma separated)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    className="bg-background/50 border-border text-foreground"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="active" className="text-foreground">Active Plan</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" variant="gaming" className="flex-1">
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Plan Name</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Features</TableHead>
                <TableHead className="text-muted-foreground">Created</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading plans...</p>
                  </TableCell>
                </TableRow>
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No plans found
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id} className="border-border hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium text-foreground">{plan.name}</TableCell>
                    <TableCell className="text-foreground">৳{plan.price}</TableCell>
                    <TableCell>
                      {plan.is_active ? (
                        <Badge className="bg-accent text-accent-foreground">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-foreground max-w-xs">
                      {plan.features ? (
                        <div className="text-sm">
                          {plan.features.slice(0, 2).map((feature, idx) => (
                            <div key={idx}>• {feature}</div>
                          ))}
                          {plan.features.length > 2 && (
                            <div className="text-muted-foreground">+{plan.features.length - 2} more</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No features</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(plan)}
                          className="hover:shadow-glow transition-all duration-300"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default PlanManagement;