import auth from '@react-native-firebase/auth';
import axios, { type AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import qs from 'qs';
import { BASE_API_URL } from '../lib/constants';

export const AUTH_TOKEN = 'authToken';
export const USER_ID = 'userId';

const apiClient = axios.create({
  baseURL: BASE_API_URL, // Replace with your API URL
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => {
    return qs.stringify(params);
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN); // Get token from secure storage
  const userId = await SecureStore.getItemAsync(USER_ID); // Get user ID from secure storage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['user-id'] = userId;
  }
  return config;
});

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentUser = auth().currentUser;

        if (currentUser) {
          console.log('Token expired, refreshing...');
          // Force refresh the token from Firebase
          const newToken = await currentUser.getIdToken(true);

          // Save the new token
          await SecureStore.setItemAsync(AUTH_TOKEN, newToken);

          // Update the Authorization header with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Retry the original request with the new token
          return apiClient(originalRequest);
        }

        // No user logged in, can't refresh token
        console.error('No user logged in, cannot refresh token');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails, reject the promise
        return Promise.reject(refreshError);
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
