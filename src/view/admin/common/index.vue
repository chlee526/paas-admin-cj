<template>
    <div id="content" class="ui-loader-container" :class="{ 'is-loading': loading }">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap is-hgt100">
            <div class="contents">
                <div class="wrap">
                    <!-- 카테고리 추가 -->
                    <CompCategoryAdd v-if="hasAdminPermission" :id="`category_add`" class="category_add" type="add" @categoryAdd="evt_categoryAdd"></CompCategoryAdd>

                    <!-- 카테고리 목록 -->
                    <div class="common_code">
                        <CompCategory v-for="(item, idx) in datas" :key="item.seq" :item.sync="datas[idx]" :sortable="item.cmm_type === 0" @categoryMdfy="evt_categoryMdfy" @categoryRemove="evt_categoryRemove" @fetchCommonCodes="fetchCommonCodes"></CompCategory>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import { findNodeByProps } from '@shared/utils/prototype/util.object';
import { mapGetters } from 'vuex';

import CompCategory from '@/components/category';
import CompCategoryAdd from '@/components/category/components/categoryAddMdfy';
import { API_category } from '@/api/admin/common';

export default {
    name: 'page-admin-common',
    components: {
        CompCategory,
        CompCategoryAdd,
    },
    data() {
        return {
            apiUID_category_update: uuid.v4(),
            loading: false,
            datas: [],
            addCategory: {
                name: '',
            },
        };
    },
    mounted() {
        this.fetchCommonCodes();
    },
    computed: {
        ...mapGetters(['getUserPermissions']),

        // 등록/수정 권한
        hasAdminPermission() {
            return this.getUserPermissions >= 2;
        },
    },
    methods: {
        sortByOrder(list) {
            return list.sort((a, b) => {
                // 현재 레벨의 order로 먼저 정렬
                if (a.order !== b.order) {
                    return a.order - b.order;
                }

                // children이 존재하는 경우 재귀적으로 children도 정렬
                if (a.children && b.children) {
                    a.children = this.sortByOrder(a.children);
                    b.children = this.sortByOrder(b.children);
                }

                return 0;
            });
        },
        /**
         * FetchData
         * 공통 코드 전체 로드
         */
        async fetchCommonCodes() {
            this.loading = true;

            // await sleep(1000);

            await this.$store
                .dispatch('opts/ATTRS', {})
                .then((res) => {
                    this.datas = this.sortByOrder(res.data?.result?.list);
                })
                .catch(($err) => {
                    this.$store
                        .dispatch('DIALOG_ERR', ['데이터를 로드하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '로드 실패', 0])
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

        /**
         * 카테고리 업데이트
         * @param {*} param 업데이트 할 카테고리와, 업데이트 내용
         */
        async updateCategory(param) {
            this.loading = true;

            await API_category(this.apiUID_category_update, param)
                .catch(() => {
                    this.$store.dispatch('NOTY_ERR', `카테고리 생성에 실패 했습니다.`);
                })
                .finally(() => {
                    this.loading = false;
                    this.fetchCommonCodes();
                });
        },

        /**
         * Event - 카테고리 추가
         * @param {*} param 추가 카테고리 파라미터
         */
        evt_categoryAdd(param) {
            console.log('evt category add  >>  ', param);
            this.updateCategory({
                type: 'i',
                level: 1,
                name: param.name,
            });
        },

        /**
         * Event - 카테고리 수정
         * @param {*} param 수정 카테고리 파라미터
         */
        evt_categoryMdfy(param) {
            console.log('evt category mdfy  >>  ', param);
            this.updateCategory({
                type: 'u',
                level: 1,
                name: param.name,
                seq: param.seq,
                order: param.order, // order 없을 경우 api 500 에러 발생
            });
        },

        /**
         * Event - 카테고리 삭제
         * @param {*} param 삭제 카테고리 파라미터
         */
        evt_categoryRemove(param) {
            console.log('evt category remove  >>  ', param);
            const removeSeq = [findNodeByProps(this.datas, { seq: param.seq })].flatten().arrObjAttrToStr('seq');
            if (!removeSeq) return;
            this.updateCategory({
                type: 'd',
                level: 1,
                seq: removeSeq,
            });
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
