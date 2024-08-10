import { createAsyncThunk } from '@reduxjs/toolkit';
import CONSTANTS from 'src/components/Constants/constants.js';
import AxiosWithCredentials from 'src/utils/axios.js';
import { axiosResponseError } from 'src/utils/axiosResponseError.js';
// import CONSTANTS from 'src/components/Constants/constants.js';
// import AxiosWithCredentials from 'src/utils/axios.js';
// import { axiosResponseError } from 'src/utils/axiosResponseError.js';

export const signUp = createAsyncThunk(
  'users/signUp',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await AxiosWithCredentials.post(
        `${CONSTANTS.USERS_ENDPOINTS.signUp}`,
        credentials,
      );
      if (res.status > 300) {
        return rejectWithValue(res.statusText);
      }
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const signIn = createAsyncThunk(
  'users/signIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await AxiosWithCredentials.post(
        `${CONSTANTS.USERS_ENDPOINTS.signIn}`,
        credentials,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosResponseError(error));
    }
  },
);

export const logout = createAsyncThunk(
  'users/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AxiosWithCredentials.post(`${CONSTANTS.USERS_ENDPOINTS.logout}`);
    } catch (error) {
      return rejectWithValue(axiosResponseError(error));
    }
  },
);

export const refresh = createAsyncThunk(
  'users/refresh',
  async (_, { rejectWithValue }) => {
    // try {
    //   const res = await AxiosWithCredentials.post(
    //     `${CONSTANTS.USERS_ENDPOINTS.refresh}`,
    //   );
    //   return res.data;
    // } catch (error) {
    //   return rejectWithValue(axiosResponseError(error));
    // }
  },
);

export const update = createAsyncThunk(
  'users/update',
  async (formData, { rejectWithValue }) => {
    // try {
    //   const res = await AxiosWithCredentials.patch(
    //     `${CONSTANTS.USERS_ENDPOINTS.updateUser}`,
    //     formData,
    //     {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     },
    //   );
    //   return res.data;
    // } catch (error) {
    //   return rejectWithValue(axiosResponseError(error));
    // }
  },
);
