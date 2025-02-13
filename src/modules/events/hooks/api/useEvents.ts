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
  createOne: (
    _input: CreateOneInput,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<{ item: Event }>>;
  readOne: (id: Id, options?: FetchApiOptions) => Promise<ApiResponse<{ item: Event }>>;
  readAll: (options?: FetchApiOptions) => Promise<ApiResponse<{ items: Event[] }>>;
  updateOne: (
    id: Id,
    _input: UpdateOneInput,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<{ item: Event }>>;
  deleteOne: (id: Id, options?: FetchApiOptions) => Promise<ApiResponse<{ item: Event | null }>>;
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

  const createOne = async (
    input: CreateOneInput,
    options?: FetchApiOptions
  ): Promise<ApiResponse<{ item: Event }>> => {
    const formData = new FormData();
    // formData.append('file', input.file);
    const response = await fetchApi<{ item: Event }>(ApiRoutes.Uploads.CreateOne, {
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
    const response = await fetchApi<{ item: Event }>(
      ApiRoutes.Uploads.ReadOne.replace('{id}', id.toString()),
      options
    );

    return response;
  };
  const readAll = async (options?: FetchApiOptions) => {
    const response = await fetchApi<{ items: Event[] }>('/', options);

    if (response.success) {
      setItems(response.data?.items ?? null);
    }

    return response;
  };

  const updateOne = async (
    id: Id,
    input: UpdateOneInput,
    options?: FetchApiOptions
  ): Promise<ApiResponse<{ item: Event }>> => {
    const formData = new FormData();
    // formData.append('file', input.file);
    const response = await fetchApi<{ item: Event }>(
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
    const response = await fetchApi<{ item: Event }>(
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
