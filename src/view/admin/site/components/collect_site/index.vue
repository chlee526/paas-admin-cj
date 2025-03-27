<template>
    <div class="collect_site ui_box ui-loader-container" :class="{ 'is-loading': loading }">
        <div class="ui_function">
            <div class="lc">
                <comp-selectbox id="lang_select" v-model="language" :opts="siteLangs" all-selected-label="언어 전체" style="width: 100px"></comp-selectbox>
            </div>
            <div class="rc">
                <comp-input-box id="collect_site_search" type="search" v-model="searchKeyword" placeholder="코드, 사이트명, URL" @search="evtSearch" style="width: 240px"></comp-input-box>
                <comp-button class="is-icon-with is-before" title="수집 사이트 목록 엑셀 다운로드" @click="evtExcelClick" :loading="excelLoading" :disabled="useSiteList?.length === 0"><span class="icon">&#xe005;</span><span class="txt">Excel</span></comp-button>
            </div>
        </div>
        <!-- 수집 제외 컨트롤러 -->
        <Controller v-if="hasAdminPermission" type="exception" :amount="selected.length" :disabled="disabledController" @clickDeselect="initialToSelected" @clickController="excludeSite"></Controller>
        <div ref="collectSiteContent" class="contents">
            <!-- 사이트 그룹 목록 -->
            <GroupList id="collect_user_group" :listData="useGrpList" @click="evtClickGrpItem" @remove="evtDeleteGrp" @confirm="evtModifyGrp" @confirmInAddGrp="addUserGroup"></GroupList>
            <!-- 사이트 -->
            <div class="list_wrap">
                <SiteList ref="collectSiteList" id="collect_site_list" :listData="useSiteList" :resetSelected="resetSelected" @selectedUpdate="evtSelected"></SiteList>
                <div v-if="!useSiteList.length" class="site_list no_data"><span class="ui_no_data_txt">데이터가 없습니다.</span></div>
            </div>
        </div>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import { excelDownload } from '@shared/utils/prototype/util.link';
import { mapGetters } from 'vuex';

import Controller from '../controller';
import SiteList from '../site_list';
import GroupList from '../group_list';

import { API_siteList, API_sitemanage, API_grouplist, API_groupmanage } from '@/api/admin/site/collect';

