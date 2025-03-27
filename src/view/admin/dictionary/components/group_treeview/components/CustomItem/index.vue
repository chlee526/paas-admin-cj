<template>
    <div :ref="`node_${source.seq}`">
        <span class="icon"></span>
        <div class="bg"></div>
        <div class="node-name">
            <div class="input">{{ source.name }}</div>
        </div>
        <div class="filter_wrap">
            <div v-if="getUserPermissions >= 3" class="btnDel" @click="deleteItem"><span>&#xe022;</span></div>
            <comp-switch-btn :id="`op_switch_${source.seq}`" class="is-xxsmall" v-model="source.use_yn" :disabled="getUserPermissions <= 1" :valForm="getUseYNOpts" @click="changeUseYN" />
        </div>
    </div>
</template>
<script>
import CompCustomItem from '@/components/group_treeview/components/CustomItem.vue';

export default {
    name: 'tree-view-custom-item',
    extends: CompCustomItem,

    methods: {
        /**
         * dialog로 삭제 여부 확인 후 상위 컴포넌트에 delete 이벤트 전달
         * dialog 멘트 수정/emit delete 인수 수정을 위해 변경
         */
        deleteItem() {
            this.$store
                .dispatch('DIALOG_WRN', ['해당 기사 주제를 삭제할 경우 관련된 사전 모두 삭제됩니다.', '삭제하시겠습니까?', 2])
                .then(() => {
                    this.$emit('evt_delete', this.source);
                })
                .catch((err) => {
                    if (err != 3) {
                        this.$store.dispatch('DIALOG_ERR', ['기사 주제를 삭제하지 못했습니다', '기사 주제 삭제 실패', 0]);
                    }
                })
                .finally(() => {});
        },

        /**
         * 사용여부 수정
         */
        changeUseYN() {
            this.$emit('evt_modify', this.source);
        },
    },
};
</script>
