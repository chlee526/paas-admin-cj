<template>
    <div id="content" class="ui-loader-container" :class="{ 'is-loading': loading }">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap is-hgt100">
            <div class="contents">
                <div class="wrap">
                    <div class="ui_row">
                        <div class="wrap is-cols-pad" style="height: 100%">
                            <div class="ui_col w4">
                                <List :dataList="dataList" :selectedItem.sync="selectedItem" :isEditMode="isEditMode" @updateDataList="fetchDatas" />
                            </div>
                            <div class="ui_col w20">
                                <Edit :dataList="dataList" :selectedItem.sync="selectedItem" :isEditMode.sync="isEditMode" @updateDataList="fetchDatas" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';
import { API_helperList } from '@shared/api/helper';

import List from './components/list';
import Edit from './components/edit';

export default {
    name: 'page-helper',
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            dataList: [],
            selectedItem: {}, // 선택된 도움말 아이템
            isEditMode: false, // 수정모드 여부
        };
    },
    components: {
        List,
        Edit,
    },
    computed: {
        ...mapGetters(['getUseageLNB']),
    },
    watch: {},
    mounted() {
        this.fetchDatas();
    },
    methods: {
        /**
         * API - 도움말 목록(관리자)
         */
        async fetchDatas() {
            this.loading = true;
            const param = { admin: 'Y' };
            await API_helperList(this.apiUID, param)
                .then((res) => {
                    const data = structuredClone(res.data);
                    this.dataList = data?.result?.list || [];
                })
                .catch((err) => {
                    this.$store.dispatch('NOTY_ERR', '도움말 목록 조회를 실패했습니다.');
                })
                .finally(() => {
                    // 선택아이템이 있을 경우 목록 업데이트 후 선택아이템 재할당
                    if (Object.keys(this.selectedItem).length) {
                        const findItem = (items, targetCode) => {
                            for (const item of items) {
                                if (item.code === targetCode) {
                                    return item;
                                }

                                if (item.children?.length) {
                                    const found = findItem(item.children, targetCode);
                                    if (found) return found;
                                }
                            }
                            return null;
                        };

                        const updatedItem = findItem(this.dataList, this.selectedItem.code);
                        this.selectedItem = !updatedItem ? {} : structuredClone(updatedItem);
                    }
                    this.loading = false;
                });
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
