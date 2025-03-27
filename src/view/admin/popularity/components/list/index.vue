<template>
    <div class="ui_box ui-loader-container" :class="{ 'is-loading': loading }">
        <div class="ui_function is-box-large is-fixed">
            <div v-if="getUserPermissions >= 2" class="lc">
                <comp-button @click="clickRegist">
                    <span class="txt ui-ellipsis">인기도 지수 등록</span>
                </comp-button>

                <comp-button-grp ref="button_grp" :useBtns="false">
                    <template #title>
                        <comp-button :disabled="!checkedItems.length">
                            <span class="txt ui-ellipsis">일괄설정({{ checkedItems.length.lengthLimitComma(0) }}개)</span>
                        </comp-button>
                    </template>

                    <template #items>
                        <comp-button v-if="getUserPermissions >= 3" @click="clickDelete({}, true)">
                            <span class="txt ui-ellipsis">삭제</span>
                        </comp-button>
                        <comp-button @click="updateUseYN('Y')">
                            <span class="txt ui-ellipsis">사용</span>
                        </comp-button>
                        <comp-button @click="updateUseYN('N')">
                            <span class="txt ui-ellipsis">미사용</span>
                        </comp-button>
                    </template>
                </comp-button-grp>
            </div>
            <div class="rc">
                <comp-input-box id="brd_searchKeyword" v-model="brdOpts.input_search_keyword" type="search" placeholder="검색어를 입력하세요." focusResetVisible @search="searchKeyword" style="width: 400px">
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
                                >총 <strong>{{ getBrdList.length.lengthLimitComma(0) }}</strong> 건</span
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
                                        <comp-button class="ui_btn is-small is-icon-only" @click="resetColOpts" style="margin-left: 4px"><span class="icon">&#xe020;</span></comp-button>
                                    </dt>
                                    <dd>
                                        <dl v-for="item in Object.keys(getColOpts)" :key="item">
                                            <dt>
                                                <span>{{ colOpts.getParseDatas({ code: item })[0].name }}</span>
                                            </dt>
                                            <dd>
                                                <comp-switch-btn :id="`${item}_switch`" class="is-small" v-model="getColOpts[item]"></comp-switch-btn>
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
                    <virtual-list data-key="seq" :data-sources="getBrdList" :keeps="60" :data-component="{}" root-tag="table" header-tag="thead" wrap-tag="tbody" footer-tag="tbody" :pageMode="true">
                        <template #colgroup>
                            <col v-if="getUserPermissions >= 2" style="width: 40px" />
                            <col v-if="getColOpts.s_seq" style="width: 80px" />
                            <col v-if="getColOpts.d_site_name" style="width: 130px" />
                            <col v-if="getColOpts.logstd" style="width: 80px" />
                            <col v-if="getColOpts.k_writer" style="width: 90px" />
                            <col v-if="getColOpts.k_modifie" style="width: 90px" />
                            <col v-if="getColOpts.reg_date" style="width: 100px" />
                            <col v-if="getColOpts.modi_date" style="width: 100px" />
                            <col v-if="getColOpts.use_yn" style="width: 60px" />
                            <col v-if="getUserPermissions >= 3" style="width: 40px" />
                        </template>

                        <template #header>
                            <tr>
                                <th v-if="getUserPermissions >= 2">
                                    <comp-checkbox id="register_allCheck" class="is-small is-board" v-model="allCheck" @click.stop="clickAllCheck" />
                                </th>
                                <th v-if="getColOpts.s_seq">
                                    <strong>사이트 번호</strong>
                                    <comp-table-sort id="s_seq" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <th v-if="getColOpts.d_site_name">
                                    <strong>사이트명</strong>
                                </th>
                                <th v-if="getColOpts.logstd">
                                    <strong>인기도 지수</strong>
                                    <comp-table-sort id="logstd" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <th v-if="getColOpts.k_writer">
                                    <strong>등록자</strong>
                                    <comp-table-sort id="k_writer" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <th v-if="getColOpts.k_modifie">
                                    <strong>수정자</strong>
                                </th>
                                <th v-if="getColOpts.reg_date">
                                    <strong>등록일</strong>
                                    <comp-table-sort id="reg_date" name="orderColumn" v-model="brdOpts.order" min-one-value />
                                </th>
                                <th v-if="getColOpts.modi_date">
                                    <strong>수정일</strong>
                                    <comp-table-sort id="modi_date" name="orderColumn" v-model="brdOpts.order" min-one-value />
                                </th>
                                <th v-if="getColOpts.use_yn">
                                    <comp-table-filter id="table_filter_sg_seqs" name="사용" v-model="brdOpts.use_yn.value" :opts="brdOpts.use_yn.opts" :multi="true" @confirm="searching"></comp-table-filter>
                                </th>
                                <th v-if="getUserPermissions >= 3">
                                    <strong>삭제</strong>
                                </th>
                            </tr>
                        </template>

                        <template v-if="getBrdList.length > 0" #item="{ item, index }">
                            <tr @click="setEditItem(item)" :class="{ 'is-selected': editItem?.seq === item.seq }">
                                <td v-if="getUserPermissions >= 2">
                                    <comp-checkbox :id="`keywords_${item.seq}`" class="is-small is-board" :value="isChecked(item.seq)" tabindex="-1" @click.stop="clickCheckBox(item.seq)" />
                                </td>
                                <td v-if="getColOpts.s_seq">
                                    <span v-if="String(brdOpts.search_type) === '5'" class="ui_fc_dm" v-html="parseHighlightWords(item.s_seq)" />
                                    <span v-else class="ui_fc_dm">{{ item.s_seq }}</span>
                                </td>
                                <td v-if="getColOpts.d_site_name">
                                    <span v-if="String(brdOpts.search_type) === '6'" class="ui_fc_dm" v-html="parseHighlightWords(item.d_site_name)" />
                                    <span v-else class="ui_fc_dm">{{ item.d_site_name }}</span>
                                </td>
                                <td v-if="getColOpts.logstd">
                                    <strong>{{ item.logstd }}</strong>
                                </td>
                                <td v-if="getColOpts.k_writer">
                                    <span v-if="String(brdOpts.search_type) === '3'" class="ui_fc_dm" v-html="parseHighlightWords(item.k_writer)" />
                                    <span v-else class="ui_fc_dm">{{ item.k_writer }}</span>
                                </td>
                                <td v-if="getColOpts.k_modifie">
                                    <span v-if="String(brdOpts.search_type) === '4'" class="ui_fc_dm" v-html="parseHighlightWords(item.k_modifier)" />
                                    <span v-else class="ui_fc_dm">{{ item.k_modifier || '-' }}</span>
                                </td>
                                <td v-if="getColOpts.reg_date">
                                    <span class="ui_fc_dm" :title="item.reg_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss')">{{ item.reg_date.dateToStr() }}</span>
                                </td>
                                <td v-if="getColOpts.modi_date">
                                    <span class="ui_fc_dm" :title="item.modi_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss')">{{ item.modi_date.dateToStr() || '-' }}</span>
                                </td>
                                <td v-if="getColOpts.use_yn" @click.stop="changeUseYN(item, index, $event)">
                                    <comp-switch-btn :id="`${item.seq}_use_yn`" class="is-xxsmall" :disabled="getUserPermissions < 2" v-model="item.active" />
                                </td>
                                <td v-if="getUserPermissions >= 3">
                                    <comp-button class="is-xsmall is-icon-only" @click.stop="clickDelete(item)">
                                        <span class="icon">&#xe022;</span>
                                    </comp-button>
                                </td>
                            </tr>
                        </template>

                        <!-- 데이터 없을 때 -->
                        <template v-else #footer>
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
import { API_popularitylist } from '@/api/admin/popularity';
import CompKeywordList from '@/components/keyword_boilerplate/comp_list';

