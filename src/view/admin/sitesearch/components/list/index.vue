<template>
    <div class="ui_box ui-loader-container" :class="{ 'is-loading': loading }">
        <div class="ui_function is-box-large" :class="{ 'is-lnb': getUseageLNB }">
            <div v-if="getUserPermissions >= 2" class="lc">
                <comp-button @click="clickRegist">
                    <span class="txt ui-ellipsis">등록</span>
                </comp-button>

                <comp-button-grp ref="button_grp" :useBtns="false">
                    <template #title>
                        <comp-button :disabled="!checkedItems.length">
                            <span class="txt ui-ellipsis">일괄설정({{ checkedItems.length }}개)</span>
                        </comp-button>
                    </template>

                    <template #items>
                        <comp-button v-if="getUserPermissions >= 3" @click="clickBulkRemove()">
                            <span class="txt ui-ellipsis">삭제</span>
                        </comp-button>
                        <comp-button @click="clickBlukUpdate('Y')">
                            <span class="txt ui-ellipsis">사용</span>
                        </comp-button>
                        <comp-button @click="clickBlukUpdate('N')">
                            <span class="txt ui-ellipsis">미사용</span>
                        </comp-button>
                    </template>
                </comp-button-grp>
            </div>
            <div class="rc">
                <comp-input-box id="brd_searchKeyword" v-model="brdOpts.input_search_keyword" type="search" placeholder="매체명 검색" focusResetVisible @search="searchKeyword">
                    <comp-selectbox slot="inputSelect" id="brd_searchType" v-model="brdOpts.search_type.value" :opts="brdOpts.search_type.opts"></comp-selectbox>
                </comp-input-box>
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
                    </div>
                </div>
                <div class="wrap">
                    <virtual-list data-key="s_seq" :data-sources="getBrdDatas" :keeps="60" :data-component="{}" root-tag="table" header-tag="thead" wrap-tag="tbody" footer-tag="tbody" :pageMode="true">
                        <template #colgroup>
                            <col v-if="getUserPermissions >= 2" style="width: 50px" />
                            <col v-if="getSaveColOpts.s_seq" style="width: 100px" />
                            <col v-if="getSaveColOpts.s_name_rsn" style="width: 120px" />
                            <col v-if="getSaveColOpts.s_name_cj" style="width: 120px" />
                            <col v-if="getSaveColOpts.s_name_search" style="width: 120px" />
                            <col v-if="getSaveColOpts.url" />
                            <col v-if="getSaveColOpts.s_writer" style="width: 80px" />
                            <col v-if="getSaveColOpts.reg_date" style="width: 100px" />
                            <col v-if="getSaveColOpts.s_modifier" style="width: 80px" />
                            <col v-if="getSaveColOpts.modi_date" style="width: 100px" />
                            <col v-if="getSaveColOpts.use_yn" style="width: 60px" />
                            <col v-if="getUserPermissions >= 3" style="width: 50px" />
                        </template>

                        <template #header>
                            <tr style="height: 50px">
                                <th v-if="getUserPermissions >= 2">
                                    <comp-checkbox id="sns_allCheck" class="is-small is-board" v-model="allCheck" @click.stop="clickAllCheck" />
                                </th>
                                <th v-if="getSaveColOpts.s_seq">
                                    <strong>매체번호</strong>
                                    <comp-table-sort id="s_seq" name="orderColumn" v-model="brdOpts.order" />
                                </th>
                                <th v-if="getSaveColOpts.s_name_rsn">
                                    <strong>사이트(RSN)</strong>
                                </th>
                                <th v-if="getSaveColOpts.s_name_cj">
                                    <strong>매체명<br />(CJ)</strong>
                                    <comp-table-sort id="s_name_cj" name="orderColumn" v-model="brdOpts.order" />
                                </th>
                                <th v-if="getSaveColOpts.s_name_search">
                                    <strong>검색어</strong>
                                    <comp-table-sort id="s_name_search" name="orderColumn" v-model="brdOpts.order" />
                                </th>
                                <th v-if="getSaveColOpts.url">
                                    <strong>URL</strong>
                                </th>
                                <th v-if="getSaveColOpts.s_writer">
                                    <strong>작성자</strong>
                                </th>
                                <th v-if="getSaveColOpts.reg_date">
                                    <strong>작성일</strong>
                                    <comp-table-sort id="reg_date" name="orderColumn" v-model="brdOpts.order" />
                                </th>
                                <th v-if="getSaveColOpts.s_modifier">
                                    <strong>수정자</strong>
                                </th>
                                <th v-if="getSaveColOpts.modi_date">
                                    <strong>수정일</strong>
                                </th>
                                <th v-if="getSaveColOpts.use_yn">
                                    <comp-table-filter id="table_filter_sg_seqs" name="사용" v-model="brdOpts.use_yn.value" :opts="brdOpts.use_yn.opts" :multi="true"></comp-table-filter>
                                </th>
                                <th v-if="getUserPermissions >= 3">
                                    <strong>삭제</strong>
                                </th>
                            </tr>
                        </template>

                        <!-- 데이터 있을 때 -->
                        <template #item="{ item }" v-if="getBrdDatas.length">
                            <tr :class="{ 'is-selected': editItem?.s_seq === item.s_seq }" @click="setEditItem(item)">
                                <td v-if="getUserPermissions >= 2">
                                    <comp-checkbox :id="`brd_${item.s_seq}`" class="is-small is-board" :val="item.s_seq" v-model="checkedItems" @click.stop />
                                </td>
                                <td v-if="getSaveColOpts.s_seq">
                                    <strong v-if="brdOpts.search_type.value === 's_seq'" v-html="parseHighlightWords(item.s_seq)" />
                                    <strong v-else>{{ item.s_seq }}</strong>
                                </td>

                                <td v-if="getSaveColOpts.s_name_rsn" class="ui_fc_dm">
                                    <span>{{ item.s_name_rsn }}</span>
                                </td>

                                <td v-if="getSaveColOpts.s_name_cj" class="ui_fc_dm">
                                    <span v-if="brdOpts.search_type.value === 's_name_cj'" v-html="parseHighlightWords(item.s_name_cj)" />
                                    <span v-else>{{ item.s_name_cj }}</span>
                                </td>

                                <td v-if="getSaveColOpts.s_name_search" class="ui_fc_dm">
                                    <span>{{ item.s_name_search }}</span>
                                </td>

                                <td v-if="getSaveColOpts.url" class="ui_al ui_fc_dm">
                                    <a :href="item.url.buzmsLink()" class="lnk" target="_blank" title="새창에서 링크 열기" @click.stop
                                        ><span>{{ item.url }}</span></a
                                    >
                                </td>

                                <td v-if="getSaveColOpts.s_writer" class="ui_fc_dm">
                                    <span v-if="brdOpts.search_type.value === 's_writer'" v-html="parseHighlightWords(item.s_writer)" />
                                    <span v-else>{{ item.s_writer }}</span>
                                </td>

                                <td v-if="getSaveColOpts.reg_date" class="ui_fc_dm" :title="item.reg_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss')">
                                    <span>{{ item.reg_date.dateToStr() }}</span>
                                </td>

                                <td v-if="getSaveColOpts.s_modifier" class="ui_fc_dm">
                                    <span v-if="brdOpts.search_type.value === 's_modifier'" v-html="parseHighlightWords(item.s_modifier)" />
                                    <span v-else>{{ item.s_modifier || '-' }}</span>
                                </td>

                                <td v-if="getSaveColOpts.modi_date" class="ui_fc_dm" :title="item.modi_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss')">
                                    <span>{{ item.modi_date.dateToStr() }}</span>
                                </td>

                                <td v-if="getSaveColOpts.use_yn" @click.stop="evt_update(item)">
                                    <comp-switch-btn :id="`${item.s_seq}_use_yn`" class="is-xxsmall" :valForm="getUseYNOpts" :disabled="getUserPermissions < 2" v-model="item.use_yn" />
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

