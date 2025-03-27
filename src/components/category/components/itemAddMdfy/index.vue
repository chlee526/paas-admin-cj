<template>
    <comp-filter-grp v-if="hasAdminPermission" ref="filterGrp" class="common_codes_filtergrp" :class="[getType.class, { 'is-expanded': isOpen }]" :enabled="is1stPopoverEnabled" :pos="getType.pos" @confirm="evt_confirm" @cancel="evt_cancel" :disableConfirmBtn="getCompareDatas" :popoverLabel="getType.name" @open="evt_expanded(true)" @close="evt_expanded(false)">
        <template v-slot:custom>
            <template v-if="type == 'add'">
                <comp-button class="is-icon-only" :class="isRecursive ? 'is-small' : 'is-xsmall'" :title="getType.name"><span class="icon" v-html="getType.label"></span></comp-button>
            </template>
            <template v-else>
                {{ getTitle.decodeHTMLEntities() }}
                <span v-if="getItem.childrenCnt > 0" class="ui_fc_dm2">({{ getItem.childrenCnt }})</span>
                <comp-item-add-mdfy ref="filterGrp2nd" class="btn-item-add" :isRecursive="false" type="add" :useURL="getItem?.cmm_type === 0" @secondGrpExpanded="evt_secondGrpExpanded" @itemAdd="evt_2ndItemAdd"></comp-item-add-mdfy>
                <comp-button v-if="hasDeletePermission" class="is-xsmall is-icon-only btn-item-remove" title="삭제" @click.stop="evt_itemRemove"><span class="icon">&#xe022;</span></comp-button>
                <span v-if="getItem?.attr?.color?.trim()?.length" class="colors" :style="`--color: ${getItem.attr.color}`"></span>
            </template>
        </template>
        <template v-slot:items>
            <dl>
                <dt>
                    <strong>이름</strong>
                </dt>
                <dd>
                    <comp-input-box class="is-small" ref="inputBox" v-model="category.name" placeholder="키워드 입력" style="width: 220px" />
                </dd>
            </dl>
            <dl v-if="useURL">
                <dt>
                    <strong>URL</strong>
                </dt>
                <dd>
                    <comp-input-box class="is-small" ref="inputBox" v-model="category.url" placeholder="url 입력" style="width: 220px" />
                </dd>
            </dl>
            <dl v-else>
                <dt>
                    <strong>색상</strong>
                </dt>
                <dd>
                    <comp-colorpicker class="is-small" v-model="category.color" :useConfirm="false" :useReset="true" pos="BL" />
                </dd>
            </dl>
        </template>
    </comp-filter-grp>

    <!-- 조회 권한만 있을 경우 -->
    <div v-else class="common_codes_filtergrp" :class="[getType.class, { 'is-expanded': isOpen }]">
        <div class="title-wrap">
            {{ getTitle.decodeHTMLEntities() }}
        </div>
    </div>
</template>

<script>
import { isEqual, merge } from 'lodash';
import { mapGetters } from 'vuex';

