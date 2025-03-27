<template>
    <div class="ui_box ui-loader-container" :class="{ 'is-loading': loading }">
        <div class="ui_function is-box-large is-fixed">
            <div class="lc">
                <comp-button v-if="getUserPermissions >= 2" @click="clickRegist">
                    <span class="txt ui-ellipsis">사용자 등록</span>
                </comp-button>
            </div>
            <div class="rc">
                <comp-input-box id="brd_searchKeyword" v-model="brdOpts.input_search_keyword" type="search" placeholder="이름, 아이디, 연락처, 이메일 검색" focusResetVisible @search="searchKeyword" style="width: 500px"> </comp-input-box>
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
                    <virtual-list data-key="seq" :data-sources="getBrdDatas" :keeps="60" :data-component="{}" root-tag="table" header-tag="thead" wrap-tag="tbody" footer-tag="tbody" :pageMode="true">
                        <template #colgroup>
                            <col v-if="getSaveColOpts.user_grp" style="width: 130px" />
                            <col v-if="getSaveColOpts.id" style="width: 130px" />
                            <col v-if="getSaveColOpts.name" style="width: 100px" />
                            <col v-if="getSaveColOpts.dept" style="width: 130px" />
                            <col v-if="getSaveColOpts.mobile" style="width: 130px" />
                            <col v-if="getSaveColOpts.email" style="width: 180px" />
                            <col v-if="getSaveColOpts.reg_date" style="width: 102px" />
                            <col v-if="getUserPermissions >= 3" style="width: 40px" />
                        </template>

                        <template #header>
                            <tr>
                                <th v-if="getSaveColOpts.user_grp">
                                    <comp-table-filter id="table_filter_user_grp" name="사용자그룹" v-model="brdOpts.user_grp" :opts="userGrpList" :multi="true" :labelVisibleNum="1" />
                                </th>
                                <th v-if="getSaveColOpts.id">
                                    <strong>아이디</strong>
                                    <comp-table-sort id="id" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <th v-if="getSaveColOpts.name">
                                    <strong>이름</strong>
                                    <comp-table-sort id="name" name="orderColumn" v-model="brdOpts.order" min-one-value></comp-table-sort>
                                </th>
                                <th v-if="getSaveColOpts.dept">
                                    <comp-table-filter id="table_filter_dept" name="부서" v-model="brdOpts.dept" :opts="deptList" :multi="true" :labelVisibleNum="1" />
                                </th>
                                <th v-if="getSaveColOpts.mobile">
                                    <strong>연락처</strong>
                                </th>
                                <th v-if="getSaveColOpts.email">
                                    <strong>E-Mail</strong>
                                </th>
                                <th v-if="getSaveColOpts.reg_date">
                                    <strong>등록일</strong>
                                    <comp-table-sort id="reg_date" name="orderColumn" v-model="brdOpts.order" min-one-value />
                                </th>
                                <th v-if="getUserPermissions >= 3">
                                    <strong>삭제</strong>
                                </th>
                            </tr>
                        </template>

                        <template v-if="getBrdDatas.length > 0" #item="{ item }">
                            <tr @click="setEditItem(item)" :class="{ 'is-selected': editItem?.seq === item.seq }">
                                <td v-if="getSaveColOpts.user_grp">
                                    <span class="ui_fc_dm">{{ userGrpList.getParseDatas({ code: item.user_grp }).arrObjAttrToStr('name') }}</span>
                                </td>
                                <td v-if="getSaveColOpts.id">
                                    <span v-if="brdOpts.search_keyword" class="ui_fc_dm" v-html="parseHighlightWords(item.id)" />
                                    <span v-else class="ui_fc_dm">{{ item.id }}</span>
                                </td>
                                <td v-if="getSaveColOpts.name">
                                    <strong v-if="brdOpts.search_keyword" v-html="parseHighlightWords(item.name)" />
                                    <strong v-else>{{ item.name }}</strong>
                                </td>
                                <td v-if="getSaveColOpts.dept">
                                    <span class="ui_fc_dm">{{ item.dept }}</span>
                                </td>
                                <td v-if="getSaveColOpts.mobile">
                                    <span v-if="brdOpts.search_keyword" class="ui_fc_dm" v-html="parseHighlightWords(item.mobile)" />
                                    <span v-else class="ui_fc_dm">{{ item.mobile }}</span>
                                </td>
                                <td v-if="getSaveColOpts.email">
                                    <span v-if="brdOpts.search_keyword" class="ui_fc_dm" v-html="parseHighlightWords(item.email)" />
                                    <span v-else class="ui_fc_dm">{{ item.email }}</span>
                                </td>
                                <td v-if="getSaveColOpts.reg_date">
                                    <span class="ui_fc_dm">{{ item.reg_date.dateToStr() }}</span>
                                </td>
                                <td v-if="getUserPermissions >= 3">
                                    <comp-button class="is-xsmall is-icon-only" @click.stop="$emit('delete', item)">
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
import { mapGetters } from 'vuex';

