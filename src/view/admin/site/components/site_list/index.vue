<template>
    <comp-list ref="siteList" v-show="listData.length > 0" class="site_list" :id="id" :datas="listData" :component="compItem" :keeps="50" :estimateSize="30" :selectable="hasAdminPermission" dataIndexKey="s_seq" @selectedUpdate="evtSelected"></comp-list>
</template>

<script>
import { mapGetters } from 'vuex';

import SiteItem from './SiteItem.vue';

export default {
    name: 'comp-site-list',
    data() {
        return {
            compItem: SiteItem,
        };
    },
    props: {
        id: { type: String, required: true },
        listData: { type: Array, required: true },
        resetSelected: { type: Boolean },
    },
    computed: {
        ...mapGetters(['getUserPermissions']),

        // 등록/수정 권한
        hasAdminPermission() {
            return this.getUserPermissions >= 2;
        },
    },
    watch: {
        resetSelected(val) {
            if (val) {
                this.hndlResetSelected();
            }
        },
    },
    methods: {
        /**
         * 선택 아이템 목록 전달 함수
         * @param {Array} val 선택 아이템 목록
         */
        evtSelected(val) {
            this.$emit('selectedUpdate', val);
        },

        hndlResetSelected() {
            if (!this.hasAdminPermission) return;
            this.$refs.siteList?.resetSelectedValue ? this.$refs.siteList?.resetSelectedValue() : this.$refs.siteList?.$el['__vue__'].resetSelectedValue();
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped></style>
