import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import { useRouter } from 'next/router';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useEffect, useState } from 'react';
import useProgressBar from '@common/hooks/useProgressBar';
import { Event } from '@modules/events/defs/types';
import useEvents2 from '@modules/events/hooks/api/useEvents2';
import { CRUD_ACTION, Id } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import UpdateUserForm from '@modules/events/components/partials/UpdateUserForm';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const EventsPage: NextPage = () => {
  const router = useRouter();
  const { start, stop } = useProgressBar();
  const { readOne } = useEvents2();
  const [loaded, setLoaded] = useState(false);
  const [item, setItem] = useState<null | Event>(null);
  const id: Id = Number(router.query.id);
  const { t } = useTranslation(['user', 'common']);

  useEffect(() => {
    if (loaded) {
      stop();
    } else {
      start();
    }
  }, [loaded]);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    if (id) {
      const { data } = await readOne(id);
      console.log(data);
      if (data) {
        if (data.item) {
          setItem(data.item);
        }
      }
      setLoaded(true);
    }
  };

  return (
    <>
      <PageHeader title={t(`user:${Labels.Users.EditOne}`)} />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: t(`user:${Labels.Users.Items}`), href: Routes.Users.ReadAll },
          { name: item ? item.email : t(`user:${Labels.Users.EditOne}`) },
        ]}
      />

      {item && <UpdateUserForm item={item} />}
    </>
  );
};

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
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
//       action: CRUD_ACTION.UPDATE,
//     },
//     redirectUrl: Routes.Permissions.Forbidden,
//   }),
//   {
//     mode: AUTH_MODE.LOGGED_IN,
//     redirectUrl: Routes.Auth.Login,
//   }
// );

export default withAuth(EventsPage, { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });
