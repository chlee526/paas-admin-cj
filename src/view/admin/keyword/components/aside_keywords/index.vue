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
            <comp-switch-btn v-if="getUserPermissions >= 2" id="aside_disble_switch" class="is-xsmall" label="사용여부" v-model="inputKeyword.active" @click="updateKeyword" />

            <template v-if="!isEdit && getUserPermissions >= 2">
                <comp-selectbox id="category_select" class="is-small" v-model="inputKeyword.yp" :opts="categoryList" notSelectedLabel="카테고리를 선택하세요" :disabled="!inputKeyword.use_yn || isEdit || selectedGrp?.level != 1" style="width: 100%" />
                <KeywordInput id="keyword_input" :inputKeyword.sync="inputKeyword" :isEdit="isEdit" :availableSgGrp="selectedGrp?.sg_seqs" useSgGrp />
            </template>

            <template v-else-if="isEdit">
                <ul class="edit_box">
                    <li class="name">
                        <span class="ui_fc_dm">{{ xpName }} <span class="ui_icon">&#xe042;</span> {{ getCategoryName }}</span>
                        <strong style="word-break: break-all; overflow-wrap: anywhere; display: flex; flex-wrap: wrap; font-size: 1.6em" v-html="inputKeyword.name ? parseKeywordName(inputKeyword.name) : '-'" />
                    </li>
                    <li>
                        <strong>사용여부</strong>
                        <span>{{ inputKeyword.active ? '사용' : '미사용' }}</span>
                    </li>
                    <li>
                        <strong>채널</strong>
                        <span>{{ parseSgCodeToName }}</span>
                    </li>
                    <li>
                        <strong>검색영역</strong>
                        <span>{{ parseTsCodeToName }}</span>
                    </li>
                    <li>
                        <strong>특수문자</strong>
                        <span>{{ parseTscCodeToName }}</span>
                    </li>
                    <li>
                        <strong>종류</strong>
                        <span>
                            {{ parseOpCodeToName }}
                            <template v-if="inputKeyword.op === 3"> ({{ inputKeyword.op_len_before }}, {{ inputKeyword.op_len_after }}) </template>
                        </span>
                    </li>
                </ul>
            </template>

            <template v-else>
                <ul class="edit_box">
                    <li class="name">
                        <span class="ui_fc_dm">{{ xpName }} <span class="ui_icon">&#xe042;</span> {{ getCategoryName }}</span>
                        <strong style="word-break: break-all; overflow-wrap: anywhere">
                            {{ '-' }}
                        </strong>
                    </li>
                    <li>
                        <strong>사용여부</strong>
                        <span>{{ '-' }}</span>
                    </li>
                    <li>
                        <strong>채널</strong>
                        <span>{{ '-' }}</span>
                    </li>
                    <li>
                        <strong>검색영역</strong>
                        <span>{{ '-' }}</span>
                    </li>
                    <li>
                        <strong>특수문자</strong>
                        <span>{{ '-' }}</span>
                    </li>
                    <li>
                        <strong>종류</strong>
                        <span>{{ '-' }}</span>
                    </li>
                </ul>
            </template>

            <ExceptKeyword ref="exceptKeyword" :id="`exceptkeyword_${isEdit ? 'edit' : 'regist'}`" :exceptList.sync="exceptList" :inputKeyword="inputKeyword" :isEdit="isEdit" @resetKeyword="resetKeyword"></ExceptKeyword>

            <div class="btn_box">
                <transition name="fade">
                    <div v-if="!isEdit && getUserPermissions >= 2">
                        <comp-button key="reset" class="is-large" title="초기화" @click="resetKeyword">
                            <span class="txt">초기화</span>
                        </comp-button>
                        <comp-button key="save" class="is-color-hl is-large" :disabled="isDisabled" title="저장" @click="saveKeyword">
                            <span class="txt">저장</span>
                        </comp-button>
                    </div>
                </transition>

                <transition name="margin">
                    <comp-button v-if="isEdit && getUserPermissions >= 3" class="is-large" customColor="#ff0000" title="삭제" @click="deleteKeyword">
                        <span class="txt">삭제</span>
                    </comp-button>
                </transition>
            </div>
        </template>
    </AsideBox>
</template>

<script>
import { mapGetters } from 'vuex';

import { parseKeywordName } from '@/utils';
import AsideBox from '@/components/aside_box';
import KeywordInput from '@/components/keyword_input';
import ExceptKeyword from '@/view/admin/keyword/components/except_keyword';

