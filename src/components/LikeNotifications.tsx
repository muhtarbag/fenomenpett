import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: number;
  username: string;
  created_at: string;
  submission_id: number;
  is_read: boolean;
}

const LikeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('like_notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'like_notifications'
        },
        (payload) => {
          console.log('Realtime notification:', payload);
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as Notification, ...prev]);
            toast.info(`${(payload.new as Notification).username} bir gönderiyi beğendi!`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('like_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Bildirimler yüklenirken bir hata oluştu');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Son Beğeniler</h2>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-3 bg-white rounded-lg shadow-sm border"
          >
            <p className="text-sm text-gray-600">
              <span className="font-medium">{notification.username}</span>{' '}
              bir gönderiyi beğendi
            </p>
            <span className="text-xs text-gray-400">
              {new Date(notification.created_at).toLocaleString('tr-TR')}
            </span>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Henüz bildirim bulunmuyor
          </p>
        )}
      </div>
    </div>
  );
};

export default LikeNotifications;