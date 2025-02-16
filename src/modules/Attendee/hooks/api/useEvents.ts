import { Attendee } from '@modules/attendee/defs/types';
import useApi, { ApiResponse, FetchApiOptions } from '@common/hooks/useApi';
import useSWRImmutable from 'swr';
import { useEffect, useState } from 'react';
import { Event } from '@modules/events/defs/types';

export interface CreateOneInput {
  // name?: string;
  // file: File;
  eventId: number;
  userId: number;
  event?: Event;
}

export type UpdateOneInput = CreateOneInput;

export interface UpsertUploadsInput extends CreateOneInput {}

interface UseUploadsResponse {
  items: Attendee[] | null;
  readAll: (options?: FetchApiOptions) => Promise<ApiResponse<{ items: Attendee[] }>>;
}

interface UseUploadsOptions {
  fetchItems?: boolean;
}
const defaultOptions = {
  fetchItems: false,
};

const useEvents = (opts: UseUploadsOptions = defaultOptions): UseUploadsResponse => {
  const fetchApi = useApi();
  const [items, setItems] = useState<Attendee[] | null>(null);

  const readAll = async (options?: FetchApiOptions) => {
    const response = await fetchApi<{ items: Attendee[] }>('/Attendee', options);

    if (response.success) {
      setItems(response.data?.items ?? null);
    }

    return response;
  };

  const { data, mutate } = useSWRImmutable<Attendee[] | null>(
    opts.fetchItems ? '/Attendee' : null,
    async () => {
      const response = await readAll();
      return response.data?.items ?? null;
    }
  );

  useEffect(() => {
    setItems(data ?? null);
  }, [data]);

  return {
    items,
    readAll,
  };
};

export default useEvents;
