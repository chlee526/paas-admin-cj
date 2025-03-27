<template>
    <div id="content" class="ui-loader-container" :class="{ 'is-loading': loading }">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap is-hgt100">
            <div class="contents">
                <div class="wrap">
                    <div class="ui_row">
                        <div class="wrap">
                            <div class="ui_col">
                                <List :savePersonalization.sync="savePersonalization" :dataList="dataList" :editItem.sync="editItem" @update="parseParameters" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <aside v-control-aside-width="{ menu: 'admin_sitesearch', isClosed: asideClosed }" style="min-width: 390px; max-width: 600px">
            <div class="ui_row">
                <div class="wrap">
                    <div class="ui_col">
                        <CompAside :editItem="editItem" :autocompleteList="autocompleteList" @setEditItem="evtEdit" @update="parseParameters" @save="parseParameters" />
                    </div>
                </div>
            </div>
        </aside>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import { getItemLocalStorage, setItemLocalStorage } from '@shared/utils/localStorage';
import merge from 'lodash/merge';
import { renameProperties } from '@shared/utils/prototype/util.object';

import List from './components/list';
import CompAside from './components/aside';

// import { API_snsMaster, API_list, API_update } from '@/api/admin/sns';
import { API_list, API_manage } from '@/api/admin/sitesearch';
import { API_siteList } from '@/api/admin/site/collect';
export default {
    name: 'page-admin-sitesearch',
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            savePersonalization: {
                main: {
                    data_list: {
                        // 항목설정
                        colOpts: {
                            s_seq: true,
                            s_name_rsn: false,
                            s_name_cj: true,
                            s_name_search: true,
                            url: true,
                            s_writer: true,
                            reg_date: true,
                            s_modifier: false,
                            modi_date: false,
                            use_yn: true,
                        },
                    },
                },
            },
            siteList: [],
            dataList: [],
            editItem: {},
            asideClosed: false,
        };
    },
    components: {
        List,
        CompAside,
    },
    async beforeRouteEnter(from, to, next) {
        /**
         * 사전 데이터 요청
         * 1. 사이트 자동 완성용 수집 사이트 목록 조회
         */

        await API_siteList(uuid.v4()).then((res) => {
            next((vm) => {
                vm.siteList = res.data?.result?.list
                    .filter((item) => item.gr_name === '뉴스')
                    .map((item) => {
                        return {
                            code: item.s_seq,
                            name: item.name,
                            url: item.url,
                        };
                    });
            });
        });
    },
    created() {
        // 개인화
        const personalization = getItemLocalStorage('personalization');
        this.savePersonalization = merge(this.savePersonalization, personalization?.admin_sitesearch);
    },
    mounted() {
        // 최초 실행 시 Fetch 시작
        this.fetchDatas();
    },
    watch: {
        // 개인화
        savePersonalization: {
            deep: true,
            handler(val) {
                const personalization = getItemLocalStorage('personalization');
                const savePersonalization = {
                    ...personalization,
                    admin_sitesearch: {
                        ...personalization?.admin_sitesearch,
                        main: {
                            ...personalization?.admin_sitesearch?.main,
                            ...val.main,
                        },
                    },
                };
                setItemLocalStorage('personalization', savePersonalization);
            },
        },
        editItem: {
            deep: true,
            handler(val) {
                if (this.asideClosed && Object.keys(this.editItem).length > 0) this.asideClosed = false;
            },
        },
    },
    computed: {
        autocompleteList() {
            const result = this.siteList.filter((item) => {
                // 이미 존재하는 사이트(코드와 매체명이 일치하는 사이트) 제외
                if (this.dataList.find(({ s_seq, s_name_cj }) => item.code === s_seq && item.name === s_name_cj)) {
                    return false;
                }
                return true;
            });
            return result;
        },
    },
    methods: {
        /**
         * API - 목록
         */
        async fetchDatas() {
            this.loading = true;
            await API_list(this.apiUID)
                .then((res) => {
                    const data = structuredClone(res.data);
                    this.dataList = data?.result?.list || [];
                })
                .catch((err) => {
                    this.$store.dispatch('NOTY_ERR', 'SNS계정 조회를 실패했습니다.');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * API - 업데이트(추가/수정/삭제)
         * 업데이트가 완료되면 fetchData를 실행
         */
        async manageDatas(param) {
            this.loading = true;

            const updateUid = uuid.v4();

            await API_manage(updateUid, param)
                .then((res) => {
                    this.$store.dispatch('NOTY_COM', `데이터를 ${param.type == 'i' ? '등록' : param.type == 'u' ? '수정' : '삭제'} 했습니다.`);

                    // 수정사항 editeItem에 반영
                    if (param.s_seq.split(',').includes(this.editItem.s_seq)) {
                        if (param.type === 'u') {
                            const obj = structuredClone(this.editItem);

                            Object.keys(this.editItem).forEach((key) => {
                                if (key !== 's_seq' && param[key]) {
                                    obj[key] = param[key];
                                }
                            });

                            this.evtEdit(obj);
                        } else if (param.type === 'd') {
                            this.evtEdit({});
                        }
                    }
                    this.loading = false;

                    this.fetchDatas(param);
                })
                .catch((err) => {
                    this.$store.dispatch('DIALOG_ERR', [`데이터 ${param.type == 'i' ? '등록을' : param.type == 'u' ? '수정을' : '삭제를'} 실패 했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.`, `데이터 ${param.type == 'i' ? '추가' : param.type == 'u' ? '수정' : '삭제'}`, 0]).then(() => {
                        location.reload();
                    });
                });
        },

        /**
         * 이벤트 - Edit 아이템 변경
         * @param {Object} item
         */
        evtEdit(item) {
            this.editItem = structuredClone(item);
        },

        /**
         * 이벤트 - 데이터 추가/수정/삭제 파라미터 만들어 전달
         * @param {Object} param
         */
        parseParameters(param) {
            let keys = ['type', 's_seq'];

            // 추가/수정
            switch (param.type) {
                case 'u':
                    keys = [...keys, 's_name_cj', 's_name_search', 'use_yn'];
                    break;
                case 'i':
                    keys = keys = [...keys, 's_name_cj', 's_name_search', 'use_yn', 's_name_rsn', 'url'];
                    break;
            }

            // 추가/수정/삭제 별 사용하는 key 값만 parameter로 전달
            const parameter = keys.reduce((obj, key) => {
                return { ...obj, [key]: param[key] };
            }, {});

            // 삭제일때 confim 후 처리
            if (parameter.type === 'd') {
                let comfimMessage = '데이터를 삭제하시겠습니까?';

                const { length } = param.s_seq.split(',');

                if (length > 1) {
                    comfimMessage = `선택하신 <strong>${length}</strong>개의 데이터를 삭제하시겠습니까?`;
                }

                // dialog confirm -> API 호출
                this.$store.dispatch('DIALOG_WRN', [comfimMessage, '데이터 삭제', 2]).then(() => {
                    this.manageDatas(parameter);
                });
            } else {
                this.manageDatas(parameter);
            }
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
