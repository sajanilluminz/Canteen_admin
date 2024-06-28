import axios from 'axios';
import {log} from 'react-native-reanimated';
import NetworkManager from '~components/networkHelper/NetowrkHelper';

export const getApiCall = async (params: any) => {
  let url = params.url;
  let headers = params.headers;
  let config = params.config;

  try {
    const response = await axios.get(url, config ? config : {headers});
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const postApiCall = async (params: any) => {
  let internetConnectionStatus = NetworkManager.isInternetReachable;
  let url = params.url;
  let headers = params.headers ?? {};
  let config = {headers};
  let data = params.data;
  console.log('url :', config, url);

  if (internetConnectionStatus) {
    try {
      const response = await axios.post(url, data, config);
      // const response = await axios.get(url);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  } else {
    return Promise.reject(new Error('Please check your internet connection'));
  }
};

export const DeleteApiCall = async (params: any) => {
  let internetConnectionStatus = NetworkManager.isInternetReachable;
  let url = params.url;
  let headers = params.headers ?? {};
  let data = params.data;
  let config = {headers: headers, data: data};
  if (internetConnectionStatus) {
    try {
      const response = await axios.delete(url, config);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  } else {
    return Promise.reject(new Error('Please check your internet connection'));
  }
};

export const PatchApiCall = async (params: any) => {
  let internetConnectionStatus = NetworkManager.isInternetReachable;
  let url = params.url;
  let headers = params.headers ?? {};
  let config = {headers};
  let data = params.data;
  if (internetConnectionStatus) {
    try {
      const response = await axios.patch(url, data, config);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  } else {
    return Promise.reject(new Error('Please check your internet connection'));
  }
};