export default {
    name: 'comp-member-list',
    data() {
        return {
            loading: false,
            brdOpts: {
                search_keyword: '',
                input_search_keyword: '',
                order: 'reg_date^D',
                user_grp: '',
                dept: '',
            },
            colOpts: [
                { code: 'user_grp', name: '사용자 그룹' },
                { code: 'id', name: '아이디' },
                { code: 'name', name: '이름' },
                { code: 'dept', name: '부서명' },
                { code: 'mobile', name: '핸드폰' },
                { code: 'email', name: '이메일' },
                { code: 'reg_date', name: '등록일' },
            ],
        };
    },
    props: {
        savePersonalization: { type: Object, required: true },
        dataList: { type: Array, required: true },
        userGrpList: { type: Array, required: true },
        deptList: { type: Array, required: true },
        editItem: { type: Object },
    },
    watch: {
        userGrpList: {
            deep: true,
            handler(val) {
                // 테이블 필터 초기화
                this.brdOpts.user_grp = val.arrObjAttrToStr('code');
            },
        },
        deptList: {
            deep: true,
            handler(val) {
                // 테이블 필터 초기화
                this.brdOpts.dept = val.arrObjAttrToStr('code');
            },
        },
    },
    computed: {
        ...mapGetters(['getUserPermissions', 'getUserHelperMenu']),
        getSavePersonalization: {
            get() {
                return this.savePersonalization;
            },
            set(val) {
                this.$emit('update:savePersonalization', val);
            },
        },
        getSaveColOpts() {
            return this.getSavePersonalization.main.data_list.colOpts;
        },
        getColCnt() {
            return Object.values(this.getSaveColOpts).filter((val) => val).length + 1;
        },
        getBrdDatas() {
            // 수정 대상 초기화
            this.setEditItem({});

            const deptList = this.brdOpts.dept.split(',');
            const userGrpList = this.brdOpts.user_grp.split(',');
            let list = [];

            this.dataList.forEach((item) => {
                if (item.dept === '') item.dept = null;

                // 부서 + 사용자그룹 필터링
                if (deptList.includes(String(item.dept)) && userGrpList.includes(String(item.user_grp))) {
                    // 검색어 필터링
                    if (this.brdOpts.search_keyword) {
                        ['name', 'id', 'mobile', 'email'].forEach((key) => {
                            if (item[key]) {
                                const search = item[key].match(new RegExp(this.brdOpts.search_keyword, 'gi'));
                                if (search) list.addItem(item);
                            }
                        });
                    } else {
                        list.addItem(item);
                    }
                }
            });

            // 정렬
            const order = this.brdOpts.order.split('^');

            list.sort((a, b) => {
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

            return list;
        },
    },
    methods: {
        /**
         * 사용자 등록 클릭이벤트
         * aside가 닫혀 있으면 클릭 트리거
         */
        clickRegist() {
            this.setEditItem({});
            this.$emit('setAsideOpen');
        },

        /**
         * 데이터목록 개인화 > 노출필드 기본값으로 변경(전체 true)
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
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
