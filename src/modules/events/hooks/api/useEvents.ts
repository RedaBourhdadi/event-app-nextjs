import ApiRoutes from '@common/defs/api-routes';
import { Event } from '@modules/events/defs/types';
import useApi, { ApiResponse, FetchApiOptions } from '@common/hooks/useApi';
import { Id } from '@common/defs/types';
import useSWRImmutable from 'swr';
import { useEffect, useState } from 'react';

export interface CreateOneInput {
  // name?: string;
  // file: File;
  title: string;
  location: string;
  date: Date;
  maxAttendees: number;
  userId: number;
}

export type UpdateOneInput = CreateOneInput;

export interface UpsertUploadsInput extends CreateOneInput {}

interface UseUploadsResponse {
  items: Event[] | null;
  readAll: (options?: FetchApiOptions) => Promise<ApiResponse<{ items: Event[] }>>;
}

interface UseUploadsOptions {
  fetchItems?: boolean;
}
const defaultOptions = {
  fetchItems: false,
};

const useEvents = (opts: UseUploadsOptions = defaultOptions): UseUploadsResponse => {
  const fetchApi = useApi();

  const { data, mutate } = useSWRImmutable<Event[] | null>(
    opts.fetchItems ? ApiRoutes.Uploads.ReadAll : null,
    async (_url: string) => {
      const response = await readAll();
      return response.data?.items ?? null;
    }
  );

  const [items, setItems] = useState<Event[] | null>(null);

  useEffect(() => {
    setItems(data ?? null);
  }, [data]);

  const readAll = async (options?: FetchApiOptions) => {
    const response = await fetchApi<{ items: Event[] }>('/', options);

    if (response.success) {
      setItems(response.data?.items ?? null);
    }

    return response;
  };

  return {
    items,
    readAll,
  };
};

export default useEvents;
