<script>
import { excelDownload } from '@shared/utils/prototype/util.link';

import { API_keywordlist } from '@/api/admin/exceptrule';
import CompKeywordList from '@/components/keyword_boilerplate/comp_list';

export default {
    name: 'comp-exceptrule-list',
    extends: CompKeywordList,
    data() {
        return {};
    },
    props: {},
    computed: {},
    watch: {},
    created() {
        this.brdOpts.search_type = 1;
    },
    methods: {
        setExcelForm(list) {
            let result = JSON.parse(JSON.stringify(list));

            result.map((item) => {
                item.op = this.parseOpCodeToName(item.op);
                item.ts = this.parseTsCodeToName(item.ts);
                item.tsc = item.tsc == 1 ? '포함' : '제거';
                item.reg_date = item.reg_date?.dateToStr();
                item.modi_date = item.modi_date?.dateToStr();
                item.use_yn = item.use_yn == 'Y' ? '사용' : '미사용';
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
                    header: '특수문자',
                    key: 'tsc',
                    width: 10,
                    style: {
                        alignment: { horizontal: 'center' },
                    },
                },
                {
                    header: '키워드',
                    key: 'keyword',
                    width: 21,
                },
                {
                    header: '종류',
                    key: 'op',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '검색영역',
                    key: 'ts',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '최초 등록일',
                    key: 'reg_date',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '최초 등록자',
                    key: 'k_writer',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '최종 작성일',
                    key: 'modi_date',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: '최종 등록자',
                    key: 'k_modifier',
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

            worker.postMessage({ list: this.excelDownList, columns: setColnameHeader, sheetName: '관리자_전체_제외_키워드' });

            worker.onmessage = (e) => {
                const blob = e.data;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '관리자_전체_제외_키워드.xlsx';
                a.click();
                URL.revokeObjectURL(url);
                this.excelLoading = false;
                worker.terminate();
            };
        },

        async fetchData(excel) {
            const param = {
                search_type: Number(this.brdOpts.search_type),
                search_keyword: this.brdOpts.search_keyword,
                order: this.brdOpts.order,
                op: this.brdOpts.op.value,
                ts: this.brdOpts.ts.value,
                use_yn: this.brdOpts.use_yn.value,
                page_num: this.brdOpts.page_num,
                row_limit: Number(this.getRowLimit),
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

                        this.input.search_keyword = this.brdOpts.search_keyword;
                        this.input.search_type = this.brdOpts.search_type;

                        this.parseListDatas();
                    } else {
                        this.excelDownList = this.setExcelForm(res?.data?.result?.list);
                        this.exportExcel();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (!excel) this.$store.dispatch('NOTY_ERR', '키워드 조회를 실패했습니다.');
                    else this.$store.dispatch('NOTY_ERR', '엑셀 요청에 실패 했습니다.');
                })
                .finally(() => {
                    this.loading = false;
                    // this.excelLoading = false;
                });
        },
    },
};
</script>

<!-- <style lang="scss" src="./style.scss" scoped /> -->
