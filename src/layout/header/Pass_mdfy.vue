<template>
    <div style="position: relative">
        <button ref="userLabel" class="user" :class="{ 'is-active': passActive }" @click.stop="passActive = !passActive">
            {{ getUserName }}
        </button>
        <transition :name="!getUseageLNB ? 'fade_posy' : 'fade_posx'">
            <div v-if="passActive" class="pass_mdfy" :style="`left: ${getUseageLNB ? '50%' : 'auto'}; margin-left: ${userLabelWid / 2 + 10}px`" v-click-outside="evt_docClick">
                <span class="arrow" :style="getArrowStyle"></span>
                <strong>비밀번호 변경</strong>
                <comp-input-box id="pass_mdfy_cur" type="password" v-model="passMdfy.curPass" placeholder="현재 비밀번호" label="현재 비밀번호" @keyup="savePw"></comp-input-box>
                <comp-input-box id="pass_mdfy_new" type="password" v-model="passMdfy.newPass" @blur="evt_newPassBlur" placeholder="새 비밀번호" label="새 비밀번호" @keyup="savePw"></comp-input-box>
                <comp-input-box id="pass_mdfy_new_confirm" type="password" v-model="passMdfy.newPassConfirm" @blur="evt_newPassBlur" placeholder="새 비밀번호 확인" label="새 비밀번호 확인" @keyup="savePw"></comp-input-box>
                <span class="result">{{ validateMsg }}</span>
                <span class="info">비밀번호는 최소4자리 입니다.</span>
                <div class="btns">
                    <button type="button" @click="savePw" class="ui_btn" :disabled="getBtnValidate"><span>확인</span></button>
                    <button type="button" @click="evt_bubbleOutClick" class="ui_btn"><span>취소</span></button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { API_SET_PW } from '@shared/api/member/user';

export default {
    name: 'comp-header-passmdfy',
    data() {
        return {
            passActive: false, // 비밀번호 수정 팝업 Active
            passMdfy: {
                curPass: '',
                newPass: '',
                newPassConfirm: '',
            },
            userLabelWid: 0,
            validateMsg: '',
        };
    },
    computed: {
        ...mapGetters(['getUseageLNB']),
        getUserName() {
            let result = '';
            let nameIdUseChk = false;
            if (this.userDatas.name) result += this.userDatas.name;
            if (result.length && this.userDatas.id) nameIdUseChk = true;
            if (nameIdUseChk && this.userDatas.id) {
                result += `(${this.userDatas.id})`;
            } else {
                if (this.userDatas.id) result += this.userDatas.id;
            }
            return result;
        },
        userDatas: function () {
            return this.$store.getters.getUser;
        },
        getArrowStyle: function () {
            return 'right: ' + (this.userLabelWid / 2 + 9) + 'px';
        },
        getBtnValidate() {
            return this.passMdfy.curPass.trim() == '' || this.passMdfy.newPass.trim() == '' || this.passMdfy.newPassConfirm.trim() == '' || this.passMdfy.newPass.trim() != this.passMdfy.newPassConfirm.trim();
        },
        validate() {
            if (this.passMdfy.curPass.trim() == '') {
                return '기존 비밀번호를 입력하지 않았습니다';
            }

            if (this.passMdfy.newPass.trim() == '') {
                return '새 비밀번호를 입력하지 않았습니다';
            }

            if (this.passMdfy.newPassConfirm.trim() == '') {
                return '새 비밀번호 확인을 입력하지 않았습니다';
            }
            return '';
        },
    },
    watch: {
        passActive: function ($val) {
            if (this.userLabelWid == 0 && $val) {
                this.userLabelWid = this.$refs.userLabel.offsetWidth;
            }
        },
        'passMdfy.curPass': function ($val) {
            if (this.validateMsg == '기존 비밀번호를 틀렸습니다.') this.validateMsg = '';
        },
        getBtnValidate($val) {
            if (!$val) this.validateMsg = '';
        },
    },
    methods: {
        async savePw() {
            if (this.validate.length) {
                this.validateMsg = this.validate;
                return;
            }

            API_SET_PW({ curPw: this.passMdfy.curPass, newPw: this.passMdfy.newPass })
                .then((res) => {
                    if (!res?.data?.error_code) {
                        this.evt_bubbleOutClick();
                        this.$store.dispatch('NOTY_INFO', '비밀번호가 변경되었습니다.');
                    } else {
                        if (res.data.error_code == -3) {
                            this.validateMsg = '기존 비밀번호를 틀렸습니다.';
                            return false;
                        }
                    }
                })
                .catch((err) => {
                    this.evt_bubbleOutClick();
                    this.$store.dispatch('NOTY_ERR_CONFIRM', ['비밀번호 변경에 실패 했습니다.', [{ name: '확인' }]]);
                });
        },
        evt_curPassBlur: async function ($e) {
            if (this.passMdfy.curPass == '') this.validateMsg = '기존 비밀번호를 입력하지 않았습니다';
            else this.validateMsg = '';
        },
        evt_newPassBlur: function () {
            if (this.passMdfy.newPass.trim() != '' && this.passMdfy.newPassConfirm.trim() != '' && this.passMdfy.newPass.trim() != this.passMdfy.newPassConfirm.trim()) this.validateMsg = '새 비밀번호가 일치하지 않습니다';
            else this.validateMsg = '';
        },
        evt_bubbleOutClick: function () {
            if (this.passActive) this.passActive = false;
            this.passMdfy.curPass = '';
            this.passMdfy.newPass = '';
            this.passMdfy.newPassConfirm = '';
            this.validateMsg = '';
        },
        evt_docClick() {
            this.evt_bubbleOutClick();
        },
    },
};
</script>

<style></style>