export default {
    name: 'comp-popularity-list',
    extends: CompKeywordList,
    data() {
        return {
            brdOpts: {
                page_num: 1, // 현재 페이지 번호
                pagingColCnt: 10,
                row_limit: '',
                search_type: '',
                search_keyword: '',
                input_search_type: 3,
                input_search_keyword: '',
                order: 'reg_date^D',
            },
            colOpts: [
                { code: 's_seq', name: '사이트 번호' },
                { code: 'd_site_name', name: '사이트명' },
                { code: 'use_yn', name: '사용여부' },
                { code: 'logstd', name: '인기도지수' },
                { code: 'k_writer', name: '등록자' },
                { code: 'k_modifie', name: '수정자' },
                { code: 'reg_date', name: '등록일' },
                { code: 'modi_date', name: '수정일' },
            ],
        };
    },
    props: {
        editItem: { type: Object },
    },
    watch: {},
    computed: {
        getBrdList() {
            return this.brdDatas.list.map((item) => {
                delete item.name;
                return item;
            });
        },
    },
    methods: {
        /**
         * 키워드 등록 클릭이벤트
         * aside가 닫혀 있으면 클릭 트리거
         */
        clickRegist() {
            this.$emit('setAsideOpen');
            this.setEditItem({});
        },

        setExcelForm(list) {
            const result = structuredClone(list);

            return result.map((item) => {
                item.k_modifie = item.k_modifie || '-';
                item.reg_date = item.reg_date?.dateToStr();
                item.modi_date = item.modi_date?.dateToStr();
                item.use_yn = item.use_yn == 'Y' ? '사용' : '미사용';
                return item;
            });
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
                    header: '사이트 번호',
                    key: 's_seq',
                    width: 10,
                    style: {
                        alignment: { horizontal: 'center' },
                    },
                },
                {
                    header: '사이트명',
                    key: 'd_site_name',
                    width: 21,
                },
                {
                    header: '인기도 지수',
                    key: 'logstd',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'right',
                        },
                    },
                },
                {
                    header: '등록자',
                    key: 'k_writer',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '수정자',
                    key: 'k_modifie',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '등록일',
                    key: 'reg_date',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '수정일',
                    key: 'modi_date',
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
                        alignment: {
                            horizontal: 'center',
                        },
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

            worker.postMessage({ list: this.excelDownList, columns: setColnameHeader, sheetName: '관리자_인기도_지수' });

            worker.onmessage = (e) => {
                const blob = e.data;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '관리자_인기도_지수.xlsx';
                a.click();
                URL.revokeObjectURL(url);
                this.excelLoading = false;
                worker.terminate();
            };
        },

        async fetchData(excel) {
            this.loading = true;

            const param = {
                search_type: Number(this.brdOpts.search_type) || 3,
                search_keyword: this.brdOpts.search_keyword,
                order: this.brdOpts.order,
                use_yn: this.brdOpts.use_yn.value,
                page_num: 1,
                row_limit: 99999,
            };

            if (excel) {
                param.excel = 1;
            }

            // 정렬 parse
            param.order = param.order.replace(/\^D|\^A/g, (match) => (match === '^D' ? ' desc' : ' asc'));

            await API_popularitylist(this.apiUID, param)
                .then((res) => {
                    if (excel) {
                        // 엑셀 다운로드
                        this.excelDownList = this.setExcelForm(res?.data?.result?.list);
                        this.exportExcel();
                    } else {
                        const data = structuredClone(res.data.result);
                        this.brdDatas.list = [...data?.list];
                        this.brdDatas.total_cnt = data?.total;

                        this.parseListDatas();
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * 데이터목록 개인화 > 노출필드 기본값으로 변경(수정자/수정일 제외 true)
         */
        resetColOpts() {
            Object.keys(this.getColOpts).forEach((item) => {
                const except = ['k_modifie', 'modi_date'];
                this.getColOpts[item] = !except.includes(item);
            });
        },

        /**
         * 수정 대상 상위 컴포넌트에 전달/toggle
         */
        setEditItem(item) {
            if (Object.keys(item).length && JSON.stringify(item) === JSON.stringify(this.editItem)) {
                this.$emit('edit', {});
            } else {
                this.$emit('edit', item);
            }
        },

        /**
         * 검색어 trim및 적용
         */
        searchKeyword() {
            this.brdOpts.input_search_keyword = this.brdOpts.input_search_keyword.trim();
            this.brdOpts.search_keyword = this.brdOpts.input_search_keyword;
            this.brdOpts.search_type = this.brdOpts.input_search_type;
            this.searching();
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
         * 사용 여부 저장(다중설정)
         * popularity > index.vue API 호출
         * @param {String} use_yn
         */
        updateUseYN(use_yn) {
            if (!this.checkedItems.length) return;

            this.$emit('save', { type: 'u', seq: this.checkedItems.join(), use_yn }, true);

            this.checkedItems = [];

            this.$refs.button_grp.Set_Expanded(false);
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

                this.$emit('save', { type: 'u', ...obj }, true);
            }
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
