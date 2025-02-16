import Routes from '@common/defs/routes';
import { CRUD_ACTION, NavGroup } from '@common/defs/types';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import Namespaces from '@common/defs/namespaces';
import { Group, EmojiEvents, EventSeat } from '@mui/icons-material';

export const menuItems: NavGroup[] = [
  {
    text: 'Gestion',
    items: [
      {
        text: 'Your events',
        icon: <EmojiEvents />,
        link: Routes.Events.ReadAll,
      },
      {
        text: 'Participation',
        icon: <EventSeat />,
        link: Routes.Common.Home,
      },
      {
        text: 'Users',
        icon: <Group />,
        link: Routes.Users.ReadAll,
        namespace: Namespaces.Users,
        permission: CRUD_ACTION.READ,
        routes: Routes.Users,
      },
    ],
  },
];
