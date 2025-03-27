<script>
import List from './components/list';
import Aside from './components/aside_exceptrule';

import store from '@/store';
import CompIndex from '@/components/keyword_boilerplate/comp_index';
import { API_keywordmanage } from '@/api/admin/exceptrule';
export default {
    name: 'Common-layout',
    extends: CompIndex,
    components: {
        List,
        Aside,
    },
    data() {
        return {
            menu: 'admin_exceptrule',
            API_keywordmanage: API_keywordmanage,
            delConfirmMsg: '삭제 시<br><strong>"해당 전체 제외키워드 필터링은 더 이상 동작하지 않습니다."</strong><br>삭제하시겠습니까?',
        };
    },
    computed: {},

    created() {},
    mounted() {},
    watch: {},
    methods: {
        /**
         * 키워드 수정 API 에 전달할 parameter 값
         */
        setUpdateAPIParameter(item) {
            const result = {
                keyword: item.name,
                op: item.op,
                op_len_before: item.op_len_before,
                op_len_after: item.op_len_after,
                ts: item.ts,
                tsc: item.tsc,
            };
            return result;
        },

        /**
         * 키워드 수정 후 editKeyword 변경될 값
         */
        setUpdateResultParameter(param) {
            const result = {
                keyword: param.keyword,
                name: param.keyword,
                op: param.op,
                op_len_before: param.op_len_before,
                op_len_after: param.op_len_after,
                ts: param.ts,
                tsc: param.tsc,
            };
            return result;
        },

        /**
         * 키워드 등록 API 에 전달할 parameter 값
         */
        setRegistAPIParameter(item) {
            const params = {
                // keyword: item.name,
                op: item.op,
                op_len_before: item.op_len_before,
                op_len_after: item.op_len_after,
                ts: item.ts,
                tsc: item.tsc,
                use_yn: item.use_yn,
            };
            const items = item.name.split('\n');
            if (items.length == 1) {
                return {
                    ...params,
                    keyword: item.name,
                };
            } else if (items.length > 1) {
                const result = [];
                items.forEach((itemSplit) => {
                    if (itemSplit.trim().length > 0) {
                        result.push({
                            ...params,
                            keyword: itemSplit,
                        });
                    }
                });
                return result;
            }

            return null;
        },
    },
};
</script>

<!-- <style src="./style.scss" lang="scss" /> -->
