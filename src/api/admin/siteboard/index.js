import request from '@shared/utils/request';

import { parseQueryString } from '@/utils';

// 제휴 수집원 목록
export function API_list(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_SITEBOARD_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}

// 제휴 수집원 커뮤니티 목록
export function API_communityList(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_SITEBOARD_COMMUNITY_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}

// 제휴 수집원 관리
export function API_manage(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_SITEBOARD_MANAGE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
        // data: getCommonApiValidation(result.data, 'ML'),
    });
}