export default {
    name: 'comp-list-sitesearch',
    data() {
        return {
            loading: false,
            brdOpts: {
                input_search_keyword: '',
                search_keyword: '',
                search_type: {
                    value: '',
                    opts: [
                        { code: 's_seq', name: '매체번호' },
                        { code: 's_name_cj', name: '매체명' },
                        { code: 's_name_search', name: '검색어' },
                        { code: 's_writer', name: '작성자' },
                        { code: 's_modifier', name: '수정자' },
                    ],
                },
                order: 'reg_date^D',
                use_yn: {
                    value: '',
                    opts: [],
                },
            },
            colOpts: [
                { code: 's_seq', name: '매체번호' },
                { code: 's_name_rsn', name: '사이트(RSN)' },
                { code: 's_name_cj', name: '매체명(CJ)' },
                { code: 's_name_search', name: '검색어' },
                { code: 'url', name: 'URL' },
                { code: 's_writer', name: '등록자' },
                { code: 'reg_date', name: '등록일' },
                { code: 's_modifier', name: '수정자' },
                { code: 'modi_date', name: '수정일' },
                { code: 'use_yn', name: '사용' },
            ],
            checkedItems: [],
            allCheck: false,
        };
    },
    components: {},
    props: {
        // 개인화 데이터
        savePersonalization: { type: Object },
        // 게시판 데이터
        dataList: { type: Array, required: true },
        // 수정 아이템
        editItem: { type: Object },
    },
    computed: {
        ...mapGetters(['getUseageLNB', 'getUseYNOpts', 'getUserPermissions']),
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
            return Object.values(this.getSaveColOpts).filter((val) => val).length + 2;
        },

        // 게시판 목록 데이터
        getBrdDatas() {
            // 검색어
            const searchResult = this.dataList.filter((item) => {
                const { value } = this.brdOpts.search_type;
                const target = item[value] || '';
                return target.match(new RegExp(this.brdOpts.search_keyword, 'gi'));
            });

            // 테이블 필터링
            const filteredList = searchResult.filter((item) => {
                const filter = this.brdOpts.use_yn.value.split(',');
                return filter.includes(String(item.use_yn));
            });

            // 정렬
            const [key, order] = this.brdOpts.order.split('^');
            filteredList.sort((a, b) => {
                // s_seq는 number로 비교
                const itemA = key === 's_seq' ? Number(a[key]) : a[key];
                const itemB = key === 's_seq' ? Number(b[key]) : b[key];

                // 오름차순
                if (order === 'D') {
                    if (itemA < itemB) return 1;
                    if (itemA === itemB) return 0;
                    if (itemA > itemB) return -1;
                }
                // 내림차순
                else if (order === 'A') {
                    if (itemA > itemB) return 1;
                    if (itemA === itemB) return 0;
                    if (itemA < itemB) return -1;
                }
            });

            this.resetCheckedItems();

            return filteredList;
        },
    },
    created() {
        this.brdOpts.use_yn = {
            opts: [...this.getUseYNOpts],
            value: this.getUseYNOpts.arrObjAttrToStr('code'),
        };
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
            this.$emit('update', {
                type: 'd',
                s_seq: this.checkedItems.join(','),
            });
            this.$refs.button_grp.Set_Expanded(false);
        },

        /**
         *   데이터목록 개인화 > 노출필드 기본값으로 변경(reset 항목만 true)
         */
        resetColOpts() {
            Object.keys(this.getSaveColOpts).forEach((item) => {
                const RESET = ['s_seq', 's_name_cj', 's_name_search', 'url', 's_writer', 'reg_date', 'use_yn'];
                this.getSaveColOpts[item] = RESET.includes(item);
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
            const { search_keyword } = this.brdOpts;

            if (search_keyword.trim().length && word) {
                const colReg = new RegExp(search_keyword, 'gi');
                word = String(word).replace(colReg, (word) => `<span class="is-hl-inputkeyword">${word}</span>`);
            }

            return word || '';
        },

        /**
         * 전체 선택 체크 박스 클릭
         */
        clickAllCheck() {
            if (this.allCheck) {
                this.checkedItems = [];
            } else {
                this.checkedItems = this.getBrdDatas.map((item) => item.s_seq);
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
            this.$emit('update', { type: 'd', ...item });
        },

        /**
         * Event - 수정
         */
        evt_update(item) {
            // switch 반영 이후 emit
            setTimeout(() => {
                this.$emit('update', { type: 'u', ...item });
            }, 50);
        },

        clickBlukUpdate(use_yn) {
            this.$emit('update', {
                type: 'u',
                s_seq: this.checkedItems.join(),
                use_yn,
            });
            this.$refs.button_grp.Set_Expanded(false);
        },
    },
};

export const CompHeader = {};
</script>

<style src="./style.scss" lang="scss" scoped />
