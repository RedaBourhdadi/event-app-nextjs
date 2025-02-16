import ApiRoutes from '@common/defs/api-routes';
import { Attendee } from '@modules/attendee/defs/types';
import useApi, { ApiResponse, FetchApiOptions } from '@common/hooks/useApi';
import { Id } from '@common/defs/types';
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
  createOne: (
    _input: CreateOneInput,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<{ item: Attendee }>>;
  readOne: (id: Id, options?: FetchApiOptions) => Promise<ApiResponse<{ item: Attendee }>>;
  readAll: (options?: FetchApiOptions) => Promise<ApiResponse<{ items: Attendee[] }>>;
  updateOne: (
    id: Id,
    _input: UpdateOneInput,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<{ item: Attendee }>>;
  deleteOne: (id: Id, options?: FetchApiOptions) => Promise<ApiResponse<{ item: Attendee | null }>>;
  deleteMulti: (ids: Id[], options?: FetchApiOptions) => Promise<ApiResponse<null>>;
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

  const createOne = async (
    input: CreateOneInput,
    options?: FetchApiOptions
  ): Promise<ApiResponse<{ item: Attendee }>> => {
    const formData = new FormData();
    // formData.append('file', input.file);
    const response = await fetchApi<{ item: Attendee }>(ApiRoutes.Uploads.CreateOne, {
      method: 'POST',
      data: formData,
      ...options,
    });

    if (response.success) {
      mutate();
    }

    return response;
  };

  const readOne = async (id: Id, options?: FetchApiOptions) => {
    const response = await fetchApi<{ item: Attendee }>(
      ApiRoutes.Uploads.ReadOne.replace('{id}', id.toString()),
      options
    );
    return response;
  };

  const updateOne = async (
    id: Id,
    input: UpdateOneInput,
    options?: FetchApiOptions
  ): Promise<ApiResponse<{ item: Attendee }>> => {
    const formData = new FormData();
    // formData.append('file', input.file);
    const response = await fetchApi<{ item: Attendee }>(
      ApiRoutes.Uploads.UpdateOne.replace('{id}', id.toString()),
      {
        method: 'POST',
        data: formData,
        ...options,
      }
    );

    if (response.success) {
      mutate();
    }

    return response;
  };

  const deleteOne = async (id: Id, options?: FetchApiOptions) => {
    const response = await fetchApi<{ item: Attendee }>(
      ApiRoutes.Uploads.DeleteOne.replace('{id}', id.toString()),
      {
        method: 'DELETE',
        ...options,
      }
    );

    if (response.success) {
      mutate();
    }

    return response;
  };

  const deleteMulti = async (ids: Id[], options?: FetchApiOptions) => {
    const response = await fetchApi<null>(ApiRoutes.Uploads.ReadAll, {
      method: 'DELETE',
      data: { ids },
      ...options,
    });

    if (response.success) {
      mutate();
    }

    return response;
  };

  return {
    items,
    createOne,
    readOne,
    readAll,
    updateOne,
    deleteOne,
    deleteMulti,
  };
};

export default useEvents;
