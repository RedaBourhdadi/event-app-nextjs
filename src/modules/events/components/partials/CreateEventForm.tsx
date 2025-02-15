import { RHFTextField, RHFDatePicker2 } from '@common/components/lib/react-hook-form';
import CreateCrudItemForm from '@common/components/partials/CreateCrudItemForm';
import Routes from '@common/defs/routes';
import { ItemResponse } from '@common/hooks/useItems';
import { Event } from '@modules/events/defs/types';
import useEvents2, { CreateOneInput } from '@modules/events/hooks/api/useEvents2';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';
import useAuth from '@modules/auth/hooks/api/useAuth';

interface CreateEventFormProps {}

const CreateEventForm = (_props: CreateEventFormProps) => {
  console.log('_props');
  const router = useRouter();
  const { user } = useAuth();
  console.log(user?.id);
  const U = user?.id || 0;

  const schema = Yup.object().shape({
    title: Yup.string().required('This field is required'),
    location: Yup.string().required('This field is required'),
    date: Yup.string().required('The date is required'),
    maxAttendees: Yup.number().required('This field is required'),
  });
  const defaultValues: CreateOneInput = {
    title: 'test',
    location: 'tesst',
    date: '2025-03-13',
    maxAttendees: 3,
    userId: U,
    // userId: user?.id || 0,

    // role: ROLE.Event,
  };
  const onPostSubmit = async (
    _data: CreateOneInput,
    response: ItemResponse<Event>,
    _methods: UseFormReturn<CreateOneInput>
  ) => {
    try {
      if (response.success) {
        router.push(Routes.Events.ReadAll);
      } else if (response.errors) {
        console.error('Submission error:', response.errors);
      }
    } catch (errors) {
      console.error('Unexpected error:', errors);
    }
  };
  return (
    <>
      <CreateCrudItemForm<Event, CreateOneInput>
        routes={Routes.Events}
        useItems={useEvents2}
        schema={schema}
        defaultValues={defaultValues}
        onPostSubmit={onPostSubmit}
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
      </CreateCrudItemForm>
    </>
  );
};

export default CreateEventForm;
