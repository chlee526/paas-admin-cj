<template>
    <div class="ui_box ui-loader-container" :class="{ 'is-loading': loading }">
        <div class="ui_function is-box-large is-fixed">
            <div class="lc">
                <comp-button v-if="getUserPermissions >= 2" @click="clickRegist">
                    <span class="txt ui-ellipsis">키워드 등록</span>
                </comp-button>

                <comp-button-grp ref="button_grp" :useBtns="false">
                    <template #title>
                        <comp-button v-if="getUserPermissions >= 2" :disabled="!checkedItems.length">
                            <span class="txt ui-ellipsis">일괄설정({{ checkedItems.length }}개)</span>
                        </comp-button>
                    </template>

                    <template #items>
                        <comp-button v-if="getUserPermissions >= 3" @click="clickDelete({}, true)">
                            <span class="txt ui-ellipsis">삭제</span>
                        </comp-button>
                        <comp-button @click="clickUseYN('Y')">
                            <span class="txt ui-ellipsis">사용</span>
                        </comp-button>
                        <comp-button @click="clickUseYN('N')">
                            <span class="txt ui-ellipsis">미사용</span>
                        </comp-button>
                    </template>
                </comp-button-grp>
            </div>
            <div class="rc">
                <comp-input-box id="brd_searchKeyword" v-model="input.search_keyword" type="search" placeholder="검색어를 입력하세요." focusResetVisible @search="clickSearch" style="width: 500px">
                    <comp-selectbox slot="inputSelect" id="brd_searchType" v-model="input.search_type" :opts="getSearchTypeOpts.exptAttr({ name: '제외키워드' })" style="width: 120px"></comp-selectbox>
                </comp-input-box>
            </div>
        </div>
        <div class="content">
            <div class="ui_brd">
                <div class="infos">
                    <div class="lc">
                        <div class="page_info">
                            <span
                                >총 <strong>{{ Number(brdDatas.total_cnt).lengthLimitComma(0) }}</strong> 건</span
                            >
                            <hr />
                            <strong> {{ brdOpts.page_num }} </strong>
                            /
                            <span> {{ brdDatas.total_cnt > 0 ? Math.ceil(brdDatas.total_cnt / getRowLimit).lengthLimitComma(0) : 1 }} </span> Pages
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
                                        <strong>보기건수</strong>
                                    </dt>
                                    <dd>
                                        <comp-selectbox id="rowlimit_select" class="is-small" v-model="getRowLimit" :opts="getBrdViewLen"></comp-selectbox>
                                    </dd>
                                </dl>
                                <hr />
                                <dl>
                                    <dt>
                                        <strong>노출필드</strong>
                                        <comp-button class="ui_btn is-small is-icon-only" @click="resetColOpts" style="margin-left: 4px"><span class="icon">&#xe020;</span></comp-button>
                                    </dt>
                                    <dd>
                                        <dl v-for="item in Object.keys(getColOpts)" :key="item">
                                            <dt>
                                                <span>{{ colOpts.getParseDatas({ code: item })[0].name }}</span>
                                            </dt>
                                            <dd>
                                                <comp-switch-btn :id="`${item}_switch`" class="is-small" v-model="getColOpts[item]"></comp-switch-btn>
                                                <!-- <comp-switch-btn v-if="item === 'category' && selectedGrp?.level !== 1" :id="`${item}_switch`" class="is-small" disabled v-model="getColOpts[item]"></comp-switch-btn>
                                                <comp-switch-btn v-else :id="`${item}_switch`" class="is-small" v-model="getColOpts[item]"></comp-switch-btn> -->
                                            </dd>
                                        </dl>
                                    </dd>
                                </dl>
                            </template>
                        </comp-filter-grp>
                        <comp-button class="is-small is-icon-with" title="엑셀 다운로드" @click="evtExcelClick" :loading="excelLoading" :disabled="brdDatas?.list?.length === 0"><span class="icon">&#xe005;</span><span class="txt">Excel</span></comp-button>
                    </div>
                </div>
                <div class="wrap">
                    <virtual-list data-key="seq" :data-sources="brdDatas.list" :keeps="60" :data-component="{}" root-tag="table" header-tag="thead" wrap-tag="tbody" tmparea-tag="tbody" footer-tag="tbody" :pageMode="true">
                        <template #colgroup>
                            <col v-if="getUserPermissions >= 2" style="width: 40px" />
                            <col v-if="getColOpts.category && selectedGrp?.level == 1" style="width: 70px" />
                            <col v-if="getColOpts.name" style="width: 30px" />
                            <col v-if="getColOpts.name" />
                            <col v-if="getColOpts.keyword" style="width: 30px" />
                            <col v-if="getColOpts.keyword" />

                            <col v-if="getColOpts.find_keyword" />
                            <col v-if="getColOpts.replace_keyword" />

                            <col v-if="getColOpts.op" :style="{ width: getColOpts.name ? '60px' : '115px' }" />

                            <col v-if="getColOpts.ts" :style="{ width: getColOpts.name ? '80px' : '115px' }" />

                            <col v-if="getColOpts.sg_seqs" style="width: 100px" />
                            <col v-if="getColOpts.expt_keywords" style="width: 20%" />
                            <!-- <col v-if="getColOpts.type_anal" style="width: 80px" /> -->

                            <col v-if="getColOpts.reg_date" :style="{ width: getColOpts.name ? '91px' : '100px' }" />

                            <col v-if="getColOpts.k_writer" :style="{ width: getColOpts.name ? '80px' : '100px' }" />

                            <col v-if="getColOpts.modi_date" :style="{ width: getColOpts.name ? '91px' : '100px' }" />

                            <col v-if="getColOpts.k_modifier" :style="{ width: getColOpts.name ? '80px' : '100px' }" />

                            <col v-if="getColOpts.use_yn" style="width: 60px" />
                            <col v-if="getUserPermissions >= 3" style="width: 40px" />
                        </template>

                        <template #header>
                            <tr>
                                <th v-if="getUserPermissions >= 2">
                                    <comp-checkbox id="register_allCheck" class="is-small is-board" v-model="allCheck" @click.stop="clickAllCheck" />
                                </th>
                                <th v-if="getColOpts.category && selectedGrp?.level === 1">
                                    <strong>그룹</strong>
                                </th>
                                <th v-if="getColOpts.name" colspan="2">
                                    <strong>키워드</strong>
                                    <comp-table-sort id="k_value" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <th v-if="getColOpts.keyword" colspan="2">
                                    <strong>키워드</strong>
                                    <comp-table-sort id="keyword" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <!-- 키워드 치환 전용 -->
                                <th v-if="getColOpts.find_keyword">
                                    <strong>찾을 키워드</strong>
                                    <comp-table-sort id="keyword" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <th v-if="getColOpts.replace_keyword">
                                    <strong>치환 키워드</strong>
                                    <comp-table-sort id="keyword" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <!-- // 키워드 치환 전용 -->
                                <th v-if="getColOpts.op">
                                    <comp-table-filter id="table_filter_op" name="종류" v-model="brdOpts.op.value" :opts="brdOpts.op.opts" :multi="true" :labelVisibleNum="1" @confirm="searching"></comp-table-filter>
                                </th>
                                <th v-if="getColOpts.ts">
                                    <comp-table-filter id="table_filter_ts" name="검색영역" v-model="brdOpts.ts.value" :opts="brdOpts.ts.opts" :multi="true" :labelVisibleNum="1" @confirm="searching"></comp-table-filter>
                                </th>
                                <!-- <th v-if="getColOpts.type_anal">
                                    <comp-table-filter id="table_filter_at" name="분석대상" v-model="brdOpts.type_anal.value" :opts="brdOpts.type_anal.opts" :multi="true" :labelVisibleNum="1" @confirm="searching"></comp-table-filter>
                                </th> -->
                                <th v-if="getColOpts.sg_seqs">
                                    <strong>채널</strong>
                                </th>
                                <th v-if="getColOpts.expt_keywords">
                                    <strong style="display: inline-block; min-width: 34px">제외 키워드</strong>
                                </th>
                                <th v-if="getColOpts.reg_date">
                                    <strong>최초<br />등록일</strong>
                                    <comp-table-sort id="reg_date" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <th v-if="getColOpts.k_writer">
                                    <strong>최초<br />등록자</strong>
                                    <comp-table-sort id="k_writer" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <th v-if="getColOpts.modi_date">
                                    <strong>최종<br />작성일</strong>
                                    <comp-table-sort id="modi_date" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <th v-if="getColOpts.k_modifier">
                                    <strong>최종<br />작성자</strong>
                                    <comp-table-sort id="k_modifier" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>

                                <th v-if="getColOpts.use_yn">
                                    <comp-table-filter id="table_filter_sg_seqs" name="사용" v-model="brdOpts.use_yn.value" :opts="brdOpts.use_yn.opts" :multi="true" @confirm="searching"></comp-table-filter>
                                </th>
                                <th v-if="getUserPermissions >= 3">
                                    <strong>삭제</strong>
                                </th>
                            </tr>
                        </template>

                        <!-- 데이터 없는 경우 -->
                        <template #footer v-if="!brdDatas.list.length">
                            <tr class="is-no-over">
                                <td class="is-no-over no_data in_list" :colspan="getColCnt">
                                    <span class="ui_no_data_txt">데이터가 없습니다.</span>
                                </td>
                            </tr>
                        </template>

                        <!-- 데이터 있는 경우 -->
                        <template v-else #item="{ item, index }">
                            <tr
                                :class="{
                                    'is-selected': getEditKeyword?.seq === item.seq,
                                    'is-checked': isChecked(item.seq),
                                }"
                                @click="clickTableRow(item, $event)">
                                <td v-if="getUserPermissions >= 2">
                                    <comp-checkbox :id="`keywords_${item.seq}`" class="is-small is-board" :value="isChecked(item.seq)" tabindex="-1" @click.stop="clickCheckBox(item.seq)" />
                                </td>
                                <td v-if="getColOpts.category && selectedGrp?.level === 1" class="td_category">
                                    <span class="ui_fc_dm ui-ellipsis">{{ categoryList.getParseDatas({ code: item.yp })[0]?.name || '-' }}</span>
                                </td>

                                <td v-if="getColOpts.name" class="is-right-bd-none">
                                    <span v-if="item.tsc == 1" class="ui_bedge is-rect is-customColor-black" style="--color: #f2f2f2" title="특수문자포함">특</span>
                                </td>
                                <td v-if="getColOpts.name" class="td_name">
                                    <strong v-if="String(brdOpts.search_type) === '1'" v-html="parseHighlightWords(parseKeywordName(item.name))" />
                                    <strong v-else v-html="parseKeywordName(item.name)" />
                                </td>

                                <td v-if="getColOpts.keyword" class="is-right-bd-none">
                                    <span v-if="item.tsc == 1" class="ui_bedge is-rect is-customColor-black" style="--color: #f2f2f2" title="특수문자포함">특</span>
                                </td>
                                <td v-if="getColOpts.keyword" class="td_name">
                                    <strong v-if="String(brdOpts.search_type) === '1'" v-html="parseHighlightWords(parseKeywordName(item.keyword))" />
                                    <strong v-else v-html="parseKeywordName(item.keyword)" />
                                </td>
                                <!-- 치환키워드 전용-->
                                <td v-if="getColOpts.find_keyword" class="td_name">
                                    <span v-if="String(brdOpts.search_type) === '1'" v-html="parseHighlightWords(parseKeywordName(item.find_keyword))" />
                                    <span v-else v-html="parseKeywordName(item.find_keyword)" />
                                </td>
                                <td v-if="getColOpts.replace_keyword" class="td_name">
                                    <strong v-if="String(brdOpts.search_type) === '1'" v-html="parseHighlightWords(parseKeywordName(item.replace_keyword))" />
                                    <strong v-else v-html="parseKeywordName(item.replace_keyword)" />
                                </td>
                                <!-- // 치환키워드 전용-->

                                <td v-if="getColOpts.op" class="td_op">
                                    <span class="ui_fc_dm">{{ parseOpCodeToName(item.op) }}</span>
                                </td>
                                <td v-if="getColOpts.ts" class="td_ts">
                                    <span class="ui_fc_dm">{{ parseTsCodeToName(item.ts) }}</span>
                                </td>

                                <!-- 기사 분류 사전 전용-->
                                <!-- <td v-if="getColOpts.type_anal" class="td_ts">
                                    <span class="ui_fc_dm">{{ parseTypeAnalCodeToName(item.type_anal) }}</span>
                                </td> -->
                                <!-- // 기사 분류 사전 전용-->

                                <td v-if="getColOpts.sg_seqs" class="td_sg_seqs">
                                    <span class="ui_fc_dm" :title="parseSgCodeToName(item.sg_seqs)">{{ parseSgCodeToName(item.sg_seqs, 3) }}</span>
                                </td>

                                <td v-if="getColOpts.expt_keywords" class="ui_al td_expt_keyword" style="width: 75%; max-width: 50px">
                                    <span v-if="getExceptKeywords(item.expt_keywords).length" class="box">
                                        <span v-html="getExceptKeywords(item.expt_keywords).arrObjAttrToStr('name') || ''" class="ui_fc_dm ui-ellipsis" />
                                        <span class="ui_fc_dm2 ui-ellipsis">(총 {{ getExceptKeywords(item.expt_keywords).length.lengthLimitComma(0) }}개)</span>
                                    </span>
                                </td>

                                <td v-if="getColOpts.reg_date">
                                    <span class="ui_fc_dm" :title="item.reg_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss')">{{ item.reg_date.dateToStr() }}</span>
                                </td>
                                <td v-if="getColOpts.k_writer">
                                    <span v-if="String(brdOpts.search_type) === '3'" v-html="parseHighlightWords(item.k_writer)" class="ui_fc_dm" />
                                    <span v-else class="ui_fc_dm">{{ item.k_writer }}</span>
                                </td>
                                <td v-if="getColOpts.modi_date">
                                    <span v-if="item.modi_date" class="ui_fc_dm" :title="item.modi_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss')">{{ item.modi_date.dateToStr() }}</span>
                                    <!-- <span v-if="item.modi_date" class="ui_fc_dm" :title="item.modi_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss')">{{ item.modi_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss') }}</span> -->
                                </td>
                                <td v-if="getColOpts.k_modifier">
                                    <span v-if="String(brdOpts.search_type) === '4'" v-html="parseHighlightWords(item.k_modifier)" class="ui_fc_dm" />
                                    <span v-else class="ui_fc_dm">{{ item.k_modifier }}</span>
                                </td>
                                <td v-if="getColOpts.use_yn" @click.stop="changeUseYN(item, index, $event)">
                                    <comp-switch-btn :id="`${item.seq}_use_yn`" class="is-xxsmall" v-model="item.active" :disabled="getUserPermissions <= 1" />
                                </td>
                                <td v-if="getUserPermissions >= 3" @click.stop="clickDelete(item)">
                                    <comp-button class="is-xsmall is-icon-only">
                                        <span class="icon">&#xe022;</span>
                                    </comp-button>
                                </td>
                            </tr>
                        </template>

                        <template #tmparea v-if="brdDatas.list.length && brdDatas.list.length < 20">
                            <tr v-for="idx in Math.abs(20 - brdDatas.list.length)" :key="'brd_2_' + idx">
                                <td :colspan="getColCnt" class="is-no-over" />
                            </tr>
                        </template>
                    </virtual-list>
                </div>
                <div class="footer">
                    <comp-paginate :datas="brdOpts" :total-len="brdDatas.total_cnt" v-model="brdOpts.page_num"></comp-paginate>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import { mapGetters } from 'vuex';

import { parseKeywordName } from '@/utils';

export default {
    name: 'comp-list',
    data() {
        return {
            excelDownList: [],
            apiUID: uuid.v4(),
            loading: false,
            excelLoading: false,
            brdOpts: {
                page_num: 1, // 현재 페이지 번호
                pagingColCnt: 10,
                row_limit: '',
                search_type: '',
                search_keyword: '',
                order: 'modi_date^D',
                op: {
                    value: '',
                    opts: [],
                },
                ts: {
                    value: '',
                    opts: [],
                },
                at: {
                    value: '',
                    opts: [],
                },
                use_yn: {
                    value: '',
                    opts: [],
                },
            },
            input: {
                search_keyword: '',
                search_type: '',
            },
            brdDatas: {
                total_cnt: 0,
                list: [],
            },
            colOpts: [
                { code: 'keyword', name: '키워드' },
                { code: 'op', name: '종류' },
                { code: 'ts', name: '검색영역' },
                { code: 'reg_date', name: '최초 등록일' },
                { code: 'k_writer', name: '최초 등록자' },
                { code: 'modi_date', name: '최종 작성일' },
                { code: 'k_modifier', name: '최종 작성자' },
                { code: 'use_yn', name: '사용여부' },
            ],

            checkedItems: [],
            allCheck: false,
        };
    },
    props: {
        savePersonalization: { type: Object },
        editKeyword: {
            type: Object,
            default: () => {
                return {};
            },
        },
        selectedGrp: { type: Object },
        delConfirmMsg: { type: String },
    },
    computed: {
        ...mapGetters(['getUserPermissions', 'getSgSeqs', 'getOpOpts', 'getTsOpts', 'getTscOpts', 'getBrdViewLen', 'getSearchTypeOpts', 'getTypeAnalOpts', 'getUseYNOpts']),
        getEditKeyword: {
            get() {
                return this.editKeyword;
            },
            set(val) {
                this.$emit('update:editKeyword', val);
            },
        },
        getSavePersonalization: {
            get() {
                return this.savePersonalization;
            },
            set(val) {
                this.$emit('update:savePersonalization', val);
            },
        },
        getRowLimit: {
            get() {
                return this.getSavePersonalization.main.data_list.row_limit;
            },
            set(val) {
                this.getSavePersonalization.main.data_list.row_limit = val;
                this.searching();
                this.setRowlimit();
            },
        },
        getColOpts() {
            return this.getSavePersonalization.main.data_list.colOpts;
        },
        getColCnt() {
            /**
             * 권한 3 : +2 (선택 ,삭제)
             * 권한 2 : +1 (선택)
             * 권한 1 : +0
             * +1 = 특수문자포함 사용할 경우
             */

            let userPermissions = 0;

            switch (this.getUserPermissions) {
                case 3:
                    userPermissions = 2;
                    break;
                case 2:
                    userPermissions = 1;
                    break;
                case 1:
                    userPermissions = 0;
                    break;
                default:
                    break;
            }

            return Object.values(this.getColOpts).filter((val) => val).length + userPermissions + (this.getColOpts.keyword ? 1 : 0);
        },
    },
    created() {
        // brdOpts opts 적용
        this.brdOpts.op = {
            opts: [...this.getOpOpts],
            value: this.getOpOpts.arrObjAttrToStr('code'),
        };

        this.brdOpts.ts = {
            opts: [...this.getTsOpts],
            value: this.getTsOpts.arrObjAttrToStr('code'),
        };

        this.brdOpts.type_anal = {
            opts: [...this.getTypeAnalOpts],
            value: this.getTypeAnalOpts.arrObjAttrToStr('code'),
        };

        this.brdOpts.use_yn = {
            opts: [...this.getUseYNOpts],
            value: this.getUseYNOpts.arrObjAttrToStr('code'),
        };
        this.setRowlimit();
    },
    mounted() {
        this.fetchData();
    },
    watch: {
        checkedItems(val) {
            const checkList = [];

            this.brdDatas.list
                .map((item) => item.seq)
                .forEach((item) => {
                    if (this.checkedItems.includes(item)) {
                        checkList.push(item);
                    }
                });

            if (this.brdDatas.list.length) {
                this.allCheck = checkList.length == this.brdDatas.list.length;
            } else {
                this.allCheck = false;
            }

            // if (val.length === this.brdDatas.list.length) {
            //     this.allCheck = true;
            // } else {
            //     this.allCheck = false;
            // }
        },

        editKeyword: {
            deep: true,
            handler(val) {
                const index = this.brdDatas.list.findIndex((item) => item.seq === val.seq);

                this.$set(this.brdDatas.list, index, structuredClone(val));
            },
        },
        selectedGrp: {
            deep: true,
            handler(val) {
                if (this.checkedItems.length) {
                    this.checkedItems = [];
                }

                this.brdOpts.search_type = 1;
                this.input.search_keyword = '';
                this.brdOpts.search_keyword = '';
                this.searching();
                // 조건 변경 시 스크롤 상단으로 이동
                window.scrollTo(0, 0);
            },
        },
        'brdOpts.page_num'(newVal, oldVal) {
            if (newVal !== oldVal) {
                // 조건 변경 시 스크롤 상단으로 이동
                window.scrollTo(0, 0);
                this.fetchData();
            }
        },
        'brdOpts.order'() {
            this.searching();
        },

        'brdDatas.list'(val) {
            const checkList = [];

            val.map((item) => item.seq).forEach((item) => {
                if (this.checkedItems.includes(item)) {
                    checkList.push(item);
                }
            });

            if (val.length) {
                this.allCheck = checkList.length == val.length;
            } else {
                this.allCheck = false;
            }
        },
    },
    methods: {
        parseKeywordName,
        /**
         * 전체 선택 체크 박스 클릭
         */
        clickAllCheck() {
            if (this.allCheck) {
                const checkList = this.brdDatas.list.map((item) => item.seq);

                this.checkedItems = this.checkedItems.filter((item) => !checkList.includes(item));
            } else {
                // this.checkedItems = this.brdDatas.list.map((item) => item.seq);
                this.checkedItems = Array.from(new Set([...this.checkedItems, ...this.brdDatas.list.map((item) => item.seq)]));
            }
        },

        isChecked(seq) {
            return this.checkedItems.includes(seq);
        },

        clickCheckBox(seq) {
            if (this.isChecked(seq)) {
                this.checkedItems = this.checkedItems.filter((item) => item !== seq);
            } else {
                this.checkedItems.push(seq);
            }
        },

        setRowlimit() {
            this.brdOpts.row_limit = this.getRowLimit;
        },

        // 조건 변경시 페이지 1로 이동 or 검색 시작
        searching() {
            if (this.brdOpts.page_num == 1) this.fetchData();
            else this.brdOpts.page_num = 1;
        },

        clickSearch(keyword) {
            this.brdOpts.search_keyword = keyword;
            this.brdOpts.search_type = this.input.search_type;
            this.searching();
        },

        async evtExcelClick() {
            await this.fetchData('excel');
        },

        fetchData(excel) {
            // 상속받은 자식 컴포넌트에서 직접 작성
        },

        /**
         * brdDatas.list의 데이터 추가
         * use_yn을 Boolean 값으로 변환한 active 추가
         */
        parseListDatas() {
            this.brdDatas.list.forEach((item) => {
                item.active = item.use_yn === 'Y';
                item.name = item.keyword;
            });
        },

        /**
         * tr 클릭이벤트
         * 키워드 수정으로 데이터 전달, 선택 토글
         */
        clickTableRow(item, $event) {
            // 체크박스 클릭시 토글 안됨
            if ($event.target.tagName === 'LABEL') return;

            // 기존 키워드와 동일한지 비교, 토글
            if (item?.seq !== this.getEditKeyword?.seq) {
                this.getEditKeyword = structuredClone(item);

                // aside open
                this.$emit('setAsideOpen');
            } else {
                this.getEditKeyword = {};
            }
        },

        /**
         * 키워드 등록 클릭이벤트
         * aside가 닫혀 있으면 클릭 트리거
         */
        clickRegist() {
            this.$emit('setAsideOpen');
            this.getEditKeyword = {};
        },

        /**
         * 키워드 삭제 이벤트
         * dictionary > index.vue API 호출
         * @param {Object} item 삭제 대상 데이터
         * @param {Boolean} multiple 다중삭제 여부
         */
        async clickDelete(item, multiple) {
            if (multiple && !this.checkedItems.length) return;

            this.$store
                .dispatch('DIALOG_WRN', [this.delConfirmMsg, '삭제하시겠습니까?', 2])
                .then(async () => {
                    const param = {};

                    param.seq = multiple ? this.checkedItems.join() : item.seq;
                    param.useModal = true;

                    // 키워드 삭제 API trigger
                    this.$emit('deleteKeyword', param);

                    // this.checkedItems = [];

                    this.$refs.button_grp.Set_Expanded(false);
                })
                .catch((err) => {});
        },

        /**
         * 다중 사용 미사용 버튼 클릭
         * dictionary > index.vue API 호출
         * @param {String} useYN 사용여부 변경될 값('Y'/'N')
         */
        async clickUseYN(useYN) {
            if (!this.checkedItems.length) return;

            this.$emit('updateKeyword', { seq: this.checkedItems.join(), use_yn: useYN });

            this.checkedItems = [];

            this.$refs.button_grp.Set_Expanded(false);

            this.fetchData();
        },

        /**
         * 단일 변경된 active를 use_yn에 반영
         */
        changeUseYN(item, index, $event) {
            // switch 클릭일때만 동작
            if ($event.target.tagName === 'INPUT') {
                const obj = structuredClone(item);
                obj.use_yn = !obj.active ? 'Y' : 'N';

                this.$set(this.brdDatas.list, index, obj);

                this.$emit('updateKeyword', obj);
            }
        },

        /**
         *   데이터목록 개인화 > 노출필드 기본값으로 변경(전체 true)
         */
        resetColOpts() {
            Object.keys(this.getColOpts).forEach((item) => {
                this.getColOpts[item] = true;
            });
        },

        parseOpCodeToName(op_code) {
            const result = this.getOpOpts.getParseDatas({ code: op_code }).arrObjAttrToStr('name');
            return result;
        },
        parseTsCodeToName(ts_code) {
            const result = this.getTsOpts.getParseDatas({ code: ts_code }).arrObjAttrToStr('name');
            return result;
        },
        parseTypeAnalCodeToName(ta_code) {
            const result = this.getTypeAnalOpts.getParseDatas({ code: ta_code }).arrObjAttrToStr('name');
            return result;
        },

        /**
         * 검색 키워드에 하이라이팅
         * @param {String} word
         * @return {String} 키워드 일치하는 부분에 하이라이트된 코드
         */
        parseHighlightWords(word) {
            if (this.brdOpts.search_keyword) {
                let inputKeyword = this.brdOpts.search_keyword;

                if (inputKeyword.trim().length) {
                    // 공백을 v로 치환하여 정규식 검사
                    inputKeyword = this.parseKeywordName(inputKeyword);

                    const colReg = new RegExp(inputKeyword, 'gi');
                    word = String(word).replace(colReg, (word) => `<span class="is-hl-inputkeyword">${word}</span>`);
                }
            }
            return word;
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
