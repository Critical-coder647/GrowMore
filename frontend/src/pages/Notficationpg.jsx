import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NotificationPage({ user, go }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = {};
      if (filter !== 'all') {
        if (filter === 'unread') {
          params.read = 'false';
        } else {
          params.type = filter;
        }
      }
      
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setNotifications(response.data.notifications || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      like: 'favorite',
      comment: 'mode_comment',
      mention: 'alternate_email',
      funding_alert: 'monetization_on',
      investor_interest: 'trending_up',
      message: 'chat',
      system: 'info',
      community: 'group',
      connection: 'person_add'
    };
    return icons[type] || 'notifications';
  };

  const getNotificationColor = (type) => {
    const colors = {
      like: 'text-red-500',
      comment: 'text-blue-500',
      mention: 'text-purple-500',
      funding_alert: 'text-green-500',
      investor_interest: 'text-yellow-500',
      message: 'text-indigo-500',
      system: 'text-slate-500',
      community: 'text-pink-500',
      connection: 'text-teal-500'
    };
    return colors[type] || 'text-slate-500';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen w-full bg-[#f5f7f8] dark:bg-[#101b22]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Left Sidebar */}
      <aside className="w-72 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111a22] hidden md:flex">
        <div className="flex flex-col gap-6">
          <button 
            onClick={() => go(user?.role === 'startup' ? 'startup-dashboard' : 'investor-dashboard')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-fit"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3 px-2 py-2 cursor-pointer" onClick={() => go(user?.role === 'startup' ? 'startup-dashboard' : 'investor-dashboard')}>
            <div className="aspect-square size-10 rounded-full bg-[#0d93f2]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0d93f2]">person</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-normal text-slate-900 dark:text-white">{user?.name || 'User'}</h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{user?.role || 'Member'}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="px-4 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Filters</h4>
            <button 
              onClick={() => setFilter('all')}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all ${filter === 'all' ? 'bg-[#0d93f2]/10 text-[#0d93f2] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">inbox</span>
                <span>All Notifications</span>
              </div>
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all ${filter === 'unread' ? 'bg-[#0d93f2]/10 text-[#0d93f2] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">mark_chat_unread</span>
                <span>Unread</span>
              </div>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>
            <button 
              onClick={() => setFilter('funding_alert')}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all ${filter === 'funding_alert' ? 'bg-[#0d93f2]/10 text-[#0d93f2] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">monetization_on</span>
                <span>Funding Alerts</span>
              </div>
            </button>
            <button 
              onClick={() => setFilter('community')}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all ${filter === 'community' ? 'bg-[#0d93f2]/10 text-[#0d93f2] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">group</span>
                <span>Community</span>
              </div>
            </button>
            <button 
              onClick={() => setFilter('like')}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all ${filter === 'like' ? 'bg-[#0d93f2]/10 text-[#0d93f2] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">favorite</span>
                <span>Likes</span>
              </div>
            </button>
            <button 
              onClick={() => setFilter('comment')}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all ${filter === 'comment' ? 'bg-[#0d93f2]/10 text-[#0d93f2] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">mode_comment</span>
                <span>Comments</span>
              </div>
            </button>
            <button 
              onClick={() => setFilter('system')}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all ${filter === 'system' ? 'bg-[#0d93f2]/10 text-[#0d93f2] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">info</span>
                <span>System Updates</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'You\'re all caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm font-medium text-[#0d93f2] hover:bg-[#0d93f2]/10 rounded-lg transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-slate-500">Loading notifications...</div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-[#111a22]">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">notifications_off</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No notifications</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {filter === 'unread' ? 'You have no unread notifications' : 'You don\'t have any notifications yet'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`rounded-xl border p-4 transition-all hover:shadow-md ${
                    notification.read 
                      ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111a22]' 
                      : 'border-[#0d93f2]/30 bg-[#0d93f2]/5 dark:border-[#0d93f2]/50 dark:bg-[#0d93f2]/10'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 ${getNotificationColor(notification.type)}`}>
                      <span className="material-symbols-outlined">{getNotificationIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 dark:text-white">{notification.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="text-[#0d93f2] hover:bg-[#0d93f2]/10 p-2 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <span className="material-symbols-outlined text-lg">done</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                      {notification.link && (
                        <button
                          onClick={() => go(notification.link.replace('/', ''))}
                          className="mt-3 text-sm font-medium text-[#0d93f2] hover:underline"
                        >
                          View Details →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationPage;
