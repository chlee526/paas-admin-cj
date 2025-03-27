<template>
    <AsideBox>
        <template slot="title">
            <h3>
                키워드
                <template v-if="getUserPermissions >= 2"> {{ isEdit ? '수정' : '등록' }} </template>
                <template v-else>정보</template>
                <transition name="fade_posx_reverse">
                    <comp-button v-if="isEdit && getUserPermissions >= 2" class="btn_regist is-small" @click="changeToRegist">
                        <span class="txt">키워드 등록</span>
                    </comp-button>
                </transition>
            </h3>
        </template>
        <template slot="content">
            <template>
                <comp-switch-btn v-if="getUserPermissions >= 2" id="aside_disble_switch" class="is-xsmall" label="사용여부" v-model="inputKeyword.active" @click="updateKeyword" />

                <div v-if="useTitle" class="title">
                    <span class="ui_fc_dm"
                        >{{ inputKeyword[useTitle] }}<em v-if="inputKeyword.type_anal && String(inputKeyword.type_anal)?.length" class="type_anal">({{ getTypeAnalOpts.getParseDatas({ code: inputKeyword.type_anal })[0].name }})</em></span
                    >
                </div>

                <template v-if="getUserPermissions <= 1">
                    <ul class="edit_box">
                        <li class="name">
                            <strong v-if="isEdit" style="word-break: break-all; overflow-wrap: anywhere; display: flex; flex-wrap: wrap; font-size: 1.6em" v-html="parseKeywordName(inputKeyword.name)" />
                            <span v-else>{{ '-' }}</span>
                        </li>
                        <li>
                            <strong>사용여부</strong>
                            <span v-if="isEdit">{{ inputKeyword.active ? '사용' : '미사용' }}</span>
                            <span v-else>{{ '-' }}</span>
                        </li>
                        <li>
                            <strong>검색영역</strong>
                            <span v-if="isEdit">{{ parseTsCodeToName }}</span>
                            <span v-else>{{ '-' }}</span>
                        </li>
                        <li>
                            <strong>특수문자</strong>
                            <span v-if="isEdit">{{ parseTscCodeToName }}</span>
                            <span v-else>{{ '-' }}</span>
                        </li>
                        <li>
                            <strong>종류</strong>
                            <span v-if="isEdit"
                                >{{ parseOpCodeToName }} <template v-if="inputKeyword.op === 3"> ({{ inputKeyword.op_len_before }}, {{ inputKeyword.op_len_after }}) </template></span
                            ><span v-else>{{ '-' }}</span>
                        </li>
                    </ul>
                </template>
                <template v-else>
                    <KeywordInput id="keyword_input" :inputKeyword.sync="inputKeyword" :isEdit="isEdit" :useTypeAnal="useTypeAnal" />

                    <div class="ui_help is-fixed is-hgt-slim">
                        <div class="wrap">
                            <ul>
                                <li class="title"><strong>도움말</strong></li>
                                <li><span>키워드는 중복으로 등록 할 수 없습니다.</span></li>
                                <li v-if="!isEdit"><span>줄넘김으로 다중 등록 가능 합니다.</span></li>
                                <li>
                                    <span>다음 특수문자는 입력할 수 없습니다.<br /><em>'(싱클 따옴표), "(더블 따옴표)</em></span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="btn_box">
                        <transition v-if="getUserPermissions > 2" name="fade_posx">
                            <comp-button v-if="isEdit" class="is-large" customColor="#ff0000" title="삭제" @click="deleteKeyword">
                                <span class="txt">삭제</span>
                            </comp-button>
                        </transition>
                        <comp-button key="reset" class="is-large" title="초기화" @click="resetKeyword">
                            <span class="txt">초기화</span>
                        </comp-button>
                        <comp-button key="save" class="is-color-hl is-large" :disabled="isDisabled" title="저장" @click="saveKeyword">
                            <span class="txt">저장</span>
                        </comp-button>
                    </div>
                </template>
            </template>
        </template>
    </AsideBox>
</template>

<script>
import { mapGetters } from 'vuex';

import { parseKeywordName } from '@/utils';
import AsideBox from '@/components/aside_box';
import KeywordInput from '@/components/keyword_input';

