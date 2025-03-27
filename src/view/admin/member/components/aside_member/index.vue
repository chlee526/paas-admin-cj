<template>
    <div>
        <!-- 사용자 그룹 -->
        <CompGroupManage v-if="getUserPermissions >= 2" :item="userGrpList" @fetchUserGrp="fetchUserGrp" />

        <!-- 사용자 등록 -->
        <AsideBox class="ui-loader-container" :class="{ 'is-loading': loading }" ref="asidebox">
            <template slot="title">
                <!-- <h3>사용자 {{ isEdit ? '수정' : '등록' }}</h3> -->
                <h3>
                    사용자
                    <template v-if="getUserPermissions >= 2">{{ isEdit ? '수정' : '등록' }}</template>
                    <template v-else>정보</template>
                </h3>

                <transition name="fade_posx_reverse">
                    <comp-button v-if="isEdit && getUserPermissions >= 2" class="btn_regist is-small" @click="$emit('edit', {})">
                        <span class="txt">사용자 등록</span>
                    </comp-button>
                </transition>
            </template>
            <template slot="content">
                <fieldset>
                    <strong :class="{ required: !isEdit && getUserPermissions >= 2 }">사용자 그룹</strong>
                    <div>
                        <comp-selectbox v-if="getUserPermissions >= 2" class="is-small" :opts="getUserGrpList" not-selected-label="사용자 그룹을 선택하세요." v-model="inputItem.user_grp"></comp-selectbox>
                        <span v-else>{{ getUserGrpList.getParseDatas({ code: inputItem.user_grp })[0]?.name || '-' }}</span>
                    </div>

                    <strong v-if="getUserPermissions >= 2" :class="{ required: !isEdit && getUserPermissions >= 2 }">권한</strong>
                    <div v-if="getUserPermissions >= 2">
                        <!-- <comp-button class="is-small" @click="checkDuplicate" :disabled="!inputItem.id.trim().length"> -->
                        <comp-button class="is-small is-color-black" @click="evtAuthMngrClick">
                            <span class="icon">&#xe057;</span>
                            <span class="txt">권한설정</span>
                        </comp-button>
                    </div>

                    <strong :class="{ required: !isEdit && getUserPermissions >= 2 }">
                        <span>아이디</span>
                    </strong>
                    <div>
                        <template v-if="getUserPermissions >= 2">
                            <strong v-if="isEdit" class="ui-ellipsis">
                                {{ inputItem.id }}
                            </strong>
                            <span v-else class="input-with-btn-box">
                                <comp-input-box ref="id_input" class="is-small" placeholder="사용자 아이디" focusResetVisible :validation="getIdWarning" v-model="inputItem.id" @input="validation.duplicate = null" @blur="blurIdInput" @focus="isIdInputBlur = false"></comp-input-box>
                                <comp-button class="is-small" @click="checkDuplicate" :disabled="!inputItem.id.trim().length">
                                    <span class="txt">중복검사</span>
                                </comp-button>
                            </span>
                        </template>
                        <strong v-else>{{ inputItem.id || '-' }}</strong>
                    </div>

                    <strong v-if="getUserPermissions >= 2" :class="{ required: !isEdit && getUserPermissions >= 2 }">
                        <span>비밀번호</span>
                    </strong>
                    <div v-if="getUserPermissions >= 2">
                        <comp-input-box ref="pwd_input" type="password" class="is-small" placeholder="사용자 비밀번호" focusResetVisible :validation="getPasswordWarning" disablePwdAutoComplete v-model="inputItem.password" @input="validation.password = null"></comp-input-box>
                    </div>

                    <strong :class="{ required: !isEdit && getUserPermissions >= 2 }">이름</strong>
                    <div>
                        <strong v-if="isEdit || getUserPermissions === 1" class="ui-ellipsis">{{ inputItem.name || '-' }}</strong>
                        <comp-input-box v-else class="is-small" placeholder="사용자 이름" focusResetVisible v-model="inputItem.name" @blur="inputItem.name = inputItem.name.trim()" />
                    </div>

                    <strong>직급</strong>
                    <div>
                        <comp-input-box v-if="getUserPermissions >= 2" class="is-small" placeholder="사용자 직급" focusResetVisible :autocomplete="rankList" v-model="inputItem.rank" />
                        <span v-else>{{ inputItem.rank || '-' }}</span>
                    </div>

                    <strong>부서</strong>
                    <div>
                        <comp-input-box v-if="getUserPermissions >= 2" class="is-small" placeholder="사용자 부서" focusResetVisible :autocomplete="getDeptList" v-model="inputItem.dept" />
                        <span v-else>{{ inputItem.dept || '-' }}</span>
                    </div>

                    <strong>핸드폰</strong>
                    <div>
                        <comp-input-box v-if="getUserPermissions >= 2" class="is-small" placeholder="000-0000-0000" focusResetVisible :maxlength="13" v-model="inputItem.mobile" @input="parseMobile" @blur="parseMobile" />
                        <span v-else>{{ inputItem.mobile || '-' }}</span>
                    </div>

                    <strong>E-mail</strong>
                    <div>
                        <comp-input-box v-if="getUserPermissions >= 2" class="is-small" placeholder="사용자 E-mail" focusResetVisible v-model="inputItem.email" />
                        <span v-else>{{ inputItem.email || '-' }}</span>
                    </div>
                </fieldset>

                <div v-if="getUserPermissions >= 2" class="btn_box">
                    <transition name="fade_posx">
                        <comp-button v-if="isEdit && getUserPermissions === 3" class="is-large" customColor="#ff0000" title="삭제" @click="$emit('delete', editItem)">
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
import EventBus from '@shared/utils/eventBus';
import { isEqual } from 'lodash';

