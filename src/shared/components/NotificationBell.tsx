import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import client from '../../shared/api/client';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await client.get('/notifications');
      const data = response.data;
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await client.put(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ITEM_FOUND': return 'bg-green-100 border-green-500 text-green-800';
      case 'CLAIM_REQUEST': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'ADMIN_MESSAGE': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <Bell className="text-white" size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs font-bold flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white shadow-2xl rounded-lg overflow-hidden z-50 border-2 border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold uppercase tracking-wider text-black">Notifications</h3>
            <span className="text-xs font-bold text-gray-500">{unreadCount} unread</span>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm font-medium">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${notification.read ? 'opacity-60' : 'bg-blue-50/30'}`}
                >
                  <div className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded inline-block mb-2 border-l-4 ${getNotificationColor(notification.type)}`}>
                    {notification.type.replace('_', ' ')}
                  </div>
                  <h4 className={`font-bold text-sm mb-1 ${notification.read ? 'text-gray-700' : 'text-black'}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <div className="text-xs text-gray-400 font-mono">
                    {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
