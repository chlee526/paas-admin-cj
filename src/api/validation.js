import { getUserNo } from '@shared/utils/auth';
/**
 * 공통 API 유효성
 * @param {Object} data 검증에 사용될 파라미터
 * @param {String} cmd API 종류
 * @returns {Object} 검증이 완료된 파라미터
 */
export const getCommonApiValidation = (data, cmd) => {
    const param = {
        ...data,
    };

    let keyArr = [];

    switch (cmd) {
        // 공용
        case 'CG':
            keyArr = ['cmm_type'];
            break;
        case 'CS':
            keyArr = ['type', 'level', 'seq', 'cmm_type', 'code', 'name', 'color'];
            break;
        // 키워드
        case 'GM':
            keyArr = ['level', 'type', 'xp', 'yp', 'zp', 'k_seq', 'name', 'sg_seqs', 'use_yn'];
            break;
        case 'KL':
            keyArr = ['xp', 'yp', 'zp', 'search_type', 'search_keyword', 'order', 'op', 'ts', 'use_yn', 'page_num', 'row_limit'];
            break;
        case 'KM':
            keyArr = ['level', 'type', 'xp', 'yp', 'zp', 'k_seq', 'name', 'op', 'op_len_before', 'op_len_after', 'ts', 'tsc', 'use_yn', 'sg_seqs', 'expt_k_seq'];
            break;
        // 사용자
        case 'MM':
            keyArr = ['type', 'seq', 'user_grp', 'id', 'password', 'name', 'rank', 'dept', 'mobile', 'email', 'menu_seq'];
            break;
        case 'MD':
            keyArr = ['id'];
            break;
        // 인기도 지수
        case 'PL':
            keyArr = ['search_type', 'search_keyword', 'order', 'use_yn', 'page_num', 'row_limit', 'excel'];
            break;
        case 'PM':
            keyArr = ['seq', 'type', 's_seq', 'd_site_name', 'logstd', 'use_yn'];
            break;
    }

    Object.keys(param).forEach((key) => {
        // API에 필요한 key값만 전달
        if (!keyArr.includes(key) && key !== 'user_no' && key !== 'cmd') delete param[key];

        // number type 키값 type 검증
        const numberTypeArr = ['xp', 'yp', 'zp', 'op', 'ts', 'tsc', 'level', 'search_type', 'row_limit', 'op_len_before', 'op_len_after', 's_seq', 'logstd'];
        if (numberTypeArr.includes(key)) {
            if (cmd === 'KL' && (key === 'op' || key === 'ts')) return;
            param[key] = Number(param[key]);
        }

        if (key === 'k_seq') param.k_seq = String(param.k_seq);
    });

    return param;
};
