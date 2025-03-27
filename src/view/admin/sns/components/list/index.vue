<template>
    <div class="ui_box ui-loader-container" :class="{ 'is-loading': loading }">
        <div class="ui_function is-box-large" :class="{ 'is-lnb': getUseageLNB }">
            <div v-if="getUserPermissions >= 2" class="lc">
                <comp-button @click="clickRegist">
                    <span class="txt ui-ellipsis">등록</span>
                </comp-button>

                <comp-button v-if="getUserPermissions >= 3" @click="clickBulkRemove" :disabled="!checkedItems.length">
                    <span class="txt ui-ellipsis">{{ `일괄삭제(${parseInt(checkedItems.length).addComma()}개)` }}</span>
                </comp-button>
            </div>
            <div class="rc">
                <comp-input-box id="brd_searchKeyword" v-model="brdOpts.input_search_keyword" type="search" placeholder="매체명 검색" focusResetVisible @search="searchKeyword" style="width: 500px"> </comp-input-box>
            </div>
        </div>
        <div class="content">
            <div class="ui_brd">
                <div class="infos">
                    <div class="lc">
                        <div class="page_info">
                            <span
                                >총 <strong>{{ getBrdDatas.length.lengthLimitComma(0) }}</strong> 건</span
                            >
                        </div>
                    </div>
                    <div class="rc">
                        <comp-filter-grp pos="BR">
                            <template v-slot:custom>
                                <comp-button class="is-small is-icon-only"><span class="icon">&#xe057;</span></comp-button>
                            </template>
                            <template v-slot:items>
                                <dl>
                                    <dt>
                                        <strong>노출필드</strong>
                                        <comp-button class="is-small is-icon-only" style="margin-left: 4px" @click="resetColOpts"><span class="icon">&#xe020;</span></comp-button>
                                    </dt>
                                    <dd>
                                        <dl v-for="item in Object.keys(getSaveColOpts)" :key="item">
                                            <dt>{{ colOpts.getParseDatas({ code: item })[0]?.name }}</dt>
                                            <dd>
                                                <comp-switch-btn :id="`${item}_switch`" class="is-small" v-model="getSaveColOpts[item]" />
                                            </dd>
                                        </dl>
                                    </dd>
                                </dl>
                            </template>
                        </comp-filter-grp>
                        <comp-button class="is-small is-icon-with" title="엑셀 다운로드" @click="$emit('excelDownload', getBrdDatas)" :loading="excelLoading" :disabled="getBrdDatas?.length === 0"><span class="icon">&#xe005;</span><span class="txt">Excel</span></comp-button>
                    </div>
                </div>
                <div class="wrap">
                    <virtual-list data-key="seq" :data-sources="getBrdDatas" :keeps="60" :data-component="{}" root-tag="table" header-tag="thead" wrap-tag="tbody" footer-tag="tbody" :pageMode="true">
                        <template #colgroup>
                            <col v-if="getUserPermissions >= 3" style="width: 50px" />
                            <col v-if="getSaveColOpts.site_name" style="width: 20%" />
                            <col v-if="getSaveColOpts.sns_seq" style="width: 20%" />
                            <col v-if="getSaveColOpts.url" style="width: 40%" />
                            <col v-if="getSaveColOpts.reg_dt" style="width: 140px" />
                            <col v-if="getUserPermissions >= 3" style="width: 50px" />
                        </template>

                        <template #header>
                            <tr style="height: 50px">
                                <th v-if="getUserPermissions >= 3">
                                    <comp-checkbox id="sns_allCheck" class="is-small is-board" v-model="allCheck" @click.stop="clickAllCheck" />
                                </th>
                                <th v-if="getSaveColOpts.site_name">
                                    <strong>매체명</strong>
                                    <comp-table-sort id="site_name" name="orderColumn" v-model="brdOpts.order" />
                                </th>
                                <th v-if="getSaveColOpts.sns_seq">
                                    <comp-table-filter id="table_filter_sns_seq" name="SNS 계정" v-model="tableFilter.sns_seq" :opts="getSnsMasetList" :multi="true" :labelVisibleNum="1" />
                                    <comp-table-sort id="sns_seq" name="orderColumn" v-model="brdOpts.order" />
                                </th>
                                <th v-if="getSaveColOpts.url">
                                    <strong>URL</strong>
                                </th>
                                <th v-if="getSaveColOpts.reg_dt">
                                    <strong>등록일</strong>
                                    <comp-table-sort id="reg_dt" name="orderColumn" v-model="brdOpts.order" />
                                </th>
                                <th v-if="getUserPermissions >= 3">
                                    <strong>삭제</strong>
                                </th>
                            </tr>
                        </template>

                        <!-- 데이터 있을 때 -->
                        <template #item="{ item }" v-if="getBrdDatas.length">
                            <tr :class="{ 'is-selected': editItem?.seq === item.seq }" @click="setEditItem(item)">
                                <td v-if="getUserPermissions >= 3">
                                    <comp-checkbox :id="`sns_${item.seq}`" class="is-small is-board" :val="item.seq" v-model="checkedItems" @click.stop />
                                </td>

                                <td v-if="getSaveColOpts.site_name" class="ui_fc_dm">
                                    <span v-if="brdOpts.search_keyword" v-html="parseHighlightWords(item.site_name)" />
                                    <span v-else>{{ item.site_name }}</span>
                                </td>
                                <td v-if="getSaveColOpts.sns_seq">
                                    <span class="ui_fc_dm">{{ getSnsMasetList.getParseDatas({ code: item.sns_seq })[0].name }}</span>
                                </td>
                                <td v-if="getSaveColOpts.url" class="ui_al">
                                    <a :href="item.url.buzmsLink()" class="lnk" target="_blank" title="새창에서 링크 열기" @click.stop
                                        ><strong>{{ item.url }}</strong></a
                                    >
                                </td>
                                <td v-if="getSaveColOpts.reg_dt" class="ui_fc_dm">
                                    <span>{{ item.reg_dt.dateToStr() }}</span>
                                </td>
                                <td v-if="getUserPermissions >= 3">
                                    <comp-button class="is-xsmall is-icon-only" @click.stop="evt_remove(item)">
                                        <span class="icon">&#xe022;</span>
                                    </comp-button>
                                </td>
                            </tr>
                        </template>

                        <!-- 데이터 없을 때 -->
                        <template #footer v-else>
                            <tr class="is-no-over">
                                <td class="is-no-over no_data in_list" :colspan="getColCnt">
                                    <span class="ui_no_data_txt">데이터가 없습니다.</span>
                                </td>
                            </tr>
                        </template>
                    </virtual-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VirtualList from 'vue-virtual-scroll-list';
