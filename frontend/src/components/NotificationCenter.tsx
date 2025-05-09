import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Notification, NotificationType } from '@/types';
import { getMyNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/utils/notificationService';
import { FiBell, FiX, FiCheck, FiTrash2 } from 'react-icons/fi';
import { theme } from '@/styles/theme';

interface NotificationCenterProps {
  maxNotifications?: number;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ maxNotifications = 5 }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format notification time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.COURSE:
        return '📚';
      case NotificationType.ASSIGNMENT:
        return '📝';
      case NotificationType.ANNOUNCEMENT:
        return '📢';
      case NotificationType.LIVE_CLASS:
        return '🎥';
      case NotificationType.GRADE:
        return '🏆';
      default:
        return '🔔';
    }
  };
  
  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications({ limit: maxNotifications });
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  // Handle marking notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Handle deleting a notification
  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      const updatedNotifications = notifications.filter(notification => notification.id !== id);
      setNotifications(updatedNotifications);
      
      // Update unread count if the deleted notification was unread
      const wasUnread = notifications.find(n => n.id === id && !n.read);
      if (wasUnread) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fetch notifications on mount and set up refresh interval
  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Automatically mark notifications as read when the dropdown is opened
  useEffect(() => {
    if (isOpen && notifications.some(n => !n.read)) {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      unreadIds.forEach(id => handleMarkAsRead(id));
    }
  }, [isOpen]);
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell icon with unread count badge */}
      <button
        className="relative p-2 rounded-full hover:bg-background-elevated focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiBell className="h-6 w-6 text-gray-300" />
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 rounded-full bg-primary">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background-elevated rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-background flex justify-between items-center">
            <h3 className="text-white font-medium">Notifications</h3>
            
            <div className="flex space-x-2">
              {notifications.some(n => !n.read) && (
                <button 
                  className="text-xs text-gray-400 hover:text-primary flex items-center"
                  onClick={handleMarkAllAsRead}
                >
                  <FiCheck className="h-4 w-4 mr-1" />
                  Mark all as read
                </button>
              )}
              
              <Link to="/notifications" className="text-xs text-primary">
                View all
              </Link>
            </div>
          </div>
          
          {/* Notification list */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-400">No notifications</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`px-4 py-3 border-b border-background hover:bg-background flex ${
                      !notification.read ? 'bg-background/70' : ''
                    }`}
                  >
                    <div className="mr-3 text-xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-medium truncate">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {notification.message}
                      </p>
                      
                      {notification.link && (
                        <Link 
                          to={notification.link} 
                          className="text-primary text-xs mt-1 inline-block"
                        >
                          View details
                        </Link>
                      )}
                    </div>
                    
                    <button 
                      className="ml-2 text-gray-500 hover:text-gray-300"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 