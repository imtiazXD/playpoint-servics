import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send, Users, User } from "lucide-react";

interface User {
  id: string;
  email: string;
}

interface Notification {
  id: string;
  user_id: string | null;
  message: string;
  status: string;
  created_at: string;
}

const MessageManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  const fetchUsers = async () => {
    try {
      // Since we can't access auth.users directly, we'll use profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name');

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Warning",
          description: "Could not fetch user list. You can still send messages to all users.",
          variant: "destructive"
        });
        return;
      }
      
      // For now, we'll create a simple list. In a real app, you'd have a proper user management system
      setUsers(data?.map(profile => ({
        id: profile.user_id,
        email: profile.display_name || 'Unknown User'
      })) || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (selectedUser === "all") {
        // Send to all users - if no users found, send to all authenticated users with null user_id
        if (users.length === 0) {
          const { error } = await supabase
            .from('notifications')
            .insert({
              user_id: null, // null means message for all users
              message: message.trim(),
              status: 'unread'
            });

          if (error) {
            console.error('Error sending message to all users:', error);
            throw error;
          }

          toast({
            title: "Success",
            description: "Message sent to all users",
          });
        } else {
          const notifications = users.map(user => ({
            user_id: user.id,
            message: message.trim(),
            status: 'unread'
          }));

          const { error } = await supabase
            .from('notifications')
            .insert(notifications);

          if (error) {
            console.error('Error sending messages:', error);
            throw error;
          }

          toast({
            title: "Success",
            description: `Message sent to all users (${users.length})`,
          });
        }
      } else {
        // Send to specific user
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: selectedUser,
            message: message.trim(),
            status: 'unread'
          });

        if (error) {
          console.error('Error sending message to user:', error);
          throw error;
        }

        toast({
          title: "Success",
          description: "Message sent successfully",
        });
      }

      setMessage("");
      fetchNotifications();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Send Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Recipient</label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    All Users
                  </div>
                </SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user.email}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Message</label>
            <Textarea
              placeholder="Enter your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={sendMessage} 
            disabled={loading || !message.trim()}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No messages sent yet</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {notification.user_id ? 
                          'Specific User' : 
                          'All Users'
                        }
                      </span>
                      <Badge variant={notification.status === 'unread' ? 'default' : 'secondary'}>
                        {notification.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageManagement;