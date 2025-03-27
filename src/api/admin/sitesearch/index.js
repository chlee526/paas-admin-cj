import request from '@shared/utils/request';

import { parseQueryString } from '@/utils';

// 사이트 검색어 목록
export function API_list(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_SITESEARCH_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}

// 사이트 검색어 관리
export function API_manage(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_SITESEARCH_MANAGE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
        // data: getCommonApiValidation(result.data, 'ML'),
    });
}
