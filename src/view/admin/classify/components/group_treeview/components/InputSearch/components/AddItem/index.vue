<template>
    <comp-filter-grp ref="filterGrp" :disableConfirmBtn="inputDisable" class="is-small btnAdd" @confirm="registItem" @close="resetName" @cancel="resetName" @open="resetName" pos="R">
        <template v-slot:custom>&#xe017;</template>
        <template v-slot:items>
            <dl>
                <dt>
                    <strong>기사 분류</strong>
                </dt>
                <dd>
                    <comp-input-box ref="inputBox" class="is-small" placeholder="기사 분류 입력" v-model="input.name" :validation="getWarnig" focusResetVisible @enter="registItem" @focus="isBlur = false" @blur="blurIdInput"></comp-input-box>
                    <comp-button class="is-small" style="margin-left: 4px" @click="checkDuplicate">
                        <span class="txt">중복체크</span>
                    </comp-button>
                </dd>
            </dl>
            <dl>
                <dt>
                    <strong>분석 대상</strong>
                </dt>
                <dd>
                    <comp-radio-grp class="is-small" id="add_classify_grp" name="add_classify_grp" :opts="getTypeAnalOpts" box v-model="input.type_anal" />
                    <!-- <comp-input-box ref="inputBox" class="is-small" placeholder="기사 주제 입력" v-model="input.name" :validation="getWarnig" focusResetVisible @enter="registItem" @focus="isBlur = false" @blur="blurIdInput"></comp-input-box> -->
                </dd>
            </dl>
        </template>
    </comp-filter-grp>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'treeView-addItem',
    data() {
        return {
            isDuplicated: null,
            isBlur: false,
            input: {
                name: '',
                type_anal: 1,
            },
            // 한글을 제외한 모든 영어, 특수문자, 숫자, 공백 제거
            forbiddenChars: /[^\uAC00-\uD7A3\u3130-\u318F\u1100-\u11FF]/g,
        };
    },
    props: {
        id: { type: String },
        groupList: { type: Array, required: true },
    },
    computed: {
        ...mapGetters(['getTypeAnalOpts']),
        inputDisable() {
            // input이 없거나 중복이면 적용 disabled
            if (this.input.name.length < 1 || this.isDuplicated !== false) {
                return true;
            } else {
                return false;
            }
        },
    },
    watch: {
        'input.name'() {
            this.isDuplicated = null;
        },
    },
    methods: {
        /**
         * 주제 사전
         */
        getWarnig() {
            let warnig = false;

            // input blur 되었을 때 warning
            if (this.isBlur) {
                if (this.isDuplicated !== null && !this.input.name.length) {
                    warnig = '필수값 입니다.';
                } else if (this.isDuplicated === null && this.input.name.length) {
                    warnig = '중복검사를 진행하세요.';
                } else if (this.isDuplicated === true) {
                    warnig = '중복된 기사 분류입니다.';
                }
            } else if (this.isDuplicated === false && this.input.name.length) {
                warnig = true;
            }

            return warnig;
        },

        /**
         * input blur 되었을 때 중복 검사 warning 보이기
         */
        blurIdInput() {
            this.isBlur = true;
            // validation 반영을 위해 input focus
            this.$refs.inputBox.evt_focus();
        },

        /**
         * 기사 분류 등록
         * 상위 컴포넌트(InputSearch)로 이벤트 전달 후 filterGrp 접기
         */
        registItem() {
            if (!this.inputDisable) {
                this.$emit('regist', this.input);
                // close
                this.$refs.filterGrp.Set_Expanded(false);
            }
        },

        /**
         * input name 초기화
         */
        resetName() {
            this.input.name = '';
        },

        /**
         * 중복확인
         */
        checkDuplicate() {
            const duplicate = this.groupList.findIndex((item) => item.name === this.input.name);
            this.isDuplicated = duplicate > -1;

            // validation 반영을 위해 input focus
            this.$refs.inputBox.evt_focus();
        },
    },
};
</script>

<style></style>
