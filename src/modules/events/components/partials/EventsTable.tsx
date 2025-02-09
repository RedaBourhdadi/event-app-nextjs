import Routes from '@common/defs/routes';
import ItemsTable from '@common/components/partials/ItemsTable';
import { Event } from '@modules/events/defs/types';
import useUsers, { CreateOneInput, UpdateOneInput } from '@modules/events/hooks/api/useUsers';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';
import { CrudRow } from '@common/defs/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface Row extends CrudRow {
  email: string;
  createdAt: string;
  roles: string[];
}

const UsersTable = () => {
  const { t, i18n } = useTranslation(['user']);
  const columns: GridColumns<Row> = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'email',
      headerName: t('user:list.email'),
      flex: 1,
    },
    {
      field: 'roles',
      headerName: t('user:list.role'),
      type: 'boolean',
      width: 125,
      renderCell: (params) => {
        const { row: item } = params;
        const { roles } = item;
        if (roles.includes('admin')) {
          return <CheckCircleIcon color="success" />;
        }
        return <CancelIcon color="error" />;
      },
    },
    {
      field: 'createdAt',
      headerName: t('user:list.created_at'),
      type: 'dateTime',
      flex: 1,
      renderCell: (params) => dayjs(params.row.createdAt).format('DD/MM/YYYY hh:mm'),
    },
  ];
  const [translatedColumns, setTranslatedColumns] = useState<GridColumns<Row>>(columns);

  useEffect(() => {
    setTranslatedColumns(columns);
  }, [t, i18n.language]);

  const itemToRow = (item: Event): Row => {
    return {
      id: item.location,
      email: item.title,
      createdAt: item.date,
      roles: item.max_attendees,
    };
  };

  return (
    <>
      <ItemsTable<Event, CreateOneInput, UpdateOneInput, Row>
        namespace={Namespaces.Users}
        routes={Routes.Events}
        useItems={useUsers}
        columns={translatedColumns}
        itemToRow={itemToRow}
        showEdit={() => false}
        showDelete={() => false}
        showLock
        exportable
      />
    </>
  );
};

export default UsersTable;
