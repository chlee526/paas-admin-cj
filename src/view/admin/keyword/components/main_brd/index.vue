<template>
    <div class="ui_box ui-loader-container" :class="{ 'is-loading': loading }">
        <div class="ui_function is-box-large is-fixed">
            <div class="lc">
                <comp-button v-if="getUserPermissions >= 2" @click="clickRegist">
                    <span class="txt ui-ellipsis">키워드 등록</span>
                </comp-button>

                <comp-button-grp :useBtns="false">
                    <template #title>
                        <comp-button v-if="getUserPermissions >= 2" :disabled="!checkedItems.length">
                            <span class="txt ui-ellipsis">일괄설정({{ checkedItems.length }}개)</span>
                        </comp-button>
                    </template>

                    <template #items="{ onClick }">
                        <comp-button v-if="getUserPermissions >= 3" @click="clickDelete({}, true, onClick)">
                            <span class="txt ui-ellipsis">삭제</span>
                        </comp-button>
                        <comp-button @click="clickUseYN('Y', onClick)">
                            <span class="txt ui-ellipsis">사용</span>
                        </comp-button>
                        <comp-button @click="clickUseYN('N', onClick)">
                            <span class="txt ui-ellipsis">미사용</span>
                        </comp-button>
                    </template>
                </comp-button-grp>
            </div>
            <div class="rc">
                <comp-input-box id="brd_searchKeyword" v-model="brdOpts.input_search_keyword" type="search" placeholder="검색어를 입력하세요." focusResetVisible @search="clickSearch" style="width: 500px">
                    <comp-selectbox slot="inputSelect" id="brd_searchType" v-model="brdOpts.input_search_type" :opts="getSearchTypeOpts" style="width: 120px"></comp-selectbox>
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
                                                <span>{{ colOpts.getParseDatas({ code: item })[0]?.name }}</span>
                                            </dt>
                                            <dd>
                                                <comp-switch-btn v-if="item === 'category' && selectedGrp?.level !== 1" :id="`${item}_switch`" class="is-small" disabled v-model="getColOpts[item]"></comp-switch-btn>
                                                <comp-switch-btn v-else :id="`${item}_switch`" class="is-small" v-model="getColOpts[item]"></comp-switch-btn>
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
                    <virtual-list data-key="k_seq" :data-sources="brdDatas.list" :keeps="60" :data-component="{}" root-tag="table" header-tag="thead" wrap-tag="tbody" tmparea-tag="tbody" footer-tag="tbody" :pageMode="true">
                        <template #colgroup>
                            <col v-if="getUserPermissions >= 2" style="width: 40px" />
                            <col v-if="getColOpts.category && selectedGrp?.level == 1" style="width: 70px" />
                            <col v-if="getColOpts.name" style="width: 30px" />
                            <col v-if="getColOpts.name" />
                            <col v-if="getColOpts.op" style="width: 60px" />
                            <col v-if="getColOpts.ts" style="width: 80px" />
                            <col v-if="getColOpts.sg_seqs" style="width: 100px" />
                            <col v-if="getColOpts.expt_keywords" style="width: 20%" />
                            <col v-if="getColOpts.reg_date" style="width: 91px" />
                            <col v-if="getColOpts.k_writer" style="width: 80px" />
                            <col v-if="getColOpts.modi_date" style="width: 91px" />
                            <col v-if="getColOpts.k_modifier" style="width: 80px" />
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
                                <th v-if="getColOpts.op">
                                    <comp-table-filter id="table_filter_op" name="종류" v-model="tableFilter.op.value" :opts="tableFilter.op.opts" :multi="true" :labelVisibleNum="1" @confirm="searching"></comp-table-filter>
                                </th>
                                <th v-if="getColOpts.ts">
                                    <comp-table-filter id="table_filter_ts" name="검색영역" v-model="tableFilter.ts.value" :opts="tableFilter.ts.opts" :multi="true" :labelVisibleNum="1" @confirm="searching"></comp-table-filter>
                                </th>
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
                                    <comp-table-filter id="table_filter_sg_seqs" name="사용" v-model="tableFilter.use_yn.value" :opts="tableFilter.use_yn.opts" :multi="true" @confirm="searching"></comp-table-filter>
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
                        <template #item="{ item, index }" v-else>
                            <tr
                                :class="{
                                    'is-selected': getEditKeyword?.k_seq === item.k_seq,
                                    'is-checked': isChecked(item.k_seq),
                                }"
                                @click="clickTableRow(item, $event)">
                                <td v-if="getUserPermissions >= 2" style="width: 100px">
                                    <comp-checkbox :id="`keywords_${item.k_seq}`" class="is-small is-board" :value="isChecked(item.k_seq)" tabindex="-1" @click.stop="clickCheckBox(item.k_seq)" />
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
                                <td v-if="getColOpts.op" class="td_op">
                                    <span class="ui_fc_dm">{{ parseOpCodeToName(item.op) }}</span>
                                </td>
                                <td v-if="getColOpts.ts" class="td_ts">
                                    <span class="ui_fc_dm">{{ parseTsCodeToName(item.ts) }}</span>
                                </td>
                                <td v-if="getColOpts.sg_seqs" class="td_sg_seqs">
                                    <span class="ui_fc_dm" :title="parseSgCodeToName(item.sg_seqs)">{{ parseSgCodeToName(item.sg_seqs, 3) }}</span>
                                    <!-- <span class="box">
                                        <span class="ui_fc_dm2" v-if="getSgCodeCnt(item.sg_seqs) > 1">(총 {{ getSgCodeCnt(item.sg_seqs) }}개)</span>
                                    </span> -->
                                </td>

                                <td v-if="getColOpts.expt_keywords" class="ui_al td_expt_keyword" style="width: 75%; max-width: 50px">
                                    <span v-if="getExceptKeywords(item.expt_keywords).length" class="box">
                                        <span v-html="getExceptKeywords(item.expt_keywords).arrObjAttrToStr('name') || ''" class="ui_fc_dm ui-ellipsis" />
                                        <span class="ui_fc_dm2 ui-ellipsis">(총 {{ getExceptKeywords(item.expt_keywords).length.lengthLimitComma(0) }}개)</span>
                                    </span>
                                </td>
                                <td v-if="getColOpts.reg_date">
                                    <span class="ui_fc_dm" :title="item.reg_date.dateToStr('-', 'YYYY-MM-DD hh:mm')">{{ item.reg_date.dateToStr() }}</span>
                                </td>
                                <td v-if="getColOpts.k_writer">
                                    <span v-if="String(brdOpts.search_type) === '3'" v-html="parseHighlightWords(item.k_writer)" class="ui_fc_dm" />
                                    <span v-else class="ui_fc_dm">{{ item.k_writer }}</span>
                                </td>
                                <td v-if="getColOpts.modi_date">
                                    <span class="ui_fc_dm" :title="item.modi_date.dateToStr('-', 'YYYY-MM-DD hh:mm')">{{ item.modi_date.dateToStr() }}</span>
                                </td>
                                <td v-if="getColOpts.k_modifier">
                                    <span v-if="String(brdOpts.search_type) === '4'" v-html="parseHighlightWords(item.k_modifier)" class="ui_fc_dm" />
                                    <span v-else class="ui_fc_dm">{{ item.k_modifier }}</span>
                                </td>
                                <td v-if="getColOpts.use_yn" @click.stop="changeUseYN(item, index, $event)">
                                    <comp-switch-btn :id="`${item.k_seq}_use_yn`" class="is-xxsmall" v-model="item.active" :disabled="getUserPermissions <= 1" />
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
import { API_keywordlist } from '@/api/admin/keyword/keyword';

