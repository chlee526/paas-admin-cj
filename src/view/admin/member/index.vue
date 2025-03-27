<template>
    <div id="content" class="ui-loader-container" :class="{ 'is-loading': loading }">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap is-hgt100">
            <div class="contents">
                <div class="wrap">
                    <div class="ui_row">
                        <div class="wrap">
                            <div class="ui_col">
                                <CompMemberList :savePersonalization.sync="savePersonalization" :dataList="dataList" :userGrpList="userGrpList" :deptList="getDeptList" :editItem="editItem" @delete="deleteMember" @edit="setEditItem" @setAsideOpen="asideClosed = false" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <aside v-control-aside-width="{ menu: 'admin_user', isClosed: asideClosed }" style="min-width: 390px; max-width: 800px">
            <div class="ui_row">
                <div class="wrap">
                    <div class="ui_col">
                        <CompAsideMember :userGrpList="getUserGrpList" :deptList="getDeptList" :rankList="getRankList" :editItem="editItem" @edit="setEditItem" @delete="deleteMember" @fetchUserGrp="fetchUserGrp" @fetchDatas="fetchDatas" />
                    </div>
                </div>
            </div>
        </aside>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import { getItemLocalStorage, setItemLocalStorage } from '@shared/utils/localStorage';
import merge from 'lodash/merge';

import CompMemberList from './components/member_list';
import CompAsideMember from './components/aside_member';

import { API_memberlist, API_membermanage } from '@/api/admin/member';
export default {
    name: 'page-admin-user',
    components: {
        CompMemberList,
        CompAsideMember,
    },
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            savePersonalization: {
                main: {
                    data_list: {
                        // 항목설정
                        colOpts: {
                            user_grp: true,
                            id: true,
                            name: true,
                            dept: true,
                            mobile: true,
                            email: true,
                            reg_date: true,
                        },
                    },
                },
            },
            dataList: [],
            userGrpList: [],
            editItem: {},
            asideClosed: false, //aside open/close
        };
    },
    created() {
        // 개인화
        const personalization = getItemLocalStorage('personalization');
        this.savePersonalization = merge(this.savePersonalization, personalization?.admin_user);
    },
    mounted() {
        this.fetchDatas();
    },
    watch: {
        savePersonalization: {
            deep: true,
            handler(val) {
                const personalization = getItemLocalStorage('personalization');
                const savePersonalization = {
                    ...personalization,
                    admin_user: {
                        ...personalization?.admin_user,
                        main: {
                            ...personalization?.admin_user?.main,
                            ...val.main,
                        },
                    },
                };
                setItemLocalStorage('personalization', savePersonalization);
            },
        },
    },
    computed: {
        /**
         * 사용자 그룹 목록에 소속 사용자 인원(cnt) 추가
         * @return {Array} [{ code: 그룹 코드, name: 그룹 이름, cnt: 그룹별 사용자 수 }]
         */
        getUserGrpList() {
            return this.userGrpList.map((item) => {
                const obj = structuredClone(item);
                obj.cnt = this.dataList.getParseDatas({ user_grp: item.code }).length;
                return obj;
            });
        },

        /**
         * 부서 목록
         */
        getDeptList() {
            const result = [];
            this.dataList.forEach((item) => {
                if (item?.dept) {
                    result.addItem({ code: item.dept, name: item.dept });
                } else if (item?.dept === null) {
                    result.addItem({ code: 'null', name: '부서없음' });
                }
            });
            return result;
        },

        /**
         * 직급 목록
         */
        getRankList() {
            const result = [];
            this.dataList.forEach((item) => {
                if (item?.rank) {
                    result.addItem({ code: item.rank, name: item.rank });
                }
            });
            return result;
        },
    },
    methods: {
        /**
         *  사용자 목록 fetch
         */
        async fetchDatas() {
            this.loading = true;
            await API_memberlist(this.apiUID)
                .then((res) => {
                    const data = structuredClone(res.data);
                    this.dataList = data?.result?.list || [];
                })
                .then(() => {
                    this.fetchUserGrp();
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * 사용자 그룹 fetch
         */
        async fetchUserGrp() {
            await this.$store
                .dispatch('opts/ATTRS', { cmm_type: '6' })
                .then((res) => {
                    const data = structuredClone(res.data);
                    /**
                     * 2024-01-04
                     * 임시 제거
                     */
                    this.userGrpList = data?.result?.list[0]?.children || [];
                    // this.userGrpList = data?.result?.list[0]?.children?.flatten() || [];
                })
                .catch(() => {
                    this.$store
                        .dispatch('DIALOG_ERR', ['데이터를 로드하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '로드 실패', 0])
                        .then(() => {
                            location.reload();
                        })
                        .catch(() => {
                            console.log('error');
                        });
                });
        },

        async deleteMember(item) {
            const msg = `<strong>[${item.name}]</strong> 사용자를 삭제하시겠습니까?`;

            this.$store
                .dispatch('DIALOG_WRN', [msg, '사용자 삭제', 2])
                .then(async () => {
                    this.loading = true;

                    const param = {
                        type: 'd',
                        seq: item.seq,
                    };

                    await API_membermanage(this.apiUID, param)
                        .then(() => {
                            this.$store.dispatch('NOTY_COM', `사용자 삭제를 성공했습니다.`);
                            this.fetchDatas();
                        })
                        .catch(() => {
                            this.$store.dispatch('NOTY_ERR', `사용자 삭제를 실패했습니다.`);
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                })
                .catch(() => {});
        },

        /**
         * @param {Object} item
         */
        setEditItem(item) {
            this.editItem = structuredClone(item);
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
