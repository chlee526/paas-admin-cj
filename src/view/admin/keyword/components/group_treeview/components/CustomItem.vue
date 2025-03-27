<template>
    <div :ref="`node_${source.g_code}`" :class="{ 'on-tooltip': filterOn }" @click.stop>
        <span class="icon" :class="[levelClass]"></span>
        <div class="bg" @click.stop="handleNodeClick(source)"></div>
        <div class="node-name" @click.stop="handleNodeClick(source)">
            <div class="input">{{ source.name }}</div>
        </div>
        <div class="filter_wrap">
            <template v-if="getUserPermissions >= 2">
                <component :is="getModuleComponent" :ref="`modifyGrp_${source.g_code}`" :id="`modifyGrp_${source.g_code}`" :noIconShow="true" :setWrapPos="getItemsWrapPos" @evt_confirm="evt_modify" :value="source" @onTool="onTool" />

                <component :is="getModuleComponent" v-if="source.treeLevel < maxNode" :ref="`addGrp_${source.g_code}`" :id="`addGrp_${source.g_code}`" @evt_confirm="evt_confirm" :value="source" @onTool="onTool" />
            </template>
            <div v-if="getUserPermissions >= 3" class="btnDel" @click.stop="evt_delete(source)"><span>&#xe022;</span></div>
            <div @click.stop>
                <comp-switch-btn :id="`op_switch_${source.g_code}`" class="is-xxsmall" v-model="useYnValue" :disabled="getUserPermissions <= 1" :valForm="getUseYNOpts"></comp-switch-btn>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

import FilterModule from '../modules/FilterModule.vue';

import CompCustomItem from '@/components/group_treeview/components/CustomItem.vue';

export default {
    name: 'tree-view-custom-item',
    extends: CompCustomItem,
    data() {
        return {
            filterOn: false,
            clicks: 0,
            tgPos: {},
            pos: {},
            timer: null,
            input: {
                name: '',
                sg_seqs: '',
            },
        };
    },

    computed: {
        ...mapGetters(['getUserPermissions']),
        getModuleComponent() {
            return FilterModule;
        },

        // 수정 필터(더블클릭) 위치 값 정의용
        getItemsWrapPos() {
            return `top:${this.pos.top}px; left: ${this.pos.left}px`;
        },

        // 노드 클래스 할당
        levelClass() {
            if (this.source.treeLevel != undefined) {
                return 'node-l' + this.source.treeLevel;
            } else {
                return 'node-0';
            }
        },
    },

    methods: {
        onTool(data) {
            this.filterOn = data;
        },
        evt_confirm({ data, input }) {
            /**
             * 아래 객체는 키워드 그룹 추가 파라미터 요청 값
             * 노드로부터 받아오는 정보와 추가 입력값을 조합하여 만들어야함
             */

            const newChild = {
                level: 2,
                type: 'i',
                xp: data.xp,
                yp: data.yp,
                zp: data.zp,
                k_seq: data.k_seq,
                name: input.name,
                sg_seqs: input.sg_seqs,
                p_seqs: data.sg_seqs,
                use_yn: 'Y',
                p_code: data.k_seq,
                children: data.children,
            };

            this.$emit('evt_confirm', newChild);
        },

        evt_delete(data) {
            this.$store
                .dispatch('DIALOG_WRN', ['삭제 시 하위 노드 변경이 있을 수 있습니다', '삭제하시겠습니까?', 2])
                .then(() => {
                    /**
                     * 아래 객체는 키워드 그룹 삭제 파라미터 요청 값
                     * 노드로부터 받아오는 정보와 추가 입력값을 조합하여 만들어야함
                     */
                    let param = {
                        level: data.level,
                        type: 'd',
                        xp: data.xp,
                        yp: data.yp,
                        zp: data.zp,
                        k_seq: data.k_seq,
                        name: data.name,
                        sg_seqs: data.sg_seqs,
                        use_yn: data.use_yn,
                        ...data,
                    };

                    this.$emit('evt_delete', param);
                })
                .catch((err) => {
                    if (err != 3) {
                        this.$store.dispatch('DIALOG_ERR', ['키워드 그룹을 삭제하지 못했습니다', '키워드 그룹 삭제 실패', 0]);
                    }
                })
                .finally(() => {});
        },
        evt_modify({ data, type, input }) {
            let arr1 = data.sg_seqs.split(',').sort();
            let arr2 = input.sg_seqs.split(',').sort();

            /**
             * 아래 로직은 키워드 그룹 수정 파라미터 요청 값을 만들기 위한 로직
             * 노드로부터 받아오는 정보와 추가 입력값을 조합하여 만들어야함
             */

            if (type == undefined) {
                if (input.name.length < 1) {
                    // this.$store.dispatch('DIALOG_ERR', ['키워드 그룹 이름은 빈값을 넣을 수 없습니다.', 0]);
                } else if (arr1.join() === arr2.join()) {
                    let modify = { ...data };

                    modify.type = 'u';
                    modify.name = type == true ? data.name : input.name;
                    modify.sg_seqs = input.sg_seqs;

                    if (type == 'switch') {
                        modify.sg_seqs = data.sg_seqs;
                        modify.name = data.name;
                    }

                    this.$emit('evt_modify', modify, type);
                } else {
                    this.$store
                        .dispatch('DIALOG_WRN', ['저장 시 하위 노드 변경이 있을 수 있습니다', '저장하시겠습니까?', 2])
                        .then((res) => {
                            let modify = { ...data };

                            modify.type = 'u';
                            modify.name = type == true ? data.name : input.name;
                            modify.sg_seqs = input.sg_seqs;

                            if (type == 'switch') {
                                modify.sg_seqs = data.sg_seqs;
                                modify.name = data.name;
                            }

                            this.$emit('evt_modify', modify, type);
                        })
                        .catch((err) => {});
                }
            } else {
                let modify = { ...data };

                modify.type = 'u';

                if (type == 'switch') {
                    modify.sg_seqs = data.sg_seqs;
                    modify.name = data.name;
                }

                this.$emit('evt_modify', modify, type);
            }
        },

        dbClick(data) {
            let targetRef = `node_${data.g_code}`;

            this.$nextTick(() => {
                this.tgPos = this.$refs[targetRef].parentNode.getBoundingClientRect();

                this.pos = {
                    top: parseInt(this.tgPos.top),
                    left: parseInt(this.tgPos.left),
                };

                let targetRef2 = `modifyGrp_${data.g_code}`;

                this.$refs[targetRef2]?.hndl_open();
            });
        },

        /**
         * 권한에 따라 클릭 이벤트 다르게 적용
         *
         * 1 : 단일 클릭
         * 2 이상 : 더블클릭 , 단일 클릭
         */
        handleNodeClick(data) {
            if (this.getUserPermissions >= 2) {
                this.clicks++;
                if (this.clicks === 1) {
                    this.timer = setTimeout(() => {
                        this.$emit('nodeClick', data);
                        this.clicks = 0;
                    }, 200);
                } else {
                    this.dbClick(data);
                    clearTimeout(this.timer);
                    this.clicks = 0;
                }
            } else {
                this.$emit('nodeClick', data);
            }
        },
    },
};
</script>
