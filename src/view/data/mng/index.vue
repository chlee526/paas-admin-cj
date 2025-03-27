<template>
    <div id="content" class="ui-loader-container" :class="{ 'is-loading': loading }">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap is-hgt100">
            <div class="contents">
                <div class="wrap">
                    <div class="data_mng">
                        <template v-for="(item, idx) in getList"><CompDownloadItem :key="idx" :item="{ item }" /> </template>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
/**
 * 기본적으로 현재 날짜 이전달이 최근 날짜로 설정 함.
 */

import { uuid } from 'vue-uuid';

import CompDownloadItem from './components/downloadItem';

import { API_dataMngList } from '@/api/data/mng';

export default {
    name: 'page-data-download',
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,

            // 다운로드 항목(API 통해서 들어옴)
            list: [],
        };
    },
    components: {
        // 다운로드 항목 아이템
        CompDownloadItem,
    },
    computed: {
        /**
         * 목록 반환
         * disabled에 대한 조건 확인 후 데이터에 바인딩해서 반환
         */
        getList() {
            const result = JSON.parse(JSON.stringify(this.list));

            result.forEach((item, idx) => {
                if (idx == 0) {
                    item.months.map((month, monthIdx) => {
                        if (monthIdx == 0) {
                            month.isDate = true;
                        } else {
                            month.isDate = false;
                        }
                        return month;
                    });
                } else {
                    item.months.map((month) => {
                        month.isDate = false;
                    });
                }

                return item;
            });

            return result;
        },
    },
    mounted() {
        this.fetchDatas();
    },
    methods: {
        async fetchDatas() {
            this.loading = true;

            await API_dataMngList(uuid.v4())
                .then((res) => {
                    this.list = res.data?.result?.list;
                })
                .catch((err) => {
                    this.store
                        .dispatch('DIALOG_ERR', ['다운로드 항목을 가져오지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '다운로드 항목 조회 실패', 0])
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
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
