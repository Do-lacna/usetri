/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type {
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import type {
  AddCategoryRequest,
  AddShopRequest,
  AddShopResponse,
  ChangeItemPriceRequest,
  ProblemDetails,
} from ".././model";
import apiClient from "../api-client";

export const addShop = (
  addShopRequest: AddShopRequest,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<AddShopResponse>> => {
  return apiClient.post(`/shops`, addShopRequest, options);
};

export const getAddShopMutationOptions = <
  TError = AxiosError<ProblemDetails>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addShop>>,
    TError,
    { data: AddShopRequest },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof addShop>>,
  TError,
  { data: AddShopRequest },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof addShop>>,
    { data: AddShopRequest }
  > = (props) => {
    const { data } = props ?? {};

    return addShop(data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type AddShopMutationResult = NonNullable<
  Awaited<ReturnType<typeof addShop>>
>;
export type AddShopMutationBody = AddShopRequest;
export type AddShopMutationError = AxiosError<ProblemDetails>;

export const useAddShop = <
  TError = AxiosError<ProblemDetails>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addShop>>,
    TError,
    { data: AddShopRequest },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationResult<
  Awaited<ReturnType<typeof addShop>>,
  TError,
  { data: AddShopRequest },
  TContext
> => {
  const mutationOptions = getAddShopMutationOptions(options);

  return useMutation(mutationOptions);
};
export const changePrice = (
  barcode: number,
  changeItemPriceRequest: ChangeItemPriceRequest,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<void>> => {
  return apiClient.put(
    `/products/${barcode}/prices`,
    changeItemPriceRequest,
    options
  );
};

export const getChangePriceMutationOptions = <
  TError = AxiosError<ProblemDetails>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof changePrice>>,
    TError,
    { barcode: number; data: ChangeItemPriceRequest },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof changePrice>>,
  TError,
  { barcode: number; data: ChangeItemPriceRequest },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof changePrice>>,
    { barcode: number; data: ChangeItemPriceRequest }
  > = (props) => {
    const { barcode, data } = props ?? {};

    return changePrice(barcode, data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type ChangePriceMutationResult = NonNullable<
  Awaited<ReturnType<typeof changePrice>>
>;
export type ChangePriceMutationBody = ChangeItemPriceRequest;
export type ChangePriceMutationError = AxiosError<ProblemDetails>;

export const useChangePrice = <
  TError = AxiosError<ProblemDetails>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof changePrice>>,
    TError,
    { barcode: number; data: ChangeItemPriceRequest },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationResult<
  Awaited<ReturnType<typeof changePrice>>,
  TError,
  { barcode: number; data: ChangeItemPriceRequest },
  TContext
> => {
  const mutationOptions = getChangePriceMutationOptions(options);

  return useMutation(mutationOptions);
};
export const addCategory = (
  addCategoryRequest: AddCategoryRequest,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<AddShopResponse>> => {
  return apiClient.post(`/categories`, addCategoryRequest, options);
};

export const getAddCategoryMutationOptions = <
  TError = AxiosError<ProblemDetails>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addCategory>>,
    TError,
    { data: AddCategoryRequest },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof addCategory>>,
  TError,
  { data: AddCategoryRequest },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof addCategory>>,
    { data: AddCategoryRequest }
  > = (props) => {
    const { data } = props ?? {};

    return addCategory(data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type AddCategoryMutationResult = NonNullable<
  Awaited<ReturnType<typeof addCategory>>
>;
export type AddCategoryMutationBody = AddCategoryRequest;
export type AddCategoryMutationError = AxiosError<ProblemDetails>;

export const useAddCategory = <
  TError = AxiosError<ProblemDetails>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addCategory>>,
    TError,
    { data: AddCategoryRequest },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationResult<
  Awaited<ReturnType<typeof addCategory>>,
  TError,
  { data: AddCategoryRequest },
  TContext
> => {
  const mutationOptions = getAddCategoryMutationOptions(options);

  return useMutation(mutationOptions);
};