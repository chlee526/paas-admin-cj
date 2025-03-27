import request from '@shared/utils/request';

import { parseQueryString } from '@/utils';

// 수집 사이트 목록
export function API_siteList(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_COLLECT_SITE_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}

// 수집 사이트 추가/삭제
export function API_sitemanage(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_COLLECT_SITE_MANAGE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}

// 수집 사이트 그룹 목록
export function API_grouplist(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_COLLECT_SITE_GROUP_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}

// 수집 사이트 그룹 추가/수정/삭제
export function API_groupmanage(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_COLLECT_SITE_GROUP_MANAGE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}
