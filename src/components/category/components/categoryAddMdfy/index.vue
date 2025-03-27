<template>
    <comp-filter-grp :pos="getType.pos" @confirm="evt_confirm" @cancel="evt_cancel" :disableConfirmBtn="getCompareDatas" :confirmLabel="getType.confirmLabel" :popoverLabel="getType.name">
        <template v-slot:custom>
            <!-- 추가의 경우 -->
            <comp-button v-if="type == 'add'" class="is-icon-with is-before is-large" title="카테고리 추가"><span class="icon">&#xe017;</span><span class="txt">카테고리 추가</span></comp-button>
            <!-- 수정의 경우 -->
            <comp-button v-else class="is-icon-only is-xsmall" title="카테고리 수정"><span class="icon">&#xe057;</span></comp-button>
        </template>
        <template v-slot:items>
            <dl>
                <dt>
                    <strong>이름</strong>
                </dt>
                <dd><comp-input-box class="is-small" ref="inputBox" v-model="category.name" placeholder="키워드 입력" style="width: 150px"></comp-input-box></dd>
            </dl>
            <!-- <dl>
                <dt>
                    <strong>기능</strong>
                </dt>
                <dd>
                    <comp-checkbox-grp :id="`${id}_permission`" class="is-small" :name="`${id}_permission`" :opts="setting.permissionOpts" box v-model="category.permission" />
                </dd>
            </dl> -->
        </template>
    </comp-filter-grp>
</template>

<script>
import { isEqual, merge } from 'lodash';

export default {
    name: 'comp-category-add-mdfy',
    data() {
        return {
            loading: false,
            setting: {
                // 권한 옵션
                permissionOpts: [
                    { code: 'i', name: '추가' },
                    { code: 'u', name: '수정' },
                    { code: 'd', name: '삭제' },
                ],
            },
            category: {
                name: '',
                permission: '',
            },
        };
    },
    components: {},
    props: {
        // ID
        id: {},
        // 타입
        type: {},
        // 데이터
        item: {},
    },
    computed: {
        // 타입별 설정
        getType() {
            return {
                name: this.type == 'mdfy' ? '카테고리 수정' : '카테고리 추가',
                label: this.type == 'mdfy' ? '&#xe057' : '&#xe017;',
                pos: this.type == 'mdfy' ? 'BL' : 'OR',
                confirmLabel: this.type == 'mdfy' ? '적용' : '추가',
            };
        },
        // 카테고리명
        getTitle() {
            return this.item?.name || '카테고리명 없음';
        },
        // prop 데이터, input 데이터 비교
        getCompareDatas() {
            if (this.type == 'add') return this.category.name.trim().length == 0 ? true : false;
            return isEqual(this.item, this.category);
        },
    },
    watch: {
        item: {
            deep: true,
            immediate: true,
            handler(val) {
                if (this.type == 'mdfy') this.category = JSON.parse(JSON.stringify(val));
            },
        },
    },
    methods: {
        // 저장
        async evt_confirm() {
            // 추가 시
            if (this.type == 'add') {
                this.$emit('categoryAdd', this.category);
                this.category = { name: '', permission: '' };
            }

            // 수정 시
            if (this.type == 'mdfy') {
                this.$emit('categoryMdfy', merge(this.item, this.category));
                this.category = JSON.parse(JSON.stringify(this.item));
            }
        },
        // 저장 취소
        evt_cancel() {
            if (this.type == 'mdfy') this.category = JSON.parse(JSON.stringify(this.item));
            else this.category = { name: '', permission: '' };
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
