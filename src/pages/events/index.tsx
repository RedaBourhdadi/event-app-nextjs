import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import EventsTable from '@modules/events/components/partials/EventsTable';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useRouter } from 'next/router';
import { Add } from '@mui/icons-material';
import PageHeader from '@common/components/lib/partials/PageHeader';
import Labels from '@common/defs/labels';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

const EventsPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation(['event']);
  return (
    <>
      <PageHeader
        title={t(`event:${Labels.Events.Items}`)}
        action={{
          label: t(`event:${Labels.Events.CreateNewOne}`),
          startIcon: <Add />,
          onClick: () => router.push(Routes.Events.CreateOne),
        }}
      />
      <CustomBreadcrumbs
        links={[
          { name: t('common:Home'), href: Routes.Common.Home },
          { name: t(`event:${Labels.Events.Items}`) },
        ]}
      />
      <EventsTable />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'event', 'common'])),
  },
});

export default withAuth(EventsPage, { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });
