import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { NotFoundResponse, refresh } from 'shared/api';

// TODO: redo
const hostname = window.location.hostname;
const port = '3000';
const BASE_URL = `http://${hostname}:${port}/api/`;

class ApiInstance {
  private _axios: AxiosInstance;
  private _token: string;
  set token(value: string) {
    this._token = value;
    this._axios.interceptors.request.clear();
    this._axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${value}`;
      return config;
    });
  }
  get token() {
    return this._token;
  }

  private _authExpire: number = 30 * 60 * 1000 - 2 * 60 * 1000;
  set expire(value: number) {
    this._authExpire = value;
  }

  private _timer: NodeJS.Timeout | string | number | undefined = null;

  constructor() {
    this._axios = axios.create({
      withCredentials: true,
      baseURL: BASE_URL,
    });
  }

  async get<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    const response: AxiosResponse<T> = await this._axios.get(endpoint, options);
    return response.data;
  }

  async post<T>(
    endpoint: string,
    data: object, // TODO: new interface
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    return await this._axios
      .post(endpoint, data, options)
      .then((res) => res.data)
      .catch((err: AxiosError) => {
        const data = err.response.data as NotFoundResponse;
        throw new Error(data.message);
      });
  }

  async patch<T>(
    endpoint: string,
    data: object, // TODO: new interface
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response: AxiosResponse<T> = await this._axios.patch(
      endpoint,
      data,
      options,
    );
    return response.data;
  }

  async delete<T>(
    endpoint: string,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response: AxiosResponse<T> = await this._axios.delete(
      endpoint,
      options,
    );
    return response.data;
  }

  async refreshTimeout<T>(): Promise<void> {
    console.log('start refresh timeout...');
    clearTimeout(this._timer);

    this._timer = setTimeout(() => this.refreshTimeout(), this._authExpire);

    await refresh();
    console.log(`update token: ${this._token ? 'success!' : 'failed!'}`);
  }

  async clearTimer(): Promise<void> {
    this._timer = null;
  }
}

export const apiInstance = new ApiInstance();
