import { Token } from '../models';
import { apiInstance } from 'shared/config';

export const login = async (
  email: string,
  password: string,
): Promise<Token> => {
  return await apiInstance
    .post<Token>('auth/signin', {
      email: email,
      password: password,
    })
    .then((res) => {
      apiInstance.token = res.token;
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const refresh = async (): Promise<Token> => {
  try {
    const res = await apiInstance.post<Token>('auth/refresh', {});
    apiInstance.token = res.token;
    apiInstance.expire = Number(res.expire) * 1000 - 1 * 60 * 1000;
    return res;
  } catch {
    return null;
  }
};

export const refreshTimer = async (): Promise<void> => {
  await apiInstance.refreshTimeout<Token>();
};

export const logout = async (): Promise<any> => {
  const res = await apiInstance.post<any>('auth/logout', {});

  apiInstance.clearTimer();
  apiInstance.token = '';

  return res;
};
