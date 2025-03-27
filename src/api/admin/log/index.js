import request from '@shared/utils/request';

import { parseQueryString } from '@/utils';

// 접속 로그 목록
export function API_logList(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_LOG_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}
