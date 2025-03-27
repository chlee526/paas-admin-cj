<template>
    <div class="ui_box ui-loader-container" :class="{ 'is-loading': loading }">
        <div class="ui_function is-box-large is-fixed">
            <div class="rc">
                <comp-datepicker id="log_search_date" class="datepicker" :s_date.sync="brdOpts.date.s_date" :e_date.sync="brdOpts.date.e_date" :min_date="brdOpts.date.min_date" :max_date="brdOpts.date.max_date" :c_type_opts="null" :range="null"></comp-datepicker>
                <comp-input-box id="log_search_input" type="search" v-model="brdOpts.search_keyword" placeholder="검색어를 입력하세요." focusResetVisible @search="evtSearch" style="width: 500px">
                    <comp-selectbox slot="inputSelect" id="brd_searchType" v-model="brdOpts.search_type" :opts="searchTypeOpts" style="width: 130px"></comp-selectbox>
                </comp-input-box>
                <comp-button class="is-icon-only" title="검색조건 초기화" @click="resetSearchData"><span class="icon">&#xe020;</span></comp-button>
            </div>
        </div>
        <div class="content">
            <div class="ui_brd is-rog-list">
                <div class="infos">
                    <div class="lc">
                        <div class="page_info">
                            <span
                                >총 <strong>{{ brdDatas.total_cnt }}</strong
                                >건</span
                            >
                            <hr />
                            <span
                                ><strong>{{ brdOpts.page_num }}</strong> / <span>{{ Math.ceil(brdDatas.total_cnt / brdOpts.row_limit) || 1 }}</span> Pages</span
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
                                        <strong>보기건수</strong>
                                    </dt>
                                    <dd>
                                        <comp-selectbox id="brd_view_len1" class="is-small" :opts="getBrdViewLen" v-model="brdOpts.row_limit"></comp-selectbox>
                                    </dd>
                                </dl>
                            </template>
                        </comp-filter-grp>
                        <comp-button class="is-small is-icon-with" title="엑셀 다운로드" :loading="excelLoading" @click="evtExcelClick" :disabled="brdDatas?.list?.length === 0"><span class="icon">&#xe005;</span><span class="txt">Excel</span></comp-button>
                    </div>
                </div>
                <div class="wrap">
                    <virtual-list data-key="seq" :data-sources="brdDatas.list" :keeps="60" :data-component="{}" root-tag="table" header-tag="thead" wrap-tag="tbody" footer-tag="tbody" :pageMode="true">
                        <template #colgroup>
                            <col style="width: 160px" />
                            <col style="width: 160px" />
                            <col style="width: 160px" />
                            <col style="width: 160px" />
                            <col style="width: 160px" />
                            <col style="width: 160px" />
                            <col style="width: 160px" />
                        </template>

                        <template #header>
                            <tr>
                                <th>
                                    <comp-table-filter id="table_filter_user_grp" name="로그종류" v-model="brdOpts.log_menu" :opts="getLogMenuOpts" :multi="true" :labelVisibleNum="1" />
                                </th>
                                <th>
                                    <comp-table-filter id="table_filter_user_grp" name="사용자그룹" v-model="brdOpts.user_grp" :opts="userGrpList" :multi="true" :labelVisibleNum="1" />
                                </th>
                                <th><strong>접속 IP</strong></th>
                                <th><strong>부서</strong></th>
                                <th><strong>아이디</strong></th>
                                <th><strong>이름</strong></th>
                                <th>
                                    <strong>일시</strong>
                                    <comp-table-sort id="reg_date" name="orderColumn" v-model="brdOpts.order" min-one-value />
                                </th>
                            </tr>
                        </template>

                        <template v-if="brdDatas.list.length > 0" #item="{ item }">
                            <tr>
                                <td class="ui_fc_dm">
                                    <span>{{ getLogMenuOpts.filter((opt) => opt.code == parseInt(item.menu))[0]?.name }}</span>
                                </td>
                                <!-- 수집원 -->
                                <td class="ui_fc_dm">
                                    <span>{{ userGrpList.filter((opt) => opt.code == parseInt(item.user_grp))[0]?.name }}</span>
                                </td>
                                <td>
                                    <strong>{{ item.ip }}</strong>
                                </td>
                                <!-- 감성 -->
                                <td class="ui_fc_dm">
                                    <span>{{ item.dept ? item.dept : '-' }}</span>
                                </td>
                                <!-- 수집일 -->
                                <td class="ui_fc_dm">
                                    <span>{{ item.m_id }}</span>
                                </td>
                                <td class="ui_fc_dm">
                                    <span>{{ item.m_name ? item.m_name : '-' }}</span>
                                </td>
                                <td class="ui_fc_dm">
                                    <span>{{ item.reg_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss') }}</span>
                                </td>
                            </tr>
                        </template>

                        <!-- 데이터 없을 때 -->
                        <template v-else #footer>
                            <tr class="is-no-over">
                                <td class="is-no-over no_data in_list" :colspan="7">
                                    <span class="ui_no_data_txt">데이터가 없습니다.</span>
                                </td>
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
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';

import store from '@/store';
import { API_logList } from '@/api/admin/log';

export default {
    name: 'comp-log-list',

    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            excelLoading: false,
            excelDownList: [],
            brdOpts: {
                date: {
                    s_date: {
                        date: new Date(new Date().setMonth(new Date().getMonth() - 1)).dateToStr(),
                    },
                    e_date: {
                        date: new Date().dateToStr(),
                    },
                    min_date: '2024-01-01',
                    max_date: new Date().dateToStr(),
                },
                search_keyword: '',
                search_type: 1,
                colCnt: '7', // 게시판 Col
                row_limit: 50, // 게시판 Row
                page_num: 1, // 현재 페이지 번호
                pagingColCnt: 10, // 페이징 갯수
                user_grp: '1,2,3', // 사용자 그룹
                log_menu: '0,1', // 로그 종류
                order: 'reg_date^D', //정렬
            },
            brdDatas: {
                total_cnt: 0,
                list: [],
            },
        };
    },

    props: {
        searchTypeOpts: { type: Array, require: true },
        userGrpList: { type: Array, require: true },
    },

    computed: {
        ...mapGetters(['getLogMenuOpts', 'getBrdViewLen']),

        // 정렬 옵션
        getBrdOrder() {
            const sort = this.brdOpts.order.split('^')[1] === 'A' ? 'asc' : 'desc';
            const column = this.brdOpts.order.split('^')[0];
            return `${column} ${sort}`;
        },
    },
    created() {
        this.fetchData();
    },
    watch: {
        'brdOpts.date': {
            deep: true,
            handler() {
                this.brdOpts.page_num = 1;
                this.fetchData();
            },
        },
        'brdOpts.log_menu': function () {
            this.brdOpts.page_num = 1;
            this.fetchData();
        },

        'brdOpts.user_grp': function () {
            this.brdOpts.page_num = 1;
            this.fetchData();
        },

        'brdOpts.row_limit': function () {
            this.brdOpts.page_num = 1;
            this.fetchData();
        },
        'brdOpts.page_num': function () {
            this.fetchData();
        },
        'brdOpts.order': function () {
            this.fetchData();
        },
    },

    methods: {
        // 접속 로그 목록
        fetchData(excel) {
            let params = {
                s_date: structuredClone(this.brdOpts.date.s_date),
                e_date: structuredClone(this.brdOpts.date.e_date),
                menu: this.brdOpts.log_menu,
                user_grp: this.brdOpts.user_grp,
                search_type: parseInt(this.brdOpts.search_type),
                search_keyword: this.brdOpts.search_keyword,
                order: this.getBrdOrder,
                page_num: parseInt(this.brdOpts.page_num),
                row_limit: parseInt(this.brdOpts.row_limit),
            };

            if (!excel) {
                this.loading = true;
            } else {
                this.excelLoading = true;
                params.page_num = 1;
                params.row_limit = 99999;
            }

            API_logList(this.apiUID, params)
                .then((res) => {
                    if (!excel) {
                        const data = structuredClone(res.data?.result);
                        this.brdDatas.list = data.list;
                        this.brdDatas.total_cnt = data.total;
                    } else {
                        this.excelDownList = this.setExcelForm(res.data?.result?.list);
                        this.exportExcel();
                    }
                })
                .catch(() => {
                    store
                        .dispatch('DIALOG_ERR', ['접속 로그 목록을 조회하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '접속 로그 목록 조회 실패', 0])
                        .then(($val) => {
                            location.reload();
                        })
                        .catch(($err) => {
                            console.log('error');
                        });
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        evtSearch() {
            this.brdOpts.search_keyword = this.brdOpts.search_keyword.trim();
            this.brdOpts.page_num = 1;
            this.fetchData();
        },

        // 검색 조건 초기화
        resetSearchData() {
            const resetData = {
                s_date: {
                    date: new Date(new Date().setMonth(new Date().getMonth() - 1)).dateToStr(),
                },
                e_date: {
                    date: new Date().dateToStr(),
                },
            };
            Object.assign(this.brdOpts.date, resetData);
            this.brdOpts.search_type = 1;
            this.brdOpts.search_keyword = '';
        },

        /**
         * 엑셀 다운로드 클릭
         */
        async evtExcelClick() {
            this.fetchData('excel');
        },

        // 엑셀 양식 파싱
        setExcelForm(list) {
            const result = structuredClone(list);
            return result.map((item) => {
                item.menu = this.getLogMenuOpts.filter((opt) => opt.code == parseInt(item.menu))[0]?.name;
                item.user_grp = this.userGrpList.filter((opt) => opt.code == parseInt(item.user_grp))[0]?.name;
                item.dept = item.dept ? item.dept : '-';
                item.m_name = item.m_name ? item.m_name : '-';
                item.reg_date = item.reg_date.dateToStr('-', 'YYYY-MM-DD hh:mm:ss');
                return item;
            });
        },

        /**
         * 엑셀 export
         */
        exportExcel() {
            const worker = new Worker('/assets/worker.js');

            const setColnameHeader = [
                {
                    header: '로그종류',
                    key: 'menu',
                    width: 20,
                    style: {
                        alignment: { horizontal: 'center' },
                    },
                },
                {
                    header: '사용자그룹',
                    key: 'user_grp',
                    width: 20,
                    style: {
                        alignment: { horizontal: 'center' },
                    },
                },
                {
                    header: '접속 IP',
                    key: 'ip',
                    width: 20,
                    style: {
                        alignment: {
                            horizontal: 'right',
                        },
                    },
                },
                {
                    header: '부서',
                    key: 'dept',
                    width: 20,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '아이디',
                    key: 'm_id',
                    width: 20,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '이름',
                    key: 'm_name',
                    width: 20,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '일시',
                    key: 'reg_date',
                    width: 30,
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

            worker.postMessage({ list: this.excelDownList, columns: setColnameHeader, sheetName: '관리자_접속_로그' });

            worker.onmessage = (e) => {
                const blob = e.data;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '관리자_접속_로그.xlsx';
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
