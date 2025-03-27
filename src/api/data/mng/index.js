import request from '@shared/utils/request';

import { parseQueryString } from '@/utils';

// 데이터 다운로드 항목
export function API_dataMngList(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_DATA_MNG_LIST, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}

// 데이터 다운로드 요청
export function API_reqExcel(id, param) {
    const result = parseQueryString(process.env.VUE_APP_API_PATH_DATA_MNG_DOWNLOAD, param);

    return request({
        id: id,
        url: result.path,
        method: 'post',
        data: result.data,
    });
}

export function API_excelTest(id, param) {
    const result = parseQueryString('/api/data/excel', param);
    return request({
        url: result.path,
        method: 'post',
        data: result.data,
    });
}