export default {
    name: 'comp-aside-keywords',
    components: {
        AsideBox,
        KeywordInput,
        ExceptKeyword,
    },
    data() {
        return {
            loading: false,
            isFold: false,
            inputKeyword: {},
        };
    },
    props: {
        edit: { type: Boolean, default: false },
        useFold: { type: Boolean, default: true }, //상하 접기 기능 활성화 여부
        editKeyword: { type: Object },
        selectedGrp: { type: Object },
        categoryList: { type: Array },
        xpName: { type: String }, //대그룹 이름
    },
    computed: {
        ...mapGetters(['getUserPermissions', 'getSgSeqs', 'getOpOpts', 'getTsOpts', 'getTscOpts', 'getUseYNOpts']),
        isDisabled() {
            const name = this.inputKeyword.name.trim().replaceAll(/\s+(?=\s)|\n+(?=\s)|\s+(?=\n)|\n+(?=\n)/g, '');
            // 키워드 입력 및 카테고리 선택 여부 확인
            return name.length <= 0 || !this.inputKeyword.yp || !this.inputKeyword.sg_seqs.length;
        },
        isEdit() {
            return Object.keys(this.getEditKeyword).length > 0;
        },
        // 키워드 등록 기본 설정
        getInit() {
            const init = {
                k_seq: '',
                name: '',
                op: 1,
                op_len_before: 0,
                op_len_after: 0,
                ts: 1,
                tsc: 1,
                use_yn: 'Y',
                active: true,
                sg_seqs: '',
                expt_keywords: [],
            };

            if (this.selectedGrp) {
                init['xp'] = this.selectedGrp['xp'];
                init['yp'] = this.selectedGrp['yp'];
                init['zp'] = this.selectedGrp['zp'];
            }

            // 채널
            init.sg_seqs = this.getSgOpts.filter((seq) => !seq.disabled).arrObjAttrToStr('code');

            return init;
        },

        /**
         * 키워드 그룹에서 사용하는 채널만 선택할 수 있도록 opts가공
         */
        getSgOpts() {
            const availableOpt = this.selectedGrp?.sg_seqs ? this.selectedGrp.sg_seqs.split(',') : [];
            const opts = this.getSgSeqs.map((seq) => {
                const obj = structuredClone(seq);
                obj.disabled = !availableOpt.includes(String(seq.code));
                return obj;
            });
            return opts;
        },

        getEditKeyword: {
            get() {
                return this.editKeyword;
            },
            set(val) {
                this.$emit('update:editKeyword', structuredClone(val));
            },
        },

        exceptList: {
            get() {
                return this.inputKeyword?.expt_keywords;
            },
            set(val) {
                this.$emit('updateExceptKeyword', val);
            },
        },

        getCategoryName() {
            return this.categoryList.getParseDatas({ code: this.inputKeyword.yp })[0]?.name;
        },
        parseSgCodeToName() {
            const codeArr = this.inputKeyword.sg_seqs.split(',').map((code) => Number(code));
            const result = this.getSgSeqs.filter((item) => codeArr.includes(item.code)).arrObjAttrToStr('name', '');
            return result;
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
                    // 제외키워드만 업데이트 시 inputKeyword 안바뀜
                    const oldword = structuredClone(oldVal);
                    const newword = structuredClone(newVal);
                    delete oldword.expt_keywords;
                    delete newword.expt_keywords;

                    if (JSON.stringify(oldword) !== JSON.stringify(newword)) {
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
        beforeEnter(el) {
            el.style.transitionDelay = 100 + 'ms';
        },
        parseKeywordName,
        /**
         * 부모 컴포넌트에서 키워드 등록 클릭시 발생하는 메소드
         * aside 펼침
         */
        triggerExpandBox() {
            this.isFold = this.isFold ? false : this.isFold;
        },

        /**
         * keyword_mng > index.vue API 호출
         */
        saveKeyword() {
            // 키워드 등록 API trigger
            this.$emit('regist', this.inputKeyword);
        },

        /**
         * keyword_mng > index.vue API 호출
         */
        deleteKeyword() {
            const item = { k_seq: this.inputKeyword.k_seq };

            // 제외키워드 존재시 같이 보내주기
            if (this.exceptList.length) {
                item.expt_k_seq = this.exceptList.arrObjAttrToStr('k_seq');
            }

            // 키워드 삭제 API trigger
            this.$emit('delete', item);
        },

        /**
         * input 초기화
         * 수정일땐 초깃값으로, 등록일땐 빈값으로
         * 상위 컴포넌트에서 regist 성공시 trigger할 수 있다.
         */
        async resetKeyword(result) {
            if (this.isEdit) {
                this.inputKeyword = structuredClone(this.getEditKeyword);
            } else {
                if (Array.isArray(result)) {
                    return await new Promise((resolve) => {
                        this.$refs.exceptKeyword.registExceptKeywordList(result).then((res) => {
                            this.inputKeyword = structuredClone(this.getInit);
                            return resolve(res);
                        });
                    });
                }
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
