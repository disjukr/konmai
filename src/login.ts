import * as querystring from 'querystring';

import { CookieJar } from 'tough-cookie';

import { getAxiosInstance } from './axios';
import { solveKcaptcha, Kcaptcha } from './kcaptcha';

export interface LoginConfig {
    jar?: CookieJar;
    id: string;
    pw: string;
}
export default async function login(config: LoginConfig): Promise<CookieJar> {
    const jar = config.jar ?? new CookieJar();
    const axios = getAxiosInstance({
        baseURL: 'https://p.eagate.573.jp/',
        jar,
    });
    await axios.get('/gate/p/login.html');
    const kcaptchaRes = await axios.get<Kcaptcha>('/gate/p/common/login/api/kcaptcha_generate.html');
    await axios.post(
        '/gate/p/common/login/api/login_auth.html',
        querystring.stringify({
            login_id: config.id,
            pass_word: config.pw,
            otp: '',
            resrv_url: '/gate/p/login_complete.html',
            captcha: await solveKcaptcha(kcaptchaRes.data),
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
    );
    return jar;
}
