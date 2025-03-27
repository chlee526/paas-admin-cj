<template>
    <div id="content" class="ui-loader-container" :class="{ 'is-loading': loading }">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap">
            <div class="contents">
                <div class="wrap">
                    <div class="ui_row">
                        <div class="wrap is-cols-pad">
                            <!-- 트리뷰 사용  -->
                            <template v-if="useGroupTree">
                                <div class="ui_col">
                                    <GroupTreeView :groupList.sync="groupList" :selectedGrp.sync="selectedGrp" />
                                </div>
                                <div class="ui_col">
                                    <List ref="main_brd" :savePersonalization.sync="savePersonalization" :editKeyword.sync="editKeyword" :selectedGrp="selectedGrp" :categoryList="getCategoryList" :delConfirmMsg="delConfirmMsg" @updateKeyword="updateKeyword" @deleteKeyword="deleteKeyword" @setAsideOpen="asideClosed = false" />
                                </div>
                            </template>
                            <!-- 트리뷰 사용 안함 -->
                            <template v-else>
                                <div class="ui_col">
                                    <List ref="main_brd" :savePersonalization.sync="savePersonalization" :editKeyword.sync="editKeyword" @updateKeyword="updateKeyword" @deleteKeyword="deleteKeyword" @setAsideOpen="asideClosed = false" />
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <aside v-control-aside-width="{ menu: menu, isClosed: asideClosed }" style="min-width: 510px; max-width: 600px">
            <div class="ui_row">
                <div class="wrap">
                    <div class="ui_col">
                        <!-- 트리뷰 사용 (selectGrp O) -->
                        <Aside v-if="useGroupTree" ref="aside_regist" :editKeyword.sync="editKeyword" :selectedGrp="selectedGrp" :categoryList="getCategoryList" :xpName="getXpName" @update="updateKeyword" @updateExceptKeyword="updateExceptKeyword" @regist="registKeyword" @delete="deleteKeyword" :useTypeAnal="useTypeAnal" />
                        <!-- 트리뷰 사용 안함 (selectGrp X) -->
                        <Aside v-else ref="aside_regist" :editKeyword.sync="editKeyword" @update="updateKeyword" @regist="registKeyword" @delete="deleteKeyword" />
                    </div>
                </div>
            </div>
        </aside>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';
import { getItemLocalStorage, setItemLocalStorage } from '@shared/utils/localStorage';
import merge from 'lodash/merge';
import { copyClipBoard } from '@shared/utils/prototype/util.string';

import store from '@/store';
import { API_keywordmanage } from '@/api/admin/dictionary/keyword';

