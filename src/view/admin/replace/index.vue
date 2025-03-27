<script>
import List from './components/list';
import Aside from './components/aside_replace';

import CompIndex from '@/components/keyword_boilerplate/comp_index';
import { API_keywordmanage } from '@/api/admin/replace';

export default {
    name: 'Common-layout',
    extends: CompIndex,
    components: {
        List,
        Aside,
    },
    data() {
        return {
            menu: 'admin_replace',
            API_keywordmanage: API_keywordmanage,
            // 개인화
            savePersonalization: {
                main: {
                    data_list: {
                        // 항목설정
                        colOpts: {
                            find_keyword: true,
                            replace_keyword: true,
                            reg_date: false,
                            k_writer: false,
                            modi_date: true,
                            k_modifier: true,
                            use_yn: true,
                        },
                        row_limit: 50,
                    },
                },
            },
            delConfirmMsg: '삭제 시<br><strong>"해당 키워드 치환은 더 이상 이뤄지지 않습니다."</strong><br>삭제하시겠습니까?',
        };
    },
    methods: {
        /**
         * 키워드 수정 API 에 전달할 parameter 값
         */
        setUpdateAPIParameter(item) {
            const result = {
                find_keyword: item.find_keyword,
                replace_keyword: item.replace_keyword,
            };
            return result;
        },

        /**
         * 키워드 수정 후 editKeyword 변경될 값
         */
        setUpdateResultParameter(param) {
            const result = {
                find_keyword: param.find_keyword,
                replace_keyword: param.replace_keyword,
            };
            return result;
        },

        /**
         * 키워드 등록 API 에 전달할 parameter 값
         */
        setRegistAPIParameter(item) {
            const params = {
                // find_keyword: item.find_keyword,
                // replace_keyword: item.replace_keyword,
                use_yn: item.use_yn,
            };

            const items = item.find_keyword.split('\n');
            if (items.length == 1) {
                return {
                    ...params,
                    find_keyword: item.find_keyword,
                    replace_keyword: item.replace_keyword,
                };
            } else if (items.length > 1) {
                const result = [];
                items.forEach((itemSplit) => {
                    if (itemSplit.trim().length > 0) {
                        result.push({
                            ...params,
                            find_keyword: itemSplit,
                            replace_keyword: item.replace_keyword,
                        });
                    }
                });
                return result;
            }

            return null;
        },

        /**
         * 키워드 등록 실패
         * @param {Object} err
         */
        // registKeywordError(err) {
        //     let msg;
        //     if (err.response.status === 409) msg = `'${err.param.find_keyword}'는 이미 등록된 키워드 입니다.`;
        //     else msg = '키워드 등록을 실패했습니다.';
        //     this.$store.dispatch('NOTY_ERR', msg);
        // },
    },
};
</script>

<!-- <style src="./style.scss" lang="scss" /> -->
