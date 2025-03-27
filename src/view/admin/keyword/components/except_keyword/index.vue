<template>
    <div class="except_box ui-loader-container" :class="{ 'is-loading': loading }">
        <div class="header">
            <h4>
                제외 키워드
                <em
                    >(<span title="사용 제외 키워드 수량">{{ getExceptKeywords.length }}</span
                    >/<span title="전체 제외 키워드 수량">{{ getExceptKeyword.length }}</span
                    >)</em
                >
            </h4>

            <comp-bubble-box class="is-helper" :html-type="true" pos="RB">
                <button class="ui_btn is-icon-only is-xsmall"><span class="icon">&#xe006;</span></button>
                <div class="ui_help" slot="html-content" v-html="getHelperContent.keyword_mng.except_keyword"></div>
            </comp-bubble-box>
        </div>

        <VirtualList id="virtual_list" class="except_keywords" :data-key="isEdit ? 'k_seq' : 'idx'" :data-sources="isEdit ? getExceptKeyword : inputList" :data-component="item" :estimate-size="30" :extra-props="{ clickExceptKeyword: clickExceptKeyword, checkedItem: checkedItem, updateKeyword: updateKeyword }"> </VirtualList>

        <template v-if="getUserPermissions >= 2">
            <div>
                <comp-bubble-box class="is-validation" content="특수문자( &#39; or &#34; )가 포함되어 있습니다." pos="LT" :showFixed="getIncludeSc">
                    <comp-textarea class="except_keyword_textarea" :forbiddenChars="getForbiddenChars" :forbiddenKeys="[222]" :rows="3" :placeholder="getPlaceholder" v-model="inputExceptKeyword.name"></comp-textarea>
                </comp-bubble-box>
                <comp-button class="is-small is-color-black" :disabled="isDisabled" @click="registExceptKeyword"><span>추가</span></comp-button>
            </div>
            <OperatorSetting :id="`except_keyword_${id}`" :inputKeyword.sync="inputExceptKeyword" />
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';
import VirtualList from 'vue-virtual-scroll-list';

import FilterGrp from './FilterGrp.vue';

import OperatorSetting from '@/components/operator_setting';
import { API_keywordmanage } from '@/api/admin/keyword/keyword';

