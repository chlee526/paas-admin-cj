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
                <comp-input-box id="brd_searchKeyword" v-model="brdOpts.input_search_keyword" type="search" placeholder="매체명 검색" focusResetVisible @search="searchKeyword" />
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
                                        <dl v-for="item in Object.keys(getColOpts)" :key="item">
                                            <dt>{{ colOpts.getParseDatas({ code: item })[0].name }}</dt>
                                            <dd>
                                                <comp-switch-btn :id="`${item}_switch`" class="is-small" v-model="getColOpts[item]" />
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
                    <virtual-list data-key="s_seq" :data-sources="getBrdDatas" :keeps="60" :data-component="{}" root-tag="table" header-tag="thead" wrap-tag="tbody" footer-tag="tbody" :pageMode="true">
                        <template #colgroup>
                            <col v-if="getUserPermissions >= 2" style="width: 50px" />
                            <col v-if="getColOpts.channel" style="width: 150px" />
                            <col v-if="getColOpts.s_seq" style="width: 100px" />
                            <col v-if="getColOpts.s_name_cj" />
                            <col v-if="getColOpts.sb_name" />
                            <col v-if="getColOpts.reg_date" style="width: 100px" />
                            <col v-if="getColOpts.writer" style="width: 80px" />
                            <col v-if="getColOpts.modi_date" style="width: 100px" />
                            <col v-if="getColOpts.modifier" style="width: 80px" />
                            <col v-if="getColOpts.use_yn" style="width: 60px" />
                            <col v-if="getUserPermissions >= 3" style="width: 50px" />
                        </template>

                        <template #header>
                            <tr style="height: 50px">
                                <th v-if="getUserPermissions >= 2">
                                    <comp-checkbox id="sns_allCheck" class="is-small is-board" v-model="allCheck" @click.stop="clickAllCheck" />
                                </th>
                                <th v-if="getColOpts.channel">
                                    <strong>채널</strong>
                                    <comp-table-sort id="channel" name="orderColumn" v-model="brdOpts.order" />
                                </th>
                                <th v-if="getColOpts.s_seq">
                                    <strong>매체번호</strong>
                                    <comp-table-sort id="s_seq" name="orderColumn" v-model="brdOpts.order" />
                                </th>
                                <th v-if="getColOpts.s_name_cj">
                                    <strong>매체명<br />(CJ)</strong>
                                    <comp-table-sort id="s_name_cj" name="orderColumn" v-model="brdOpts.order" />
                                </th>
                                <th v-if="getColOpts.sb_name">
                                    <strong>수집원</strong>
                                </th>
                                <th v-if="getColOpts.reg_date">
                                    <strong>최초<br />등록일</strong>
                                    <comp-table-sort id="reg_date" name="orderColumn" v-model="brdOpts.order" />
                                </th>
                                <th v-if="getColOpts.writer">
                                    <strong>최초<br />등록자</strong>
                                </th>
                                <th v-if="getColOpts.modi_date">
                                    <strong>최종<br />작성일</strong>
                                </th>
                                <th v-if="getColOpts.modifier">
                                    <strong>최종<br />작성자</strong>
                                </th>
                                <th v-if="getColOpts.use_yn">
                                    <comp-table-filter id="table_filter_sg_seqs" name="사용" v-model="brdOpts.use_yn.value" :opts="brdOpts.use_yn.opts" :multi="true"></comp-table-filter>
                                </th>
                                <th v-if="getUserPermissions >= 3">
                                    <strong>삭제</strong>
                                </th>
                            </tr>
                        </template>

                        <!-- 데이터 있을 때 -->
                        <template #item="{ item, index }" v-if="getBrdDatas.length">
                            <tr :class="{ 'is-selected': editItem?.seq === item.seq }" @click="setEditItem(item)">
                                <td v-if="getUserPermissions >= 2">
                                    <comp-checkbox :id="`keywords_${item.seq}`" class="is-small is-board" :value="isChecked(item.seq)" tabindex="-1" @click.stop="clickCheckBox(item.seq)" />
                                </td>
                                <td v-if="getColOpts.channel" class="ui_fc_dm">
                                    <span>{{ item.channel }}</span>
                                </td>
                                <td v-if="getColOpts.s_seq">
                                    <strong>{{ item.s_seq }}</strong>
                                </td>
                                <td v-if="getColOpts.s_name_cj" class="ui_fc_dm">
                                    <span v-html="parseHighlightWords(item.s_name_cj)" />
                                </td>
                                <td v-if="getColOpts.sb_name">
                                    <span v-html="getSbnameHighlight(item.sb_name)"></span>
                                </td>
                                <td v-if="getColOpts.reg_date" class="ui_fc_dm" :title="item.reg_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss')">
                                    <span>{{ item.reg_date.dateToStr() }}</span>
                                </td>
                                <td v-if="getColOpts.writer" class="ui_fc_dm">
                                    <span>{{ item.writer }}</span>
                                </td>
                                <td v-if="getColOpts.modi_date" class="ui_fc_dm" :title="item.reg_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss')">
                                    <span>{{ item.reg_date.dateToStr() }}</span>
                                </td>
                                <td v-if="getColOpts.modifier" class="ui_fc_dm">
                                    <span>{{ item.modifier }}</span>
                                </td>
                                <td v-if="getColOpts.use_yn" @click.stop="changeUseYN(item, index, $event)">
                                    <comp-switch-btn :id="`${item.seq}_use_yn`" class="is-xxsmall" v-model="item.active" :disabled="getUserPermissions < 2" />
                                </td>
                                <td v-if="getUserPermissions >= 3">
                                    <comp-button class="is-xsmall is-icon-only" @click.stop="clickDelete(item)">
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

