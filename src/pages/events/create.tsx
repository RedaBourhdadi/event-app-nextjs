import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
// import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
// import { CRUD_ACTION } from '@common/defs/types';
// import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
// import CreateUserStepper from '@modules/events/components/partials/CreateEventStepper';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import CreateUserForm from '@modules/events/components/partials/CreateEventForm';

const UsersPage: NextPage = () => {
  const { t } = useTranslation(['event', 'common']);

  return (
    <>
      <PageHeader title={t(`event:${Labels.Events.CreateNewOne}`)} />
      <CustomBreadcrumbs
        links={[
          { name: t('common:Home'), href: Routes.Common.Home },
          { name: t(`event:${Labels.Events.Items}`), href: Routes.Events.ReadAll },
          { name: t(`event:${Labels.Events.NewOne}`) },
        ]}
      />
      {/* <CreateUserStepper /> */}
      <CreateUserForm />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'event', 'common'])),
  },
});

// export default withAuth(
//   withPermissions(UsersPage, {
//     requiredPermissions: {
//       entity: Namespaces.Users,
//       action: CRUD_ACTION.CREATE,
//     },
//     redirectUrl: Routes.Permissions.Forbidden,
//   }),
//   {
//     mode: AUTH_MODE.LOGGED_IN,
//     redirectUrl: Routes.Auth.Login,
//   }
// );

export default withAuth(UsersPage, { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });
