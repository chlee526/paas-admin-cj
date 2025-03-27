import request from '@shared/utils/request';

import { parseQueryString } from '@/utils';

// 제외 키워드 목록
export function API_keywordlist(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_EXCEPTRULE_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}

// 제외 키워드 추가/수정/삭제
export function API_keywordmanage(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_EXCEPTRULE_MANAGE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}
