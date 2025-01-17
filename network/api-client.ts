import axios, { type AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_API_URL } from '../lib/constants';

export const AUTH_TOKEN = 'authToken';
export const USER_ID = 'userId';

const apiClient = axios.create({
  baseURL: BASE_API_URL, // Replace with your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add a request interceptor
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN); // Get token from secure storage
  const userId = await SecureStore.getItemAsync(USER_ID); // Get token from secure storage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["user-id"] = userId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(BASE_API_URL, { refreshToken });
          await SecureStore.setItemAsync('authToken', data.authToken);

          error.config.headers.Authorization = `Bearer ${data.authToken}`;
          return apiClient.request(error.config); // Retry original request
        } catch (refreshError) {
          // Handle refresh token failure (e.g., logout user)
        }
      }
    }
    return Promise.reject(error);
  },
);

export async function orvalApiClient<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  return (await apiClient({ ...config, ...options })).data;
}

export default apiClient;
