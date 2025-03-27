<script>
import { getItemLocalStorage, setItemLocalStorage } from '@shared/utils/localStorage';
import { uuid } from 'vue-uuid';

import GroupTreeView from './components/group_treeview';
import List from './components/list';
import Aside from './components/aside_keywords';

import CompIndex from '@/components/keyword_boilerplate/comp_index';
import store from '@/store';
import { API_grouplist } from '@/api/admin/keyword/group';
import { API_keywordmanage } from '@/api/admin/keyword/keyword';

export default {
    name: 'Common-layout',
    extends: CompIndex,
    components: {
        GroupTreeView,
        Aside,
        List,
    },
    data() {
        return {
            menu: 'admin_keyword',
            useGroupTree: true,
            API_keywordmanage: API_keywordmanage,
            delConfirmMsg: '삭제 시<br><strong>"해당 주제 사전으로 분석된 데이터는 사용하지 못합니다."</strong><br>삭제하시겠습니까?',
            // 개인화
            savePersonalization: {
                main: {
                    data_list: {
                        // 항목설정
                        colOpts: {
                            category: true,
                            name: true,
                            op: true,
                            ts: true,
                            sg_seqs: true,
                            expt_keywords: false,
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
            initSavePersonalization: {
                main: {
                    data_list: {
                        // 항목설정
                        colOpts: {
                            category: true,
                            name: true,
                            op: true,
                            ts: true,
                            sg_seqs: true,
                            expt_keywords: false,
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
        };
    },
    computed: {},
    beforeRouteEnter(from, to, next) {
        store
            .dispatch('opts/ATTRS', { cmm_type: '1,2,3,4,5' })
            .then((res) => {
                let result = res.data?.result?.list || [];

                if (!Array.isArray(result)) {
                    result = [result];
                }

                if (result.getParseDatas({ code: 1 })[0]) store.commit('opts/SET_SGSEQS', result.getParseDatas({ code: 1 })[0].children);

                if (result.getParseDatas({ code: 2 })[0]) store.commit('opts/SET_TS', result.getParseDatas({ code: 2 })[0].children);

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
        // 키워드 그룹목록 조회
        this.fetchGrpList();
    },
    watch: {},
    methods: {
        /**
         * 키워드 그룹 목록 조회
         * 조회 실패 시 팝업
         */
        async fetchGrpList() {
            this.loading = true;
            await API_grouplist(this.apiUID)
                .then((res) => {
                    this.groupList = [...res?.data?.result?.list];
                })
                .catch((err) => {
                    store
                        .dispatch('DIALOG_ERR', ['키워드 그룹을 조회하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '키워드 그룹 조회 실패', 0])
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
         * 키워드 수정
         * 수정 중인 키워드의 사용여부를 brd에서 업데이트시 API 통신 후 반영
         * @param {Object} item k_seq와 use_yn이 꼭 들어가있어야함
         */
        async updateKeyword(item) {
            this.loading = true;

            const param = {
                level: 3,
                type: 'u',
                k_seq: item.k_seq ? item.k_seq : item.seq,
                use_yn: item.use_yn,
            };
            await API_keywordmanage(this.apiUID, param)
                .then((res) => {
                    if (res.data?.result?.code === 200) {
                        // 수정중인 키워드 변경시 변경사항 반영
                        const keywords = String(param.k_seq).split(',') || [];

                        if (keywords.includes(String(this.editKeyword.k_seq))) {
                            const obj = structuredClone(this.editKeyword);
                            obj.use_yn = param.use_yn;
                            obj.active = param.use_yn === 'Y';
                            this.editKeyword = obj;
                        }

                        this.$store.dispatch('NOTY_COM', `키워드 수정을 성공했습니다.`);
                    } else {
                        throw new Error();
                    }
                })
                .catch((err) => {
                    if (err?.response?.status === 409) this.updateKeywordError('이미 등록된 키워드 입니다.');
                    else if (err?.response?.status === 400) this.updateKeywordError('키워드에 금지 문자가 포함되어, 등록에 실패 했습니다.');
                    else this.updateKeywordError();
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        async deleteKeyword(item) {
            this.$store
                .dispatch('DIALOG_WRN', [this.delConfirmMsg, '삭제하시겠습니까?', 2])
                .then(async () => {
                    this.loading = true;

                    const param = {
                        level: 3,
                        type: 'd',
                        k_seq: item.k_seq ? item.k_seq : item.seq,
                        expt_k_seq: '',
                    };

                    // 제외키워드 존재시 같이 보내주기
                    if (item?.expt_k_seq) param.expt_k_seq = item.expt_k_seq;

                    await API_keywordmanage(this.apiUID, param)
                        .then((res) => {
                            if (res.data?.result?.code === 200) {
                                // 수정중인 키워드 삭제시 editKeyword 비우기
                                const keywords = String(param.k_seq).split(',') || [];
                                if (keywords.includes(String(this.editKeyword.k_seq))) this.editKeyword = {};

                                this.$store.dispatch('NOTY_COM', `키워드 삭제를 성공했습니다.`);
                            } else {
                                throw new Error();
                            }
                        })
                        .catch(() => {
                            this.$store.dispatch('NOTY_ERR', `키워드 삭제를 실패했습니다.`);
                        })
                        .finally(() => {
                            this.loading = false;
                            // trigger main_brd fetchData
                            this.$refs.main_brd.searching();
                        });
                })
                .catch((err) => {});
        },

        /**
         * 키워드 등록
         * 등록 완료시 main_brd keywordList fetch trigger
         * @param {*} item
         */
        async registKeyword(item) {
            const resItem = this.setRegistAPIParameter(item);

            let params = [];
            if (Array.isArray(resItem)) {
                params = structuredClone(resItem);
            } else {
                params.push(resItem);
            }

            if (!params.length) return;

            this.loading = true;

            const successList = []; // 성공 목록
            const failList = []; // 실패 목록
            const failScList = []; // 실패(특수문자포함) 목록
            const promises = params.map(async (item, idx) => {
                const updateUid = uuid.v4();
                let param = { type: 'i', ...item };

                // 순서대로 등록되게 하기 위한 0.01초 딜레이
                await new Promise((resolve) => setTimeout(resolve, 15 * idx));

                return await API_keywordmanage(updateUid, param)
                    .then((res) => {
                        res.param = param;
                        return res;
                    })
                    .catch((err) => {
                        err.param = param;
                        return err;
                    });
            });

            await Promise.allSettled(promises)
                .then((res) => {
                    res.forEach((item) => {
                        if (item.value?.status === 200) successList.push(item);
                        // else if (item.value?.response?.status === 400) failScList.push(item);
                        else {
                            failList.push(item);
                        }
                    });
                })
                .finally(async () => {
                    // 제외 키워드 생성을 위한 생성된 키워드 데이터 배열화
                    const exptLists = successList.map((item) => item.value.data.result.list[0]);
                    let exptResult = null;
                    let exptResultCnt = 0;
                    let exptResultEachCnt = 0;

                    // 제외 키워드 등록/입력 초기화
                    await this.$refs.aside_regist
                        .resetKeyword(exptLists)
                        .then((res) => {
                            exptResult = res;
                            exptResultCnt = parseInt(exptResult.success.length + exptResult.fail.length);
                        })
                        .finally(() => {
                            this.loading = false;
                            this.$refs.main_brd.searching();
                        });

                    // 실패 키워드 데이터 정렬
                    const failsKeywordDatas = [];
                    failList.forEach((keyword) => {
                        failsKeywordDatas.push({ ...keyword.value.param, errStatus: keyword.value.response.status, exptKeywordList: exptResult.inputList });
                        // failsKeywordDatas.push({ ...keyword.value.param, errStatus: keyword.value.response.status, exptKeywordList: [...exptResult.success, ...exptResult.fail] });
                    });
                    exptResult.fail.forEach((exptKeyword) => {
                        const keyword = exptLists.filter((keyword) => keyword.zp === exptKeyword.zp)[0];
                        const sameKeyword = failsKeywordDatas.filter((keyword) => keyword.zp === exptKeyword.zp) || [];
                        if (sameKeyword.length) {
                            sameKeyword[0].exptKeywordList.push(exptKeyword);
                        } else {
                            failsKeywordDatas.push({ ...keyword, exptKeywordList: [exptKeyword] });
                        }
                    });

                    // 성공에 대한 처리
                    if (successList.length) {
                        this.registKeywordSuccess('등록 되었습니다.');
                    }
                    // 실패에 대한 처리
                    if (failList.length || failsKeywordDatas.length) {
                        this.registKeywordError('등록에 실패한 키워드(제외키워드)가 있습니다.<br>"보기"를 눌러 실패한 키워드를 확인합니다.', failsKeywordDatas);
                    }
                });
        },

        setRegistAPIParameter(item) {
            const params = {
                level: 3,
                type: 'i',
            };
            const items = item.name.split('\n');
            if (items.length == 1) {
                return {
                    ...item,
                    name: item.name,
                    ...params,
                };
            } else if (items.length > 1) {
                const result = [];
                items.forEach((itemSplit) => {
                    if (itemSplit.trim().length > 0) {
                        result.push({
                            ...item,
                            name: itemSplit,
                            ...params,
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

<!--<style src="./style.scss" lang="scss" /> -->
