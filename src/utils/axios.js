import { selectUserToken } from 'src/redux/users/selectors.js';
import axios from 'axios';
import CONSTANTS from 'src/components/Constants/constants.js';
import store from 'src/redux/store.js';
import toast from 'react-hot-toast';
import { refresh } from 'src/redux/users/operations.js';

const AxiosWithCredentials = axios.create({
  baseURL: CONSTANTS.DOMAINS.SERVER_DEPLOY,
  withCredentials: true,
});

AxiosWithCredentials.interceptors.request.use(
  config => {
    const state = store.getState();
    const token = selectUserToken(state);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    toast.error(error.message);
    return Promise.reject(error);
  },
);

AxiosWithCredentials.interceptors.response.use(
  res => res,
  async err => {
    console.log('err in interceptors', err);
    console.log('err.response in interceptors', err.response);
    console.log(
      'err.response.data.message in interceptors',
      err.response.data.message,
    );

    const status = err?.response?.data.status || err?.response?.status || null;
    const statusText =
      err?.response?.data.message || err?.response?.statusText || null;

    const originalRequest = err.config;

    if (status === 401 && statusText === 'Email or password invalid!') {
      toast.error(statusText);
    } else if (
      (status === 401 && statusText === 'Missing session cookies') ||
      (status === 401 && statusText === 'The session was not found!') ||
      (status === 401 &&
        statusText === 'The refresh session token has expired!')
    ) {
      localStorage.clear();
      toast(
        'You have lost cookies somewhere or the session was not found and been redirected to Home Page. Try to log in again, please.',
        {
          autoClose: 7000,
        },
      );

      setTimeout(() => {
        window.location.replace('/');
        console.log('mission cookies with _retry');
      }, 4000);
    } else if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Status 401 detected, attempting to refresh token...');
      try {
        const result = await store.dispatch(refresh()).unwrap();
        console.log('result in interceptors response', result);

        originalRequest.headers.Authorization = `Bearer ${result}`;

        return AxiosWithCredentials(originalRequest);
      } catch (refreshError) {
        console.log('Refresh failed:', refreshError);
      }
    }
    if (status === 500 || status === 400 || status === 403 || status === 409) {
      toast.error(statusText);
    }

    return Promise.reject(err);
  },
);

export default AxiosWithCredentials;
