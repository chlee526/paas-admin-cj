<script>
import { excelDownload } from '@shared/utils/prototype/util.link';

import { API_keywordlist } from '@/api/admin/keyword/keyword';
import CompKeywordList from '@/components/keyword_boilerplate/comp_list';

export default {
    name: 'comp-main-brd2',
    extends: CompKeywordList,
    data() {
        return {
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
        };
    },
    props: {
        categoryList: { type: Array },
    },
    computed: {
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
    watch: {},
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
                    header: '그룹',
                    key: 'category',
                    width: 21,
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

            worker.postMessage({ list: this.excelDownList, columns: setColnameHeader, sheetName: '관리자_기사_주제_사전' });

            worker.onmessage = (e) => {
                const blob = e.data;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '관리자_기사_주제_사전.xlsx';
                a.click();
                URL.revokeObjectURL(url);
                this.excelLoading = false;
                worker.terminate();
            };
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
                use_yn: this.brdOpts.use_yn.value,
                op: this.brdOpts.op.value,
                ts: this.brdOpts.ts.value,
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

                        result.list.map((item) => {
                            item.seq = item.k_seq;
                        });

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

        parseSgCodeToName(sg_code, limit) {
            if (!sg_code) return '';
            const codeArr = sg_code.split(',').map((code) => Number(code));
            const result = this.getSgSeqs.filter((item) => codeArr.includes(item.code)).arrObjAttrToStr('name', '', limit);
            return result;
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
    },
};
</script>

<!-- <style lang="scss" src="./style.scss" scoped /> -->
