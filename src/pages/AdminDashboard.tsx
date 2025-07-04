import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell } from "lucide-react";

const AdminDashboard = () => {
  const [orders] = useState([
    {
      id: "ORD001",
      email: "user1@gmail.com",
      password: "userpass123",
      paymentMethod: "bKash",
      transactionId: "TXN123456789",
      status: "pending",
      createdAt: "2024-01-15 10:30 AM"
    },
    {
      id: "ORD002", 
      email: "user2@gmail.com",
      password: "mypass456",
      paymentMethod: "Nagad",
      transactionId: "NGD987654321",
      status: "completed",
      createdAt: "2024-01-15 09:15 AM"
    },
    {
      id: "ORD003",
      email: "user3@gmail.com", 
      password: "secure789",
      paymentMethod: "Rocket",
      transactionId: "RKT555666777",
      status: "pending",
      createdAt: "2024-01-15 08:45 AM"
    }
  ]);

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
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-muted-foreground" />
              {stats.pendingOrders > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                  {stats.pendingOrders}
                </span>
              )}
            </div>
            <Button variant="outline">Logout</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">{stats.totalOrders}</h3>
              <p className="text-muted-foreground">Total Orders</p>
            </div>
          </Card>
          <Card className="bg-gradient-card border-border p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-secondary">{stats.pendingOrders}</h3>
              <p className="text-muted-foreground">Pending Orders</p>
            </div>
          </Card>
          <Card className="bg-gradient-card border-border p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-accent">{stats.completedOrders}</h3>
              <p className="text-muted-foreground">Completed Orders</p>
            </div>
          </Card>
          <Card className="bg-gradient-card border-border p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">৳{stats.totalIncome}</h3>
              <p className="text-muted-foreground">Total Income</p>
            </div>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="bg-gradient-card border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Order ID</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Payment</TableHead>
                    <TableHead className="text-muted-foreground">Transaction ID</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Created</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                      <TableCell className="text-foreground">{order.email}</TableCell>
                      <TableCell className="text-foreground">{order.paymentMethod}</TableCell>
                      <TableCell className="text-foreground">{order.transactionId}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{order.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <>
                              <Button size="sm" variant="gaming">
                                Mark Done
                              </Button>
                              <Button size="sm" variant="destructive">
                                Reject
                              </Button>
                            </>
                          )}
                          {order.status === "completed" && (
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;