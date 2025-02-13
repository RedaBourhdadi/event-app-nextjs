import { useState, useEffect } from 'react';
import useApi from './useApi';

interface Notification {
  id: number;
  title: string;
  message: string;
  data: any;
  createdAt: string;
  readAt: string | null;
}

interface NotificationResponse {
  items: Notification[];
}

const useNotifications = (pollingInterval = 10000) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchApi = useApi();

  const fetchNotifications = async () => {
    try {
      const response = await fetchApi<NotificationResponse>('/notifications', {
        method: 'GET',
        verbose: false,
        displaySuccess: false,
      });

      if (response.success && response.data?.items) {
        const sortedNotifications = response.data.items.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifications(sortedNotifications as Notification[]);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetchApi(`/notifications/${id}/read`, {
        method: 'POST',
        verbose: false,
        displaySuccess: false,
      });

      if (response.success) {
        // setNotifications([]);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingInterval]);

  return {
    notifications: Array.isArray(notifications) ? notifications : [],
    loading,
    markAsRead,
    refetch: fetchNotifications,
  };
};

export default useNotifications;
