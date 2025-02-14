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
  CreateArchivedCartRequest,
  CreateCartRequest,
  CreateCartResponse,
  GetArchivedCartResponse,
  GetCartResponse,
  ProblemDetails,
} from '.././model';
import { orvalApiClient } from '.././api-client';

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const createArchivedCart = (
  createArchivedCartRequest: CreateArchivedCartRequest,
  options?: SecondParameter<typeof orvalApiClient>,
  signal?: AbortSignal,
) => {
  return orvalApiClient<void>(
    {
      url: `/archived-carts`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: createArchivedCartRequest,
      signal,
    },
    options,
  );
};

export const getCreateArchivedCartMutationOptions = <
  TData = Awaited<ReturnType<typeof createArchivedCart>>,
  TError = ProblemDetails,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    TData,
    TError,
    { data: CreateArchivedCartRequest },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}) => {
  const mutationKey = ['createArchivedCart'];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createArchivedCart>>,
    { data: CreateArchivedCartRequest }
  > = (props) => {
    const { data } = props ?? {};

    return createArchivedCart(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions } as UseMutationOptions<
    TData,
    TError,
    { data: CreateArchivedCartRequest },
    TContext
  >;
};

export type CreateArchivedCartMutationResult = NonNullable<
  Awaited<ReturnType<typeof createArchivedCart>>
>;
export type CreateArchivedCartMutationBody = CreateArchivedCartRequest;
export type CreateArchivedCartMutationError = ProblemDetails;

export const useCreateArchivedCart = <
  TData = Awaited<ReturnType<typeof createArchivedCart>>,
  TError = ProblemDetails,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    TData,
    TError,
    { data: CreateArchivedCartRequest },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseMutationResult<
  TData,
  TError,
  { data: CreateArchivedCartRequest },
  TContext
> => {
  const mutationOptions = getCreateArchivedCartMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getArchivedCart = (
  options?: SecondParameter<typeof orvalApiClient>,
  signal?: AbortSignal,
) => {
  return orvalApiClient<GetArchivedCartResponse>(
    { url: `/archived-carts`, method: 'GET', signal },
    options,
  );
};

export const getGetArchivedCartQueryKey = () => {
  return [`/archived-carts`] as const;
};

export const getGetArchivedCartQueryOptions = <
  TData = Awaited<ReturnType<typeof getArchivedCart>>,
  TError = ProblemDetails,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getArchivedCart>>, TError, TData>
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetArchivedCartQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getArchivedCart>>> = ({
    signal,
  }) => getArchivedCart(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getArchivedCart>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetArchivedCartQueryResult = NonNullable<
  Awaited<ReturnType<typeof getArchivedCart>>
>;
export type GetArchivedCartQueryError = ProblemDetails;

export function useGetArchivedCart<
  TData = Awaited<ReturnType<typeof getArchivedCart>>,
  TError = ProblemDetails,
>(options: {
  query: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getArchivedCart>>, TError, TData>
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getArchivedCart>>,
        TError,
        TData
      >,
      'initialData'
    >;
  request?: SecondParameter<typeof orvalApiClient>;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetArchivedCart<
  TData = Awaited<ReturnType<typeof getArchivedCart>>,
  TError = ProblemDetails,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getArchivedCart>>, TError, TData>
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getArchivedCart>>,
        TError,
        TData
      >,
      'initialData'
    >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetArchivedCart<
  TData = Awaited<ReturnType<typeof getArchivedCart>>,
  TError = ProblemDetails,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getArchivedCart>>, TError, TData>
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetArchivedCart<
  TData = Awaited<ReturnType<typeof getArchivedCart>>,
  TError = ProblemDetails,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getArchivedCart>>, TError, TData>
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetArchivedCartQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const createCart = (
  createCartRequest: CreateCartRequest,
  options?: SecondParameter<typeof orvalApiClient>,
) => {
  return orvalApiClient<CreateCartResponse>(
    {
      url: `/carts`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      data: createCartRequest,
    },
    options,
  );
};

export const getCreateCartMutationOptions = <
  TData = Awaited<ReturnType<typeof createCart>>,
  TError = ProblemDetails,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    TData,
    TError,
    { data: CreateCartRequest },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}) => {
  const mutationKey = ['createCart'];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createCart>>,
    { data: CreateCartRequest }
  > = (props) => {
    const { data } = props ?? {};

    return createCart(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions } as UseMutationOptions<
    TData,
    TError,
    { data: CreateCartRequest },
    TContext
  >;
};

export type CreateCartMutationResult = NonNullable<
  Awaited<ReturnType<typeof createCart>>
>;
export type CreateCartMutationBody = CreateCartRequest;
export type CreateCartMutationError = ProblemDetails;

export const useCreateCart = <
  TData = Awaited<ReturnType<typeof createCart>>,
  TError = ProblemDetails,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    TData,
    TError,
    { data: CreateCartRequest },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseMutationResult<TData, TError, { data: CreateCartRequest }, TContext> => {
  const mutationOptions = getCreateCartMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getCart = (
  options?: SecondParameter<typeof orvalApiClient>,
  signal?: AbortSignal,
) => {
  return orvalApiClient<GetCartResponse>(
    { url: `/carts`, method: 'GET', signal },
    options,
  );
};

export const getGetCartQueryKey = () => {
  return [`/carts`] as const;
};

export const getGetCartQueryOptions = <
  TData = Awaited<ReturnType<typeof getCart>>,
  TError = ProblemDetails,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetCartQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getCart>>> = ({
    signal,
  }) => getCart(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getCart>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetCartQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCart>>
>;
export type GetCartQueryError = ProblemDetails;

export function useGetCart<
  TData = Awaited<ReturnType<typeof getCart>>,
  TError = ProblemDetails,
>(options: {
  query: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getCart>>,
        TError,
        TData
      >,
      'initialData'
    >;
  request?: SecondParameter<typeof orvalApiClient>;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCart<
  TData = Awaited<ReturnType<typeof getCart>>,
  TError = ProblemDetails,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getCart>>,
        TError,
        TData
      >,
      'initialData'
    >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCart<
  TData = Awaited<ReturnType<typeof getCart>>,
  TError = ProblemDetails,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetCart<
  TData = Awaited<ReturnType<typeof getCart>>,
  TError = ProblemDetails,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetCartQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const removeFromCart = (
  options?: SecondParameter<typeof orvalApiClient>,
) => {
  return orvalApiClient<void>({ url: `/carts`, method: 'DELETE' }, options);
};

export const getRemoveFromCartMutationOptions = <
  TData = Awaited<ReturnType<typeof removeFromCart>>,
  TError = ProblemDetails,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<TData, TError, void, TContext>;
  request?: SecondParameter<typeof orvalApiClient>;
}) => {
  const mutationKey = ['removeFromCart'];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof removeFromCart>>,
    void
  > = () => {
    return removeFromCart(requestOptions);
  };

  return { mutationFn, ...mutationOptions } as UseMutationOptions<
    TData,
    TError,
    void,
    TContext
  >;
};

export type RemoveFromCartMutationResult = NonNullable<
  Awaited<ReturnType<typeof removeFromCart>>
>;

export type RemoveFromCartMutationError = ProblemDetails;

export const useRemoveFromCart = <
  TData = Awaited<ReturnType<typeof removeFromCart>>,
  TError = ProblemDetails,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<TData, TError, void, TContext>;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseMutationResult<TData, TError, void, TContext> => {
  const mutationOptions = getRemoveFromCartMutationOptions(options);

  return useMutation(mutationOptions);
};
