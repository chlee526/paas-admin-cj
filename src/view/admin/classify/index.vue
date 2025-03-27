<script>
import GroupTreeView from './components/group_treeview';
import List from './components/list';
import Aside from './components/aside_classify';

import CompIndex from '@/components/keyword_boilerplate/comp_index';
import store from '@/store';
import { API_grouplist } from '@/api/admin/classify/group';
import { API_keywordmanage } from '@/api/admin/classify/keyword';

// 상속 컴포넌트 초기화
CompIndex.beforeRouteEnter = null;

export default {
    name: 'Common-layout',
    extends: CompIndex,
    components: {
        GroupTreeView,
        List,
        Aside,
    },
    data() {
        return {
            menu: 'admin_classify',
            useGroupTree: true,
            API_keywordmanage: API_keywordmanage,
            // 개인화
            savePersonalization: {
                main: {
                    data_list: {
                        // 항목설정
                        colOpts: {
                            keyword: true,
                            op: true,
                            ts: true,
                            // type_anal: true,
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
            useTypeAnal: true,
            delConfirmMsg: '삭제 시<br><strong>"해당 분류 사전으로 분석된 데이터는 사용하지 못합니다."</strong><br>삭제하시겠습니까?',
        };
    },
    computed: {},
    beforeRouteEnter(from, to, next) {
        store
            .dispatch('opts/ATTRS', { cmm_type: '1,2,3,4,5,7' })
            .then((res) => {
                let result = res.data?.result?.list || [];

                if (!Array.isArray(result)) {
                    result = [result];
                }

                // 검색영역에서 URL, 메뉴명 제외
                if (result.getParseDatas({ code: 2 })[0]) {
                    const list = result.getParseDatas({ code: 2 })[0].children.exptAttr({ name: 'URL' }).exptAttr({ name: '메뉴명' });
                    store.commit('opts/SET_TS', list);
                }

                if (result.getParseDatas({ code: 3 })[0]) store.commit('opts/SET_TSC', result.getParseDatas({ code: 3 })[0].children);

                if (result.getParseDatas({ code: 4 })[0]) store.commit('opts/SET_OP', result.getParseDatas({ code: 4 })[0].children);

                if (result.getParseDatas({ code: 5 })[0]) store.commit('opts/SET_SEARCHTYPE', result.getParseDatas({ code: 5 })[0].children);

                next(() => {});
            })
            .catch(($err) => {
                store
                    .dispatch('DIALOG_ERR', ['제품 정보를 로드하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '속성 로드 실패', 0])
                    .then(($val) => {
                        location.reload();
                    })
                    .catch(($err) => {
                        console.log('error');
                    });
            });
    },
    created() {
        // 기사 주제 조회
        this.fetchGrpList();
    },
    watch: {},
    methods: {
        /**
         * 기사 주제 목록 조회
         * 조회 실패 시 팝업
         */
        async fetchGrpList() {
            this.loading = true;
            await API_grouplist(this.apiUID)
                .then((res) => {
                    // 트리뷰 형식에 맞게 code, name 추가
                    const list = [...res?.data?.result?.list];
                    this.groupList = list.map((item) => {
                        const obj = {
                            code: item.seq,
                            name: item.classify,
                            ...item,
                        };
                        return obj;
                    });
                })
                .catch((err) => {
                    store
                        .dispatch('DIALOG_ERR', ['기사 주제를 조회하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '기사 주제 조회 실패', 0])
                        .then(($val) => {
                            location.reload();
                        })
                        .catch(($err) => {
                            console.log('error');
                        });
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * 키워드 수정 API 에 전달할 parameter 값
         */
        setUpdateAPIParameter(item) {
            const result = {
                classify: this.selectedGrp.classify,
                keyword: item.name,
                op: item.op,
                op_len_before: item.op_len_before,
                op_len_after: item.op_len_after,
                ts: item.ts,
                tsc: item.tsc,
                type_anal: item.type_anal,
            };
            return result;
        },

        /**
         * 키워드 수정 후 editKeyword 변경될 값
         */
        setUpdateResultParameter(param) {
            const result = {
                classify: this.selectedGrp.classify,
                keyword: param.keyword,
                name: param.keyword,
                op: param.op,
                op_len_before: param.op_len_before,
                op_len_after: param.op_len_after,
                ts: param.ts,
                tsc: param.tsc,
                type_anal: param.type_anal,
            };
            return result;
        },

        /**
         * 키워드 등록 API 에 전달할 parameter 값
         */
        setRegistAPIParameter(item) {
            const params = {
                classify: this.selectedGrp.classify,
                // keyword: item.name,
                op: item.op,
                op_len_before: item.op_len_before,
                op_len_after: item.op_len_after,
                ts: item.ts,
                tsc: item.tsc,
                use_yn: item.use_yn,
                type_anal: item.type_anal,
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
