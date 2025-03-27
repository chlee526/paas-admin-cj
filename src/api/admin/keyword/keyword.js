import request from '@shared/utils/request';

import { getCommonApiValidation } from '@/api/validation';
import { parseQueryString } from '@/utils';

// 키워드 목록
export function API_keywordlist(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_KEYWORD_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: getCommonApiValidation(result.data, 'KL'),
    });
}

// 키워드 추가/수정/삭제
export function API_keywordmanage(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_KEYWORD_MANAGE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: getCommonApiValidation(result.data, 'KM'),
    });
}
