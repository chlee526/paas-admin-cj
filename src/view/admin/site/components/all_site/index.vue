<template>
    <div ref="allSite" class="all_site ui_box ui-loader-container" :class="{ 'is-loading': loading }">
        <div class="ui_function">
            <div class="lc">
                <comp-selectbox id="lang_select" v-model="language" :opts="siteLangs" all-selected-label="언어 전체" style="width: 100px"></comp-selectbox>
                <comp-selectbox id="sort_select" v-model="sort.value" :opts="sort.opts" not-selected-label="정렬" style="width: 90px"></comp-selectbox>
            </div>
            <div class="rc">
                <comp-input-box id="all_site_search" type="search" v-model="searchKeyword" placeholder="코드, 사이트명, URL" @search="evtSearch" style="width: 80%"></comp-input-box>
                <comp-button class="is-icon-with is-before" title="전체 사이트 목록 엑셀 다운로드" @click="evtExcelClick" :loading="excelLoading" :disabled="useSiteList?.length === 0"><span class="icon">&#xe005;</span><span class="txt">Excel</span></comp-button>
            </div>
        </div>
        <!-- 수집 등록 컨트롤러 -->
        <Controller v-if="hasAdminPermission" type="register" :amount="selected.length" :disabled="disabledController" :activeGrpItem="activeSiteGrp" @clickDeselect="initialToSelected" @clickController="registerSite" @openPopover="hndlOpenPopover"></Controller>
        <!-- 사이트 목록 -->
        <div class="contents">
            <SiteList ref="allSiteList" id="all_site_list" class="allSiteList" :listData="useSiteList" :resetSelected="resetSelected" @selectedUpdate="evtSelected"></SiteList>
            <div v-if="!useSiteList.length" class="site_list no_data"><span class="ui_no_data_txt">데이터가 없습니다.</span></div>
        </div>
        <!-- 사이트 그룹 선택 팝오버 -->
        <comp-filter-grp ref="registerPopover" class="register_popover" useBtns :getNoIconWrapPos="registerPopoverPos" @cancel="selectSiteGrp = ''">
            <template v-slot:custom> </template>
            <template v-slot:items>
                <div><strong>사이트 그룹을 선택 해주세요.</strong></div>
                <ul class="wrap">
                    <li v-for="item in getSiteGrpList" :key="item.grp">
                        <comp-button :class="{ 'is-active': item.grp === selectSiteGrp }" :data-grp="item.grp" @click="evtSiteGrpClick"
                            ><span class="txt">{{ item.name }}</span></comp-button
                        >
                    </li>
                </ul>
            </template>
        </comp-filter-grp>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import { mapGetters } from 'vuex';
import { excelDownload } from '@shared/utils/prototype/util.link';

import Controller from '../controller';
import SiteList from '../site_list';

import { API_siteList } from '@/api/admin/site/all';
import { API_sitemanage } from '@/api/admin/site/collect';

