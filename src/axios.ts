import axios, { AxiosRequestConfig } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

export interface Config extends AxiosRequestConfig {
    jar?: CookieJar | boolean;
}
export function getAxiosInstance(config?: Config) {
    const axiosInstance = axios.create(config);
    axiosCookieJarSupport(axiosInstance);
    Object.assign(axiosInstance.defaults, {
        jar: config?.jar,
        withCredentials: true,
    });
    return axiosInstance;
}
