import React from 'react';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';

import Routes from '@common/defs/routes';
// import EventsTable from '@modules/events/components/partials/EventsTable';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useRouter } from 'next/router';
import { Add, Login } from '@mui/icons-material';
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
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import useEvents, { CreateOneInput } from '@modules/events/hooks/api/useEvents';
import { usesubEvens, CreateOneInputSub } from '@modules/events/hooks/api/useEvents2';
import { Event } from '@modules/events/defs/types';
import ComponentBlock from './events/component-block';

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
    // console.log(response.data?.items);
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

  const { t } = useTranslation(['user']);
  return (
    <>
      <PageHeader
        // title={t(`user:${Labels.Users.ReadAll}`)}
        title="Events List"
        action={
          user?.id
            ? {
                label: t(`user:${Labels.Users.NewOne}`),
                startIcon: <Add />,
                // onClick: () => router.push(Routes.Users.CreateOne),
                onClick: () => router.push('events/create'),
                // permission: {
                //   entity: Namespaces.Users,
                //   action: CRUD_ACTION.CREATE,
                // },
              }
            : {
                label: t(`user:${Labels.Users.NewOne}`),
                startIcon: <Login />,
                onClick: () => router.push('/auth/login'),
              }
        }
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
                  secondary={
                    <span style={{ display: 'flex', gap: '16px' }}>
                      <span>
                        <strong>Location:</strong> {item.location}
                      </span>
                      <span>
                        <strong>Date:</strong> {item.date}
                      </span>
                      <span>
                        <strong>Attendees:</strong> {item.attendeesCount}/{item.maxAttendees}
                      </span>
                    </span>
                  }
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
        action={(() => {
          if (!user?.id) {
            return (
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push(Routes.Auth.Login)}
              >
                Login to Register
              </Button>
            );
          }
          if ((selectedItem?.attendeesCount ?? 0) >= (selectedItem?.maxAttendees ?? 0)) {
            return (
              <Button variant="contained" color="error" disabled>
                Event is Full
              </Button>
            );
          }
          return (
            <Button variant="contained" color="primary" onClick={handleViewDetails}>
              Register for the Event
            </Button>
          );
        })()}
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
                <strong>Attendees: </strong>
                {selectedItem?.attendeesCount}
                <span>/</span>
                {selectedItem?.maxAttendees}
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
