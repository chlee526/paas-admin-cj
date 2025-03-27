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
                        <strong v-else>{{ inputItem.s_name_rsn || '-' }}</strong>
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
                        <strong>URL</strong>
                        <span>{{ inputItem.url || '-' }}</span>
                    </li>

                    <li v-if="getUserPermissions < 2">
                        <strong>매체명 </strong>
                        <span>{{ inputItem.s_name_cj || '-' }}</span>
                    </li>

                    <li v-if="getUserPermissions < 2">
                        <strong>검색어 </strong>
                        <span>{{ inputItem.s_name_search || '-' }}</span>
                    </li>
                </ul>

                <div v-if="getUserPermissions >= 2" class="cj">
                    <strong :class="{ required: !isEdit }">매체명</strong>
                    <div>
                        <comp-input-box class="is-small is-wid100p" placeholder="매체명 입력" focusResetVisible v-model="inputItem.s_name_cj" />
                    </div>

                    <strong :class="{ required: !isEdit }">검색어</strong>
                    <div>
                        <comp-input-box class="is-small is-wid100p" placeholder="검색어 입력" focusResetVisible v-model="inputItem.s_name_search" />
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
    name: 'comp-aside-sitesearch',
    components: {
        AsideBox,
    },
    data() {
        return {
            // 입력값
            inputItem: {
                s_seq: '',
                s_name_cj: '',
                s_name_search: '',
                s_name_rsn: '',
                url: '',
                use_yn: 'Y',
            },
            // 초기값
            init: {
                s_seq: '',
                s_name_cj: '',
                s_name_search: '',
                s_name_rsn: '',
                url: '',
                use_yn: 'Y',
            },
        };
    },
    props: {
        // 수정 아이템
        editItem: { type: Object },
        // 자동완성 목록
        autocompleteList: { type: Array, default: new Array() },
    },
    computed: {
        ...mapGetters(['getUseYNOpts', 'getUserPermissions']),
        // 컴포넌트 타이틀
        getTitle() {
            if (this.getUserPermissions >= 2) {
                return `사이트 검색어 ${!this.isEdit ? '등록' : '수정'}`;
            }
            return '사이트 검색어 정보';
        },
        // 수정상태인지 확인
        isEdit() {
            return Object.keys(this.editItem).length > 0;
        },
        // 유효성 확인
        isVaild() {
            // 저장
            if (!this.isEdit) {
                return ['s_name_cj', 's_name_search', 'use_yn', 's_name_rsn', 'url'].every((key) => {
                    // 값 입력 여부 확인
                    return this.inputItem[key].trim().length > 0;
                });
            } else {
                // 수정
                const keys = ['s_name_cj', 's_name_search', 'use_yn'];
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
            const { url, name } = this.autocompleteList.find(({ code }) => this.inputItem.s_seq === code);
            this.inputItem.url = url || '';
            this.inputItem.s_name_rsn = name || '';
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
                this.$emit('save', param);
                this.resetInput();
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
