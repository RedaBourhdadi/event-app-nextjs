import { RHFTextField, RHFDatePicker2 } from '@common/components/lib/react-hook-form';
import UpdateCrudItemForm from '@common/components/partials/UpdateCrudItemForm';
import Routes from '@common/defs/routes';
import { ROLES_OPTIONS } from '@modules/permissions/defs/options';
import { ROLE } from '@modules/permissions/defs/types';
import { Event } from '@modules/events/defs/types';
import useEvents2, { UpdateOneInput } from '@modules/events/hooks/api/useEvents2';
import { Grid, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

interface UpdateEventFormProps {
  item: Event;
}

const UpdateEventForm = (props: UpdateEventFormProps) => {
  const { item } = props;
  const { t } = useTranslation(['common']);
  const schema = Yup.object().shape({
    title: Yup.string().required('This field is required'),
    location: Yup.string().required('This field is required'),
    date: Yup.string().required('The date is required'),
    maxAttendees: Yup.number().required('This field is required'),
  });
  const defaultValues: UpdateOneInput = {
    title: item.title,
    location: item.location,
    date: new Date(item.date).toISOString().split('T')[0],
    maxAttendees: item.maxAttendees,
    userId: item.userId,
  };
  return (
    <>
      <UpdateCrudItemForm<Event, UpdateOneInput>
        item={item}
        routes={Routes.Events}
        useItems={useEvents2}
        schema={schema}
        defaultValues={defaultValues}
      >
        <Grid container spacing={3} sx={{ padding: 6 }}>
          <Grid item xs={6}>
            <RHFTextField name="title" label="title" />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField name="location" label="location" type="text" />
          </Grid>
          <Grid item xs={6}>
            <RHFDatePicker2 name="date" />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField name="maxAttendees" label="maxAttendees" type="number" />
          </Grid>
        </Grid>
      </UpdateCrudItemForm>
    </>
  );
};

export default UpdateEventForm;
