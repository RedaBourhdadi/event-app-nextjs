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
import useEvents from '@modules/events/hooks/api/useEvents';
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
const UsersPage: NextPage = () => {
  const router = useRouter();
  const { readAll } = useEvents();
  const [items, setItems] = React.useState<Event[]>([]);

  const fetchEvents = async (): Promise<Event[]> => {
    const response = await readAll();
    console.log('API Response:', response.data?.items); // Debug the raw response
    return response.data?.items || [];
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
        title={t(`user:${Labels.Users.ReadAll}`)}
        action={{
          label: t(`user:${Labels.Users.NewOne}`),
          startIcon: <Add />,
          onClick: () => router.push(Routes.Users.CreateOne),
          permission: {
            entity: Namespaces.Users,
            action: CRUD_ACTION.CREATE,
          },
        }}
      />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: t(`user:${Labels.Users.Items}`) },
        ]}
      />
      {/* <EventsTable /> */}

      <ComponentBlock>
        <Paper variant="outlined" sx={{ width: 1 }}>
          <List>
            {items.map((item) => (
              <ListItemButton key={item.id}>
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
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'user', 'common'])),
  },
});

export default withAuth(
  withPermissions(UsersPage, {
    requiredPermissions: {
      entity: Namespaces.Users,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
