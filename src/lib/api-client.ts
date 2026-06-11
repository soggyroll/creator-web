/** @format */

import Axios, { AxiosRequestConfig, AxiosError } from "axios";
import { getToken } from "@clerk/nextjs";
import { getTeamCookie } from "@/actions/team";

const VERSION_PREFIX = "/api/v1";

export const apiClient = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + VERSION_PREFIX,
});

apiClient.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${await getToken()}`;
  const teamId = await getTeamCookie();

  if (teamId) {
    config.headers["X-Team-ID"] = teamId;
  }

  return config;
});

// Add a second `options` argument to pass extra options to each query
export const client = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const promise = apiClient({
    ...config,
    ...options,
  }).then(({ data }) => data);

  return promise;
};

// Override the return error type for react-query and swr
export type ErrorType<Error> = AxiosError<Error>;

// Standard body type
export type BodyType<BodyData> = BodyData;

// Or wrap the body type if processing data before sending
// export type BodyType<BodyData> = CamelCase<BodyData>;