export default {
    name: 'comp-collect-site',
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            excelLoading: false,
            language: '',
            searchKeyword: '',
            useSearchKeyword: '',
            originSiteList: [],
            useSiteList: [],
            useGrpList: [],
            selected: [],
            activeGrpItem: { grp: 'all', name: '전체', isActive: true },
            disabledController: true,
            resetSelected: false,
        };
    },
    components: {
        Controller,
        SiteList,
        GroupList,
    },
    props: {
        isUpdateSite: { type: Boolean }, // 사이트 목록 업데이트 여부
        siteLangs: { type: Array, default: null }, // 사이트 언어 옵션 목록
        activeSiteGrp: { type: String }, // 활성화 사이트 그룹 grp 코드
    },
    mounted() {
        this.fetchGroupList();
    },
    computed: {
        ...mapGetters(['getUserPermissions']),

        // 등록/수정 권한
        hasAdminPermission() {
            return this.getUserPermissions >= 2;
        },
    },
    watch: {
        // 사이트 그룹 목록
        useGrpList: {
            deep: true,
            handler(val) {
                this.$emit('updateGrpList', structuredClone(val));
            },
        },

        // 활성화 사이트 그룹
        activeGrpItem: {
            deep: true,
            handler(val, oldVal) {
                if (val?.grp !== oldVal?.grp) this.initialToSelected();
                this.parsingSiteList();
            },
        },

        // 사이트 선택 목록
        selected: {
            deep: true,
            handler(val) {
                if (!val.length) this.disabledController = true;
                else this.disabledController = false;
            },
        },

        // 언어 옵션 목록
        siteLangs: {
            deep: true,
            handler(val) {
                this.language = val.arrObjAttrToStr('code');
            },
        },

        // 언어
        language(val) {
            this.parsingSiteList();
        },

        // 사이트 업데이트 여부
        isUpdateSite(val) {
            if (val) this.fetchGroupList('currentItem');
        },

        activeSiteGrp(val) {
            this.evtClickGrpItem(val);
        },
    },
    methods: {
        /**
         * 수집 사이트 제외
         */
        async excludeSite() {
            const params = { type: 'd', s_seq: this.selected.join(',') };
            await API_sitemanage(this.apiUID, params)
                .then((res) => {
                    this.initialToSelected();
                    this.$store.dispatch('NOTY_COM', `사이트 수집 제외를 성공했습니다.`);
                    this.$emit('updateSite');
                })
                .catch((err) => {
                    console.error('excludeSite:', err);
                    this.$store.dispatch('NOTY_ERR', `사이트 수집 제외를 실패했습니다.`);
                });
        },

        /**
         * 사이트 그룹 목록
         * @param {String} activeGrpType 사이트 그룹 active 설정을 위한 파라미터
         */
        async fetchGroupList(activeGrpType) {
            this.loading = true;

            await API_grouplist(this.apiUID)
                .then((res) => {
                    let originGrpList = structuredClone(res.data.result.list);
                    originGrpList.sort((a, b) => parseInt(a.grp) - parseInt(b.grp));
                    this.useGrpList = [{ grp: 'all', name: '전체' }, ...originGrpList];
                })
                .catch((err) => {
                    console.error('fetchGroupList:', err);
                })
                .finally(() => {
                    this.fetchSiteList(activeGrpType);
                });
        },

        /**
         * 엑셀 다운로드 클릭
         */
        evtExcelClick() {
            this.excelLoading = true;
            this.excelDownList = this.setExcelForm(this.useSiteList);
            this.exportExcel();
            // this.fetchSiteList(null, 'excel');
        },

        /**
         * 수집 사이트 목록
         * @param {String} activeGrpType 사이트 그룹 active 설정을 위한 파라미터
         */
        async fetchSiteList(activeGrpType, excel) {
            let param;

            if (excel) {
                param = {
                    lang: this.language,
                    search_keyword: this.useSearchKeyword,
                    excel: 1,
                };
                this.excelLoading = true;
            }

            await API_siteList(this.apiUID, param)
                .then((res) => {
                    if (!excel) {
                        this.originSiteList = structuredClone(res.data.result.list);
                        this.parsingGrpList(activeGrpType);
                        this.parsingSiteList();
                    } else {
                        this.excelDownList = this.setExcelForm(res?.data?.result?.list);

                        this.exportExcel();
                        // excelDownload(res?.data?.result?.excelLink);
                    }
                })
                .catch((err) => {
                    if (!excel) this.$store.dispatch('NOTY_ERR', '수집 사이트 목록 조회를 실패했습니다.');
                    else this.$store.dispatch('NOTY_ERR', '수집 사이트 목록 엑셀 요청에 실패 했습니다.');
                })
                .finally(() => {
                    if (!excel) {
                        // 사이트 언어 옵션 목록 파싱
                        const siteLangs = [...new Set(this.originSiteList.map((site) => site.lang))].map((lang) => ({ code: lang, name: lang }));
                        this.$emit('updateLangs', structuredClone(siteLangs));
                        this.loading = false;
                    } else {
                        // this.excelLoading = false;
                    }
                });
        },

        setExcelForm(list) {
            let result = JSON.parse(JSON.stringify(list));

            result.map((item) => {
                item.status = item.status == 1 ? '사용' : '미사용';
                return item;
            });

            return result;
        },

        /**
         * 엑셀 export
         *
         * web worker 호출용 파일은 public 경로에 추가해야합니다.
         * web worker 기능 및 사용하는 exceljs 설명은 worker.js 파일에 있음
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
                    header: '고유값',
                    key: 's_seq',
                    width: 10,
                },
                {
                    header: '분류',
                    key: 'gr_name',
                    width: 10,
                    style: {
                        alignment: { horizontal: 'center' },
                    },
                },
                {
                    header: '사이트 이름',
                    key: 'name',
                    width: 30,
                },
                {
                    header: 'URL',
                    key: 'url',
                    width: 50,
                },
                {
                    header: 'URL 상태',
                    key: 'status',
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

            worker.postMessage({ list: this.excelDownList, columns: setColnameHeader, sheetName: `관리자사이트(수집)-${this.activeGrpItem.name}` });

            worker.onmessage = (e) => {
                const blob = e.data;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `관리자사이트(수집)-${this.activeGrpItem.name}.xlsx`;
                a.click();
                URL.revokeObjectURL(url);
                this.excelLoading = false;
                worker.terminate();
            };
        },

        /**
         * 사이트 그룹 추가
         * @param {String} addGrpName 사이트 그룹명
         */
        async addUserGroup(addGrpName) {
            const params = { type: 'i', gr_name: addGrpName };

            await API_groupmanage(this.apiUID, params)
                .then((res) => {
                    this.fetchGroupList('addItem');
                    this.parsingSiteList();
                    this.$store.dispatch('NOTY_COM', `사이트 그룹 추가를 성공했습니다.`);
                })
                .catch((err) => {
                    console.error('addUserGroup:', err);
                    this.$store.dispatch('NOTY_ERR', `사이트 그룹 추가를 실패했습니다.`);
                });
        },

        /**
         * 사이트 그룹 수정
         * @param {Object} val 수정할 사이트 그룹 정보
         */
        async evtModifyGrp(val) {
            const params = { type: 'u', grp: parseInt(val.grp), gr_name: val.name };
            this.evtClickGrpItem(structuredClone(val));
            await API_groupmanage(this.apiUID, params)
                .then((res) => {
                    this.fetchGroupList('currentItem');
                    this.parsingSiteList();
                    this.$store.dispatch('NOTY_COM', `사이트 그룹 수정을 성공했습니다.`);
                })
                .catch((err) => {
                    console.error('evtModifyGrp:', err);
                    this.$store.dispatch('NOTY_ERR', `사이트 그룹 수정을 실패했습니다.`);
                });
        },

        /**
         * 사이트 그룹 삭제
         * @param {Object} val 삭제할 사이트 그룹 정보
         */
        async evtDeleteGrp(val) {
            const params = { type: 'd', grp: parseInt(val.grp) };
            await API_groupmanage(this.apiUID, params)
                .then((res) => {
                    this.$emit('updateSite');
                    this.$store.dispatch('NOTY_COM', `사이트 그룹 삭제를 성공했습니다.`);
                })
                .catch((err) => {
                    console.error('evtDeleteGrp:', err);
                    this.$store.dispatch('NOTY_ERR', `사이트 그룹 삭제를 실패했습니다.`);
                });
        },

        /**
         * 수집 사이트 파싱
         */
        parsingSiteList() {
            let originList = structuredClone(this.originSiteList);
            let groupSiteList = this.activeGrpItem.grp === 'all' ? originList : originList.filter((site) => this.activeGrpItem.grp === site.grp);

            if (this.searchKeyword.trim().length) {
                const regex = new RegExp(this.searchKeyword.trim(), 'i');
                groupSiteList = groupSiteList.filter((site) => regex.test(site.s_seq) || regex.test(site.name) || regex.test(site.url));
            }

            this.useSiteList = groupSiteList.filter((item) => this.language.indexOf(item.lang) >= 0);
        },

        /**
         * 사이트 그룹 파싱
         * @param {String} activeGrpType
         */
        parsingGrpList(activeGrpType) {
            const updatedGrpList = structuredClone(this.useGrpList);

            updatedGrpList.forEach((item, idx) => {
                // 그룹 내 사이트 개수
                if (item.grp === 'all') item.siteAmount = this.originSiteList.length;
                else item.siteAmount = this.originSiteList.filter((site) => String(site.grp) === String(item.grp)).length;

                // 사이트 그룹 active
                if (activeGrpType) {
                    switch (activeGrpType) {
                        case 'all':
                            if (item.grp === 'all') {
                                item.isActive = true;
                                this.activeGrpItem = item;
                            } else {
                                item.isActive = false;
                            }
                            break;

                        case 'currentItem':
                            if (this.useGrpList.findIndex((item) => item.grp === this.activeGrpItem.grp) < 0) {
                                if (item.grp === 'all') {
                                    item.isActive = true;
                                    this.activeGrpItem = item;
                                } else {
                                    item.isActive = false;
                                }
                            } else {
                                if (this.activeGrpItem.grp === item.grp) {
                                    item.isActive = true;
                                    this.activeGrpItem = item;
                                } else {
                                    item.isActive = false;
                                }
                            }
                            break;

                        case 'addItem':
                            if (idx == updatedGrpList.length - 1) {
                                item.isActive = true;
                                this.activeGrpItem = item;
                            } else {
                                item.isActive = false;
                            }
                            break;
                    }
                } else {
                    if (item.grp === 'all') {
                        item.isActive = true;
                        this.activeGrpItem = item;
                    } else {
                        item.isActive = false;
                    }
                }
            });

            this.useGrpList = updatedGrpList;
        },

        /**
         * 사이트 그룹 활성화 함수
         * @param {String} activeGrp
         */
        evtClickGrpItem(activeGrp) {
            const updatedGrpList = structuredClone(this.useGrpList);

            updatedGrpList.forEach((item) => {
                if (item.grp === activeGrp) {
                    item.isActive = true;
                    this.activeGrpItem = item;
                } else item.isActive = false;
            });
            this.useGrpList = [...updatedGrpList];
        },

        /**
         * 수집 사이트 검색
         * @param {String} val 검색 키워드
         */
        evtSearch(val) {
            if (val.trim().length) {
                const regex = new RegExp(val.trim(), 'i');
                this.useSiteList = this.originSiteList.filter((site) => regex.test(site.s_seq) || regex.test(site.name) || regex.test(site.url));
            } else this.parsingSiteList();
            this.useSearchKeyword = val.trim();
        },

        /**
         * 사이트 선택 목록 초기화
         */
        initialToSelected() {
            this.resetSelected = true;
            setTimeout(() => {
                this.resetSelected = false;
            }, 0);
        },

        /**
         * 사이트 선택 목록
         */
        evtSelected(val) {
            this.selected = [...val];
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
