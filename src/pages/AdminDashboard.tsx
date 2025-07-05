import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PlanManagement from "@/components/admin/PlanManagement";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast({
        title: "Success",
        description: `Order ${newStatus === 'completed' ? 'marked as done' : 'rejected'}`,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = (orderId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    completedOrders: orders.filter(o => o.status === "completed").length,
    totalIncome: orders.filter(o => o.status === "completed").length * 250
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "completed":
        return <Badge className="bg-accent text-accent-foreground">Completed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 md:p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground animate-slide-in">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <Bell className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              {stats.pendingOrders > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center animate-bounce">
                  {stats.pendingOrders}
                </span>
              )}
            </div>
            <Button variant="outline">Logout</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-gradient-card border-border p-4 md:p-6 hover:shadow-glow transition-all duration-300 animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-primary">{stats.totalOrders}</h3>
              <p className="text-sm md:text-base text-muted-foreground">Total Orders</p>
            </div>
          </Card>
          <Card className="bg-gradient-card border-border p-4 md:p-6 hover:shadow-glow transition-all duration-300 animate-slide-in" style={{animationDelay: '0.2s'}}>
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-secondary">{stats.pendingOrders}</h3>
              <p className="text-sm md:text-base text-muted-foreground">Pending Orders</p>
            </div>
          </Card>
          <Card className="bg-gradient-card border-border p-4 md:p-6 hover:shadow-glow transition-all duration-300 animate-slide-in" style={{animationDelay: '0.3s'}}>
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-accent">{stats.completedOrders}</h3>
              <p className="text-sm md:text-base text-muted-foreground">Completed Orders</p>
            </div>
          </Card>
          <Card className="bg-gradient-card border-border p-4 md:p-6 hover:shadow-glow transition-all duration-300 animate-slide-in" style={{animationDelay: '0.4s'}}>
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-primary">৳{stats.totalIncome}</h3>
              <p className="text-sm md:text-base text-muted-foreground">Total Income</p>
            </div>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="bg-gradient-card border-border animate-slide-in" style={{animationDelay: '0.5s'}}>
          <div className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Order ID</TableHead>
                    <TableHead className="text-muted-foreground">Gmail</TableHead>
                    <TableHead className="text-muted-foreground">Password</TableHead>
                    <TableHead className="text-muted-foreground">Payment Method</TableHead>
                    <TableHead className="text-muted-foreground">Transaction ID</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-muted-foreground mt-2">Loading orders...</p>
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id} className="border-border hover:bg-muted/20 transition-colors">
                        <TableCell className="font-medium text-foreground">{order.id.slice(0, 8)}...</TableCell>
                        <TableCell className="text-foreground">{order.gmail}</TableCell>
                        <TableCell className="text-foreground font-mono text-sm">
                          <div className="flex items-center gap-2">
                            <span>
                              {visiblePasswords[order.id] ? order.password : '••••••••'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePasswordVisibility(order.id)}
                              className="h-6 w-6 p-0"
                            >
                              {visiblePasswords[order.id] ? 
                                <EyeOff className="h-3 w-3" /> : 
                                <Eye className="h-3 w-3" />
                              }
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">{order.payment_method}</TableCell>
                        <TableCell className="text-foreground">{order.transaction_id}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 flex-wrap">
                            {order.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="gaming"
                                  onClick={() => updateOrderStatus(order.id, 'completed')}
                                  className="animate-glow-pulse"
                                >
                                  Mark Done
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => updateOrderStatus(order.id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {order.status === "completed" && (
                              <Button size="sm" variant="outline" disabled>
                                Completed
                              </Button>
                            )}
                            {order.status === "rejected" && (
                              <Button size="sm" variant="destructive" disabled>
                                Rejected
                              </Button>
                            )}
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

        {/* Plan Management */}
        <div className="mt-6 md:mt-8">
          <PlanManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;