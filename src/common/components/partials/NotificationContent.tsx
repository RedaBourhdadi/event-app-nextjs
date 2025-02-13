import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: number;
  title: string;
  message: string;
  data: any;
  createdAt: string;
  readAt: string | null;
}

interface NotificationContentProps {
  loading: boolean;
  notifications: Notification[];
  onNotificationClick: (id: number) => void;
}

const NotificationContent: React.FC<NotificationContentProps> = ({
  loading,
  notifications,
  onNotificationClick,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="textSecondary">No new notifications</Typography>
      </Box>
    );
  }

  return (
    <List sx={{ p: 0 }}>
      {notifications.map((notification) => (
        <ListItem
          key={notification.id}
          button
          onClick={() => onNotificationClick(notification.id)}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: notification.readAt !== null ? 'action.hover' : 'transparent',
            '&:last-child': {
              borderBottom: 'none',
            },
          }}
        >
          <ListItemText
            primary={<Typography variant="subtitle2">{notification.title}</Typography>}
            secondary={
              <>
                <Typography variant="body2" color="textPrimary" sx={{ mb: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {notification.createdAt
                    ? formatDistance(new Date(notification.createdAt), new Date(), {
                        addSuffix: true,
                        locale: fr,
                      })
                    : 'Date inconnue'}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default NotificationContent;
