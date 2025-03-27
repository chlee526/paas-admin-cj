import request from '@shared/utils/request';

import { parseQueryString } from '@/utils';

// 전체 사이트 목록
export function API_siteList(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_ALL_SITE_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}
