import React, { useState } from 'react';
import { AuthPage, AppNotification } from '../types';
import { 
  Bell, 
  CheckCheck, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Activity, 
  Zap, 
  AlertTriangle, 
  Radio, 
  Info, 
  Clock,
  Filter
} from 'lucide-react';

interface NotificationsPageProps {
  notifications: AppNotification[];
  onNavigate: (page: AuthPage) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onNavigate,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'power' | 'device'>('all');

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'power') return n.category === 'power' || n.category === 'voltage';
    if (filter === 'device') return n.category === 'device' || n.category === 'system';
    return true;
  });

  const getCategoryBadge = (category: AppNotification['category']) => {
    switch (category) {
      case 'power':
        return { label: 'Power Supply', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' };
      case 'voltage':
        return { label: 'Voltage Quality', color: 'bg-amber-950/80 text-amber-300 border-amber-800' };
      case 'device':
        return { label: 'Device & Hardware', color: 'bg-sky-950/80 text-sky-300 border-sky-800' };
      case 'account':
        return { label: 'Account & Plan', color: 'bg-purple-950/80 text-purple-300 border-purple-800' };
      default:
        return { label: 'System Alert', color: 'bg-[#16365B] text-slate-300 border-[#16365B]' };
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 text-white">
      {/* Header and Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#16365B] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-[#B9E5FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <span>/</span>
            <span className="text-slate-300">Notification Centre</span>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-8 h-8 rounded-lg bg-[#16365B] border border-[#B9E5FF]/30 text-[#B9E5FF] flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Notifications & Alerts
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#B9E5FF] text-[#071629] font-bold text-xs">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>

        {/* Global Action: Mark All as Read */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-1.5 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3 py-1.5 rounded-lg bg-[#0B1B33] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#16365B]/70 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
            filter === 'all'
              ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-[#0B1B33]'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-[#0B1B33]'
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#B9E5FF] text-[#071629] text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilter('power')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
            filter === 'power'
              ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-[#0B1B33]'
          }`}
        >
          Power & Voltage
        </button>
        <button
          onClick={() => setFilter('device')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
            filter === 'device'
              ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-[#0B1B33]'
          }`}
        >
          Device & System
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-8 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No notifications</h3>
            <p className="text-xs text-slate-400">
              {filter === 'unread' 
                ? 'You are all caught up! No unread notifications.' 
                : 'No alerts matching this filter category.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const badge = getCategoryBadge(notif.category);
            return (
              <div
                key={notif.id}
                className={`rounded-xl p-4 transition-all duration-200 border ${
                  notif.is_read
                    ? 'bg-[#0B1B33]/60 border-[#16365B]'
                    : 'bg-[#0B1B33] border-[#16365B] border-l-4 border-l-[#B9E5FF] shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                      {notif.is_demo && (
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/80">
                          Demo Data
                        </span>
                      )}
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#B9E5FF]" title="Unread" />
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {notif.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{formatTimestamp(notif.created_at)}</span>
                    </div>
                  </div>

                  {/* Per-Notification Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#16365B]/50 w-full sm:w-auto justify-end">
                    {!notif.is_read && (
                      <button
                        onClick={() => onMarkAsRead(notif.id)}
                        className="px-2.5 py-1 rounded bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3 text-slate-400" />
                        <span>Mark read</span>
                      </button>
                    )}

                    {notif.related_route && (
                      <button
                        onClick={() => {
                          if (!notif.is_read) onMarkAsRead(notif.id);
                          onNavigate(notif.related_route!);
                        }}
                        className="px-2.5 py-1 rounded bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <span>Open section</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Disclaimers & Info */}
      <div className="bg-[#0B1B33]/40 border border-[#16365B] rounded-xl p-3.5 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#B9E5FF] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Alert notifications represent future multi-channel dispatch (Push, SMS, In-App). Prototype records are clearly marked as demo data and do not reflect physical hardware telemetry.
        </p>
      </div>
    </div>
  );
};
