"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import NotificationsPanel from "@/components/notifications-panel";
import { useDictionary } from "@/lib/i18n/locale-context";
import { notificationsDictionary } from "@/lib/i18n/dictionaries/notifications";

export function NotificationsBell() {
  const t = useDictionary(notificationsDictionary);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setNotificationsOpen(true)} aria-label={t.bellAriaLabel}>
        🔔
      </Button>
      <NotificationsPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
}
