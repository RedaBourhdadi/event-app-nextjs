import React from 'react';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import { NextPage } from 'next';

import Routes from '@common/defs/routes';
import { useRouter } from 'next/router';
import PageHeader from '@common/components/lib/partials/PageHeader';
import Labels from '@common/defs/labels';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '@common/components/lib/feedbacks/ConfirmDialog';
import { Button, ListItem, Box } from '@mui/material';
import useAuth from '@modules/auth/hooks/api/useAuth';

// @mui
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import useEvents from '@modules/attendee/hooks/api/useEvents';
import useEvents2 from '@modules/attendee/hooks/api/useEvents2';
import { Attendee } from '@modules/attendee/defs/types';
import ComponentBlock from '@modules/events/components/component-block';

// const responsee: EventResponse[] = [];
const ParticipationsPage: NextPage = () => {
  // const { user } = useAuth();
  // const router = useRouter();
  const { readAll } = useEvents();
  const { deleteOne } = useEvents2();
  const [items, setItems] = React.useState<Attendee[]>([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Attendee | null>(null);

  const fetchEvents = async (): Promise<Attendee[]> => {
    const response = await readAll();
    console.log(response.data?.items);
    return response.data?.items || [];
  };

  const handleOpenCancelDialog = (item: Attendee) => {
    setSelectedItem(item);
    setIsCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setIsCancelDialogOpen(false);
    setSelectedItem(null);
  };

  const handleCancelParticipation = async () => {
    if (selectedItem?.id) {
      console.log('selectedItem', selectedItem);
      try {
        await deleteOne(selectedItem.id, {
          displayProgress: true,
          displaySuccess: true,
        });
        // Refresh the events list
        const response = await fetchEvents();
        setItems(response);
      } catch (error) {
        console.error('Error canceling participation:', error);
      }
    }
    handleCloseCancelDialog();
  };

  React.useEffect(() => {
    const loadEvents = async () => {
      const response = await fetchEvents();
      setItems(response);
    };
    loadEvents();
  }, []);

  const { t } = useTranslation(['event']);
  return (
    <>
      <PageHeader
        title={t(`event:${Labels.Events.Items}`)}
        // title="Events List"
        // action={}
      />

      <ComponentBlock>
        <Paper variant="outlined" sx={{ width: 1 }}>
          <List>
            {items.length === 0 ? (
              <ListItem>
                <ListItemText primary="No participations available" />
              </ListItem>
            ) : (
              items.map((item) => (
                <ListItem key={item.id}>
                  <ListItemAvatar>
                    <Avatar>
                      {/* <Iconify icon="ic:baseline-image" width={24} /> */}
                      {item.event?.title[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{item.event?.title}</span>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenCancelDialog(item)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </ComponentBlock>

      <ConfirmDialog
        title="Cancel Participation"
        open={isCancelDialogOpen}
        onClose={handleCloseCancelDialog}
        action={
          <Button onClick={handleCancelParticipation} color="error" variant="contained">
            Confirm
          </Button>
        }
        content={
          <p>
            Are you sure you want to cancel your participation in "{selectedItem?.event?.title}"?
          </p>
        }
      />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'event', 'common'])),
  },
});

export default withAuth(ParticipationsPage, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
