import request from '@shared/utils/request';

import { parseQueryString } from '@/utils';

// 공통코드 추가/수정/삭제
export function API_category(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_SET_CODES, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}
