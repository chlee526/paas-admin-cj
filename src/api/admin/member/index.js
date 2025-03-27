import request from '@shared/utils/request';

import { getCommonApiValidation } from '@/api/validation';
import { parseQueryString } from '@/utils';

// 사용자 목록
export function API_memberlist(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_MEMBER_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: getCommonApiValidation(result.data, 'ML'),
    });
}

// 사용자 추가/수정/삭제
export function API_membermanage(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_MEMBER_MANAGE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: getCommonApiValidation(result.data, 'MM'),
    });
}

// 사용자 아이디 중복 조회
export function API_memberduplicate(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_MEMBER_DUPLICATE, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: getCommonApiValidation(result.data, 'MD'),
    });
}
