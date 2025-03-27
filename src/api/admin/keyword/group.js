import request from '@shared/utils/request';

import { getCommonApiValidation } from '@/api/validation';
import { parseQueryString } from '@/utils';

// 키워드 그룹 목록
export function API_grouplist(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_KEYWORD_GROUP_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: getCommonApiValidation(result.data, 'GL'),
    });
}

// 키워드 그룹 추가/삭제
export function API_groupmanage(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_KEYWORD_GROUP_MANAGE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: getCommonApiValidation(result.data, 'GM'),
    });
}
