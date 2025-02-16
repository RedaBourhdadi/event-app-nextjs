import ApiRoutes from '@common/defs/api-routes';
// import { ROLE } from '@modules/permissions/defs/types';
import { Attendee } from '@modules/attendee/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';
import { Event } from '@modules/events/defs/types';

export interface CreateOneInput {
  eventId: number;
  userId: number;
  event: Event;
}

export interface UpdateOneInput {
  eventId: number;
  userId: number;
  event: Event;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useEvents2: UseItems<Attendee, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Attendees;
  const useItemsHook = useItems<Attendee, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useEvents2;
