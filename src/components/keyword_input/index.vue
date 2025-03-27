<template>
    <div>
        <comp-bubble-box class="is-validation" content="특수문자( &#39; or &#34; )가 포함되어 있습니다." pos="LT" :showFixed="getIncludeSc">
            <comp-input-box v-if="isEdit" class="input_mdfy is-xlarge" :id="`keyword_input_${id}`" placeholder="수정키워드를 입력하세요" :forbiddenChars="getForbiddenChars" :forbiddenKeys="[222]" v-model="getInputKeyword.name" style="width: 100%" />
            <comp-textarea v-else :id="`keyword_input_${id}`" :rows="5" :placeholder="getPlaceholder" :forbiddenChars="getForbiddenChars" :forbiddenKeys="[222]" v-model="getInputKeyword.name" />
        </comp-bubble-box>
        <OperatorSetting :id="id" :inputKeyword.sync="getInputKeyword" :availableSgGrp="availableSgGrp" :useSgGrp="useSgGrp" :useTypeAnal="useTypeAnal" />
    </div>
</template>

<script>
import OperatorSetting from '@/components/operator_setting';

export default {
    name: 'comp-keyword-input',
    components: {
        OperatorSetting,
    },
    data() {
        return {};
    },
    props: {
        id: { type: String, required: true },
        isEdit: { type: Boolean, default: false },
        inputKeyword: { type: Object },
        useSgGrp: { type: Boolean, default: false }, //채널 선택 사용여부
        availableSgGrp: { type: String, default: '' }, //선택 가능한 채널
        useTypeAnal: { type: Boolean, default: false }, // 분석대상 선택 사용여부
    },
    computed: {
        getInputKeyword: {
            get() {
                return this.inputKeyword;
            },
            set(val) {
                this.$emit('update:inputKeyword', val);
            },
        },
        getPlaceholder() {
            let placeholder = '키워드 입력';

            if (String(this.getInputKeyword.tsc) === '2') {
                placeholder += `\r\n${this.isEdit ? ' ' : ''}특수문자는 입력할 수 없습니다.`;
            }

            if (this.useSgGrp) {
                if (String(this.getInputKeyword.tsc) === '2') {
                    placeholder += `\r\n줄넘김으로 다중 등록 가능합니다.`;
                } else {
                    placeholder += `\r\n${this.isEdit ? ' ' : ''}다음 특수문자는 입력할 수 없습니다.\r\n${this.isEdit ? ' ' : ''}' '(작은 따옴표), " "(큰 따옴표)\r\n줄넘김으로 다중 등록 가능합니다.`;
                }
            }

            return placeholder;
        },
        getForbiddenChars() {
            if (String(this.getInputKeyword.tsc) === '2') {
                return /\n+(?=\n)|[^\uAC00-\uD7A3ㄱ-ㅎㅏ-ㅣ\w\s\n]/g;
            } else {
                return null;
                // return [`'`, `"`];
            }
        },
        getIncludeSc() {
            return String(this.getInputKeyword.tsc) === '1' && /['""']/g.test(this.getInputKeyword.name);
        },
    },
    watch: {
        'getInputKeyword.tsc'(val) {
            const attr = ['name', 'keyword', 'search_keyword'];
            const dummy = JSON.parse(JSON.stringify(this.inputKeyword));

            attr.forEach((key) => {
                if (dummy[key]) dummy[key] = val == 1 ? dummy[key].replace(/['"]]/g, '') : dummy[key].replace(/\n+(?=\n)|[^\uAC00-\uD7A3ㄱ-ㅎㅏ-ㅣ\w\s\n]/g, '');
            });
            this.getInputKeyword = dummy;
        },
    },
    methods: {},
};
</script>

<style lang="scss" src="./style.scss" scoped />
