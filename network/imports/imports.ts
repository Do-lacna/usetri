/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import type {
  DiscountPriceImportBatchDto,
  GetDiscountPriceImportsParams,
  GetDiscountPriceImportsResponse,
  PatchDiscountImportRequest,
  UploadDiscountPricesJsonBody,
  UploadDiscountPricesJsonParams,
} from '.././model';
import { orvalApiClient } from '.././api-client';

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const getDiscountPriceImports = (
  params?: GetDiscountPriceImportsParams,
  options?: SecondParameter<typeof orvalApiClient>,
  signal?: AbortSignal,
) => {
  return orvalApiClient<GetDiscountPriceImportsResponse>(
    { url: `/admin/discount-price-imports`, method: 'GET', params, signal },
    options,
  );
};

export const getGetDiscountPriceImportsQueryKey = (
  params?: GetDiscountPriceImportsParams,
) => {
  return [
    `/admin/discount-price-imports`,
    ...(params ? [params] : []),
  ] as const;
};

export const getGetDiscountPriceImportsQueryOptions = <
  TData = Awaited<ReturnType<typeof getDiscountPriceImports>>,
  TError = unknown,
>(
  params?: GetDiscountPriceImportsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getDiscountPriceImports>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof orvalApiClient>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetDiscountPriceImportsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getDiscountPriceImports>>
  > = ({ signal }) => getDiscountPriceImports(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getDiscountPriceImports>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetDiscountPriceImportsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getDiscountPriceImports>>
>;
export type GetDiscountPriceImportsQueryError = unknown;

export function useGetDiscountPriceImports<
  TData = Awaited<ReturnType<typeof getDiscountPriceImports>>,
  TError = unknown,
>(
  params: undefined | GetDiscountPriceImportsParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getDiscountPriceImports>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getDiscountPriceImports>>,
          TError,
          TData
        >,
        'initialData'
      >;
    request?: SecondParameter<typeof orvalApiClient>;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetDiscountPriceImports<
  TData = Awaited<ReturnType<typeof getDiscountPriceImports>>,
  TError = unknown,
>(
  params?: GetDiscountPriceImportsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getDiscountPriceImports>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getDiscountPriceImports>>,
          TError,
          TData
        >,
        'initialData'
      >;
    request?: SecondParameter<typeof orvalApiClient>;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetDiscountPriceImports<
  TData = Awaited<ReturnType<typeof getDiscountPriceImports>>,
  TError = unknown,
>(
  params?: GetDiscountPriceImportsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getDiscountPriceImports>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof orvalApiClient>;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetDiscountPriceImports<
  TData = Awaited<ReturnType<typeof getDiscountPriceImports>>,
  TError = unknown,
>(
  params?: GetDiscountPriceImportsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getDiscountPriceImports>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof orvalApiClient>;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetDiscountPriceImportsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const uploadDiscountPricesJson = (
  uploadDiscountPricesJsonBody: UploadDiscountPricesJsonBody,
  params?: UploadDiscountPricesJsonParams,
  options?: SecondParameter<typeof orvalApiClient>,
  signal?: AbortSignal,
) => {
  const formData = new FormData();
  if (uploadDiscountPricesJsonBody.jsonFile !== undefined) {
    formData.append('jsonFile', uploadDiscountPricesJsonBody.jsonFile);
  }

  return orvalApiClient<DiscountPriceImportBatchDto>(
    {
      url: `/admin/discount-price-imports`,
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData,
      params,
      signal,
    },
    options,
  );
};

export const getUploadDiscountPricesJsonMutationOptions = <
  TData = Awaited<ReturnType<typeof uploadDiscountPricesJson>>,
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    TData,
    TError,
    {
      data: UploadDiscountPricesJsonBody;
      params?: UploadDiscountPricesJsonParams;
    },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}) => {
  const mutationKey = ['uploadDiscountPricesJson'];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof uploadDiscountPricesJson>>,
    {
      data: UploadDiscountPricesJsonBody;
      params?: UploadDiscountPricesJsonParams;
    }
  > = (props) => {
    const { data, params } = props ?? {};

    return uploadDiscountPricesJson(data, params, requestOptions);
  };

  return { mutationFn, ...mutationOptions } as UseMutationOptions<
    TData,
    TError,
    {
      data: UploadDiscountPricesJsonBody;
      params?: UploadDiscountPricesJsonParams;
    },
    TContext
  >;
};

export type UploadDiscountPricesJsonMutationResult = NonNullable<
  Awaited<ReturnType<typeof uploadDiscountPricesJson>>
>;
export type UploadDiscountPricesJsonMutationBody = UploadDiscountPricesJsonBody;
export type UploadDiscountPricesJsonMutationError = unknown;

export const useUploadDiscountPricesJson = <
  TData = Awaited<ReturnType<typeof uploadDiscountPricesJson>>,
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    TData,
    TError,
    {
      data: UploadDiscountPricesJsonBody;
      params?: UploadDiscountPricesJsonParams;
    },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseMutationResult<
  TData,
  TError,
  {
    data: UploadDiscountPricesJsonBody;
    params?: UploadDiscountPricesJsonParams;
  },
  TContext
> => {
  const mutationOptions = getUploadDiscountPricesJsonMutationOptions(options);

  return useMutation(mutationOptions);
};
export const patchDiscountImportEntry = (
  batchId: number,
  discountId: number,
  patchDiscountImportRequest: PatchDiscountImportRequest,
  options?: SecondParameter<typeof orvalApiClient>,
) => {
  return orvalApiClient<GetDiscountPriceImportsResponse>(
    {
      url: `/admin/discount-price-imports/${batchId}/${discountId}`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      data: patchDiscountImportRequest,
    },
    options,
  );
};

export const getPatchDiscountImportEntryMutationOptions = <
  TData = Awaited<ReturnType<typeof patchDiscountImportEntry>>,
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    TData,
    TError,
    { batchId: number; discountId: number; data: PatchDiscountImportRequest },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}) => {
  const mutationKey = ['patchDiscountImportEntry'];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchDiscountImportEntry>>,
    { batchId: number; discountId: number; data: PatchDiscountImportRequest }
  > = (props) => {
    const { batchId, discountId, data } = props ?? {};

    return patchDiscountImportEntry(batchId, discountId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions } as UseMutationOptions<
    TData,
    TError,
    { batchId: number; discountId: number; data: PatchDiscountImportRequest },
    TContext
  >;
};

export type PatchDiscountImportEntryMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchDiscountImportEntry>>
>;
export type PatchDiscountImportEntryMutationBody = PatchDiscountImportRequest;
export type PatchDiscountImportEntryMutationError = unknown;

export const usePatchDiscountImportEntry = <
  TData = Awaited<ReturnType<typeof patchDiscountImportEntry>>,
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    TData,
    TError,
    { batchId: number; discountId: number; data: PatchDiscountImportRequest },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseMutationResult<
  TData,
  TError,
  { batchId: number; discountId: number; data: PatchDiscountImportRequest },
  TContext
> => {
  const mutationOptions = getPatchDiscountImportEntryMutationOptions(options);

  return useMutation(mutationOptions);
};
