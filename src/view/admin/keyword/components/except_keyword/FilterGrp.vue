<template>
    <comp-filter-grp pos="L" :disableConfirmBtn="disableConfirmBtn" @confirm="updateExceptKeyword" @cancel="resetEditKeyword">
        <template v-slot:custom>
            <comp-switch-btn :id="`except_switch_${source.k_seq}`" class="is-xxsmall" v-model="isActive" :disabled="getUserPermissions <= 1" />
            <div class="exceptKeyword_infos ui-ellipsis" @click="clickKeyword">
                <span class="ui-ellipsis" v-html="parseKeywordName(source.name)" />
                <span class="ui_fc_dm2" :title="getOperatorTitle">
                    <span class="is-color-dims" :class="[{ ui_bedge: source.tsc === 1 }, { 'is-rect': source.tsc === 1 }]">
                        <span class="icon" title="특수문자포함" v-if="source.tsc === 1">특</span>
                    </span>
                    <span class="ui_bedge is-rect is-color-dims">
                        <span class="icon">{{ parseTsCodeToName() }}</span>
                    </span>
                    <span class="ui_bedge is-rect is-color-dims">
                        <span class="icon">{{ parseOpCodeToName() }}</span>
                    </span>
                </span>
            </div>
            <comp-button v-if="getUserPermissions >= 3" class="is-xsmall is-icon-only" @click="deleteKeyword">
                <span class="icon">&#xe022;</span>
            </comp-button>
        </template>
        <!-- 제외키워드 수정기능 제거 -style에서  display none-->
        <template v-slot:items>
            <div class="exceptKeyword_edit_box">
                <KeywordInput :id="`exceptkeyword_edit_${source.k_seq}`" :inputKeyword.sync="editKeyword" isEdit />
            </div>
        </template>
    </comp-filter-grp>
</template>

<script>
import { uuid } from 'vue-uuid';
import { mapGetters } from 'vuex';

import { parseKeywordName } from '@/utils';
import { API_keywordmanage } from '@/api/admin/keyword/keyword';
import KeywordInput from '@/components/keyword_input';

export default {
    name: 'comp-filter-grp-item',
    components: {
        KeywordInput,
    },
    data() {
        return {
            apiUID: uuid.v4(),
            editKeyword: {},
            disableConfirmBtn: true,
        };
    },
    props: {
        source: { type: Object }, //virtualScroll data-sources
        clickExceptKeyword: { type: Function },
        updateKeyword: { type: Function },
        checkedItem: { type: Object },
    },
    computed: {
        ...mapGetters(['getUserPermissions', 'getSgSeqs', 'getOpOpts', 'getTsOpts', 'getTscOpts', 'getUseYNOpts']),
        isActive: {
            get() {
                return this.source.use_yn === 'Y';
            },
            set() {
                this.updateUseYN();
            },
        },
        getOperatorTitle() {
            const ts = this.getTsOpts.getParseDatas({ code: this.source.ts }).arrObjAttrToStr('name');
            const tsc = this.getTscOpts.getParseDatas({ code: this.source.tsc }).arrObjAttrToStr('name');
            const op = this.getOpOpts.getParseDatas({ code: this.source.op }).arrObjAttrToStr('name');

            let title = `${tsc}, ${ts}, ${op}`;

            if (op === '인접') title += `(${this.source.op_len_before}, ${this.source.op_len_after})`;

            return title;
        },
    },
    watch: {
        source: {
            deep: true,
            handler() {
                this.resetEditKeyword();
            },
        },
        'editKeyword.name'(val) {
            this.disableConfirmBtn = val ? false : true;
        },
    },
    created() {
        this.resetEditKeyword();
    },
    mounted() {},
    methods: {
        parseKeywordName,
        resetEditKeyword() {
            this.editKeyword = structuredClone(this.source);
        },

        clickKeyword() {
            this.clickExceptKeyword(this.source);
        },

        parseOpCodeToName() {
            switch (this.getOpOpts.getParseDatas({ code: this.source.op }).arrObjAttrToStr('name')) {
                case '일반':
                    return 'A';
                case '구문':
                    return 'P';
                case '인접':
                    return `N (${this.source.op_len_before}, ${this.source.op_len_after})`;
            }
        },
        parseTsCodeToName() {
            switch (this.getTsOpts.getParseDatas({ code: this.source.ts }).arrObjAttrToStr('name')) {
                case '제목':
                    return 'S';
                case '내용':
                    return 'C';
                case '메뉴명':
                    return 'M';
                case 'URL':
                    return 'U';
                default:
                    return 'SC';
            }
        },

        async updateExceptKeyword() {
            const param = {
                level: 4,
                type: 'u',
                ...this.editKeyword,
            };

            await API_keywordmanage(this.apiUID, param)
                .then(() => {
                    // 부모에 업데이트 알림
                    this.updateKeyword(this.editKeyword);
                    this.$store.dispatch('NOTY_COM', '제외키워드 수정을 성공했습니다.');
                })
                .catch((res) => {
                    this.$store.dispatch('NOTY_ERR', res?.data?.result?.err);
                });
        },

        /**
         * 사용 여부 업데이트시 수정중인 값은 초기화되고
         * 기존 source에 사용여부만 업데이트 됨
         */
        async updateUseYN() {
            const item = {
                ...this.source,
                use_yn: !this.isActive ? 'Y' : 'N',
            };
            // 서버에 등록되지않은 키워드 수정시 inputList에서만 반영
            if (!item.k_seq) {
                this.updateKeyword(structuredClone(item));
                return;
            }

            const param = {
                level: 4,
                type: 'u',
                ...item,
            };

            await API_keywordmanage(this.apiUID, param)
                .then((res) => {
                    if (res?.data?.result?.code === 200) {
                        this.updateKeyword(structuredClone(item));
                        this.$store.dispatch('NOTY_COM', '제외키워드 수정을 성공했습니다.');
                    } else {
                        throw new Error();
                    }
                })
                .catch((res) => {
                    this.$store.dispatch('NOTY_ERR', '제외키워드 수정을 실패했습니다.');
                });
        },

        async deleteKeyword() {
            // 서버에 등록되지않은 키워드 삭제시 inputList에서만 제거
            if (!this.source.k_seq) {
                this.updateKeyword(this.source, true);
                return;
            }

            const param = {
                level: 4,
                type: 'd',
                k_seq: this.source.k_seq,
            };

            await API_keywordmanage(this.apiUID, param)
                .then((res) => {
                    if (res?.data?.result?.code === 200) {
                        this.updateKeyword(this.source, true);
                        this.$store.dispatch('NOTY_COM', '제외키워드 삭제를 성공했습니다.');
                    } else {
                        throw new Error();
                    }
                })
                .catch((res) => {
                    this.$store.dispatch('NOTY_ERR', '제외키워드 삭제를 실패했습니다.');
                });
        },
    },
};
</script>
