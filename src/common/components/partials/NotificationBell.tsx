import React, { useState } from 'react';
import { Badge, IconButton, Popover, Paper } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useNotifications from '@common/hooks/useNotifications';
import NotificationContent from './NotificationContent';

export const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { notifications, loading, markAsRead } = useNotifications();

  const unreadCount = notifications.filter((notification) => notification.readAt === null).length;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (id: number) => {
    // console.log(id);
    await markAsRead(id);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton onClick={handleClick} aria-describedby={id}>
        <Badge badgeContent={unreadCount} color="error" overlap="circular">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 320, maxHeight: 400 }}>
          <NotificationContent
            loading={loading}
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
          />
        </Paper>
      </Popover>
    </>
  );
};