import CompKeywordList from '@/components/keyword_boilerplate/comp_list';

export default {
    name: 'comp-list-siteboard',
    extends: CompKeywordList,
    data() {
        return {
            brdOpts: {
                input_search_keyword: '',
                search_keyword: '',
                order: 'reg_date^D',
            },
            colOpts: [
                { code: 's_seq', name: '매체번호' },
                { code: 's_name_cj', name: '매체명(CJ)' },
                { code: 'sb_name', name: '수집원' },
                { code: 'channel', name: '채널' },
                { code: 'reg_date', name: '최초 등록일' },
                { code: 'writer', name: '최초 등록자' },
                { code: 'modi_date', name: '최종 작성일' },
                { code: 'modifier', name: '최종 작성자' },
                { code: 'use_yn', name: '사용여부' },
            ],
        };
    },
    props: {
        // 게시판 데이터
        dataList: { type: Array, required: true },
        // 수정 아이템
        editItem: { type: Object },
    },
    computed: {
        ...mapGetters(['getUseageLNB']),

        // 게시판 목록 데이터
        getBrdDatas() {
            // 검색어
            const searchResult = this.dataList.filter((item) => {
                const target = item['s_name_cj'];
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

            return filteredList.map((item) => ({ ...item, active: item.use_yn === 'Y' }));
        },
    },
    created() {},
    watch: {
        checkedItems(val) {
            this.allCheck = val.length === this.getBrdDatas.length;
        },
    },
    methods: {
        getSbnameHighlight(sbname) {
            const result = sbname.split('>');
            result[result.length - 1] = `<strong>${result[result.length - 1]}</strong>`;
            return result.join('<span class="ui_fc_dm2" style="display: inline-block; margin: 0 0.5em; font-size: 8px; line-height: 0.8; vertical-align: middle"> ▶ </span>');
        },

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
         *   데이터목록 개인화 > 노출필드 기본값으로 변경(reset 항목만 true)
         */
        resetColOpts() {
            Object.keys(this.getColOpts).forEach((item) => {
                const RESET = ['s_seq', 's_name_cj', 's_name_search', 'url', 's_writer', 'reg_date', 'use_yn'];
                this.getColOpts[item] = RESET.includes(item);
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
                this.checkedItems = this.getBrdDatas.map((item) => item.seq);
            }
        },

        /**
         * 체크 아이템 초기화
         */
        resetCheckedItems() {
            this.checkedItems = [];
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
