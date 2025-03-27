<template>
    <div class="user_group_wrap">
        <comp-list :id="id" class="user_group" :datas="listData" :component="compItem" @click="evtClick" @remove="evtRemove" @confirm="evtConfirm"></comp-list>
        <comp-filter-grp v-if="hasAdminPermission" ref="addGrp" class="add_group_btn" :getNoIconWrapPos="addGrpWrapPos" confirmLabel="추가" :disableConfirmBtn="!addGrpName.length" @open="hndlOpenAddGrp" @confirm="evtConfirmInAddGrp" @cancel="addGrpName = ''">
            <template v-slot:custom>그룹 추가</template>
            <template v-slot:items>
                <dl>
                    <dt>
                        <strong>그룹명</strong>
                    </dt>
                    <dd><comp-input-box class="is-small" ref="inputBox" v-model="addGrpName" placeholder="그룹명 입력" style="width: 170px"></comp-input-box></dd>
                </dl>
            </template>
        </comp-filter-grp>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import GroupItem from './GroupItem.vue';

export default {
    name: 'com-group-list',
    data() {
        return {
            addGrpName: '',
            addGrpWrapPos: {},
            compItem: GroupItem,
        };
    },
    props: {
        id: { type: String, required: true },
        listData: { type: Array, required: true },
    },
    computed: {
        ...mapGetters(['getUserPermissions']),

        // 등록/수정 권한
        hasAdminPermission() {
            return this.getUserPermissions >= 2;
        },
    },
    methods: {
        /**
         * 그룹 추가 wrapper position
         */
        hndlOpenAddGrp() {
            const targetPos = this.$refs.addGrp?.$el.getBoundingClientRect();
            this.addGrpWrapPos = {
                top: parseInt(targetPos.top) + 'px',
                left: parseInt(targetPos.left) + 'px',
                marginTop: -(targetPos.height * 2 + 45) + 'px',
                marginLeft: -parseInt(targetPos.width) + 'px',
            };
        },

        /**
         * 사이트 그룹 활성화
         */
        evtClick(val) {
            this.$emit('click', val);
        },

        /**
         * 사이트 그룹 삭제 이벤트
         */
        evtRemove(val) {
            this.$emit('remove', val);
        },

        /**
         * 사이트 그룹 수정 이벤트
         */
        evtConfirm(val) {
            this.$emit('confirm', val);
        },

        /**
         * 사이트 그룹 추가 이벤트
         */
        evtConfirmInAddGrp() {
            this.$emit('confirmInAddGrp', this.addGrpName);
            this.addGrpName = '';
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped></style>