import AsideBox from '@/components/aside_box';
import CompGroupManage from '@/view/admin/member/components/group_manage';
import { API_memberduplicate, API_membermanage } from '@/api/admin/member';

export default {
    name: 'comp-aside-member',
    components: {
        AsideBox,
        CompGroupManage,
    },
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            inputItem: {
                seq: '',
                user_grp: '',
                id: '',
                password: '',
                name: '',
                rank: '',
                dept: '',
                mobile: '',
                email: '',
                menu_seq: [],
            },

            init: {
                seq: '',
                user_grp: '',
                id: '',
                password: '',
                name: '',
                rank: '',
                dept: '',
                mobile: '',
                email: '',
                menu_seq: [],
            },
            // 유효성 검사
            validation: {
                duplicate: null,
                password: null,
            },
            showWarning: false, //사용자 등록 경고 표시여부
            isIdInputBlur: false, // id_input blur 여부
        };
    },
    props: {
        userGrpList: { type: Array, required: true },
        deptList: { type: Array, required: true },
        rankList: { type: Array, required: true },
        editItem: { type: Object },
    },
    watch: {
        editItem: {
            deep: true,
            handler() {
                this.resetInput();
            },
        },
    },
    computed: {
        ...mapGetters(['getUserPermissions', 'getRoutes']),
        isEdit() {
            return Object.keys(this.editItem).length > 0;
        },

        getUserGrpList() {
            const result = this.userGrpList;
            return result;
        },

        getDeptList() {
            const result = this.deptList.exptAttr({ name: '부서없음' });

            return result.length ? result : null;
        },

        /**
         * 저장버튼 활성화 여부
         */
        isVaild() {
            let validation = true;
            let isChanged = false;

            if (this.isEdit) {
                const originItem = structuredClone(this.editItem);
                delete originItem.reg_date;

                isChanged = Object.keys(originItem).some((key) => !isEqual(originItem[key] || '', this.inputItem[key]));

                // 비밀번호 입력했는데 4글자 미만일 때
                if (this.inputItem.password.trim().length && this.inputItem.password.trim().length < 4) validation = false;
            }

            // 사용자 그룹, 사용자 이름 입력 안했을 때
            // 사용자 수정이면서 변경사항이 없을 때 비밀번호 입력도 없으면
            // 저장 버튼 비활성화
            if (!this.inputItem.user_grp || !this.inputItem.name.trim() || (this.isEdit && !isChanged && !this.inputItem.password.trim())) validation = false;

            // 권한 설정 값이 없으면
            if (!this.inputItem.menu_seq.length) validation = false;

            return validation;
        },
    },
    created() {
        EventBus.$on('MODAL_CLOSE', (name, param) => {
            // 권한 설정 팝업이 닫힐때 권한 전달 받아 input에 설정 함.
            if (param && param.menu_seq) this.inputItem.menu_seq = [...param.menu_seq];
        });
    },
    methods: {
        /**
         * 아이디 validation
         */
        getIdWarning() {
            let msg = false;

            if (!this.isEdit) {
                if (this.validation.duplicate === null) {
                    if (!this.inputItem.id.trim()) {
                        msg = '필수 값입니다.';
                    } else if (this.isIdInputBlur === true) {
                        // id_input에 값이 있고 blur 되었을 때 warning
                        msg = '중복 아이디 검사를 진행하세요.';
                    }
                } else if (this.validation.duplicate === false) {
                    msg = '이미 사용된 아이디입니다.';
                } else if (this.validation.duplicate === true) {
                    msg = true;
                }
            }

            return msg;
        },

        /**
         * 비밀번호 글자수 validation
         */
        getPasswordWarning() {
            let msg = false;

            // password 입력이 일어나기 전까지 warning 노출 안함
            if (this.validation.password === null) {
                // 입력값이 있을 땐 무조건 4글자 이상 입력시 통과
                if (this.inputItem.password.length >= 4) {
                    msg = true;
                    // 수정일 땐 입력하지 않아도 통과
                    // 등록일 땐 필수 값입니다
                } else if (!this.inputItem.password.length) {
                    msg = this.isEdit ? false : '필수 값입니다.';
                } else {
                    msg = '4글자 이상 입력하세요.';
                }
            }

            return msg;
        },

        /**
         * id_input blur 되었을 때 중복 검사 warning 보이기
         */
        blurIdInput() {
            this.isIdInputBlur = true;
            // validation 반영을 위해 input focus
            this.$refs.id_input?.evt_focus();
        },

        /**
         * member index.vue에 fetchUserGrp trigger
         * 사용자 그룹 fetch
         */
        fetchUserGrp() {
            this.$emit('fetchUserGrp');
        },

        /**
         * member index.vue에 fetchUserGrp trigger
         * 사용자 그룹 fetch
         */
        fetchDatas() {
            this.$emit('fetchDatas');
        },

        /**
         * input/유효성 초기화
         */
        resetInput() {
            if (this.isEdit) {
                const obj = {
                    seq: this.editItem.seq,
                    user_grp: this.editItem.user_grp,
                    id: this.editItem.id,
                    password: '',
                    name: this.editItem.name,
                    rank: this.editItem.rank || '',
                    dept: this.editItem.dept || '',
                    mobile: this.editItem.mobile || '',
                    email: this.editItem.email || '',
                    menu_seq: this.editItem.menu_seq || [],
                };
                this.inputItem = structuredClone(obj);
                this.validation.duplicate = true;
            } else {
                this.inputItem = structuredClone(this.init);
                this.validation.duplicate = '';

                // validation 반영을 위해 input focus
                this.$refs?.id_input?.evt_focus();
            }

            // 초기화 되어 첫 입력이 발생하기 전까지 password validation 보이지 않기
            this.validation.password = '';
            // validation 반영을 위해 input focus
            this.$refs.pwd_input?.evt_focus();
        },

        /**
         * 핸드폰 하이픈 삽입 및 숫자만 입력
         */
        parseMobile() {
            const value = this.inputItem.mobile
                .trim() //공백제거
                .replaceAll(/[^0-9]/g, '') // 숫자를 제외한 모든 문자 제거
                .replaceAll(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
                .replace(/(-{1,2})$/g, '');

            setTimeout(() => {
                this.inputItem.mobile = value;
            });
        },

        /**
         * 아이디 중복검사
         */
        async checkDuplicate() {
            const id = this.inputItem.id.trim();

            if (!id.length) return;

            this.loading = true;

            await API_memberduplicate(this.apiUID, { id })
                .then((res) => {
                    const result = res.data?.result?.duplicate;
                    this.validation.duplicate = result === true ? false : true || false;
                    // validation 반영을 위해 input focus
                    this.$refs.id_input?.evt_focus();
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * 사용자 등록 또는 수정 저장
         * 유효성 검사 통과여부에 따라 API 호출 또는 경고문 노출
         */
        async saveInputItem() {
            // 유효성 검사 미통과시 경고문 노출
            const validation = this.getIdWarning && this.getPasswordWarning;

            if (!validation) {
                this.showWarning = true;
                return;
            }

            this.loading = true;
            const param = {
                type: this.isEdit ? 'u' : 'i',
                ...this.inputItem,
            };

            if (this.isEdit) {
                delete param.id;
                if (param.password === '') delete param.password;
            } else {
                delete param.seq;
            }

            // 수정일 때, 나보다 높은 권한의 사용자의 경우 내가 변경 할 수 없는 권한은 기존 데이터 유지하도록 함
            if (this.isEdit) {
                // 현재 사용자가 접근 가능한 메뉴 시퀀스 추출
                const accessibleMenuSeqs = new Set();

                this.getRoutes.forEach((route) => {
                    // 1차 메뉴 시퀀스 추가
                    if (route.meta.auth) accessibleMenuSeqs.add(route.seq);

                    // 2차 메뉴(자식 라우트) 시퀀스 추가
                    route?.children?.forEach((subRoute) => {
                        if (subRoute.meta.auth) accessibleMenuSeqs.add(subRoute.seq);
                    });
                });

                // 현재 사용자가 접근할 수 없는 메뉴/권한 필터링
                const inaccessibleMenu = this.editItem.menu_seq.filter((item) => !accessibleMenuSeqs.has(item.code));

                // 현재 수정된 메뉴 권한과 접근할 수 없는 메뉴 권한 병합
                param.menu_seq = Array.from(new Set([...param.menu_seq, ...inaccessibleMenu]));
            }

            await API_membermanage(this.apiUID, param)
                .then(() => {
                    this.$store.dispatch('NOTY_COM', `사용자 ${this.isEdit ? '수정' : '등록'}을 성공했습니다.`);
                    this.fetchDatas();
                })
                .catch(() => {
                    this.$store.dispatch('NOTY_ERR', `사용자 ${this.isEdit ? '수정' : '등록'}을 실패했습니다.`);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        evtAuthMngrClick() {
            this.$store.dispatch('MODAL_OPEN', [
                'auth-mngr',
                {
                    userAuths: this.inputItem.menu_seq || [],
                },
            ]);
        },
    },
};
</script>

<style lang="scss" src="./style.scss" scoped />