export default {
    name: 'comp-all-site',
    data() {
        return {
            excelDownList: [],
            apiUID: uuid.v4(),
            loading: false,
            excelLoading: false,
            language: '',
            sort: {
                value: '',
                opts: [
                    { code: '', name: '정렬' },
                    { code: 's_seq', name: '최신순' },
                    { code: 'name', name: '사이트명' },
                ],
            },
            searchKeyword: '',
            useSearchKeyword: '',
            originSiteList: [],
            useSiteList: [],
            selected: [],
            disabledController: true,
            registerPopoverPos: {}, // 팝오버 포지션
            activeSiteGrp: null,
            selectSiteGrp: '',
            resetSelected: false,
        };
    },
    components: {
        Controller,
        SiteList,
    },
    props: {
        siteGrpList: { type: Array, default: null }, // 사이트 그룹 목록
        isUpdateSite: { type: Boolean }, // 사이트 업데이트 여부
        siteLangs: { type: Array, default: null }, // 사이트 언어 옵션
    },
    computed: {
        ...mapGetters(['getUserPermissions']),

        // 등록/수정 권한
        hasAdminPermission() {
            return this.getUserPermissions >= 2;
        },

        getSiteGrpList() {
            return this.siteGrpList.filter((item) => item.grp !== 'all');
        },
    },
    mounted() {
        this.fetchSiteList();
    },
    watch: {
        // 사이트 그룹 목록
        siteGrpList: {
            deep: true,
            handler(val) {
                this.activeSiteGrp = val.find((item) => item.isActive);
            },
        },

        // 사이트 선택 목록
        selected: {
            deep: true,
            handler(val, oldVal) {
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
            this.getSiteList();
        },

        // 정렬
        'sort.value': function (val) {
            this.getSiteList();
        },

        // 사이트 업데이트
        isUpdateSite(val) {
            if (val) this.fetchSiteList();
            this.$emit('updateLangs', structuredClone(this.getLangOpts));
        },
    },
    methods: {
        /**
         * 수집 사이트 등록
         */
        async registerSite(selectedSiteGrp) {
            const params = { type: 'i', grp: selectedSiteGrp ? parseInt(selectedSiteGrp) : parseInt(this.activeSiteGrp.grp), s_seq: this.selected.join(',') };

            await API_sitemanage(this.apiUID, params)
                .then((res) => {
                    this.$emit('updateSite');
                    this.$emit('updateActiveGrp', this.selectSiteGrp);
                    this.initialToSelected();
                    this.$store.dispatch('NOTY_COM', `사이트 수집 등록을 성공했습니다.`);
                })
                .catch((err) => {
                    console.error('registerSite:', err);
                    this.$store.dispatch('NOTY_ERR', `사이트 수집 등록을 실패했습니다.`);
                });
        },

        /**
         * 엑셀 다운로드 클릭
         */
        async evtExcelClick() {
            this.excelLoading = true;
            this.excelDownList = this.setExcelForm(this.useSiteList);
            this.exportExcel();
            // await this.fetchSiteList('excel');
        },

        /**
         * 전체 사이트 목록
         */
        async fetchSiteList(excel) {
            let param;

            if (!excel) this.loading = true;
            else {
                param = {
                    search_keyword: this.useSearchKeyword,
                    excel: 1,
                };
                this.excelLoading = true;
            }

            await API_siteList(this.apiUID, param)
                .then((res) => {
                    if (!excel) {
                        this.originSiteList = structuredClone(res.data.result.list);
                        this.getSiteList();
                    } else {
                        this.excelDownList = this.setExcelForm(res?.data?.result?.list);
                        this.exportExcel();
                        // excelDownload(res?.data?.result?.excelLink);
                    }
                })
                .catch((err) => {
                    if (!excel) this.$store.dispatch('NOTY_ERR', '전체 사이트 목록 조회를 실패했습니다.');
                    else this.$store.dispatch('NOTY_ERR', '전체 사이트 목록 엑셀 요청에 실패 했습니다.');
                })
                .finally(() => {
                    if (!excel) {
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

            worker.postMessage({ list: this.excelDownList, columns: setColnameHeader, sheetName: '관리자사이트(미수집)-전체' });

            worker.onmessage = (e) => {
                const blob = e.data;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '관리자사이트(미수집)-전체.xlsx';
                a.click();
                URL.revokeObjectURL(url);
                this.excelLoading = false;
                worker.terminate();
            };
        },

        /**
         * 사이트 목록 파싱
         */
        getSiteList() {
            let originList = structuredClone(this.originSiteList);

            // 정렬
            if (this.sort.value) {
                originList.sort((a, b) => {
                    if (this.sort.value === 's_seq') {
                        return parseInt(b.s_seq) - parseInt(a.s_seq);
                    } else if (this.sort.value === 'name') {
                        return a.name.localeCompare(b.name, 'ko');
                    }
                    return 0;
                });
            } else {
                originList.sort((a, b) => parseInt(a.s_seq) - parseInt(b.s_seq));
            }

            // 검색
            if (this.searchKeyword.trim().length) {
                const regex = new RegExp(this.searchKeyword.trim(), 'i');
                originList = originList.filter((site) => regex.test(site.s_seq) || regex.test(site.name) || regex.test(site.url));
            }
            this.useSiteList = originList.filter((item) => this.language.indexOf(item.lang) >= 0);
        },

        /**
         * 사이트 선택 목록
         * @param {Array} val
         */
        evtSelected(val) {
            this.selected = [...val];
        },

        /**
         * 사이트 검색
         * @param {String} val 검색 키워드
         */
        evtSearch(val) {
            if (val.trim().length) {
                const regex = new RegExp(val.trim(), 'i');
                this.useSiteList = this.originSiteList.filter((site) => regex.test(site.s_seq) || regex.test(site.name) || regex.test(site.url));
            } else {
                this.getSiteList();
            }
            this.useSearchKeyword = val.trim();
        },

        /**
         * 선택 목록 초기화
         */
        initialToSelected() {
            this.selectSiteGrp = '';
            this.$refs.registerPopover?.hndl_close();
            this.resetSelected = true;
            setTimeout(() => {
                this.resetSelected = false;
            }, 0);
        },

        /**
         * 수집 등록 팝오버 position 설정
         */
        getRegisterPopoverPos() {
            const targetPos = this.$refs.allSite?.getBoundingClientRect();
            this.registerPopoverPos = { top: targetPos.top + 100 + 'px', left: targetPos.right + 80 + 'px' };
        },

        /**
         * 수집 등록 팝오버 오픈
         * 사이트 그룹 전체일경우 수집등록 클릭시 팝오버 오픈
         */
        hndlOpenPopover() {
            this.getRegisterPopoverPos();
            this.$refs.registerPopover?.hndl_open();
        },

        /**
         * 수집 등록 팝오버 - 사이트 그룹 버튼 클릭 이벤트
         *  * @param {event} e
         */
        evtSiteGrpClick(e) {
            this.selectSiteGrp = e.currentTarget.dataset.grp;
            this.$refs.registerPopover?.hndl_close();
            this.registerSite(this.selectSiteGrp);
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
