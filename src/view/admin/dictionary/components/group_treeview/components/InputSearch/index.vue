<template>
    <div>
        <comp-input-box type="search" placeholder="내용을 입력하세요." focusResetVisible v-model="inputText" @search="searchInputText" @blur="trimInputText" />

        <CompAddItem v-if="getUserPermissions >= 2" ref="addGrp" id="addGrp" :nodeInstance="nodeInstance" :groupList="groupList" @regist="registItem" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CompAddItem from './components/AddItem';

export default {
    name: 'treeview-inputSearch-custom',
    components: {
        CompAddItem,
    },
    data() {
        return {
            inputText: '',
        };
    },
    props: {
        nodeInstance: { type: Object, required: true },
    },
    computed: {
        ...mapGetters(['getUserPermissions']),
        groupList() {
            return this.nodeInstance?.props?.groupList || [];
        },
    },
    methods: {
        trimInputText() {
            this.inputText = this.inputText.trim();
        },
        searchInputText() {
            this.$emit('search', this.inputText);
        },
        registItem(item) {
            this.$emit('evt_confirm', item);
        },
    },
};
</script>
