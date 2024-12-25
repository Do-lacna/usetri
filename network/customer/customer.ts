/**
 * Generated by orval v7.3.0 🍺
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
  AddProductBody,
  AddProductToCartResponse,
  GetCartResponse,
  ProblemDetails,
  RemoveFromCartBody,
  RemoveFromCartResponse,
} from '.././model';
import { orvalApiClient } from '.././api-client';

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const addProduct = (
  addProductBody: AddProductBody,
  options?: SecondParameter<typeof orvalApiClient>,
  signal?: AbortSignal,
) => {
  const formData = new FormData();
  if (addProductBody.category_ids !== undefined) {
    addProductBody.category_ids.forEach((value) =>
      formData.append('category_ids', value.toString()),
    );
  }

  return orvalApiClient<AddProductToCartResponse>(
    {
      url: `/cart`,
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData,
      signal,
    },
    options,
  );
};

export const getAddProductMutationOptions = <
  TError = ProblemDetails,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addProduct>>,
    TError,
    { data: AddProductBody },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof addProduct>>,
  TError,
  { data: AddProductBody },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof addProduct>>,
    { data: AddProductBody }
  > = (props) => {
    const { data } = props ?? {};

    return addProduct(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type AddProductMutationResult = NonNullable<
  Awaited<ReturnType<typeof addProduct>>
>;
export type AddProductMutationBody = AddProductBody;
export type AddProductMutationError = ProblemDetails;

export const useAddProduct = <
  TError = ProblemDetails,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addProduct>>,
    TError,
    { data: AddProductBody },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseMutationResult<
  Awaited<ReturnType<typeof addProduct>>,
  TError,
  { data: AddProductBody },
  TContext
> => {
  const mutationOptions = getAddProductMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getCart = (
  options?: SecondParameter<typeof orvalApiClient>,
  signal?: AbortSignal,
) => {
  return orvalApiClient<GetCartResponse>(
    { url: `/cart`, method: 'GET', signal },
    options,
  );
};

export const getGetCartQueryKey = () => {
  return [`/cart`] as const;
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
  > & { queryKey: DataTag<QueryKey, TData> };
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
  queryKey: DataTag<QueryKey, TData>;
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
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetCart<
  TData = Awaited<ReturnType<typeof getCart>>,
  TError = ProblemDetails,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetCart<
  TData = Awaited<ReturnType<typeof getCart>>,
  TError = ProblemDetails,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetCartQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const removeFromCart = (
  removeFromCartBody: RemoveFromCartBody,
  options?: SecondParameter<typeof orvalApiClient>,
) => {
  const formData = new FormData();
  if (removeFromCartBody.category_ids !== undefined) {
    removeFromCartBody.category_ids.forEach((value) =>
      formData.append('category_ids', value.toString()),
    );
  }

  return orvalApiClient<RemoveFromCartResponse>(
    {
      url: `/cart`,
      method: 'DELETE',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData,
    },
    options,
  );
};

export const getRemoveFromCartMutationOptions = <
  TError = ProblemDetails,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof removeFromCart>>,
    TError,
    { data: RemoveFromCartBody },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof removeFromCart>>,
  TError,
  { data: RemoveFromCartBody },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof removeFromCart>>,
    { data: RemoveFromCartBody }
  > = (props) => {
    const { data } = props ?? {};

    return removeFromCart(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RemoveFromCartMutationResult = NonNullable<
  Awaited<ReturnType<typeof removeFromCart>>
>;
export type RemoveFromCartMutationBody = RemoveFromCartBody;
export type RemoveFromCartMutationError = ProblemDetails;

export const useRemoveFromCart = <
  TError = ProblemDetails,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof removeFromCart>>,
    TError,
    { data: RemoveFromCartBody },
    TContext
  >;
  request?: SecondParameter<typeof orvalApiClient>;
}): UseMutationResult<
  Awaited<ReturnType<typeof removeFromCart>>,
  TError,
  { data: RemoveFromCartBody },
  TContext
> => {
  const mutationOptions = getRemoveFromCartMutationOptions(options);

  return useMutation(mutationOptions);
};
