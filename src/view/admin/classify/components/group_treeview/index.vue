<template>
    <div class="ui_box ui-loader-container group_tree_wrap" :class="{ 'is-loading': loading }">
        <div class="content">
            <div class="group_tree_box">
                <tree-view class="is-keyword-mngr" ref="treeView" :opts.sync="opts" :nodeInstance="getNodeInstance" @click.capture="nodeClick" @evt_confirm="registGroup" @evt_modify="editGroup" @evt_delete="deleteGroup" v-model="selectNode" :maxNode="1" />
            </div>
        </div>
        <div class="footer" v-if="getUserPermissions >= 2"><span class="ui_icon"></span> 기사 주제는 한글만 가능</div>
    </div>
</template>

<script>
import CompInputSearch from './components/InputSearch';
import CompCustomItem from './components/CustomItem';

import Grouptreeview from '@/components/group_treeview';
import { API_groupmanage } from '@/api/admin/classify/group';

export default {
    name: 'comp-group-treeview',
    extends: Grouptreeview,
    data() {
        return {
            keyName: 'seq',
        };
    },
    props: {
        groupList: { type: Array, required: true },
        selectedGrp: { type: Object, required: true },
    },
    computed: {
        getNodeInstance() {
            return {
                component: { nodeCustom: this.getNodeCustomComponent, searchCustom: this.getSearchCustomComponent },
                event: {},
                props: { groupList: [...this.opts] },
            };
        },
        getNodeCustomComponent() {
            return CompCustomItem;
        },
        getSearchCustomComponent() {
            return CompInputSearch;
        },
    },
    watch: {},
    methods: {
        /**
         * 트리뷰(그룹) 추가
         * 추가하기 위한 부모 node 값을 api 통신 후 자식 노드 추가
         * @param {Object} item
         */
        async registGroup(item) {
            this.loading = true;

            const param = {
                type: 'i',
                classify: item.name,
                type_anal: item.type_anal,
                use_yn: 'Y',
            };

            await API_groupmanage(this.apiUID, param)
                .then((res) => {
                    const result = res?.data?.result?.list[0];
                    result.name = result.classify;
                    this.opts.unshift(result);
                    this.$store.dispatch('NOTY_COM', `기사 분류 등록을 성공했습니다.`);
                })
                .catch((err) => {
                    this.$store.dispatch('NOTY_ERR', `기사 분류 등록을 실패했습니다.`);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * 그룹 삭제
         * api 통신 후 트리뷰에 반영
         * @param {Object} item
         */
        async deleteGroup(item) {
            this.loading = true;

            const param = {
                type: 'd',
                seq: item.seq,
                classify: item.classify,
            };

            await API_groupmanage(this.apiUID, param)
                .then(() => {
                    this.$refs.treeView.deleteNode(item);
                    this.$store.dispatch('NOTY_COM', `기사 분류 삭제를 성공했습니다.`);
                })
                .catch((err) => {
                    this.$store.dispatch('NOTY_ERR', `기사 분류 삭제를 실패했습니다.`);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * 그룹 수정
         * api 통신 후 트리뷰에 반영
         */
        async editGroup(item) {
            this.loading = true;

            const param = {
                type: 'u',
                seq: item.seq,
                type_anal: item.type_anal,
                classify: item.classify,
                use_yn: item.use_yn,
            };

            await API_groupmanage(this.apiUID, param)
                .then((res) => {
                    this.$refs.treeView.modifyTree(item);
                    this.$store.dispatch('NOTY_COM', `기사 분류 수정을 성공했습니다.`);
                })
                .catch((err) => {
                    this.$store.dispatch('NOTY_ERR', `기사 분류 수정을 실패했습니다.`);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
