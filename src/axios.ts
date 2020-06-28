import axios, { AxiosRequestConfig } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';

export function getAxiosInstance(config?: AxiosRequestConfig) {
    const axiosInstance = axios.create(config);
    axiosCookieJarSupport(axiosInstance);
    Object.assign(axiosInstance.defaults, {
        jar: config?.jar,
        withCredentials: true,
    });
    return axiosInstance;
}
