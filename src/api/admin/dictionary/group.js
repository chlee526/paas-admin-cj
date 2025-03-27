import request from '@shared/utils/request';

import { parseQueryString } from '@/utils';

// 기사 주제 목록
export function API_grouplist(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_DICTIONARY_GROUP_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}

// 기사 주제 추가/삭제
export function API_groupmanage(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_DICTIONARY_GROUP_MANAGE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}
