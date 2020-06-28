import { getAxiosInstance } from './axios';
import hasha from 'hasha';

import * as captcha from '../captcha.json';

export interface Kcaptcha {
    data: {
        correct_pic: string;
        kcsess: string;
        choicelist: {
            attr: string;
            img_url: string;
            key: string;
        }[];
    }
}

export async function solveKcaptcha(kcaptcha: Kcaptcha): Promise<string> {
    const kcsess = kcaptcha.data.kcsess;
    const correctMd5 = await md5(kcaptcha.data.correct_pic);
    const choiceMd5 = captcha[correctMd5].choice_md5;
    const keys = ['', '', '', '', ''];
    for (const choice of kcaptcha.data.choicelist) {
        if (!choice.attr) continue;
        const idx = +choice.attr[1];
        const md5Result = await md5(choice.img_url);
        if (choiceMd5.includes(md5Result)) keys[idx] = choice.key;
    }
    return `k_${kcsess}_${keys.join('_')}`;
}

async function md5(imageUrl: string): Promise<string> {
    const axios = getAxiosInstance();
    const res = await axios.get<Buffer>(imageUrl, {
        responseType: 'arraybuffer',
    });
    return hasha(res.data, { algorithm: 'md5' });
}