export default {
    name: 'Common-layout',
    components: {
        // 기본 컴포넌트 사용 시
        // 1. 사용할 컴포넌트 import 필수
        // 2. 반드시 아래 이름으로 선언해야함
        // GroupTreeView, List, Aside
    },
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            groupList: [], // 그룹데이터
            selectedGrp: {},
            editKeyword: {},
            // 개인화
            savePersonalization: null,
            initSavePersonalization: {
                main: {
                    data_list: {
                        // 항목설정
                        colOpts: {
                            keyword: true,
                            op: true,
                            ts: true,
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
            asideClosed: false, //aside open/close
            useGroupTree: false, //트리뷰 사용여부

            // ✨상속컴포넌트 필수
            menu: '', // 메뉴명 (개인화 저장에 필요)
            API_keywordmanage: API_keywordmanage,
            useTypeAnal: false, // 분석대상 사용 여부

            delConfirmMsg: '',
        };
    },
    computed: {
        ...mapGetters(['getUserPermissions']),
        /**
         * 현재 선택 그룹의 xp 값으로 중그룹 목록을 selectBox opts 형태로 반환
         * @return {Array} 중그룹 목록
         */
        getCategoryList() {
            let list = [];
            const xp = this.selectedGrp?.xp;
            const children = this.groupList.find((grp) => grp.xp == xp)?.children || [];

            if (children.length) {
                list = children.map((item) => {
                    return { code: item.yp, name: item.name };
                });
            }
            return [{ code: '', name: '카테고리를 선택하세요' }, ...list];
        },

        /**
         * 현재 선택 그룹의 xp 값으로 대그룹 이름 가져오기
         * @return {String} 대그룹 이름
         */
        getXpName() {
            const xp = this.selectedGrp?.xp;

            const name = this.groupList.getParseDatas({ xp: xp })[0]?.name || '';
            return name;
        },
    },
    beforeRouteEnter(from, to, next) {
        store
            .dispatch('opts/ATTRS', { cmm_type: '1,2,3,4,5' })
            .then((res) => {
                let result = res.data?.result?.list || [];

                if (!Array.isArray(result)) {
                    result = [result];
                }

                if (result.getParseDatas({ code: 2 })[0]) store.commit('opts/SET_TS', result.getParseDatas({ code: 2 })[0].children);

                if (result.getParseDatas({ code: 3 })[0]) store.commit('opts/SET_TSC', result.getParseDatas({ code: 3 })[0].children);

                if (result.getParseDatas({ code: 4 })[0]) store.commit('opts/SET_OP', result.getParseDatas({ code: 4 })[0].children);

                if (result.getParseDatas({ code: 5 })[0]) store.commit('opts/SET_SEARCHTYPE', result.getParseDatas({ code: 5 })[0].children);

                if (result.getParseDatas({ code: 7 })[0]) store.commit('opts/SET_TYPEANAL', result.getParseDatas({ code: 7 })[0].children);

                next(() => {});
            })
            .catch(($err) => {
                store
                    .dispatch('DIALOG_ERR', ['기본 속성 정보를 로드하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '속성 로드 실패', 0])
                    .then(($val) => {
                        location.reload();
                    })
                    .catch(($err) => {
                        console.log('error');
                    });
            });
    },
    created() {
        // 개인화 적용
        const personalization = getItemLocalStorage('personalization');

        this.savePersonalization = merge(this.savePersonalization ? this.savePersonalization : this.initSavePersonalization, personalization?.[this.menu]);
    },
    mounted() {},
    watch: {
        savePersonalization: {
            deep: true,
            handler(val) {
                const personalization = getItemLocalStorage('personalization');

                const savePersonalization = { ...personalization };

                savePersonalization[this.menu] = {
                    ...personalization?.[this.menu],
                    main: {
                        ...personalization?.[this.menu]?.main,
                        ...val.main,
                    },
                };

                setItemLocalStorage('personalization', savePersonalization);
            },
        },
        // 선택 그룹 변경시 키워드 수정 해제
        selectedGrp(newVal, oldVal) {
            if (oldVal?.seq !== newVal?.seq) {
                this.editKeyword = {};
            }

            if (oldVal?.k_seq !== newVal?.k_seq) {
                this.editKeyword = {};
            }
        },
    },
    methods: {
        /**
         * 키워드 수정 API 에 전달할 parameter 값
         */
        setUpdateAPIParameter(item) {
            const result = {};
            return result;
        },

        /**
         * 키워드 수정 후 editKeyword 변경될 값
         */
        setUpdateResultParameter(item) {
            const result = {};
            return result;
        },

        /**
         * 키워드 등록 API 에 전달할 parameter 값
         */
        setRegistAPIParameter(item) {
            const result = {};
            return result;
        },

        /**
         * 키워드 수정
         * @param {Object} item
         */
        async updateKeyword(item) {
            this.loading = true;

            let param = {
                type: 'u',
                seq: item.seq,
                use_yn: item.use_yn,
            };
            const keywords = String(param.seq).split(',') || [];

            if (keywords.length === 1) {
                // 단일 수정일 땐 모든 변경 사항 전달
                const keys = {};
                param = {
                    ...param,
                    ...this.setUpdateAPIParameter(item),
                };
            }

            await this.API_keywordmanage(this.apiUID, param)
                .then((res) => {
                    this.updateKeywordSuccess(res, keywords, param);
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
        /**
         * 키워드 수정 성공/실패
         */
        updateKeywordSuccess(res, keywords, param) {
            if (res.data?.result?.code === 200) {
                // 수정중인 키워드 변경시 변경사항 반영

                if (keywords.includes(String(this.editKeyword.seq))) {
                    let obj = structuredClone(this.editKeyword);

                    // 단일 수정일 때
                    if (keywords.length === 1) {
                        obj = {
                            ...obj,
                            ...this.setUpdateResultParameter(param),
                        };
                    }

                    obj.use_yn = param.use_yn;
                    obj.active = param.use_yn === 'Y';
                    this.editKeyword = obj;
                }

                this.$store.dispatch('NOTY_COM', `키워드 수정을 성공했습니다.`);
            } else {
                throw new Error();
            }
        },
        updateKeywordError(msg) {
            if (msg) this.$store.dispatch('NOTY_ERR', msg);
            else this.$store.dispatch('NOTY_ERR', `키워드 수정을 실패했습니다.`);
        },

        /**
         * 키워드 등록
         * 등록 완료시 list fetch trigger
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

            // Loading On
            this.loading = true;

            // const successList = []; // 성공 목록
            // const failList = []; // 실패 목록
            // const failDuplicateList = []; // 실패(이미 등록된 실패) 목록
            /**
             * 실제 API 통신이 되는 재귀 함수
             * params의 갯수만큼 완료된 이후 재귀 호출로 다음건 진행
             * @param {*} paramCnt 현재 params의 index
             */
            // const fetchRegist = async (paramCnt) => {
            //     if (!params[paramCnt]) return;
            //     const updateUid = uuid.v4();
            //     const param = { type: 'i', ...params[paramCnt] };
            //     await this.API_keywordmanage(updateUid, param)
            //         .then((res) => {
            //             successList.push(param);
            //         })
            //         .catch((err) => {
            //             if (err.response?.status) failDuplicateList.push(param);
            //             else failList.push(param);
            //         })
            //         .finally(async () => {
            //             await fetchRegist(paramCnt + 1);
            //         });
            // };
            // await fetchRegist(0);

            // /**
            //  * 전체 APi 완료 이후 작업
            //  */
            // this.loading = false;
            // // 성공에 대한 처리
            // if (successList.length) {
            //     const successMsg = params.length > 1 ? `${params.length}개의 키워드 중 ${successList.length}개를 등록했습니다.` : null;
            //     this.registKeywordSuccess(successMsg);
            // }
            // // 실패에 대한 처리
            // if (failList.length) {
            //     let failMsg;
            //     if (failList.length > 10) {
            //         failMsg = `${failList.length}개의 키워드 등록에 실패 했습니다.`;
            //     } else {
            //         failMsg = failList.reduce((acc, cur) => `${acc}${acc !== '' ? ',<br>' : acc}'${cur.keyword || cur.find_keyword}'`, '') + '<br>키워드 등록에 실패 했습니다.';
            //     }
            //     this.registKeywordError(failMsg);
            // }
            // // 실패(이미 등록된 실패: 409에러)에 대한 처리
            // if (failDuplicateList.length) {
            //     let failDuplicateMsg;
            //     if (failDuplicateList.length > 10) {
            //         failDuplicateMsg = `${failDuplicateList.length}개의 키워드는 이미 등록된 키워드 입니다.`;
            //     } else {
            //         failDuplicateMsg = failDuplicateList.reduce((acc, cur) => `${acc}${acc !== '' ? ',<br>' : acc}'${cur.keyword || cur.find_keyword}'`, '') + '<br>이미 등록된 키워드 입니다.';
            //     }
            //     this.registKeywordError(failDuplicateMsg);
            // }
            // // 메인 게시판 Fetching
            // this.$refs.main_brd.searching();

            /**
             * Promise.all 작업건
             */
            const successList = []; // 성공 목록
            const failList = []; // 실패 목록
            const failDuplicateList = []; // 실패(이미 등록된 실패) 목록
            const failScList = []; // 실패(특수문자포함) 목록
            const promises = params.map(async (item, idx) => {
                const updateUid = uuid.v4();
                let param = { type: 'i', ...item };

                // 순서대로 등록되게 하기 위한 0.01초 딜레이
                await new Promise((resolve) => setTimeout(resolve, 15 * idx));

                return await this.API_keywordmanage(updateUid, param)
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
                        else if (item.value?.response?.status === 409) failDuplicateList.push(item);
                        else if (item.value?.response?.status === 400) failScList.push(item);
                        else failList.push(item);
                    });
                })
                .finally(() => {
                    this.loading = false;

                    // 성공에 대한 처리
                    if (successList.length) {
                        const successMsg = params.length > 1 ? `${params.length}개의 키워드 중 ${successList.length}개의 등록에 성공했습니다.` : null;
                        this.registKeywordSuccess(successMsg);
                    }
                    // 실패(이미 등록된 실패: 409에러)에 대한 처리
                    if (failDuplicateList.length) {
                        let failDuplicateMsg;
                        if (failDuplicateList.length > 10) {
                            failDuplicateMsg = `${failDuplicateList.length}개의 키워드는 이미 등록된 키워드 입니다.<br>"복사"를 눌러 실패한 키워드를 클립보드에 저장합니다.`;
                        } else {
                            failDuplicateMsg = failDuplicateList.reduce((acc, cur) => `${acc}${acc !== '' ? ', ' : acc}'${cur.value.param.keyword || cur.value.param.find_keyword}'`, '') + '<br><br>이미 등록된 키워드 입니다.<br>"복사"를 눌러 실패한 키워드를 클립보드에 저장할 수 있습니다.';
                        }
                        this.registKeywordError(failDuplicateMsg, failDuplicateList);
                    }
                    // 실패(특수문자 포함 실패: 400에러)에 대한 처리
                    if (failScList.length) {
                        let failScMsg;
                        if (failScList.length > 10) {
                            failScMsg = `${failScList.length}개의 키워드에 금지 문자가 포함되어, 등록에 실패 했습니다.<br>"복사"를 눌러 실패한 키워드를 클립보드에 저장합니다.`;
                        } else {
                            failScMsg = failScList.reduce((acc, cur) => `${acc}${acc !== '' ? ', ' : acc}'${cur.value.param.keyword || cur.value.param.find_keyword}'`, '') + '<br><br>키워드에 금지 문자가 포함되어, 등록에 실패 했습니다.<br>"복사"를 눌러 실패한 키워드를 클립보드에 저장할 수 있습니다.';
                        }
                        this.registKeywordError(failScMsg, failScList);
                    }
                    // 실패에 대한 처리
                    if (failList.length) {
                        let failMsg;
                        if (failList.length > 10) {
                            failMsg = `${failList.length}개의 키워드 등록에 실패 했습니다.<br>"복사"를 눌러 실패한 키워드를 클립보드에 저장합니다.`;
                        } else {
                            failMsg = failList.reduce((acc, cur) => `${acc}${acc !== '' ? ', ' : acc}'${cur.value.param.keyword || cur.value.param.find_keyword}'`, '') + '<br><br>키워드 등록에 실패 했습니다.<br>"복사"를 눌러 실패한 키워드를 클립보드에 저장할 수 있습니다.';
                        }
                        this.registKeywordError(failMsg, failList);
                    }

                    // trigger main_brd fetchData
                    this.$refs.main_brd.searching();
                });
        },
        /**
         * 키워드 등록 성공/실패
         */
        registKeywordSuccess(msg) {
            this.$store.dispatch('NOTY_COM', msg ? msg : '키워드 등록을 성공했습니다.');
            this.$refs.aside_regist.resetKeyword();
        },
        registKeywordError(msg, failList) {
            this.$store.dispatch(msg ? 'NOTY_ERR_CONFIRM' : 'NOTY_ERR', [
                msg ? msg : '키워드 등록을 실패했습니다.',
                [
                    {
                        name: '복사',
                        click: () => {
                            if (failList?.length) {
                                const msg = failList.reduce((acc, cur) => `${acc}${acc.length ? '\n' : ''}${cur?.value?.param?.keyword || cur?.value?.param?.find_keyword}`, '');
                                const copyResult = msg.copyClipBoard(true);
                            }
                        },
                    },
                    { name: '확인' },
                ],
            ]);
        },

        /**
         * 키워드 삭제
         * 삭제 완료시 main_brd keywordList fetch trigger
         * @param {Object} item 삭제 대상 데이터(seq 필수)
         */
        async deleteKeyword(item) {
            if (item.useModal) {
                this.loading = true;

                const param = {
                    type: 'd',
                    seq: item.seq,
                };

                await this.API_keywordmanage(this.apiUID, param)
                    .then((res) => {
                        if (res.data?.result?.code === 200) {
                            // 수정중인 키워드 삭제시 editKeyword 비우기
                            if (String(param.seq).split(',').length) {
                                this.editKeyword = {};
                            }

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
            } else {
                this.$store
                    .dispatch('DIALOG_WRN', [this.delConfirmMsg, '삭제하시겠습니까?', 2])
                    .then(async () => {
                        this.loading = true;

                        const param = {
                            type: 'd',
                            seq: item.seq,
                        };

                        await this.API_keywordmanage(this.apiUID, param)
                            .then((res) => {
                                if (res.data?.result?.code === 200) {
                                    // 수정중인 키워드 삭제시 editKeyword 비우기
                                    if (String(param.seq).split(',').length) {
                                        this.editKeyword = {};
                                    }

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
            }
        },

        /**
         * 단순 제외키워드 데이터 동기화를 위함
         * @param {*} item
         */
        updateExceptKeyword(item) {
            this.$set(this.editKeyword, 'expt_keywords', item);
        },
    },
};
</script>

<style src="./style.scss" lang="scss" />
