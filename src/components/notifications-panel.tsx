"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "success", title: "Meeting processed", message: '"Q4 Strategy Sync" is ready. AI has extracted 4 high-priority action items.', time: "2 mins ago", unread: true },
    { id: 2, type: "warning", title: "Action items detected", message: 'A deadline for "PRD Completion" was discussed in your last meeting.', time: "45 mins ago", unread: true },
    { id: 3, type: "info", title: "Team Access Granted", message: 'Sarah Miller invited you to the "Product Development" workspace.', time: "1 hour ago", unread: true },
    { id: 4, type: "neutral", title: "Integration Sync Successful", message: "Notion database updated with 15 new meeting records.", time: "4 hours ago", unread: false },
    { id: 5, type: "neutral", title: "Weekly Digest Ready", message: "Your AI productivity analysis for Oct 7 - Oct 13 is available.", time: "8 hours ago", unread: false },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[400px] z-50 bg-surface/80 backdrop-blur-md border-l border-border flex flex-col shadow-2xl">
      {/* Panel Header */}
      <div className="p-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-success text-background text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
          )}
        </div>
        <button onClick={markAllRead} className="text-success text-sm hover:opacity-80 transition-opacity">Mark all read</button>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Unread Items */}
        <div className="px-4 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary px-4 mb-4">Unread</p>
          {notifications.filter(n => n.unread).map(notification => (
            <div key={notification.id} className="p-4 rounded-xl cursor-pointer transition-all flex gap-4 relative hover:bg-surface/50">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-success rounded-full"></div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                notification.type === "success" ? "bg-success/20 text-success" :
                notification.type === "warning" ? "bg-warning/20 text-warning" :
                "bg-info/20 text-info"
              }`}>
                <span className="text-lg">
                  {notification.type === "success" ? "" : notification.type === "warning" ? "" : ""}
                </span>
              </div>
              <div className="flex-1 pr-6">
                <p className="font-medium leading-tight">{notification.title}</p>
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">{notification.message}</p>
                <p className="text-[10px] text-text-secondary mt-2">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Earlier Items */}
        <div className="px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary px-4 mb-4">Earlier Today</p>
          {notifications.filter(n => !n.unread).map(notification => (
            <div key={notification.id} className="p-4 rounded-xl cursor-pointer transition-all flex gap-4 opacity-80 hover:bg-surface/50">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-text-secondary shrink-0">
                <span className="text-lg"></span>
              </div>
              <div className="flex-1">
                <p className="font-medium leading-tight">{notification.title}</p>
                <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
                <p className="text-[10px] text-text-secondary mt-2">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel Footer */}
      <div className="p-6 border-t border-border bg-surface-low">
        <Button variant="secondary" className="w-full gap-2" onClick={onClose}>
          <span></span>
          Close Panel
        </Button>
      </div>
    </div>
  );
}
