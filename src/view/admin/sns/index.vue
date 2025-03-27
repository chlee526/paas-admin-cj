<template>
    <div id="content" class="ui-loader-container" :class="{ 'is-loading': loading }">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap is-hgt100">
            <div class="contents">
                <div class="wrap">
                    <div class="ui_row">
                        <div class="wrap">
                            <div class="ui_col">
                                <List :savePersonalization.sync="savePersonalization" :dataList="dataList" :dataSet="dataSet" :editItem.sync="editItem" :excelLoading="excelLoading" @update="evtUpdate" @excelDownload="evtExcelDownload" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <aside v-control-aside-width="{ menu: 'admin_sns', isClosed: asideClosed }" style="min-width: 390px; max-width: 800px">
            <div class="ui_row">
                <div class="wrap">
                    <div class="ui_col">
                        <CompAsideAcount :editItem="editItem" :autocompleteList="dataSet.mediaAutocompleteList" :snsList="dataSet.snsMaster" :urlList="getURLList" @setEditItem="evtEdit" @update="evtUpdate" @save="evtSave" />
                    </div>
                </div>
            </div>
        </aside>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import { getItemLocalStorage, setItemLocalStorage } from '@shared/utils/localStorage';
import merge from 'lodash/merge';
import { renameProperties } from '@shared/utils/prototype/util.object';
import { excelDownload } from '@shared/utils/prototype/util.link';

import List from './components/list';
import CompAsideAcount from './components/aside_acount';

