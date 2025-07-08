-- Fix the RLS policy for users to see their own notifications AND messages sent to all users
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications and all-user messages" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);