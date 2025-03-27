<template>
    <div>
        <div class="util">
            <ul>
                <!-- 사용자 이름/비밀번호 변경 -->
                <li>
                    <!-- 비밀번호 변경 기능 사용 안함 -->
                    <span v-if="!getUsePassSet" class="user">
                        <span v-if="userDatas?.name.trim().length">
                            {{ userDatas.name }}
                        </span>
                        <span v-if="userDatas?.id.trim().length">({{ userDatas.id }})</span>
                    </span>
                    <CompHeaderUtilPassMdfy v-else></CompHeaderUtilPassMdfy>
                </li>
                <template v-if="!getUseageLNB">
                    <li>
                        <comp-button href="#" class="is-icon-only is-small" title="로그아웃" @click.prevent="evt_logout"><span class="icon">&#xe071;</span></comp-button>
                    </li>
                    <li v-if="getSystemUrl">
                        <comp-button href="#" class="is-icon-only is-small" title="시스템 바로가기(새창)" @click.prevent="evt_system"><span class="icon">&#xe070;</span></comp-button>
                    </li>
                    <li v-if="getUseNotice">
                        <comp-button class="is-small" title="공지사항" @click.prevent="evt_noticeClick"><span class="txt">공지사항</span></comp-button>
                    </li>
                </template>
                <template v-else>
                    <li>
                        <comp-button href="#" class="is-small" title="로그아웃" @click.prevent="evt_logout"><span class="txt">로그아웃</span></comp-button>
                    </li>
                    <li v-if="getSystemUrl">
                        <comp-button href="#" class="is-small" title="시스템 바로가기(새창)" @click.prevent="evt_system"><span class="txt">시스템</span></comp-button>
                    </li>
                    <li v-if="getUseNotice">
                        <comp-button class="is-small" title="공지사항" @click.prevent="evt_noticeClick"><span class="txt">공지사항</span></comp-button>
                    </li>
                </template>
                <!-- <li>
                    <comp-button href="#" class="is-small" title="세션종료" @click.prevent="evt_abLogout"><span class="txt">세션종료</span></comp-button>
                </li>
                <li>
                    <router-link to="/view/member/login" class="ui_btn is-small">
                        <span class="txt">로그인</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/view/member/pass" class="ui_btn is-small">
                        <span class="txt">첫 비밀번호</span>
                    </router-link>
                </li> -->
                <slot name="addUtils"></slot>
                <li v-if="getUseHeaderEnvSet"><CompHeaderEnvironmentSet /></li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CompHeaderUtilPassMdfy from './Pass_mdfy.vue';
import CompHeaderEnvironmentSet from './HeaderEnvironmentSet.vue';
// import { API_logout } from '@shared/api/member/login';

export default {
    name: 'comp-header-utils',
    components: {
        CompHeaderUtilPassMdfy,
        CompHeaderEnvironmentSet,
    },
    computed: {
        ...mapGetters(['getUseageLNB']),
        userDatas() {
            return this.$store.getters.getUser;
        },
        getUsePassSet() {
            return process.env.VUE_APP_USEAGE_PW_SET;
        },
        getSystemUrl() {
            return this.$store.state.user.system.url;
        },
        getUseNotice() {
            return process.env.VUE_APP_NOTICE === 'true';
        },
        getUseHeaderEnvSet() {
            return process.env.VUE_APP_USEAGE_HEADER_ENV_SET === 'true';
        },
    },
    methods: {
        evt_system() {
            this.$store.dispatch('user/SYSTEM');
        },

        async evt_logout() {
            await this.$store
                .dispatch('user/LOGOUT')
                .then((res) => {
                    this.$router.push({ path: '/view/member/login' }).catch(($err) => {});
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        evt_noticeClick() {
            this.$router.push({ path: '/view/notice' }).catch(($err) => {});
        },
    },
};
</script>
