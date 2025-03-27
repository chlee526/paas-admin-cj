<template>
    <div class="ui_box ui-loader-container group_tree_wrap" :class="{ 'is-loading': loading }">
        <div class="content">
            <div class="group_tree_box">
                <tree-view class="cj_treeview" ref="treeView" v-model="selectNode" :opts.sync="opts" @click.capture="nodeClick" @evt_modify="modifyNode" @evt_confirm="addNode" @evt_delete="deleteNode" :maxNode="2" :nodeInstance="getNodeInstance" />
            </div>
        </div>
    </div>
</template>

<script>
import { isEmpty } from 'lodash';
import { uuid } from 'vue-uuid';
import { mapGetters } from 'vuex';

export default {
    name: 'comp-group-treeview',
    data() {
        return {
            selectNode: '',
            apiUID: uuid.v4(),
            loading: false,
            modify: {
                name: '',
                sg_seqs: '',
                p_seqs: '',
            },
            opts: [],
            keyName: 'k_seq', // 고유 seq 키 명칭 설정
        };
    },

    props: ['groupList', 'selectedGrp'],
    computed: {
        getNodeInstance() {
            return {
                component: { nodeCustom: {}, searchCustom: {} },
                event: {},
                props: {},
            };
        },

        ...mapGetters(['getUseYNOpts', 'getUserPermissions']),
    },
    created() {
        this.opts = this.groupList;
    },

    watch: {
        opts(val) {
            this.$emit('update:groupList', val);
        },
        groupList(val) {
            this.opts = val;

            if (this.selectNode == '' && val.length > 0) {
                this.selectNode = String(val[0][this.keyName]);
            }
        },
        selectNode(val) {
            let tmp = this.$refs.treeView.getSelectData();

            if (isEmpty(tmp)) {
                this.$emit('update:selectedGrp', this.opts[0]);
            } else {
                this.$emit('update:selectedGrp', tmp);
            }
        },
    },
    methods: {
        /**
         * 선택된 트리뷰 데이터 정보 찾기
         * @param {Object} val 선택된 트리뷰 데이터 값
         */
        getSelectData(val) {
            this.$emit('update:selectedGrp', val);
        },
        /**
         * 트리뷰 노드 클릭 시 노드 데이터 정보 찾기
         * @param {Object} data 클릭한 노드 값
         */
        nodeClick(data) {
            // this.$emit('update:selectedGrp', data);
        },
    },
};
</script>

<style src="./style.scss" lang="scss" />
