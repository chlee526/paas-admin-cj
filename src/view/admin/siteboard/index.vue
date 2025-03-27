<template>
    <div id="content" class="ui-loader-container" :class="{ 'is-loading': loading }">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap is-hgt100">
            <div class="contents">
                <div class="wrap">
                    <div class="ui_row">
                        <div class="wrap">
                            <div class="ui_col">
                                <List :savePersonalization.sync="savePersonalization" :dataList="dataList" :editItem.sync="editItem" @updateKeyword="(param) => parseParameters({ ...param, type: 'u' })" @deleteKeyword="(param) => parseParameters({ ...param, type: 'd' })" @excelDownload="evtExcelDownload" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <aside v-control-aside-width="{ menu: 'admin_siteboard', isClosed: asideClosed }" style="min-width: 390px; max-width: 600px">
            <div class="ui_row">
                <div class="wrap">
                    <div class="ui_col">
                        <CompAside :brdList="dataList" :editItem="editItem" :autocompleteList="autocompleteList" :communityAutocompleteList="communityAutocompleteList" @setEditItem="evtEdit" @update="parseParameters" @save="parseParameters" />
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

import List from './components/list';
import CompAside from './components/aside';

import { API_list, API_manage } from '@/api/admin/siteboard';
import { API_siteList } from '@/api/admin/site/collect';
import { API_communityList } from '@/api/admin/siteboard';

export default {
    name: 'page-admin-siteboard',
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
                            s_name_cj: true,
                            sb_name: true,
                            channel: true,
                            reg_date: true,
                            writer: true,
                            modi_date: false,
                            modifier: false,
                            use_yn: true,
                        },
                    },
                },
            },
            siteList: [],
            communityList: [],
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

        // 사이트 목록
        const resSiteList = await API_siteList(uuid.v4());
        const resultSiteList = resSiteList.data?.result?.list
            .filter((item) => item.gr_name === '커뮤니티' || item.gr_name === '뉴스')
            .map((item) => {
                return {
                    code: item.s_seq,
                    name: item.name,
                    gr_name: item.gr_name,
                };
            });

        // 커뮤니티 목록
        const resCommunityList = await API_communityList(uuid.v4());
        const resultCommunityList = resCommunityList.data?.result?.list.map((item, idx) => {
            return {
                code: idx,
                name: item.sb_name,
                s_seq: item.s_seq,
                s_name_cj: item.s_name_cj,
            };
        });

        // 본 컨텐츠로 전달
        next((vm) => {
            vm.siteList = resultSiteList;
            vm.communityList = resultCommunityList;
        });
    },
    created() {
        // 개인화
        const personalization = getItemLocalStorage('personalization');
        this.savePersonalization = merge(this.savePersonalization, personalization?.admin_siteboard);
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
                    admin_siteboard: {
                        ...personalization?.admin_siteboard,
                        main: {
                            ...personalization?.admin_siteboard?.main,
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
            return this.siteList;
        },
        communityAutocompleteList() {
            return this.communityList;
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
                    this.$store.dispatch('NOTY_ERR', '제휴 수집원 목록 조회를 실패했습니다.');
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
            let keys = ['seq', 'type', 's_seq'];

            // 추가/수정
            switch (param.type) {
                case 'u':
                    keys = [...keys, 'sb_name', 'use_yn'];
                    break;
                case 'i':
                    keys = keys = [...keys, 's_name_cj', 'sb_name', 'sb_name', 'channel', 'use_yn'];
                    break;
                case 'd':
                    keys = keys = [...keys, 'sb_name'];
                    break;
            }

            // 추가/수정/삭제 별 사용하는 key 값만 parameter로 전달
            const parameter = keys.reduce((obj, key) => {
                return { ...obj, [key]: param[key] };
            }, {});

            // 삭제일때 confim 후 처리
            if (parameter.type === 'd') {
                let comfimMessage = '데이터를 삭제하시겠습니까?';

                const { length } = param.seq.split(',');

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

        /**
         * 엑셀 다운로드
         * @param list 게시판 목록
         */
        evtExcelDownload(list) {
            this.excelLoading = true;
            this.excelDownList = this.setExcelForm(list);
            this.exportExcel();
        },
        /**
         * 게시판 내용 치환
         * @param list 게시판 목록
         */
        setExcelForm(list) {
            let result = structuredClone(list).map((item) => ({
                ...item,
                use_yn: item.use_yn == 'Y' ? '사용' : '미사용',
            }));

            return result;
        },
        /**
         * 다운로드 엑셀 파일 설정
         */
        exportExcel() {
            const worker = new Worker('/assets/worker.js');

            /** [column 설정] !!!!!!
             * 1열 column값에 대한 style 아닌 전체 col 값이 스타일 처리됩니다.
             * 개별 스타일 지정이 필요한 경우 worker.js 파일 수정필요
             * header : col 이름 , key: col 기준 키값 , width: col 넓이, style: 개별 스타일
             */
            const setColnameHeader = [
                {
                    header: '채널',
                    key: 'channel',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '매체번호',
                    key: 's_seq',
                    width: 12,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '매체명',
                    key: 's_name_cj',
                    width: 20,
                },
                {
                    header: '수집원',
                    key: 'sb_name',
                    width: 35,
                },
                {
                    header: '최초 등록일',
                    key: 'reg_date',
                    width: 19,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '최초 등록자',
                    key: 'writer',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '최종 수정일',
                    key: 'modi_date',
                    width: 19,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '최종 수정자',
                    key: 'modifier',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '사용',
                    key: 'use_yn',
                    width: 10,
                    style: {
                        alignment: { horizontal: 'center' },
                    },
                },
            ];

            setColnameHeader.map((item) => {
                item.style = {
                    ...item.style,
                    font: {
                        size: 9,
                    },
                };
            });

            worker.postMessage({ list: this.excelDownList, columns: setColnameHeader, sheetName: '제휴 수집원' });

            worker.onmessage = (e) => {
                const blob = e.data;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '제휴수집원.xlsx';
                a.click();
                URL.revokeObjectURL(url);
                this.excelLoading = false;
                worker.terminate();
            };
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
