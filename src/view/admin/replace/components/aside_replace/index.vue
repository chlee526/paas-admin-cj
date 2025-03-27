<template>
    <AsideBox>
        <template slot="title">
            <h3>
                키워드 <template v-if="getUserPermissions >= 2"> {{ isEdit ? '수정' : '등록' }} </template>
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

                <template v-if="getUserPermissions <= 1">
                    <fieldset>
                        <strong>사용여부</strong>
                        <div>
                            <span v-if="isEdit">{{ inputKeyword.active ? '사용' : '미사용' }}</span>
                            <span v-else>{{ '-' }}</span>
                        </div>
                        <strong>찾을 키워드</strong>
                        <div>
                            <span v-if="isEdit">{{ inputKeyword.find_keyword }}</span>
                            <span v-else>{{ '-' }}</span>
                        </div>
                        <strong>치환 키워드</strong>
                        <div>
                            <span v-if="isEdit">{{ inputKeyword.replace_keyword }}</span> <span v-else>{{ '-' }}</span>
                        </div>
                    </fieldset>
                </template>

                <div class="replace" v-else>
                    <comp-bubble-box class="is-validation" content="특수문자( &#39; or &#34; )가 포함되어 있습니다." pos="LT" :showFixed="getSkIncludeSc">
                        <comp-textarea id="input_replace_ta_find" v-model="inputKeyword.find_keyword" :class="{ 'is-valid': inputKeyword.find_keyword.length }" :forbiddenKeys="isEdit ? [222, 13] : [222]"></comp-textarea>
                    </comp-bubble-box>
                    <span class="arrow"></span>
                    <comp-bubble-box class="is-validation" content="특수문자( &#39; or &#34; )가 포함되어 있습니다." pos="LT" :showFixed="getRkIncludeSc">
                        <comp-textarea id="input_replace_ta_replace" v-model="inputKeyword.replace_keyword" :class="{ 'is-valid': inputKeyword.replace_keyword.length }" :forbiddenKeys="[222, 13]"></comp-textarea>
                    </comp-bubble-box>
                </div>

                <div class="ui_help is-fixed is-hgt-slim" v-if="getUserPermissions >= 2">
                    <div class="wrap">
                        <ul>
                            <li class="title"><strong>도움말</strong></li>
                            <li>
                                <span>
                                    구문 입력만 가능합니다.
                                    <!-- <br /><em>찾을 키워드의 경우 연속공백은 입력 할 수 없습니다.</em> -->
                                    <br /><em>찾을 키워드는 줄넘김으로 다중등록 가능합니다.</em> <br /><em>치환 키워드는 줄바꿈(개행)을 사용할 수 없습니다.</em>
                                </span>
                            </li>
                            <li>
                                <span>제목 + 내용 에서만 치환 됩니다.</span>
                            </li>
                            <li>
                                <span>특수문자 입력 가능 합니다.<br /><em>'(싱글 따옴표),"(더블 따옴표) 입력 불가</em></span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="btn_box" v-if="getUserPermissions >= 2">
                    <transition name="fade_posx" v-if="getUserPermissions > 2">
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
    </AsideBox>
</template>

<script>
import CompAsideKeyword from '@/components/keyword_boilerplate/comp_aside';

export default {
    name: 'comp-aside',
    extends: CompAsideKeyword,
    computed: {
        isDisabled() {
            let disabled = false;

            // 키워드 입력 없으면 저장 안됨
            if (!this.inputKeyword.find_keyword.trim().length) disabled = true;
            if (this.inputKeyword.find_keyword.length <= 0 || this.inputKeyword.replace_keyword.length <= 0) disabled = true;

            // 변경된 값이 있으면 저장 가능
            if (Object.keys(this.editKeyword).length) {
                const isChanged = Object.keys(this.editKeyword).every((key) => String(this.inputKeyword[key]) === String(this.editKeyword[key]));
                if (isChanged) disabled = true;
            }

            return disabled;
        },
        // 키워드 등록 기본 설정
        getInit() {
            const init = {
                seq: '',
                name: '',
                use_yn: 'Y',
                active: true,
                find_keyword: '',
                replace_keyword: '',
            };

            return init;
        },

        getSkIncludeSc() {
            return /['""']/g.test(this.inputKeyword.find_keyword);
        },
        getRkIncludeSc() {
            return /['""']/g.test(this.inputKeyword.replace_keyword);
        },
    },
    watch: {
        'inputKeyword.find_keyword'(val) {
            // this.inputKeyword.find_keyword = val.replace(/ {2,}/g, '');
            if (this.isEdit) this.inputKeyword.find_keyword = val.replace(/[\r\n]+/g, '');
        },
        'inputKeyword.replace_keyword'(val) {
            // this.inputKeyword.find_keyword = val.replace(/ {2,}/g, '');
            this.inputKeyword.replace_keyword = val.replace(/[\r\n]+/g, '');
        },
    },
};
</script>

<style lang="scss" src="./style.scss" scoped />