export default {
    name: 'comp-aside',
    components: {
        AsideBox,
        KeywordInput,
    },
    data() {
        return {
            loading: false,
            isFold: false,
            inputKeyword: {},

            useTitle: null, // title 사용 여부 제어, inputKeyword에서 가져다 쓸 key값 전달
        };
    },
    props: {
        edit: { type: Boolean, default: false },
        useFold: { type: Boolean, default: true }, //상하 접기 기능 활성화 여부
        editKeyword: { type: Object },
        selectedGrp: { type: Object },
        useTypeAnal: { type: Boolean, default: false },
    },
    computed: {
        ...mapGetters(['getUserPermissions', 'getSgSeqs', 'getOpOpts', 'getTsOpts', 'getTscOpts', 'getUseYNOpts', 'getTypeAnalOpts']),
        isDisabled() {
            let disabled = true;
            const name = this.inputKeyword.name.trim().replaceAll(/\s+(?=\s)|\n+(?=\s)|\s+(?=\n)|\n+(?=\n)/g, '');

            // 키워드 입력 있으면 저장 가능
            if (name.length > 0) disabled = false;

            // 변경된 값이 있으면 저장 가능
            if (this.isEdit) {
                const isChanged = !Object.keys(this.editKeyword).every((key) => String(this.inputKeyword[key]) === String(this.editKeyword[key]));
                if (isChanged) disabled = false;
                else disabled = true;
            }

            return disabled;
        },
        isEdit() {
            return Object.keys(this.getEditKeyword).length > 0;
        },
        // 키워드 등록 기본 설정
        getInit() {
            const init = {
                seq: '',
                name: '',
                op: 1,
                op_len_before: 0,
                op_len_after: 0,
                ts: 1,
                tsc: 2,
                use_yn: 'Y',
                active: true,
            };

            return init;
        },

        getEditKeyword: {
            get() {
                return this.editKeyword;
            },
            set(val) {
                this.$emit('update:editKeyword', structuredClone(val));
            },
        },

        getForbiddenChars() {
            if (String(this.inputKeyword.tsc) === '2') {
                return /\n+(?=\n)|[^\uAC00-\uD7A3ㄱ-ㅎㅏ-ㅣ\w\s\n]/g;
            } else {
                return null;
                // return [`'`, `"`];
            }
        },
        parseOpCodeToName() {
            const result = this.getOpOpts.getParseDatas({ code: this.inputKeyword.op }).arrObjAttrToStr('name');
            return result;
        },

        parseTsCodeToName() {
            const result = this.getTsOpts.getParseDatas({ code: this.inputKeyword.ts }).arrObjAttrToStr('name');
            return result;
        },
        parseTscCodeToName() {
            const result = this.getTscOpts.getParseDatas({ code: this.inputKeyword.tsc }).arrObjAttrToStr('name');
            return result;
        },
    },
    watch: {
        editKeyword: {
            deep: true,
            handler(newVal, oldVal) {
                if (Object.keys(newVal).length) {
                    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                        this.inputKeyword = structuredClone(newVal);
                    }
                } else {
                    this.inputKeyword = structuredClone(this.getInit);
                }
            },
        },
        'inputKeyword.active'(val) {
            const obj = structuredClone(this.inputKeyword);
            obj.use_yn = val ? 'Y' : 'N';

            this.inputKeyword = obj;
        },
        selectedGrp: {
            deep: true,
            handler() {
                if (!this.isEdit) {
                    this.inputKeyword = structuredClone(this.getInit);
                } else {
                    this.inputKeyword = structuredClone(this.getEditKeyword);
                }
            },
        },
    },
    created() {
        this.inputKeyword = structuredClone(this.getInit);
    },
    methods: {
        parseKeywordName,

        /**
         * dictionary > index.vue API 호출
         */
        saveKeyword() {
            if (this.isEdit) {
                // 키워드 수정 API trigger
                this.$emit('update', this.inputKeyword);
            } else {
                // 키워드 등록 API trigger
                this.$emit('regist', this.inputKeyword);
            }
        },

        /**
         * dictionary > index.vue API 호출
         */
        deleteKeyword() {
            const item = { seq: this.inputKeyword.seq };

            // 키워드 삭제 API trigger
            this.$emit('delete', item);
        },

        /**
         * input 초기화
         * 수정일땐 초깃값으로, 등록일땐 빈값으로
         * 상위 컴포넌트에서 regist 성공시 trigger할 수 있다.
         */
        resetKeyword() {
            if (this.isEdit) {
                this.inputKeyword = structuredClone(this.getEditKeyword);
            } else {
                this.inputKeyword = structuredClone(this.getInit);
            }
        },

        /**
         * 키워드 사용여부 반영
         *  keyword_mng > index.vue API 호출
         */
        updateKeyword() {
            // 수정일때만 반영

            if (this.isEdit) {
                const obj = structuredClone(this.inputKeyword);
                obj.use_yn = obj.active ? 'Y' : 'N';
                this.$emit('update', obj);
            }
        },

        /**
         * 키워드 수정일 때 키워드 등록 버튼 클릭시 동작
         */
        changeToRegist() {
            this.getEditKeyword = {};
        },
    },
};
</script>

<style lang="scss" src="./style.scss" scoped />
