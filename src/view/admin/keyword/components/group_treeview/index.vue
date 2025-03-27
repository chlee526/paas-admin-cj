<template>
    <div class="ui_box ui-loader-container group_tree_wrap" :class="{ 'is-loading': loading }">
        <div class="content">
            <div class="group_tree_box">
                <tree-view class="is-keyword-mngr" ref="treeView" v-model="selectNode" :opts.sync="opts" @click.capture="nodeClick" @evt_modify="modifyNode" @evt_confirm="addNode" @evt_delete="deleteNode" :maxNode="2" :nodeInstance="getNodeInstance" />
            </div>
        </div>
        <div class="footer" v-if="getUserPermissions >= 2"><span class="ui_icon"></span> 키워드명 더블클릭으로 수정</div>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import { mapGetters } from 'vuex';

import CustomItem from './components/CustomItem.vue';
import InputSearch from './components/search/InputSearch.vue';

import Grouptreeview from '@/components/group_treeview';
import { API_groupmanage } from '@/api/admin/keyword/group';

export default {
    name: 'comp-group-treeview',
    extends: Grouptreeview,
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            modify: {
                name: '',
                sg_seqs: '',
                p_seqs: '',
            },
            opts: [],
            keyName: 'k_seq', // 코유 seq 키명칭 할당
        };
    },

    props: ['groupList', 'selectedGrp'],
    computed: {
        getNodeInstance() {
            return {
                component: { nodeCustom: CustomItem, searchCustom: InputSearch },
                event: {},
                props: {},
            };
        },

        ...mapGetters(['getUseYNOpts', 'getUserPermissions']),

        getSgSeqs() {
            if (this.$store.getters.getSgSeqs.length > 0) {
                let list = JSON.parse(JSON.stringify(this.$store.getters.getSgSeqs)).delAttr('color');

                return list;
            } else {
                let list = JSON.parse(
                    JSON.stringify([
                        { code: '뉴스', name: '뉴스' },
                        { code: '블로그', name: '블로그' },
                        { code: '카페', name: '카페' },
                        { code: '커뮤니티', name: '커뮤니티' },
                        { code: '유튜브', name: '유튜브' },
                        { code: '인스타그램', name: '인스타그램' },
                        { code: '트위터', name: '트위터' },
                    ]),
                );
                list.map((item) => {
                    if (!this.modify.sg_seqs.includes(item.code)) {
                        item.disabled = true;
                    }
                });
                return list;
            }
        },
        getPgSeqs() {
            if (this.$store.getters.getSgSeqs.length > 0) {
                let list = JSON.parse(JSON.stringify(this.$store.getters.getSgSeqs)).delAttr('color');

                return list;
            } else {
                let list = JSON.parse(
                    JSON.stringify([
                        { code: '뉴스', name: '뉴스' },
                        { code: '블로그', name: '블로그' },
                        { code: '카페', name: '카페' },
                        { code: '커뮤니티', name: '커뮤니티' },
                        { code: '유튜브', name: '유튜브' },
                        { code: '인스타그램', name: '인스타그램' },
                        { code: '트위터', name: '트위터' },
                    ]),
                );
                list.map((item) => {
                    if (!this.modify.p_seqs.includes(item.code)) {
                        item.disabled = true;
                    }
                });
                return list;
            }
        },
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
    },
    methods: {
        async deleteNode(data) {
            this.loading = true;

            let param = {
                level: data.level,
                type: 'd',
                xp: data.xp,
                yp: data.yp,
                k_seq: data.k_seq,
            };

            await API_groupmanage(this.apiUID, param)
                .then((res) => {
                    if (res.data.result.code == 200) {
                        this.$refs.treeView.deleteNode(data);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$store
                        .dispatch('DIALOG_ERR', ['키워드 그룹을 삭제하지 못했습니다', '키워드 그룹 삭제 실패', 0])
                        .then(($val) => {})
                        .catch(($err) => {});
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * 트리뷰(그룹) 추가
         * 추가하기 위한 부모 node 값을 api 통신 후 자식 노드 추가
         * @param {Object} data
         */
        async addNode(data) {
            this.loading = true;
            await API_groupmanage(this.apiUID, data)
                .then((res) => {
                    if (res.data.result) {
                        let newChild = { ...data };

                        // let g_code = res.data.result.xp + '_' + res.data.result.yp + '_' + res.data.result.zp;
                        newChild.xp = res.data.result.xp;
                        newChild.yp = res.data.result.yp;
                        newChild.zp = res.data.result.zp;
                        newChild.k_seq = res.data.result.k_seq;
                        newChild.name = res.data.result.name;
                        newChild.g_code = res.data.result.k_seq;
                        newChild.children = [];
                        newChild.treeLevel = newChild.level;

                        this.$refs.treeView.addNode(newChild);

                        // this.$emit('update:groupList', this.opts);
                    } else {
                        this.$store
                            .dispatch('DIALOG_ERR', ['키워드 그룹을 등록하지 못했습니다', '키워드 그룹 등록 실패', 0])
                            .then(($val) => {})
                            .catch(($err) => {});
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$store
                        .dispatch('DIALOG_ERR', ['키워드 그룹을 등록하지 못했습니다', '키워드 그룹 등록 실패', 0])
                        .then(($val) => {})
                        .catch(($err) => {});
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        async modifyNode(data, type) {
            this.loading = true;

            let param = {
                level: data.level,
                type: data.type,
                xp: data.xp,
                yp: data.yp,
                k_seq: data.k_seq,
                name: data.name,
                sg_seqs: data.sg_seqs,
                use_yn: data.use_yn,
            };

            await API_groupmanage(this.apiUID, param)
                .then((res) => {
                    if (res.data.result.code == 200) {
                        let modify = { ...data };
                        this.$refs.treeView.modifyTree(modify);

                        /**
                         * 트리뷰 데이터 수정 하였지만 side 탭의 정보가 갱신이 안되어 추가
                         */
                        if (data.k_seq === this.selectedGrp.k_seq) {
                            this.$emit('update:selectedGrp', data);
                        }
                        // this.$emit('update:groupList', this.opts);
                    } else {
                        this.$store
                            .dispatch('DIALOG_ERR', ['키워드 그룹을 수정하지 못했습니다?', '키워드 그룹 수정 실패', 0])
                            .then((res) => {
                                let modify = {
                                    level: data.level,
                                    name: data.editName ? data.editName : data.name,
                                    k_seq: data.k_seq,
                                    g_code: data.g_code,
                                    sg_seqs: this.modify.edit_seqs,
                                    use_yn: data.use_yn,
                                };

                                if (type == 'switch') {
                                    modify.sg_seqs = data.sg_seqs;
                                    modify.name = data.name;
                                    modify.use_yn = data.use_yn.test(this.getUseYNOpts);
                                }

                                this.$refs.treeView.modifyTree(modify);
                            })
                            .catch((err) => {});
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$store
                        .dispatch('DIALOG_ERR', ['키워드 그룹을 수정하지 못했습니다!', '키워드 그룹 수정 실패', 0])
                        .then((res) => {
                            let modify = {
                                level: data.level,
                                name: data.editName ? data.editName : data.name,
                                k_seq: data.k_seq,
                                g_code: data.g_code,
                                sg_seqs: this.modify.edit_seqs,
                                use_yn: data.use_yn,
                            };

                            if (type == 'switch') {
                                modify.sg_seqs = data.sg_seqs;
                                modify.name = data.name;
                                modify.use_yn = data.use_yn.test(this.getUseYNOpts);
                            }

                            this.$refs.treeView.modifyTree(modify);
                        })
                        .catch((err) => {});
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * 트리뷰 노드 클릭 시 상위 컴포넌트로 데이터 전달
         * @param {Object} data 클릭한 노드 값
         */
        nodeClick(data) {
            // this.$emit('update:selectedGrp', data);
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
