<template>
    <div class="category ui-loader-container" :class="{ 'is-loading': loading }">
        <div class="header" :class="{ 'is-view-permission': !hasAdminPermission }">
            <h3>{{ getTitle }}</h3>
            <!-- 카테고리 수정 Filter -->
            <CompCategoryMdfy v-if="hasAdminPermission" :item="item" :id="`category_mdfy_${item.code}`" type="mdfy" @categoryMdfy="evt_categoryMdfy" />

            <!-- 카테고리 삭제 -->
            <comp-button v-if="hasDeletePermission" class="is-icon-only is-xsmall" title="카테고리 삭제" @click="evt_categoryRemove"><span class="icon">&#xe022;</span></comp-button>

            <!-- 아이템 추가 Filter -->
            <CompItemAddMdfy v-if="hasAdminPermission" :id="`category_add_${item.code}`" type="add" :useURL="item.cmm_type === 0" @itemAdd="evt_itemAdd" />
        </div>

        <comp-list v-if="sortable && hasAdminPermission" class="list list_wrap" v-sortable="{ data: getItemList, wrapClass: 'list-wrap', itemClass: 'common_codes_filtergrp', targetClass: 'title-wrap' }" @click="evtClick" @listUpdate="updateOrder">
            <template v-slot:default>
                <CompItemAddMdfy v-for="(item, index) in getItemList" :key="item.seq" :id="`category_mdfy_${item.code}`" :class="`item_lv_${item.use_level}`" type="mdfy" :item="item" :data-index="index" :data-drag-group="item.dataGroup" :data-grp-head="item.use_level === 1" useURL @itemMdfy="evt_itemMdfy" @itemRemove="evt_itemRemove" @itemAdd="evt_itemAdd2nd" />
            </template>
        </comp-list>

        <comp-list v-else class="list list_wrap">
            <template v-slot:default>
                <CompItemAddMdfy v-for="item in getItemList" :key="item.seq" :id="`category_mdfy_${item.code}`" :class="`item_lv_${item.use_level}`" type="mdfy" :item="item" @itemMdfy="evt_itemMdfy" @itemRemove="evt_itemRemove" @itemAdd="evt_itemAdd2nd" />
            </template>
        </comp-list>
    </div>
</template>

<script>
import { isEqual } from 'lodash';
import { findNodeByProps } from '@shared/utils/prototype/util.object';
import { mapGetters } from 'vuex';

import CompCategoryMdfy from './components/categoryAddMdfy';
import CompItemAddMdfy from './components/itemAddMdfy';

import { API_category } from '@/api/admin/common';

