import request from '@shared/utils/request';

import { getCommonApiValidation } from '@/api/validation';
import { parseQueryString } from '@/utils';

// SNS 마스터
export function API_snsMaster(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_SNS_MASTER, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
        // data: getCommonApiValidation(result.data, 'ML'),
    });
}

// 매체 자동완성 목록
export function API_mediaList(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_SNS_MEDIA, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
        // data: getCommonApiValidation(result.data, 'ML'),
    });
}

// SNS 계정 목록
export function API_list(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_SNS_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
        // data: getCommonApiValidation(result.data, 'ML'),
    });
}

// 사용자 추가/수정/삭제
export function API_update(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_SNS_UPDATE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}

// 사용자 아이지 중복 조회
export function API_memberduplicate(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_MEMBER_DUPLICATE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: getCommonApiValidation(result.data, 'MD'),
    });
}