export default {
    name: 'comp-except_keyword',
    components: {
        OperatorSetting,
        VirtualList,
    },
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            item: FilterGrp,
            checkedItem: {},
            inputExceptKeyword: {},
            inputList: [], //키워드 등록시 제외키워드 목록 임시 저장
        };
    },
    props: {
        id: { type: String, required: true },
        exceptList: { type: Array },
        inputKeyword: { type: Object },
        isEdit: { type: Boolean, default: false },
    },
    computed: {
        ...mapGetters(['getUserPermissions', 'getOpOpts', 'getTsOpts', 'getTscOpts', 'getUseYNOpts', 'getHelperContent']),
        getExceptKeyword: {
            get() {
                return this.exceptList;
            },
            set(val) {
                this.$emit('update:exceptList', val);
            },
        },
        init() {
            const init = {
                name: '',
                op: '1',
                op_len_before: 0,
                op_len_after: 0,
                ts: '1',
                tsc: 1,
                use_yn: 'Y',
                active: true,
            };

            init.k_seq = this.inputKeyword?.k_seq;
            init.xp = this.inputKeyword?.xp;
            init.yp = this.inputKeyword?.yp;
            init.zp = this.inputKeyword?.zp;

            return init;
        },

        isDisabled() {
            // 키워드 등록된 키워드에만 제외키워드 등록 가능
            const isExistKeyword = this.isEdit ? !!this.inputKeyword?.k_seq : true;
            // 제외키워드 입력 여부 확인
            const name = this.inputExceptKeyword.name.trim().replaceAll(/\s+(?=\s)|\n+(?=\s)|\s+(?=\n)|\n+(?=\n)/g, '');

            return !isExistKeyword || name.length <= 0;
        },

        getPlaceholder() {
            let placeholder = '제외 키워드 입력';

            if (this.inputExceptKeyword.tsc === 2) {
                placeholder += '\r\n모든 특수문자는 입력할 수 없습니다.\r\n줄넘김으로 다중 등록 가능합니다.';
            } else {
                placeholder += '\r\n아래 특수문자는 입력할 수 없습니다.\r\n\' \'(작은 따옴표), " "(큰 따옴표)\r\n줄넘김으로 다중 등록 가능합니다.';
            }
            return placeholder;
        },
        getForbiddenChars() {
            if (String(this.inputExceptKeyword.tsc) === '2') {
                return /\n+(?=\n)|[^\uAC00-\uD7A3ㄱ-ㅎㅏ-ㅣ\w\s\n]/g;
            } else {
                return null;
            }
        },

        getExceptKeywords() {
            const list = this.getExceptKeyword;
            if (list)
                return (
                    list
                        // 사용여부 'Y'인 키워드만 노출
                        .filter((word) => word?.use_yn == 'Y') || []
                );
            return [];
        },
        getIncludeSc() {
            return String(this.inputExceptKeyword.tsc) === '1' && /['""']/g.test(this.inputExceptKeyword.name);
        },
    },
    watch: {
        inputKeyword: {
            deep: true,
            handler() {
                // 모든 입력 초기화
                this.inputList = [];
                this.inputExceptKeyword = structuredClone(this.init);
                // virtualList 스크롤 상단으로 이동
                document.querySelector('#virtual_list').scrollTo(0, 0);
            },
        },
        'inputExceptKeyword.tsc'(val) {
            if (val == 2) this.inputExceptKeyword.name = this.inputExceptKeyword.name.replace(/\n+(?=\n)|[^\uAC00-\uD7A3ㄱ-ㅎㅏ-ㅣ\w\s\n]/g, '');
        },
    },
    created() {
        this.inputExceptKeyword = structuredClone(this.init);
    },
    mounted() {},
    methods: {
        clickExceptKeyword(item) {
            // toggle checked
            if (this.checkedItem?.k_seq === item.k_seq) {
                this.checkedItem = {};
            } else {
                this.checkedItem = structuredClone(item);
            }
        },

        /**
         * FilterGrp 팝업에서 제외키워드 수정시 호출
         * API는 FilterGrp에서 통신 후 main_brd와 연동하기 위해
         * 변동된 데이터를 aside_keywords로 올려준다.
         * @param {*} item
         * @param {Boolean} isDelete 삭제 여부
         */
        updateKeyword(item, isDelete) {
            const idx = this.getExceptKeyword.findIndex((keyword) => keyword.k_seq === item.k_seq);

            if (isDelete) {
                // 서버에 등록되지 않은 키워드 삭제시 inputList에서만 제거
                if (idx === -1) {
                    this.inputList = this.inputList.filter((input) => input?.idx !== item?.idx);
                } else {
                    const list = this.getExceptKeyword.findIndex((keyword) => keyword.k_seq === item.k_seq);
                    this.getExceptKeyword.splice(idx, 1);

                    this.$emit('update:exceptList', this.getExceptKeyword);
                }

                return;
            } else {
                // 서버에 등록되지 않은 키워드 수정시 inputList에서만 반영
                if (idx === -1) {
                    const list = this.inputList.map((input) => {
                        if (input?.idx === item?.idx) input = structuredClone(item);
                        return input;
                    });
                    this.$set(this, 'inputList', list);
                } else {
                    const oldVal = JSON.stringify(this.getExceptKeyword[idx]);
                    const newVal = JSON.stringify(item);

                    // 기존 값과 변경된 값이 다를 때 상위로 데이터 전달
                    if (oldVal !== newVal) {
                        this.$set(this.getExceptKeyword, idx, structuredClone(item));
                        this.$emit('update:exceptList', this.getExceptKeyword);
                    }
                }
            }
        },

        /**
         * 제외키워드 단일등록
         * API는 FilterGrp에서 통신 후 main_brd와 연동하기 위해
         * 변동된 데이터를 aside_keywords로 올려준다.
         */
        async registExceptKeyword() {
            console.log('A');
            const param = {
                level: 4,
                type: 'i',
                ...this.inputExceptKeyword,
            };

            // 키워드 등록일땐 다중저장을 위해 임시 목록에만 저장
            if (!this.isEdit) {
                // 키워드 여러개 입력 쪼개서 저장
                const keywords = param.name.split(/\n/g) || [];
                keywords.forEach((name) => {
                    if (name.trim().length) {
                        this.inputList.push({
                            ...param,
                            name,
                            idx: Math.random(),
                        });
                    }
                });

                // 입력(Input) 초기화
                this.inputExceptKeyword.name = '';

                return;
            }

            const params = this.inputExceptKeyword?.name
                .split(/\n/g)
                .filter((item) => item.trim().length)
                .map((item) => ({ ...param, name: item }));

            let result = []; // 실패 목록
            await this.registKeyword(params).then((res) => {
                result = res;
            });

            // 성공에 대한 처리
            if (result.success.length) {
                const successMsg = params.length > 1 ? `${params.length}개의 제외키워드 중 ${result.success.length}개의 등록에 성공했습니다.` : null;
                this.registKeywordSuccess(successMsg);
            }

            // 실패에 대한 처리
            if (result.fail.length) {
                let failMsg;
                if (result.fail.length > 10) {
                    failMsg = `${result.fail.length}개의 제외키워드 등록에 실패 했습니다.<br>"복사"를 눌러 실패한 제외키워드를 클립보드에 저장합니다.`;
                } else {
                    failMsg = result.fail.map((item) => item.name).join(', ') + '<br><br>제외키워드 등록에 실패 했습니다.<br>"복사"를 눌러 실패한 제외키워드를 클립보드에 저장할 수 있습니다.';
                }
                this.registKeywordError(failMsg, result.fail);
            }
        },
        /**
         * 키워드 등록 성공/실패
         */
        registKeywordSuccess(msg) {
            this.$store.dispatch('NOTY_COM', msg ? msg : '제외키워드 등록을 성공했습니다.');
        },
        registKeywordError(msg, failList) {
            this.$store.dispatch(msg ? 'NOTY_ERR_CONFIRM' : 'NOTY_ERR', [
                msg ? msg : '제외 키워드 등록을 실패했습니다.',
                [
                    {
                        name: '복사',
                        click: async (name, close) => {
                            if (failList?.length) {
                                const msg = failList.map((item) => item.name).join('\n');
                                const copyResult = await msg.copyClipBoard(true);
                            }
                            close();
                        },
                    },
                    { name: '확인' },
                ],
            ]);
        },

        /**
         * 제외키워드 다중등록
         * 키워드 등록 후에 임시 목록(inputList)을 Promise all로 호출
         * 메소드 종료 후 main_brd를 다시 fetchList하기 때문에 데이터 동기화 하지않음.
         * @param {Array} list 등록 키워드 목록(제외키워드 아님)
         */
        async registExceptKeywordList(keywordList) {
            if (!Array.isArray(keywordList)) return;

            if (!this.isDisabled) {
                this.inputList.push(this.inputExceptKeyword);
            }

            const params = [];
            keywordList.forEach((keyword) => {
                this.inputList.forEach((item) => {
                    params.push({
                        ...item,
                        level: 4,
                        type: 'i',
                        zp: keyword.zp,
                    });
                    delete params.k_seq;
                });

                this.inputExceptKeyword = structuredClone(this.init);
            });

            return await this.registKeyword(params, true);
        },

        async registKeyword(list, isRegist) {
            console.log('registKeyword ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■', list);

            this.loading = true;

            const successList = [];
            const failList = [];
            const failScList = [];
            const promises = list.map(async (item, idx) => {
                const updateUid = uuid.v4();
                // 순서대로 등록되게 하기 위한 0.01초 딜레이
                await new Promise((resolve) => setTimeout(resolve, 15 * idx));

                return await API_keywordmanage(updateUid, item)
                    .then((res) => {
                        res.param = item;
                        successList.push(res.data.result.list[0]);
                        return res;
                    })
                    .catch((err) => {
                        err.param = item;
                        if (err.response.status === 400) failScList.push(item);
                        failList.push({ ...item, errStatus: err.response.status });
                        return err;
                    });
            });

            const settledPromises = await Promise.allSettled(promises);

            // 등록 아니고 수정 모드일때
            if (!isRegist) {
                successList.forEach((item) => this.getExceptKeyword.push(item));
                this.$set(this, 'getExceptKeyword', this.getExceptKeyword);
            }

            const dummyInputList = structuredClone(this.inputList);
            this.loading = false;
            this.inputList = [];

            // 입력 초기화
            this.inputExceptKeyword = structuredClone(this.init);

            return Promise.resolve({ success: successList, fail: failList, failSc: failScList, inputList: dummyInputList });
        },
    },
};
</script>

<style lang="scss" src="./style.scss" />