import { API_snsMaster, API_list, API_update } from '@/api/admin/sns';
import { API_siteList } from '@/api/admin/site/collect';
export default {
    name: 'page-admin-snsacount',
    data() {
        return {
            excelDownList: [],
            apiUID: uuid.v4(),
            loading: false,
            excelLoading: false,
            savePersonalization: {
                main: {
                    data_list: {
                        // 항목설정
                        colOpts: {
                            site_name: true,
                            sns_seq: true,
                            url: true,
                            reg_dt: true,
                        },
                    },
                },
            },
            dataSet: {
                snsMaster: [],
                mediaAutocompleteList: [],
            },
            dataList: [],
            editItem: {},
            asideClosed: false,
        };
    },
    components: {
        List,
        CompAsideAcount,
    },
    async beforeRouteEnter(from, to, next) {
        /**
         * 사전 데이터 요청
         * 1. SNS 마스터 목록 조회
         * 2. 매체 자동완성 목록 조회
         */
        let snsMasterList = [];

        // 1. SNS 마스터 목록 조회
        await API_snsMaster(uuid.v4())
            .then((res) => {
                snsMasterList = res.data?.result?.list;
            })
            .catch((err) => {
                this.store
                    .dispatch('DIALOG_ERR', ['SNS 마스터 목록을 가져오지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', 'SNS 마스터 목록 조회 실패', 0])
                    .then(($val) => {
                        location.reload();
                    })
                    .catch(($err) => {
                        console.log('error');
                    });
            });

        // 2. 매체명 자동완성 목록 조회
        await API_siteList(uuid.v4())
            .then((res) => {
                next((vm) => {
                    // Component에 데이터 전달
                    vm.dataSet.snsMaster = renameProperties(snsMasterList, { sns_name: 'name', sns_seq: 'code' });
                    vm.dataSet.mediaAutocompleteList = res.data?.result?.list
                        .filter((item) => item.gr_name === '뉴스')
                        .map((item) => {
                            return {
                                code: item.name,
                                name: item.name,
                            };
                        });
                });
            })
            .catch((err) => {
                this.store
                    .dispatch('DIALOG_ERR', ['매체 자동완성 목록을 가져오지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', 'SNS 마스터 목록 조회 실패', 0])
                    .then(($val) => {
                        location.reload();
                    })
                    .catch(($err) => {
                        console.log('error');
                    });
            });
    },
    created() {
        // 개인화
        const personalization = getItemLocalStorage('personalization');
        this.savePersonalization = merge(this.savePersonalization, personalization?.admin_snsacount);
    },
    mounted() {
        // 최초 실행 시 Fetch 시작
        this.fetchDatas();
    },
    watch: {
        // 개인화
        savePersonalization: {
            deep: true,
            handler(val) {
                const personalization = getItemLocalStorage('personalization');
                const savePersonalization = {
                    ...personalization,
                    admin_snsacount: {
                        ...personalization?.admin_snsacount,
                        main: {
                            ...personalization?.admin_snsacount?.main,
                            ...val.main,
                        },
                    },
                };
                setItemLocalStorage('personalization', savePersonalization);
            },
        },
        editItem: {
            deep: true,
            handler(val) {
                if (this.asideClosed && Object.keys(this.editItem).length > 0) this.asideClosed = false;
            },
        },
    },
    computed: {
        getURLList() {
            return this.dataList.map(({ url }) => url);
        },
    },
    methods: {
        setExcelForm(list) {
            let result = JSON.parse(JSON.stringify(list));

            result.map((item) => {
                item.reg_dt = item.reg_dt?.dateToStr();
                item.sns_seq = this.dataSet.snsMaster.getParseDatas({ code: item.sns_seq })[0].name;
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
                    header: '매체명',
                    key: 'site_name',
                    width: 10,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: 'SNS 계정',
                    key: 'sns_seq',
                    width: 21,
                    style: {
                        alignment: {
                            horizontal: 'center',
                        },
                    },
                },
                {
                    header: 'URL',
                    key: 'url',
                    width: 70,
                },
                {
                    header: '등록일',
                    key: 'reg_dt',
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

            worker.postMessage({ list: this.excelDownList, columns: setColnameHeader, sheetName: '관리자_SNS계정' });

            worker.onmessage = (e) => {
                const blob = e.data;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '관리자_SNS계정.xlsx';
                a.click();
                URL.revokeObjectURL(url);
                this.excelLoading = false;
                worker.terminate();
            };
        },
        evtExcelDownload(list) {
            this.excelLoading = true;
            this.excelDownList = this.setExcelForm(list);
            this.exportExcel();
        },
        // evtExcelDownload() {
        //     // this.fetchDatas('excel');

        //     const worker = new Worker('./excelWorker/excel1.js');
        //     worker.postMessage('this.data');
        //     worker.onmessage = (event) => {
        //         this.downloadFile(event.data, 'data.xlsx');
        //         worker.terminate();
        //     };
        // },
        // downloadFile(data, filename) {
        //     const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        //     const link = document.createElement('a');
        //     link.href = window.URL.createObjectURL(blob);
        //     link.download = filename;
        //     link.click();
        // },
        /**
         * API - 목록
         */
        async fetchDatas(excel) {
            if (excel) this.excelLoading = true;
            else this.loading = true;

            let param;
            if (excel) {
                param = {
                    search_keyword: '',
                    excel: 1,
                };
            }

            await API_list(this.apiUID, param)
                .then((res) => {
                    if (!excel) {
                        const data = structuredClone(res.data);
                        this.dataList = data?.result?.list || [];
                    } else {
                        excelDownload(res?.data?.result?.excelLink);
                    }
                })
                .catch((err) => {
                    if (!excel) this.$store.dispatch('NOTY_ERR', 'SNS계정 조회를 실패했습니다.');
                    else this.$store.dispatch('NOTY_ERR', '엑셀 요청에 실패 했습니다.');
                })
                .finally(() => {
                    this.loading = false;
                    // this.excelLoading = false;
                });
        },

        /**
         * API - 업데이트(추가/수정/삭제)
         * 업데이트가 완료되면 fetchData를 실행
         */
        async updateSns(param) {
            this.loading = true;

            const updateUid = uuid.v4();

            await API_update(updateUid, param)
                .then((res) => {
                    this.$store.dispatch('NOTY_COM', `데이터를 ${param.type == 'i' ? '등록' : param.type == 'u' ? '수정' : '삭제'} 했습니다.`);

                    // 수정사항 editeItem에 반영
                    if (param.type === 'u' && param.seq === this.editItem.seq) {
                        const obj = structuredClone(param);
                        delete param.type;

                        this.editItem = {
                            ...this.editItem,
                            ...obj,
                        };
                    }

                    this.loading = false;
                    this.fetchDatas();
                })
                .catch((err) => {
                    this.$store.dispatch('DIALOG_ERR', [`데이터 ${param.type == 'i' ? '등록을' : param.type == 'u' ? '수정을' : '삭제를'} 실패 했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.`, `데이터 ${param.type == 'i' ? '추가' : param.type == 'u' ? '수정' : '삭제'}`, 0]).then(() => {
                        location.reload();
                    });
                });
        },

        /**
         * 이벤트 - Edit 아이템 변경
         * @param {Object} item
         */
        evtEdit(item) {
            this.editItem = structuredClone(item);
        },

        /**
         * 이벤트 - 계정 추가/수정/삭제
         * @param {Object} param
         */
        evtUpdate(param) {
            const params = {
                type: param.type,
                site_name: param.site_name,
                sns_seq: param.sns_seq,
                sns_name: param.sns_name,
                url: param.url,
            };
            // 수정이나 삭제면 seq 추가
            if (params.type == 'u' || params.type == 'd') params.seq = param.seq;

            if (params.type == 'd') {
                if (param.seq.split(',').length > 1) {
                    this.$store.dispatch('DIALOG_WRN', [`선택하신 <strong>${params.seq.split(',').length}</strong>개의 데이터를 삭제 하시겠습니까?`, '데이터 삭제', 2]).then((val) => {
                        this.evtBulkRemove(param);
                    });
                } else {
                    this.$store.dispatch('DIALOG_WRN', [`데이터를 삭제 하시겠습니까?`, '데이터 삭제', 2]).then((val) => {
                        // 삭제 시 필요 매개변수 외에 전부 제거
                        delete params.site_name;
                        delete params.sns_seq;
                        delete params.sns_name;
                        delete params.url;
                        this.updateSns(params);
                    });
                }
            } else {
                this.updateSns(params);
            }
        },

        /**
         * 이벤트 - 계정 일괄 삭제
         * @param {Object} params
         */
        async evtBulkRemove(params) {
            const updateUid = uuid.v4();
            const promises = params.seq.split(',').map(async (item, idx) => {
                let param = { type: params.type, seq: item };

                return await API_update(updateUid + '_' + idx, param)
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            });

            let successList = [];
            let failList = [];
            await Promise.allSettled(promises)
                .then((res) => {
                    res.forEach((item) => {
                        if (item.status === 'fulfilled' && item.value?.data.result.code === 200) successList.push(item);
                        if (item.status !== 'fulfilled' || !item.value) failList.push(item);
                    });
                })
                .finally(() => {
                    if (failList.length > 0) {
                        this.$store.dispatch('DIALOG_ERR', [`데이터 삭제를 실패 했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.`, `데이터 삭제`, 0]).then(() => {
                            location.reload();
                        });
                    } else {
                        this.$store.dispatch('NOTY_COM', `데이터를 삭제 했습니다.`);
                        this.loading = false;
                        this.fetchDatas();
                    }
                });
        },

        // SNS 계정 등록(단일 + 다중)
        async evtSave(list) {
            this.loading = true;

            // 작업 완료 후 noty를 위해 결과값 저장
            const sussessList = [];
            const failList = [];

            const promises = list.map(async (item, idx) => {
                const param = {
                    type: 'i',
                    ...item,
                };
                delete param.seq;

                const updateUid = uuid.v4();

                // 순서대로 등록되게 하기 위한 딜레이
                await new Promise((resolve) => setTimeout(resolve, 30 * idx));

                return await API_update(updateUid, param)
                    .then((res) => {
                        sussessList.push(res);
                    })
                    .catch((err) => {
                        failList.push(err);
                    });
            });

            await Promise.allSettled(promises).finally(() => {
                this.$store.dispatch('NOTY_COM', `데이터를 등록했습니다.`);

                if (failList.length) {
                    this.$store.dispatch('DIALOG_ERR', [`데이터 등록을 실패 했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.`, `데이터 추가`, 0]).then(() => {
                        location.reload();
                    });
                }

                this.loading = false;
                this.fetchDatas();
            });
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