export default {
    name: 'comp-item-add-mdfy',
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
            // 입력값
            category: {
                name: '',
                color: '',
            },
            // Open여부
            isOpen: false,
            // 첫벗째 팝오버 사용 여부
            is1stPopoverEnabled: true,
        };
    },
    props: {
        // 재귀 마지막
        isRecursive: { type: Boolean, default: true },
        // 컴포넌트 타입(추가/수정)
        type: { type: String, default: 'mdfy' },
        // 데이터
        item: { type: Object },
        // 데이터
        value: {},
        useURL: { type: Boolean },
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

        // 삭제 이벤트가 선언 되었는지 확인
        hasItemRemoveListener() {
            return 'itemRemove' in this.$listeners;
        },
        // 사용 데이터
        getItem() {
            return this.value ? this.value : this.item;
        },
        // 타입별 설정
        getType() {
            return {
                name: this.type == 'mdfy' ? '아이템 수정' : '아이템 추가',
                class: this.type == 'mdfy' ? 'btn-item-mdfy' : 'btn-item-add',
                label: this.type == 'mdfy' ? '&#xe057' : '&#xe017;',
                pos: this.type == 'mdfy' ? 'BL' : 'BR',
            };
        },
        // 카테고리명
        getTitle() {
            return this.getItem?.name || '아이템명 없음';
        },
        // prop 데이터, input 데이터 비교
        getCompareDatas() {
            if (!this.category.name.trim() || (this.useURL && !this.category?.url.trim())) {
                return true;
            }

            if (this.type === 'add') return false;

            const compareKeys = ['color'];

            if (this.useURL) {
                compareKeys.push('url');
            }

            const item = { name: this.getItem.name };
            const category = { name: this.category.name };

            compareKeys.forEach((key) => {
                item[key] = this.getItem?.attr?.[key] || '';
                category[key] = this.category?.[key] || '';
            });

            return isEqual(item, category);
        },
        getInit() {
            const init = {
                name: '',
                permission: '',
            };

            if (this.useURL) {
                init.url = '';
            } else {
                init.color = '';
            }

            return init;
        },
    },
    watch: {
        // 실제 사용 아이템 데이터
        getItem: {
            deep: true,
            immediate: true,
            handler(val) {
                if (this.type == 'mdfy') {
                    const value = structuredClone(val);

                    this.setCategory(value);
                }
            },
        },
    },
    created() {
        if (this.type === 'add' && this.useURL) {
            this.category = {
                ...this.category,
                url: '',
            };
        }
    },
    methods: {
        evtClick(e) {
            console.log('!!!!');
            e.preventDefault();
        },
        setCategory(item) {
            const category = {
                ...item,
                ...(this.useURL ? { url: item?.attr?.url || '' } : {}),
                ...(item?.attr || {}),
            };

            this.category = category;
        },
        // 저장
        async evt_confirm() {
            // 추가 시
            if (this.type == 'add') {
                this.$emit('itemAdd', this.category);
                this.category = { ...this.getInit };
            }

            // 수정 시
            if (this.type == 'mdfy') {
                const item = merge(this.getItem, this.category);
                this.$emit('itemMdfy', item);
                this.category = { ...item };
            }
        },
        // 저장 취소
        evt_cancel() {
            if (this.type === 'mdfy') {
                this.setCategory(this.getItem);
            } else {
                this.category = { ...this.getInit };
            }
        },

        /**
         * 아이템 삭제
         */
        evt_itemRemove() {
            this.$refs.filterGrp.Set_Expanded(false);
            this.$emit('itemRemove', this.getItem);
        },

        /**
         * 재귀 컴포넌트 저장 시
         */
        evt_2ndItemAdd(val) {
            const param = {
                type: 'i',
                level: 2,
                cmm_type: this.getItem.cmm_type,
                code: this.getItem.code,
                name: val.name,
                attr: {
                    color: val.color,
                },
            };

            if (this.useURL) {
                param.attr.url = val.url;
            }

            this.$emit('itemAdd', param);
        },

        /**
         * FilterGrp Open/Close 이벤트
         * @param {Boolean} val Open 여부
         */
        evt_expanded(val) {
            if (!this.isRecursive) this.$emit('secondGrpExpanded', val);
            else this.evt_firstGrpExpanded(val);
        },
        evt_firstGrpExpanded(val) {
            if (val) this.$refs?.filterGrp2nd?.$refs?.filterGrp?.Set_Expanded(false);
        },
        evt_secondGrpExpanded(val) {
            this.isOpen = val;
            if (val) {
                this.$refs?.filterGrp?.Set_Expanded(false);
                this.is1stPopoverEnabled = false;
            }
            setTimeout(() => {
                this.is1stPopoverEnabled = !val;
            });
        },
    },
};
</script>

<style src="./style.scss" lang="scss" />
