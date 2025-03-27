import request from '@shared/utils/request';

import { getCommonApiValidation } from '@/api/validation';
import { parseQueryString } from '@/utils';

// 사이트 목록
export function API_popularitylist(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_POPULARITY_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: getCommonApiValidation(result.data, 'PL'),
    });
}

// 사이트 추가/수정/삭제
export function API_popularityManage(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_POPULARITY_MANAGE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: getCommonApiValidation(result.data, 'PM'),
    });
}
