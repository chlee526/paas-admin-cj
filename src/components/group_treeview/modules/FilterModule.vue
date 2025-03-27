<template>
    <comp-filter-grp :id="id" :ref="id" :getNoIconWrapPos="setWrapPos" :disableConfirmBtn="inputDisable" class="is-small btnAdd" @confirm="evt_confirm(source)" @close="evt_close" @cancel="evt_close" @open="evt_open(source)" pos="R">
        <template v-if="!noIconShow" v-slot:custom>&#xe017;</template>
        <template v-slot:items>
            <dl>
                <dt><strong>그룹명</strong></dt>
                <dd><comp-input-box ref="inputBox" class="is-small" v-model="input.name" @enter="evt_confirm(source)" placeholder="키워드 입력"></comp-input-box></dd>
            </dl>
            <dl>
                <dt><strong>채널</strong></dt>
                <dd>
                    <comp-bubble-box class="is-validation" :showFixed="showFixed" content="필수값 입니다.">
                        <comp-checkbox-grp class="is-small" :opts="getSeqsList" box v-model="input.sg_seqs"> </comp-checkbox-grp>
                    </comp-bubble-box>
                </dd>
            </dl>
        </template>
    </comp-filter-grp>
</template>

<script>
export default {
    name: 'treeView-filterModule',
    data() {
        return {
            test: '',
            filterValue: this.value,
            input: {
                name: '',
                sg_seqs: '',
                p_seqs: '',
            },
            modify: {
                name: '',
                sg_seqs: '',
                p_seqs: '',
            },
        };
    },
    props: {
        setWrapPos: {},
        id: {},
        noIconShow: {},
        value: {},
    },
    computed: {
        source: {
            get() {
                let obj = this.value;
                let list = JSON.parse(JSON.stringify(this.$store.getters.getSgSeqs)).delAttr('color');
                let tmp = [];
                list.forEach((item) => {
                    tmp.push(item.code);
                });

                if (obj == undefined) {
                    obj = {
                        g_code: 'first',
                        sg_seqs: tmp.join(','),
                    };
                }

                return obj;
            },
            set(val) {},
        },
        getSeqsList() {
            let list = JSON.parse(JSON.stringify(this.$store.getters.getSgSeqs)).delAttr('color');

            if (this.id.includes('addGrp')) {
                list.map((item) => {
                    if (!this.source.sg_seqs.includes(item.code)) {
                        item.disabled = true;
                    }
                    return item;
                });
            } else {
                if (this.source.p_seqs != undefined) {
                    list.map((item) => {
                        if (!this.source.p_seqs.includes(item.code)) {
                            item.disabled = true;
                        }
                    });
                }
            }

            return list;
        },

        showFixed() {
            let list = this.getSeqsList.filter((item) => {
                return this.input.sg_seqs.split(',').includes(item.code.toString());
            });

            if (list.length < 1) {
                return true;
            } else {
                return false;
            }
        },

        inputDisable() {
            let list = this.getSeqsList.filter((item) => {
                return this.input.sg_seqs.split(',').includes(item.code.toString());
            });

            if (this.input.name.length < 1 || list.length < 1) {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        evt_confirm(data) {
            this.$emit('evt_confirm', { data, input: this.input });
            this.hndl_close();
        },
        evt_close() {
            this.$emit('onTool', false);
            this.$emit('evt_close');
        },

        hndl_open() {
            let target = this.id;

            this.$refs[target]?.hndl_open();
        },

        hndl_close() {
            let target = this.id;

            this.$refs[target]?.hndl_close();
            // this.input.name = '';
            // this.input.sg_seqs = '';
        },

        evt_open(data) {
            setTimeout(() => {
                this.$emit('onTool', true);
            }, 100);

            this.$nextTick(() => {
                this.$refs.inputBox.$refs.input.focus();
            });

            if (this.id.includes('addGrp')) {
                this.input.name = '';
            } else {
                this.input.name = data.name;
            }
            this.input.p_seqs = data.p_seqs;

            this.modify.sg_seqs = data.sg_seqs;
            this.modify.p_seqs = data.p_seqs;
            this.input.sg_seqs = data.sg_seqs;
        },
    },
};
</script>
