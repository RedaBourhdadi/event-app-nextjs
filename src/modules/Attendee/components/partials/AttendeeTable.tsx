import Routes from '@common/defs/routes';
import ItemsTable from '@modules/attendee/components/partials/ItemsTable';
// import ItemsTable from '@common/components/partials/ItemsTable';
import { Attendee } from '@modules/attendee/defs/types';
import useEvents2, { CreateOneInput, UpdateOneInput } from '@modules/attendee/hooks/api/useEvents2';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';
import { CrudRow } from '@common/defs/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

//
interface Row extends CrudRow {
  title: string;
  location: string;
  date: string;
  maxAttendees: number;
  userId: number;
}

const AttendeeTable = () => {
  const { t, i18n } = useTranslation(['user']);
  const columns: GridColumns<Row> = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 100,
    // },

    {
      field: 'title',
      headerName: t('user:list.title'),
      flex: 1,
    },
    {
      field: 'location',
      headerName: t('user:list.email'),
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'date',
      flex: 1,
    },
    {
      field: 'maxAttendees',
      headerName: 'max Attendees',
      flex: 1,
    },
  ];
  const [translatedColumns, setTranslatedColumns] = useState<GridColumns<Row>>(columns);

  useEffect(() => {
    setTranslatedColumns(columns);
  }, [t, i18n.language]);

  const itemToRow = (item: Attendee): Row => {
    return {
      id: item.event.id,
      location: item.event.location,
      title: item.event.title,
      date: item.event.date,
      maxAttendees: item.event.maxAttendees,
      userId: item.event.userId,
    };
  };

  return (
    <>
      <ItemsTable<Attendee, CreateOneInput, UpdateOneInput, Row>
        namespace={Namespaces.Users}
        routes={Routes.Events}
        useItems={useEvents2}
        columns={translatedColumns}
        itemToRow={itemToRow}
        // showEdit={() => true}
        // showDelete={() => true}
        exportable
        showLock
      />
    </>
  );
};

export default AttendeeTable;
