<template>
    <div class="operator_box">
        <comp-bubble-box v-if="useSgGrp" class="is-validation" :showFixed="!getInputKeyword?.sg_seqs" content="필수값 입니다.">
            <comp-checkbox-grp :id="`sg_chk_${id}`" class="is-small" :name="`sg_chk_${id}`" :opts="getSgOpts" box v-model="getInputKeyword.sg_seqs" />
        </comp-bubble-box>

        <!-- <div v-if="useTypeAnal" class="row">
            <comp-radio-grp class="is-small" :id="`type_anal_${id}`" :name="`type_anal_${id}`" :opts="getTypeAnalOpts" box v-model="getInputKeyword.type_anal" />
        </div> -->

        <div class="row">
            <comp-radio-grp class="is-small" :id="`ts_radio_${id}`" :name="`ts_radio_${id}`" :opts="getTsOpts" box v-model="getInputKeyword.ts" />
        </div>

        <div class="row">
            <comp-bubble-box :content="getHelperContent.keyword_mng.operator_setting.tsc" pos="L">
                <comp-button class="is-xsmall is-icon-only">
                    <span class="icon">&#xe006;</span>
                </comp-button>
            </comp-bubble-box>
            <span>특수문자</span>
            <comp-bubble-box class="is-validation" content="입력된 특수문자는 제거 됩니다." pos="R" :showFixed="getInputKeyword.tsc == 2">
                <comp-radio-grp class="is-small" :id="`tsc_radio_${id}`" :name="`tsc_radio_${id}`" :opts="getParseTscOpts" box v-model="getInputKeyword.tsc" />
            </comp-bubble-box>
        </div>

        <div class="row">
            <comp-radio-grp class="is-small" :id="`op_radio_${id}`" :name="`op_radio_${id}`" :opts="getOpOpts" box v-model="getOp" style="margin-right: 4px"></comp-radio-grp>
            <transition name="fade_posx_reverse">
                <div v-if="useOpLength" class="grp">
                    <div class="adjacency_keyword">
                        <input type="number" max="999" placeholder="앞" v-model="getInputKeyword.op_len_before" />
                        <span>인접 길이</span>
                        <input type="number" max="999" placeholder="뒤" v-model="getInputKeyword.op_len_after" />
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'comp-operator-setting',
    data() {
        return {};
    },
    props: {
        id: { type: String, required: true },
        inputKeyword: { type: Object },
        useSgGrp: { type: Boolean, default: false }, //채널 선택 사용여부
        availableSgGrp: { type: String, default: '' }, //선택 가능한 채널
        useTypeAnal: { type: Boolean, default: false }, // 분석대상 선택 사용여부
    },
    computed: {
        ...mapGetters(['getUserPermissions', 'getSgSeqs', 'getOpOpts', 'getTsOpts', 'getTscOpts', 'getHelperContent', 'getTypeAnalOpts']),
        getInputKeyword: {
            get() {
                return this.inputKeyword;
            },
            set(val) {
                this.$emit('update:inputKeyword', val);
            },
        },

        getOp: {
            get() {
                return this.getInputKeyword.op;
            },
            set(val) {
                const keys = ['op_len_after', 'op_len_before'];

                // 인접 미사용 시 인접 길이 0 으로
                if (Number(val) !== 3) {
                    keys.forEach((key) => {
                        this.getInputKeyword[key] = 0;
                    });
                } else {
                    // 인접 사용시 기본값 15
                    const isZero = keys.every((key) => Number(this.getInputKeyword[key]) === 0);
                    if (isZero) {
                        keys.forEach((key) => {
                            this.getInputKeyword[key] = 15;
                        });
                    }
                }

                this.getInputKeyword.op = val;
            },
        },

        getParseTscOpts() {
            const opts = this.getTscOpts.map((tsc) => {
                const obj = structuredClone(tsc);
                obj.name = obj.name.replaceAll('특수문자', '');
                return obj;
            });
            return opts;
        },

        // 키워드 인접길이 활성화 여부
        useOpLength() {
            return this.getInputKeyword.op === 3;
        },

        getSgOpts() {
            const availableOpt = this.availableSgGrp ? this.availableSgGrp.split(',') : [];
            const opts = this.getSgSeqs.map((seq) => {
                const obj = structuredClone(seq);
                obj.disabled = !availableOpt.includes(String(seq.code));
                return obj;
            });
            return opts;
        },
    },
    watch: {},
    created() {},
    mounted() {},
    methods: {},
};
</script>

<style lang="scss" src="./style.scss" />