export default {
    name: 'comp-main-brd',
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            excelLoading: false,
            tableFilter: {
                op: {
                    value: '',
                    opts: [],
                },
                ts: {
                    value: '',
                    opts: [],
                },
                use_yn: {
                    value: '',
                    opts: [],
                },
            },
            brdOpts: {
                page_num: 1, // 현재 페이지 번호
                pagingColCnt: 10,
                row_limit: '',
                search_type: '',
                search_keyword: '',
                input_search_keyword: '',
                input_search_type: '',
                order: 'modi_date^D',
            },
            brdDatas: {
                total_cnt: 0,
                list: [],
            },
            colOpts: [
                { code: 'category', name: '카테고리' },
                { code: 'name', name: '키워드' },
                { code: 'op', name: '종류' },
                { code: 'ts', name: '검색영역' },
                { code: 'sg_seqs', name: '채널' },
                { code: 'expt_keywords', name: '제외키워드' },
                { code: 'reg_date', name: '최초 등록일' },
                { code: 'k_writer', name: '최초 등록자' },
                { code: 'modi_date', name: '최종 작성일' },
                { code: 'k_modifier', name: '최종 작성자' },
                { code: 'use_yn', name: '사용여부' },
            ],

            excelDownList: [],
            checkedItems: [],
            allCheck: false,
            expandItems: false, //buttonGrp 켜짐/꺼짐
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
        categoryList: { type: Array },
    },
    computed: {
        ...mapGetters(['getSgSeqs', 'getOpOpts', 'getTsOpts', 'getTscOpts', 'getBrdViewLen', 'getSearchTypeOpts', 'getUseYNOpts', 'getUserPermissions']),
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
            let cnt = 0;
            if (this.selectedGrp?.level !== 1) {
                cnt = Object.keys(this.getColOpts).filter((key) => {
                    if (key !== 'category' && this.getColOpts[key]) return key;
                }).length;
            } else {
                cnt = Object.values(this.getColOpts).filter((val) => val).length;
            }

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

            return cnt + userPermissions + (this.getColOpts.name ? 1 : 0);
        },
    },
    created() {
        // tableFilter opts 적용
        this.tableFilter.op = {
            opts: [...this.getOpOpts],
            value: this.getOpOpts.arrObjAttrToStr('code'),
        };

        this.tableFilter.ts = {
            opts: [...this.getTsOpts],
            value: this.getTsOpts.arrObjAttrToStr('code'),
        };

        this.tableFilter.use_yn = {
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
                const index = this.brdDatas.list.findIndex((item) => item.k_seq === val.k_seq);

                this.$set(this.brdDatas.list, index, structuredClone(val));
            },
        },
        selectedGrp: {
            deep: true,
            handler() {
                if (this.checkedItems.length) {
                    this.checkedItems = [];
                }
                this.brdOpts.search_type = 1;
                this.brdOpts.input_search_keyword = '';
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

            val.map((item) => item.k_seq).forEach((item) => {
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
                const checkList = this.brdDatas.list.map((item) => item.k_seq);

                this.checkedItems = this.checkedItems.filter((item) => !checkList.includes(item));
            } else {
                // this.checkedItems = this.brdDatas.list.map((item) => item.seq);
                this.checkedItems = Array.from(new Set([...this.checkedItems, ...this.brdDatas.list.map((item) => item.k_seq)]));
            }
        },

        isChecked(k_seq) {
            return this.checkedItems.includes(k_seq);
        },

        clickCheckBox(k_seq) {
            if (this.isChecked(k_seq)) {
                this.checkedItems = this.checkedItems.filter((item) => item !== k_seq);
            } else {
                this.checkedItems.push(k_seq);
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
            this.brdOpts.search_type = this.brdOpts.input_search_type;
            this.searching();
        },

        setExcelForm(list) {
            let result = JSON.parse(JSON.stringify(list));

            result.map((item) => {
                item.yp = this.categoryList.getParseDatas({ code: item.yp })[0]?.name || '-';
                item.tsc = item.tsc == 1 ? '포함' : '제거';
                item.op = this.parseOpCodeToName(item.op);
                item.ts = this.parseTsCodeToName(item.ts);
                item.sg_seqs = this.parseSgCodeToName(item.sg_seqs, 3);
                item.expt_keywords = this.getExceptKeywords(item.expt_keywords).arrObjAttrToStr('name') || '';
                item.reg_date = item.reg_date.dateToStr();
                item.modi_date = item.modi_date.dateToStr();
                item.use_yn = item.use_yn == 'Y' ? '사용' : '미사용';
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
            // worker 호출
            const worker = new Worker('/assets/worker.js');

            /** [column 설정] !!!!!!
             * 1열 column값에 대한 style 아닌 전체 col 값이 스타일 처리됩니다.
             * 개별 스타일 지정이 필요한 경우 worker.js 파일 수정필요
             * header : col 이름 , key: col 기준 키값 , width: col 넓이, style: 개별 스타일
             */
            const setColnameHeader = [
                {
                    header: '그룹',
                    key: 'yp',
                },
                {
                    header: '특수문자',
                    key: 'tsc',
                    width: 10,
                    style: {
                        alignment: { horizontal: 'center' },
                    },
                },
                {
                    header: '키워드',
                    key: 'name',
                },
                {
                    header: '종류',
                    key: 'op',
                    width: 10,
                    style: {
                        alignment: { horizontal: 'center' },
                    },
                },
                {
                    header: '검색영역',
                    key: 'ts',
                    width: 10,
                },
                {
                    header: '채널',
                    key: 'sg_seqs',
                },
                {
                    header: '제외 키워드',
                    key: 'expt_keywords',
                    width: 30,
                },
                {
                    header: '최초등록일',
                    key: 'reg_date',
                    width: 10,
                    style: {
                        alignment: { horizontal: 'center' },
                    },
                },
                {
                    header: '최초등록자',
                    key: 'k_writer',
                    width: 10,
                    style: {
                        alignment: { horizontal: 'center' },
                    },
                },
                {
                    header: '최종등록일',
                    key: 'modi_date',
                    width: 10,
                    style: {
                        alignment: { horizontal: 'center' },
                    },
                },
                {
                    header: '최종작성자',
                    key: 'k_modifier',
                    width: 10,
                    style: {
                        alignment: { horizontal: 'center' },
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
                if (!item.width) item.width = 21;
                item.style = {
                    ...item.style,
                    font: {
                        size: 9,
                    },
                };
            });

            worker.postMessage({ list: this.excelDownList, columns: setColnameHeader, sheetName: '관리자_키워드' });

            worker.onmessage = (e) => {
                const blob = e.data;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '관리자_키워드.xlsx';
                a.click();
                URL.revokeObjectURL(url);
                this.excelLoading = false;
                worker.terminate();
            };
        },

        /**
         * 엑셀 다운로드 클릭
         */
        async evtExcelClick() {
            await this.fetchData('excel');
        },
        async fetchData(excel) {
            // 키워드 그룹 미선택 시 키워드 목록 비우고 fetch 안함
            const isSelected = ['xp', 'yp', 'zp'].every((key) => Object.keys(this.selectedGrp).includes(key));
            if (!isSelected) {
                this.brdDatas.total_cnt = 0;
                this.brdDatas.list = [];
                return;
            }

            const param = {
                xp: this.selectedGrp.xp,
                yp: this.selectedGrp.yp,
                zp: this.selectedGrp.zp,
                use_yn: this.tableFilter.use_yn.value,
                op: this.tableFilter.op.value,
                ts: this.tableFilter.ts.value,
                order: this.brdOpts.order,
                page_num: this.brdOpts.page_num,
                row_limit: this.getRowLimit,
                search_type: this.brdOpts.search_type,
                search_keyword: this.brdOpts.search_keyword,
            };
            if (excel) {
                param.page_num = 1;
                param.row_limit = 99999;
                param.excel = 1;
            }

            // 정렬 parse
            param.order = param.order.replace(/\^D|\^A/g, (match) => (match === '^D' ? ' desc' : ' asc'));

            if (!excel) this.loading = true;
            else this.excelLoading = true;

            await API_keywordlist(this.apiUID, param)
                .then((res) => {
                    if (!excel) {
                        const result = structuredClone(res?.data?.result);
                        this.brdDatas.list = [...result?.list];
                        this.brdDatas.total_cnt = result?.total;

                        this.brdOpts.input_search_keyword = this.brdOpts.search_keyword;
                        this.brdOpts.input_search_type = this.brdOpts.search_type;

                        this.parseListDatas();
                    } else {
                        this.excelDownList = this.setExcelForm(res?.data?.result?.list);
                        this.exportExcel();
                        // excelDownload(res?.data?.result?.excelLink);
                    }
                })
                .catch((err) => {
                    if (!excel) this.$store.dispatch('NOTY_ERR', '키워드 조회를 실패했습니다.');
                    else this.$store.dispatch('NOTY_ERR', '엑셀 요청에 실패 했습니다.');
                })
                .finally(() => {
                    this.loading = false;
                    // this.excelLoading = false;
                });
        },

        /**
         * brdDatas.list의 데이터 추가
         * use_yn을 Boolean 값으로 변환한 active 추가
         * except_keywords 없을 때 빈배열 할당
         */
        parseListDatas() {
            this.brdDatas.list.forEach((item) => {
                item.active = item.use_yn === 'Y';
                if (!item?.expt_keywords) item.expt_keywords = [];
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
            if (item?.k_seq !== this.getEditKeyword?.k_seq) {
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
         * keyword_mng > index.vue API 호출
         * @param {Object} item 삭제 대상 데이터
         * @param {Boolean} multiple 다중삭제 여부
         * @param {Function} close 팝업 종료 이벤트
         */
        async clickDelete(item, multiple, close) {
            if (multiple && !this.checkedItems.length) return;

            this.loading = true;

            const param = {};

            if (multiple) {
                param.k_seq = this.checkedItems.join();

                // 체크 아이템의 제외키워드 가져오기
                const expt_k_seq = [];
                this.checkedItems.forEach((checked) => {
                    const data = this.brdDatas.list.getParseDatas({ k_seq: checked })[0] || {};
                    if (data?.expt_keywords?.length) expt_k_seq.push(data.expt_keywords.arrObjAttrToStr('k_seq'));
                });
                if (expt_k_seq.length) param.expt_k_seq = expt_k_seq.join();
            } else {
                param.k_seq = item.k_seq;
                // 제외키워드 있을 때
                if (item.expt_keywords.length) {
                    param.expt_k_seq = item.expt_keywords.arrObjAttrToStr('k_seq');
                }
            }

            // 키워드 삭제 API trigger
            this.$emit('deleteKeyword', param);

            this.checkedItems = [];

            if (close) close();
        },

        /**
         * 다중 사용 미사용 버튼 클릭
         * keyword_mng > index.vue API 호출
         * @param {String} useYN 사용여부 변경될 값('Y'/'N')
         * @param {Function} close 팝업 종료 이벤트
         */
        async clickUseYN(useYN, close) {
            if (!this.checkedItems.length) return;

            this.$emit('updateKeyword', { xp: 0, yp: 0, k_seq: this.checkedItems.join(), use_yn: useYN });

            this.checkedItems = [];

            if (close) close();

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

        getExceptKeywords(item) {
            const list = item;
            if (list)
                return (
                    list
                        // 사용여부 'Y'인 키워드만 노출
                        .filter((word) => word?.use_yn == 'Y')
                        .map((word) => {
                            const obj = structuredClone(word);
                            // 검색어 하이라이팅
                            if (String(this.brdOpts.search_type) === '2') obj.name = this.parseHighlightWords(obj.name);
                            return obj;
                        }) || []
                );
            return [];
        },

        getSgCodeCnt(sg_code) {
            return sg_code ? sg_code.split(',').length.lengthLimitComma(0) : 0;
        },

        parseSgCodeToName(sg_code, limit) {
            if (!sg_code) return '';
            const codeArr = sg_code.split(',').map((code) => Number(code));
            const result = this.getSgSeqs.filter((item) => codeArr.includes(item.code)).arrObjAttrToStr('name', '', limit);
            return result;
        },

        parseOpCodeToName(op_code) {
            const result = this.getOpOpts.getParseDatas({ code: op_code }).arrObjAttrToStr('name');
            return result;
        },
        parseTsCodeToName(ts_code) {
            const result = this.getTsOpts.getParseDatas({ code: ts_code }).arrObjAttrToStr('name');
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
                    // 제외키워드가 아닌경우만 공백을 v로 치환하여 정규식 검사
                    if (String(this.brdOpts.search_type) !== '2') inputKeyword = this.parseKeywordName(this.brdOpts.search_keyword);

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