export default {
    name: 'comp-admin-common-category',
    data() {
        return {
            loading: false,
            compItemAddMdfy: CompItemAddMdfy,
        };
    },
    components: {
        CompCategoryMdfy,
        CompItemAddMdfy,
    },
    props: {
        item: {},
        sortable: { type: Boolean, defualt: false },
    },
    computed: {
        ...mapGetters(['getUserPermissions']),

        // 등록/수정 권한
        hasAdminPermission() {
            return this.getUserPermissions >= 2;
        },

        // 삭제 권한
        hasDeletePermission() {
            return this.getUserPermissions >= 3;
        },

        // 카테고리명
        getTitle() {
            return this.item?.name || '카테고리명 없음';
        },
        // prop 데이터, input 데이터 비교
        getCompareDatas() {
            return isEqual(this.item, this.category);
        },
        // 수정 설정
        getMdfySet() {
            return {
                type: 'mdfy',
                name: '카테고리 수정',
                label: '&#xe057;',
            };
        },
        // 추가 설정
        getAddSet() {
            return {
                type: 'add',
                name: '카테고리 추가',
                label: '&#xe057;',
            };
        },
        getItemList() {
            const parseChildrenList = (items, parentItem = null) => {
                return items
                    .map((item) => {
                        const result = {
                            ...item,
                            childrenCnt: item.children ? item.children.length : 0,
                            children: undefined,
                            dataGroup: this.sortable && parentItem ? parentItem.seq : item.seq,
                        };

                        if (item.children) {
                            result.children = parseChildrenList(item.children, item);
                        }

                        return result;
                    })
                    .sort((a, b) => a.order - b.order);
            };

            return parseChildrenList(this.item?.children || []).flatten();
        },
    },
    created() {},
    mounted() {},
    watch: {
        item: {
            deep: true,
            immediate: true,
            handler(val) {
                const tmp = JSON.parse(JSON.stringify(val));
                tmp.permission = '';
                this.category = tmp;
            },
        },
    },
    methods: {
        evtClick(e) {
            console.log('???!!!!');
        },
        /**
         * 전달받은 코드의 자식 list를 order 오름차순 정렬 반환
         * @param code 부모 코드
         */
        getChildrednOrder(code) {
            const children = findNodeByProps(this.item, { code })?.children;

            if (children) {
                return children.sort((a, b) => a.order - b.order);
            }

            return [];
        },
        /**
         * FetchData
         * 카테고리 로드
         * 아이템 등록/수정/삭제 후 갱신시 사용
         */
        async fetchCategory() {
            console.log('카테고리 갱신');
            this.loading = true;

            await this.$store
                .dispatch('opts/ATTRS', { cmm_type: this.item.cmm_type })
                .then((res) => {
                    if (res.data?.result?.list[0]) this.$emit('update:item', res.data?.result?.list[0]);
                })
                .catch(($err) => {
                    this.$store.dispatch('DIALOG_ERR', ['카테고리 데이터를 갱신하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '갱신 실패', 0]).then(($val) => {
                        location.reload();
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * FetchData
         * 공통 코드 전체 로드
         */
        async updateItem(param) {
            this.loading = true;

            await API_category(this.apiUID_category_update, param)
                .catch(() => {
                    this.$store.dispatch('NOTY_ERR', `아이템 추가에 실패 했습니다.`);
                })
                .finally(() => {
                    this.loading = false;
                    this.fetchCategory();
                });
        },

        /**
         * Event - 카테고리 수정
         * 이벤트 발생 시 상위로 이벤트 전달
         * @param {*} param 수정 카테고리 파라미터
         */
        evt_categoryMdfy(param) {
            this.$emit('categoryMdfy', param);
        },

        /**
         * Event - 카테고리 삭제
         * 이벤트 발생 시 Confirm 후 상위로 이벤트 전달
         */
        evt_categoryRemove() {
            this.$store.dispatch('DIALOG_WRN', [`카테고리 삭제 시, 하위 아이템이 모두 삭제되며,<br> 시스템에 큰 영향을 줄 수 있습니다.<br><br><strong>[${this.item.name}]</strong> 카테고리를 삭제하시겠습니까?`, '카테고리 삭제', 2]).then(() => {
                this.$emit('categoryRemove', this.item);
            });
        },

        /**
         * Event - 아이템 추가
         * @param {*} param 추가 아이템 파라미터
         */
        evt_itemAdd(param) {
            // 추가 : 마지막 order 번호 + 1
            let order = -1;
            const orderList = this.getChildrednOrder(this.item.cmm_type);

            if (orderList.length) {
                order = orderList[orderList.length - 1].order;
            }

            const parameter = {
                cmm_type: this.item.cmm_type,
                type: 'i',
                level: 2,
                name: param.name,
                attr: {
                    color: param.color || '',
                },
                order: order + 1,
            };

            if (this.item.cmm_type === 0) {
                parameter.attr.url = param.url;
            }

            this.updateItem(parameter);
        },
        evt_itemAdd2nd(param) {
            // 추가 : 마지막 order 번호 + 1
            let order = -1;
            const orderList = this.getChildrednOrder(param.code);

            if (orderList.length) {
                order = orderList[orderList.length - 1].order;
            }

            this.updateItem({ ...param, order: order + 1 });
        },

        /**
         * Event - 아이템 수정
         * @param {*} param 수정 아이템 파라미터
         */
        evt_itemMdfy(param) {
            console.log('evt item mdfy  >>  ', param);

            const parameter = {
                type: 'u',
                level: 1,
                name: param.name,
                seq: param.seq,
                order: param.order,
                attr: {
                    color: param.color || '',
                },
            };

            if (this.item.cmm_type === 0) {
                parameter.attr.url = param.url;
            }

            this.updateItem(parameter);
        },

        /**
         * Event - 아이템 삭제
         * @param {*} param 수정 아이템 파라미터
         */
        evt_itemRemove(param) {
            this.$store
                .dispatch('DIALOG_WRN', [`아이템 삭제 시, 시스템에 큰 영향을 줄 수 있습니다.<br><br><strong>[${param.name}]</strong> 아이템을 삭제하시겠습니까?`, '아이템 삭제', 2])
                .then(() => {
                    console.log('evt item remove  >>  ', param);
                    const removeSeq = [findNodeByProps(this.item, { seq: param.seq })].flatten().arrObjAttrToStr('seq');
                    this.updateItem({
                        type: 'd',
                        level: 2,
                        seq: removeSeq,
                    });
                })
                .catch(() => {});
        },

        async updateOrder({ detail }) {
            this.loading = true;

            const { tgIdx, dragIdx } = detail;
            const current = this.getItemList[dragIdx];
            const target = this.getItemList[tgIdx];
            const parent = this.getItemList.find(({ dataGroup, use_level }) => dataGroup === current.dataGroup && use_level < current.use_level);

            const code = parent ? parent.code : this.item.code;

            const list = this.getChildrednOrder(code);

            const currentIndex = list.findIndex(({ seq }) => seq === current.seq);
            const targetIndex = list.findIndex(({ seq }) => seq === target.seq);

            // 현재 인덱스의 요소 추출
            const [removed] = list.splice(currentIndex, 1);

            // 추출한 요소를 목표 인덱스에 삽입
            list.splice(targetIndex, 0, removed);

            // order 값 재조정
            const updatedList = list.map((item, index) => ({
                ...item,
                order: index,
            }));

            Promise.all(
                updatedList.map((item) => {
                    const parameter = {
                        type: 'u',
                        level: Number(item.level),
                        name: item.name,
                        seq: item.seq,
                        order: item.order,
                        attr: item.attr,
                    };
                    return API_category(this.apiUID_category_update, parameter);
                }),
            )
                .catch(() => {
                    this.$store.dispatch('NOTY_ERR', `아이템 수정을 실패 했습니다.`);
                })
                .finally(() => {
                    this.loading = false;
                    this.fetchCategory();
                });
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
