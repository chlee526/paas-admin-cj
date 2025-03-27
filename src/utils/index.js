import merge from 'lodash/merge';

/**
 * 키워드 공백 문자로 치환
 * @param {String} name
 * @return {String} result
 */
export const parseKeywordName = (name) => {
    return name.replace(/\s/g, '<span class="ui_keyword_space">∨</span>');
};

/**
 * 키워드 중복공백/특수문자 제거
 * @param {Object} item
 * @return {String} result
 */
export const trimKeyword = (item) => {
    let name = item.name;
    if (name) {
        // 중복공백 제거
        name = name.replaceAll(/\n+(?=\n)/g, '');

        // 특수문자 제거
        if (item.tsc === 2) {
            // 한글,영어,숫자,공백,개행이 아닌 모든 문자 선택
            name = name.replaceAll(/[^\uAC00-\uD7A3\w\s\n]/g, '');
        }
    }
    return name;
};

/**
 * 쿼리스트링 URL을 path와 data로 분리
 * @param {String} APIURL
 * @param {Object} param
 * @returns {Object} {data, path}
 */
export const parseQueryString = (APIURL, param) => {
    const queryString = APIURL.split('?');
    const data = param ? structuredClone(param) : {};

    const result = { data: data, path: process.env.VUE_APP_BASE_API + APIURL };

    if (queryString.length > 1) {
        result.path = process.env.VUE_APP_BASE_API + queryString[0];
        result.data = merge(data, queryString[1].queryStrToJson());
    }

    return result;
};
