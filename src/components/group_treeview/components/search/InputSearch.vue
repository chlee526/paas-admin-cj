<template>
    <div>
        <comp-input-box type="search" v-model="inputText" placeholder="내용을 검색하세요" focusResetVisible @search="inputSearchClick(inputText)"></comp-input-box>

        <component :is="getModuleComponent" ref="addGrp" id="addGrp" @evt_confirm="evt_confirm" @evt_cancel="evt_cancel" />
    </div>
</template>

<script>
import { isEmpty } from 'lodash';

import FilterModule from '../../modules/FilterModule.vue';

export default {
    name: 'treeview-inputSearch',
    data() {
        return {
            inputText: '',
            input: {
                name: '',
                sg_seqs: '',
            },
            modify: {
                sg_seqs: '',
            },
        };
    },

    props: {
        nodeInstance: {},

        editType: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        getModuleComponent() {
            return FilterModule;
        },
        getCustomComponent() {
            if (!isEmpty(this.nodeInstance.component.searchCustom)) {
                return true;
            } else {
                return false;
            }
        },
    },
    created() {},
    methods: {
        evt_cancel() {},
        evt_confirm({ data, input }) {
            let firstChild = {
                level: 1,
                type: 'i',
                name: input.name,
                sg_seqs: data.sg_seqs,
                use_yn: 'Y',
                children: [],
            };

            this.$emit('evt_confirm', firstChild);
            this.$refs.addGrp.hndl_close();
        },
        inputSearchClick(searchName) {
            this.$emit('search', searchName);
        },
        addNodeFilterOpen() {},
        addNodeFilterCancle() {},
    },
};
</script>

<style></style>
