<template>
    <div>
        <!-- 인기도 지수 등록 -->
        <AsideBox class="ui-loader-container" :class="{ 'is-loading': loading }" ref="asidebox">
            <template slot="title">
                <h3>
                    {{ getTitle }}
                </h3>

                <transition name="fade_posx_reverse">
                    <comp-button v-if="isEdit && getUserPermissions >= 2" class="btn_regist is-small" @click="$emit('edit', {})">
                        <span class="txt">인기도 지수 등록</span>
                    </comp-button>
                </transition>
            </template>
            <template slot="content">
                <fieldset>
                    <strong :class="{ required: !isEdit && getUserPermissions >= 2 }">사용여부</strong>
                    <div>
                        <comp-switch-btn v-if="getUserPermissions >= 2" id="aside_disble_switch" class="is-xsmall" v-model="inputItem.active" @click="changeUseYN" />
                        <strong v-else>
                            {{ isEdit ? (inputItem.active ? '사용' : '미사용') : '-' }}
                        </strong>
                    </div>

                    <strong :class="{ required: !isEdit && getUserPermissions >= 2 }">
                        <span>사이트명</span>
                    </strong>

                    <div>
                        <span v-if="!isEdit && getUserPermissions >= 2">
                            <comp-selectbox v-if="getAutoCompleteList.length" ref="d_site_name_selectbox" class="is-small" :opts="getAutoCompleteList" placeholder="사이트명" notSelectedLabel="사이트를 선택하세요." autoComplete style="width: 100%" v-model="inputItem.s_seq" @change="setDsiteName" />
                        </span>

                        <strong v-else class="ui-ellipsis">
                            {{ inputItem.d_site_name || '-' }}
                        </strong>
                    </div>

                    <strong :class="{ required: !isEdit && getUserPermissions >= 2 }">
                        <span>인기도 지수</span>
                    </strong>
                    <div>
                        <comp-input-box v-if="getUserPermissions >= 2" ref="pwd_input" class="is-small" type="number" placeholder="인기도 지수(0~100)" focusResetVisible :min="0" :max="100" v-model="inputItem.logstd" />
                        <strong v-else>
                            {{ isEdit ? inputItem.logstd : '-' }}
                        </strong>
                    </div>
                </fieldset>

                <div v-if="getUserPermissions >= 2" class="btn_box">
                    <transition name="fade_posx">
                        <comp-button v-if="isEdit && getUserPermissions >= 3" class="is-large" customColor="#ff0000" title="삭제" @click="$emit('delete', editItem)">
                            <span class="txt">삭제</span>
                        </comp-button>
                    </transition>
                    <comp-button class="is-large" title="초기화" @click="resetInput">
                        <span class="txt">초기화</span>
                    </comp-button>
                    <comp-button class="is-color-hl is-large" :disabled="!isVaild" title="저장" @click="saveInputItem">
                        <span class="txt">저장</span>
                    </comp-button>
                </div>
            </template>
        </AsideBox>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';

import AsideBox from '@/components/aside_box';
import { API_siteList } from '@/api/admin/site/collect';

export default {
    name: 'comp-aside-popularity',
    components: {
        AsideBox,
    },
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            fullSiteList: [],
            inputItem: {
                active: true,
                use_yn: 'Y',
                seq: '',
                s_seq: '',
                d_site_name: '',
                logstd: '',
            },

            init: {
                active: true,
                use_yn: 'Y',
                seq: '',
                s_seq: '',
                d_site_name: '',
                logstd: '',
            },
        };
    },
    props: {
        editItem: { type: Object },
        registedList: { type: Array },
    },
    watch: {
        editItem: {
            deep: true,
            handler() {
                this.resetInput();
            },
        },
    },
    created() {
        this.fetchSiteAll();
    },
    computed: {
        ...mapGetters(['getUserPermissions']),
        getTitle() {
            if (this.getUserPermissions >= 2) {
                return `인기도 지수 ${!this.isEdit ? '등록' : '수정'}`;
            }
            return '인기도 지수 정보';
        },

        isEdit() {
            return Object.keys(this.editItem).length > 0;
        },

        /**
         * 저장버튼 활성화 여부
         */
        isVaild() {
            let validation = true;
            let isChanged = false;

            // 변경 사항이 없을 때 저장 버튼 비활성화
            const origin = structuredClone(this.isEdit ? this.editItem : this.init);
            delete origin.reg_date;
            delete origin.modi_date;

            isChanged = !Object.keys(origin).every((key) => {
                let original = String(origin[key]);

                // 빈값 예외처리
                if (original === 'null' || original === null) original = '';

                return original === String(this.inputItem[key]);
            });

            // 등록일 때 입력값 확인
            if (!this.isEdit) {
                validation = this.inputItem.s_seq && this.inputItem.logstd;
            }

            return isChanged && validation;
        },

        getAutoCompleteList() {
            return this.fullSiteList
                .filter((item) => {
                    if (!this.registedList.some(({ s_seq }) => String(item.s_seq) === String(s_seq))) {
                        return item;
                    }
                })
                .map(({ s_seq, name }) => {
                    return { code: String(s_seq), name };
                });
        },
    },

    methods: {
        // 자동 완성용 전체 사이트 목록
        async fetchSiteAll() {
            this.loading = true;

            await API_siteList(this.apiUID)
                .then((res) => {
                    const data = structuredClone(res?.data?.result);
                    this.fullSiteList = [...data.list];
                })
                .catch(() => {
                    this.$store
                        .dispatch('DIALOG_ERR', ['사이트 목록을 로드하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '사이트 목록 로드 실패', 0])
                        .then(($val) => {
                            location.reload();
                        })
                        .catch(($err) => {
                            console.log('error');
                        });
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * 변경된 active를 use_yn에 반영
         */
        changeUseYN() {
            const obj = structuredClone(this.inputItem);
            obj.use_yn = obj.active ? 'Y' : 'N';
            this.inputItem = obj;
        },

        /**
         * d_site_name 설정
         * @param {String} item s_seq
         */
        setDsiteName(item) {
            this.inputItem.d_site_name = this.getAutoCompleteList.find(({ code }) => code === item)?.name;
        },

        /**
         * input 초기화
         */
        resetInput() {
            if (this.isEdit) {
                this.inputItem = structuredClone(this.editItem);
            } else {
                this.inputItem = structuredClone(this.init);
            }
        },

        /**
         * 사용자 등록 또는 수정 저장
         * popularity > index.vue API 호출
         */
        async saveInputItem() {
            const param = {
                type: this.isEdit ? 'u' : 'i',
                ...this.inputItem,
            };

            if (!this.isEdit) {
                delete param.seq;
            }

            this.$emit('save', param, this.isEdit);
        },
    },
};
</script>

<style lang="scss" src="./style.scss" scoped />
