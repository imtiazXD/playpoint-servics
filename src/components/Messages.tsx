import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, X } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  status: string;
  created_at: string;
}

interface MessagesProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
}

const Messages = ({ isOpen, onClose, onUnreadCountChange }: MessagesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      fetchNotifications();
    }
  }, [user, isOpen]);

  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setNotifications(data || []);
      const unreadCount = data?.filter(n => n.status === 'unread').length || 0;
      onUnreadCountChange(unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, status: 'read' } : n
        )
      );
      
      const unreadCount = notifications.filter(n => n.status === 'unread' && n.id !== notificationId).length;
      onUnreadCountChange(unreadCount);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .eq('status', 'unread');

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, status: 'read' }))
      );
      onUnreadCountChange(0);

      toast({
        title: "Success",
        description: "All messages marked as read",
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark messages as read",
        variant: "destructive"
      });
    }
  };

  const getNotificationIcon = (message: string) => {
    if (message.toLowerCase().includes('success') || message.toLowerCase().includes('ready') || message.toLowerCase().includes('completed')) {
      return '✅';
    } else if (message.toLowerCase().includes('info') || message.toLowerCase().includes('check') || message.toLowerCase().includes('email')) {
      return 'ℹ️';
    } else if (message.toLowerCase().includes('warning') || message.toLowerCase().includes('need') || message.toLowerCase().includes('required')) {
      return '❗';
    }
    return '📩';
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  if (!isOpen) return null;

  return (
    <Card className="bg-gradient-card border-border p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Messages</h2>
        </div>
        <div className="flex items-center gap-2">
          {notifications.filter(n => n.status === 'unread').length > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border border-border rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                notification.status === 'unread' ? 'bg-muted/30 border-primary/30' : 'bg-background/50'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.message)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notification.status === 'unread' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(notification.created_at)}
                  </p>
                </div>
                {notification.status === 'unread' && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default Messages;