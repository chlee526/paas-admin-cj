<template>
    <div :ref="`node_${source.g_code}`">
        <span class="icon"></span>
        <div class="bg"></div>
        <div class="node-name">
            <div class="input">{{ source.name }}</div>
        </div>
        <div class="filter_wrap"></div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'tree-view-custom-item',
    data() {
        return {
            input: {
                name: '',
                sg_seqs: '',
            },
        };
    },

    props: {
        value: {},
        maxNode: {},
        nodeInstance: {},
    },
    computed: {
        /**
         * comp-switch-btn 컴포넌트 사용 시 v-model 값 처리에 따라서 이벤트 호출 필요성에 따라 만듬
         * 1. useYnValue computed를 사용 하려면 오버라이드 받는 컴포넌트에 evt_modify 메소드 있어야함
         * 2. evt_modify 메소드에 전달하는 param 값을 다르게 받고 싶다면 아래 getModify computed를 마찬가지로 오버라이드 하여 전달해야함
         */
        useYnValue: {
            get() {
                return this.source.use_yn;
            },
            set(val) {
                this.source.use_yn = val;
                this.evt_modify(this.getModify);
            },
        },
        getModify() {
            return { data: this.source, input: this.input, type: 'switch' };
        },
        source: {
            get() {
                return this.value;
            },
            set(val) {},
        },
        ...mapGetters(['getUseYNOpts', 'getUserPermissions']),
    },

    methods: {},
};
</script>