import { excelDownload } from '@shared/utils/prototype/util.link';

export default {
    name: 'snsacount-list',
    data() {
        return {
            loading: false,
            brdOpts: {
                input_search_keyword: '',
                search_keyword: '',
                order: 'site_name^A',
            },
            colOpts: [
                { code: 'site_name', name: '매체명' },
                { code: 'sns_seq', name: 'SNS 계정' },
                { code: 'url', name: 'URL' },
                { code: 'reg_dt', name: '등록일' },
            ],
            tableFilter: {
                sns_seq: '',
            },
            checkedItems: '',
            allCheck: false,
        };
    },
    components: {},
    props: {
        // 개인화 데이터
        savePersonalization: { type: Object },
        // 게시판 데이터
        dataList: { type: Array, required: true },
        // 데이터셋
        dataSet: { type: Object, default: null, required: true },
        // 수정 아이템
        editItem: { type: Object },
        // 엑셀 다운로드 로딩상태
        excelLoading: { type: Boolean },
    },
    computed: {
        ...mapGetters(['getUseageLNB', 'getUserPermissions']),
        getSavePersonalization: {
            get() {
                return this.savePersonalization;
            },
            set(val) {
                this.$emit('update:savePersonalization', val);
            },
        },
        getSaveColOpts() {
            return this.getSavePersonalization?.main?.data_list?.colOpts;
        },
        getColCnt() {
            const { length } = Object.values(this.getSaveColOpts).filter((val) => val);

            // 체크박스, 삭제 행 제거
            if (this.getUserPermissions < 3) {
                return length - 2;
            }

            return length;
        },

        // 게시판 목록 데이터
        getBrdDatas() {
            // 검색어
            const searchResult = this.dataList.filter((item) => item.site_name.match(new RegExp(this.brdOpts.search_keyword, 'gi')));

            // 테이블 필터링
            const tableFilter = this.getSnsMasetList.getParseDatas({ code: this.tableFilter.sns_seq }).arrObjAttrToStr('code').split(',').map(String);
            const result = searchResult.filter((item) => {
                return tableFilter.includes(String(item.sns_seq));
            });

            // 정렬
            const order = this.brdOpts.order.split('^');
            result.sort((a, b) => {
                const itemA = a[order[0]];
                const itemB = b[order[0]];

                // 오름차순
                if (order[1] === 'D') {
                    if (itemA < itemB) return 1;
                    if (itemA === itemB) return 0;
                    if (itemA > itemB) return -1;
                }
                // 내림차순
                else if (order[1] === 'A') {
                    if (itemA > itemB) return 1;
                    if (itemA === itemB) return 0;
                    if (itemA < itemB) return -1;
                }
            });
            this.resetCheckedItems();
            return result;
        },

        // SNS 마스터 목록
        getSnsMasetList() {
            return this.dataSet.snsMaster;
        },
    },
    mounted() {
        // 초기 SNS계정값 설정
        this.tableFilter.sns_seq = this.dataSet.snsMaster ? this.dataSet.snsMaster.arrObjAttrToStr('code') : '';
    },
    watch: {
        checkedItems(val) {
            this.allCheck = val.length == this.getBrdDatas.length;
        },
    },
    methods: {
        /**
         * 계정 등록 클릭이벤트
         * aside가 닫혀 있으면 클릭 트리거
         */
        clickRegist() {
            // aside가 닫혀있는지 확인
            if (document.querySelector('aside').classList.contains('is-closed')) {
                // aisde 펼침 버튼 클릭 트리거
                document.querySelector('.resizer button').click();
            }
            this.setEditItem({});
        },

        /**
         * 계정 일괄삭제 클릭이벤트
         */
        clickBulkRemove() {
            const params = { type: 'd', seq: this.checkedItems.join(',') };
            this.$emit('update', params);
        },

        /**
         *   데이터목록 개인화 > 노출필드 기본값으로 변경(전체 true)
         */
        resetColOpts() {
            Object.keys(this.getSaveColOpts).forEach((item) => {
                this.getSaveColOpts[item] = true;
            });
        },

        /**
         * 수정 대상 상위 컴포넌트에 전달/toggle
         */
        setEditItem(item) {
            if (Object.keys(item).length && JSON.stringify(item) === JSON.stringify(this.editItem)) {
                this.$emit('update:editItem', {});
            } else {
                this.$emit('update:editItem', item);
            }
        },

        /**
         * 검색어 trim및 적용
         */
        searchKeyword() {
            this.brdOpts.input_search_keyword = this.brdOpts.input_search_keyword.trim();
            this.brdOpts.search_keyword = this.brdOpts.input_search_keyword;
        },

        /**
         * 검색 키워드에 하이라이팅
         * @param {String} word
         * @return {String} 키워드 일치하는 부분에 하이라이트된 코드
         */
        parseHighlightWords(word) {
            const inputKeyword = this.brdOpts.search_keyword;

            if (inputKeyword.trim().length && word) {
                const colReg = new RegExp(inputKeyword, 'gi');
                word = String(word).replace(colReg, (word) => `<span class="is-hl-inputkeyword">${word}</span>`);
            }

            return word || '';
        },

        /**
         * 아이템 체크 여부 확인
         */
        isChecked(seq) {
            return this.checkedItems.includes(seq);
        },

        /**
         * 전체 선택 체크 박스 클릭
         */
        clickAllCheck() {
            if (this.allCheck) {
                this.checkedItems = [];
            } else {
                this.checkedItems = this.getBrdDatas.map((item) => item.seq);
            }
        },

        /**
         * 체크 박스 클릭이벤트
         */
        clickCheckBox(e, seq) {
            if (this.isChecked(seq)) {
                this.checkedItems = this.checkedItems.filter((item) => item !== seq);
            } else {
                this.checkedItems.push(seq);
            }
        },

        /**
         * 체크 아이템 초기화
         */
        resetCheckedItems() {
            this.checkedItems = [];
        },

        /**
         * Event - 삭제
         */
        evt_remove(item) {
            this.$emit('update', { ...{ type: 'd' }, ...item });
        },
    },
};

export const CompHeader = {};
</script>

<style src="./style.scss" lang="scss" scoped />
