import React from 'react';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';

import Routes from '@common/defs/routes';
// import EventsTable from '@modules/events/components/partials/EventsTable';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useRouter } from 'next/router';
import { Add } from '@mui/icons-material';
import PageHeader from '@common/components/lib/partials/PageHeader';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '@common/components/lib/feedbacks/ConfirmDialog';
import { Button } from '@mui/material';
import useAuth from '@modules/auth/hooks/api/useAuth';

// @mui
// import Masonry from '@mui/lab/Masonry';
// import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
// import Switch from '@mui/material/Switch';
// import Divider from '@mui/material/Divider';
// import Collapse from '@mui/material/Collapse';
// import Checkbox from '@mui/material/Checkbox';
// import Container from '@mui/material/Container';
// import IconButton from '@mui/material/IconButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemButton from '@mui/material/ListItemButton';
// import readAll from '@modules/events/hooks/api/useUploads';
// import { useEvents } from '@modules/events/hooks/api/useUploads';
import useEvents, { CreateOneInput } from '@modules/events/hooks/api/useEvents';
import { usesubEvens, CreateOneInputSub } from '@modules/events/hooks/api/useEvents2';
import { Event } from '@modules/events/defs/types';

// import Iconify from './iconify';
import ComponentBlock from './component-block';

// interface EventResponse {
//   id: number;
//   title: string;
//   location: string;
//   date: string;
//   maxAttendees: number;
//   userId: number;
// }

// const responsee: EventResponse[] = [];
const EventsPage: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { readAll } = useEvents();
  const { createOne } = usesubEvens();
  const [items, setItems] = React.useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Event | null>(null);

  const fetchEvents = async (): Promise<Event[]> => {
    const response = await readAll();
    console.log('API Response:', response.data?.items); // Debug the raw response
    return response.data?.items || [];
  };

  const handleOpenDialog = (item: Event) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleViewDetails = () => {
    // const eventId = Number(selectedItem?.id);
    const defaultValues: CreateOneInputSub = {
      eventId: Number(selectedItem?.id),
      userId: Number(user?.id) || 0,
    };

    createOne(defaultValues, {
      displayProgress: true,
      displaySuccess: true,
    })
      .then((response) => {
        console.log('Subscription created:', response);
      })
      .catch((error) => {
        console.error('Error creating subscription:', error);
      });

    handleCloseDialog();
  };

  React.useEffect(() => {
    const loadEvents = async () => {
      const response = await fetchEvents();
      setItems(response);
    };
    loadEvents();
  }, []);

  // Use another useEffect to log items after they've been updated
  React.useEffect(() => {
    console.log('Updated items:', items);
  }, [items]);

  const { t } = useTranslation(['user']);
  return (
    <>
      <PageHeader
        // title={t(`user:${Labels.Users.ReadAll}`)}
        title="Events List"
        action={{
          label: t(`user:${Labels.Users.NewOne}`),
          startIcon: <Add />,
          // onClick: () => router.push(Routes.Users.CreateOne),
          onClick: () => router.push('events/create'),
          permission: {
            entity: Namespaces.Users,
            action: CRUD_ACTION.CREATE,
          },
        }}
      />
      {/* <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: t(`user:${Labels.Users.Items}`) },
        ]}
      /> */}
      {/* <EventsTable /> */}

      <ComponentBlock>
        <Paper variant="outlined" sx={{ width: 1 }}>
          <List>
            {items.map((item) => (
              <ListItemButton key={item.id} onClick={() => handleOpenDialog(item)}>
                <ListItemAvatar>
                  <Avatar>
                    {/* <Iconify icon="ic:baseline-image" width={24} /> */}
                    {item.title[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={`Location : ${item.location} - Date : ${item.date} - Max Attendees : ${item.maxAttendees} `}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </ComponentBlock>

      <ConfirmDialog
        title="Event Details"
        open={isDialogOpen}
        onClose={handleCloseDialog}
        action={
          user?.id ? (
            <Button variant="contained" color="primary" onClick={handleViewDetails}>
              register for the event
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(Routes.Auth.Login)}
            >
              Login to Register
            </Button>
          )
        }
        content={
          selectedItem && (
            <>
              <p>
                <strong>Title:</strong> {selectedItem.title}
              </p>
              <p>
                <strong>Location:</strong> {selectedItem.location}
              </p>
              <p>
                <strong>Date:</strong> {selectedItem.date}
              </p>
              <p>
                <strong>Max Attendees:</strong> {selectedItem.maxAttendees}
              </p>
            </>
          )
        }
      />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'user', 'common'])),
  },
});

// export default withAuth(
//   withPermissions(EventsPage, {
//     requiredPermissions: {
//       entity: Namespaces.Users,
//       action: CRUD_ACTION.READ,
//     },
//     redirectUrl: Routes.Permissions.Forbidden,
//   }),
//   {
//     mode: AUTH_MODE.LOGGED_IN,
//     redirectUrl: Routes.Auth.Login,
//   }
// );

export default EventsPage;
