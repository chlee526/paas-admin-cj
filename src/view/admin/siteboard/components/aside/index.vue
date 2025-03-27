<template>
    <div>
        <AsideBox class="ui-loader-container">
            <template slot="title">
                <h3>
                    {{ getTitle }}
                </h3>
                <transition name="fade_posx_reverse">
                    <comp-button v-if="isEdit && getUserPermissions >= 2" class="btn_regist is-small" @click="$emit('setEditItem', {})">
                        <span class="txt">등록</span>
                    </comp-button>
                </transition>
            </template>
            <template slot="content">
                <div v-if="getUserPermissions >= 2">
                    <comp-switch-btn id="aside_use_yn" class="is-xsmall" label="사용여부" :valForm="getUseYNOpts" v-model="inputItem.use_yn" />
                </div>

                <ul class="rsn">
                    <li class="name" :class="{ 'is-edit': isEdit || getUserPermissions < 2 }">
                        <comp-selectbox v-if="!isEdit && getUserPermissions >= 2" class="is-large is-wid100p" :opts="autocompleteList" autoComplete not-selected-label="사이트를 선택하세요." v-model="inputItem.s_seq" @change="changeS_Seq" />
                        <strong v-else>{{ inputItem.s_name_cj || '-' }}</strong>
                    </li>

                    <li v-if="getUserPermissions < 2">
                        <strong>사용여부 </strong>
                        <span>{{ isEdit ? (inputItem.use_yn === 'Y' ? '사용' : '미사용') : '-' }}</span>
                    </li>
                    <li>
                        <strong>매체번호</strong>
                        <span>{{ inputItem.s_seq || '-' }}</span>
                    </li>

                    <li>
                        <strong>채널</strong>
                        <span>{{ inputItem.channel || '-' }}</span>
                    </li>

                    <li v-if="getUserPermissions < 2">
                        <strong>수집원 </strong>
                        <span>{{ inputItem.sb_name || '-' }}</span>
                    </li>
                </ul>

                <div v-if="getUserPermissions >= 2" class="cj">
                    <strong :class="{ required: !isEdit }">수집원</strong>
                    <div>
                        <comp-input-box class="is-small is-wid100p" placeholder="매체명 입력" focusResetVisible v-model="inputItem.sb_name" :autocomplete="getCommunityAutocompleteList" />
                    </div>
                    <div class="ui_help is-fixed is-hgt-slim" style="padding: 0; grid-column: 1 / -1">
                        <div class="wrap">
                            <ul>
                                <li>
                                    <span>수집원의 하위 표시는 '<strong>></strong>' 를 사용해 주세요.<br /><em>ex) 정보분석 > 리포트 분석 > 리포트 전체보기</em></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div v-if="getUserPermissions >= 2" class="btn_box">
                    <transition name="fade_posx">
                        <comp-button v-if="isEdit && getUserPermissions >= 3" class="is-large" customColor="#ff0000" title="삭제" @click="evt_remove">
                            <span class="txt">삭제</span>
                        </comp-button>
                    </transition>
                    <comp-button v-if="true" class="is-large" @click="resetInput" title="초기화">
                        <span class="txt">초기화</span>
                    </comp-button>
                    <comp-button v-if="true" class="is-color-hl is-large" @click="evt_save" :disabled="!isVaild" title="저장">
                        <span class="txt">저장</span>
                    </comp-button>
                </div>
            </template>
        </AsideBox>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import AsideBox from '@/components/aside_box';

export default {
    name: 'comp-aside-siteboard',
    components: {
        AsideBox,
    },
    data() {
        return {
            // 입력값
            inputItem: {
                s_seq: '',
                s_name_cj: '',
                sb_name: '',
                use_yn: 'Y',
                channel: '',
            },
            // 초기값
            init: {
                s_seq: '',
                s_name_cj: '',
                sb_name: '',
                use_yn: 'Y',
                channel: '',
            },
        };
    },
    props: {
        // 수정 아이템
        editItem: { type: Object },
        // 자동완성 목록
        autocompleteList: { type: Array, default: new Array() },
        communityAutocompleteList: { type: Array, default: new Array() },
        brdList: { type: Array, default: new Array() },
    },
    computed: {
        ...mapGetters(['getUseYNOpts', 'getUserPermissions']),
        // 컴포넌트 타이틀
        getTitle() {
            if (this.getUserPermissions >= 2) {
                return `제휴 수집원 ${!this.isEdit ? '등록' : '수정'}`;
            }
            return '제휴 수집원 정보';
        },
        // 수정상태인지 확인
        isEdit() {
            return Object.keys(this.editItem).length > 0;
        },
        // 유효성 확인
        isVaild() {
            // 저장
            if (!this.isEdit) {
                return ['s_name_cj', 'sb_name', 'use_yn', 'channel'].every((key) => {
                    // 값 입력 여부 확인
                    return this.inputItem[key].trim().length > 0;
                });
            } else {
                // 수정
                const keys = ['sb_name', 'use_yn'];
                const isChanged = keys.some((key) => {
                    return this.editItem[key] !== this.inputItem[key];
                });

                // 디폴트값에서 변경 여부 확인
                if (isChanged) {
                    return keys.every((key) => {
                        // 값 입력 여부 확인
                        return this.inputItem[key].trim().length > 0;
                    });
                }
            }

            return false;
        },
        // 수집원 자동 완성 목록
        getCommunityAutocompleteList() {
            if (this.inputItem.channel === '뉴스') {
                return [
                    { code: 0, name: '네이버 뉴스' },
                    { code: 1, name: '네이트 뉴스' },
                    { code: 2, name: '다음 뉴스' },
                ];
            }
            return this.inputItem.s_seq ? this.communityAutocompleteList.filter((item) => item.s_seq === this.inputItem.s_seq) : this.communityAutocompleteList;
        },
    },
    created() {},
    watch: {
        editItem: {
            deep: true,
            handler(val) {
                this.resetInput();
            },
        },
    },
    methods: {
        /**
         * 등록 시 URL, s_name_rsn 가져오기
         */
        changeS_Seq() {
            const { gr_name, name } = this.autocompleteList.find(({ code }) => this.inputItem.s_seq === code);
            this.inputItem.channel = gr_name || '';
            this.inputItem.s_name_cj = name || '';
        },

        /**
         * input/유효성 초기화
         */
        resetInput() {
            if (this.isEdit) {
                this.inputItem = structuredClone(this.editItem);
            } else {
                this.inputItem = structuredClone(this.init);
            }
        },

        /**
         * 저장
         */
        evt_save() {
            const param = {
                type: this.isEdit ? 'u' : 'i',
                ...this.inputItem,
            };

            // 수정
            if (this.isEdit) {
                this.$emit('update', param);
            } else {
                // 중복 체크(s_seq, sb_name)
                const hasItems = this.brdList.filter((item) => {
                    return item.s_seq === param.s_seq && item.sb_name === param.sb_name;
                });
                if (hasItems.length === 0) {
                    this.$emit('save', param);
                    this.resetInput();
                } else {
                    this.$store.dispatch('NOTY_ERR', '이미 등록된 수집원입니다.');
                }
            }
        },

        /**
         * 삭제
         */
        evt_remove() {
            this.$emit('update', { type: 'd', ...this.inputItem });
        },
    },
};
</script>

<style lang="scss" src="./style.scss" scoped />
