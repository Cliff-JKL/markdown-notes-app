import { makeAutoObservable, runInAction } from 'mobx';
import { login, refresh, logout } from 'shared/api';
import { Token } from 'shared/api';

class AuthStore {
  tokenData: Token = null;
  isLoading = false;
  signInError: string = null;

  constructor() {
    makeAutoObservable(this);
  }

  signInAction = async (email: string, password: string) => {
    try {
      this.isLoading = true;
      this.signInError = null;
      const res = await login(email, password);

      runInAction(() => {
        this.tokenData = res;

        this.isLoading = false;
      });
    } catch (err) {
      this.isLoading = false;
      this.signInError = err.message;
    }
  };

  refreshAction = async () => {
    try {
      this.isLoading = true;
      const res = await refresh();

      runInAction(() => {
        this.tokenData = res;

        this.isLoading = false;
      });
    } catch {
      this.isLoading = false;
    }
  };

  logoutAction = async () => {
    try {
      this.isLoading = true;
      await logout();

      runInAction(() => {
        this.tokenData = null;
        this.isLoading = false;
      });
    } catch {
      this.isLoading = false;
    }
  };

  getToken = () => {
    return this.tokenData?.token;
  };

  isAuthorized = () => {
    console.log(Boolean(this.tokenData?.token !== undefined));
    return Boolean(this.tokenData?.token !== undefined);
  };

  clearSignInError = () => {
    this.signInError = null;
  };
}

export default new AuthStore();
