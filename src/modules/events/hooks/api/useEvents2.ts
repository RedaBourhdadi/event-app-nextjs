import ApiRoutes from '@common/defs/api-routes';
// import { ROLE } from '@modules/permissions/defs/types';
import { Event } from '@modules/events/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';

export interface CreateOneInput {
  title: string;
  location: string;
  date: string;
  maxAttendees: number;
  userId: number;
}

export interface UpdateOneInput {
  title: string;
  location: string;
  date: Date;
  maxAttendees: number;
  userId: number;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useEvents2: UseItems<Event, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Events;
  // console.log('useEvents');
  // console.log(apiRoutes);
  // console.log(CreateOneInput);
  // console.log(opts);
  const useItemsHook = useItems<Event, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  // console.log(useItemsHook);

  return useItemsHook;
};

export default useEvents2;
