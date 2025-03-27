<template>
    <div id="content" class="ui-loader-container" :class="{ 'is-loading': loading }">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap is-hgt100">
            <div class="contents">
                <div class="wrap">
                    <div class="ui_row">
                        <div class="wrap">
                            <div class="ui_col">
                                <CompPopularityList ref="list" :savePersonalization.sync="savePersonalization" :editItem="editItem" @save="saveItem" @deleteKeyword="deleteItem" @edit="setEditItem" @setAsideOpen="asideClosed = false" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <aside v-control-aside-width="{ menu: 'admin_popularity', isClosed: asideClosed }" style="min-width: 390px; max-width: 800px">
            <div class="ui_row">
                <div class="wrap">
                    <div class="ui_col">
                        <CompAsidePopularity ref="aside" :editItem="editItem" :registedList="registedList" @edit="setEditItem" @save="saveItem" @delete="deleteItem" />
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

import CompPopularityList from './components/list';
import CompAsidePopularity from './components/aside';

import store from '@/store';
import { API_popularitylist, API_popularityManage } from '@/api/admin/popularity';

export default {
    name: 'page-admin-popularity',
    components: {
        CompPopularityList,
        CompAsidePopularity,
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
                            s_seq: true,
                            d_site_name: true,
                            use_yn: true,
                            logstd: true,
                            k_writer: true,
                            k_modifie: false,
                            reg_date: true,
                            modi_date: false,
                        },
                    },
                },
            },
            registedList: [],
            editItem: {},
            asideClosed: false, //aside open/close
        };
    },
    beforeRouteEnter(from, to, next) {
        store
            .dispatch('opts/ATTRS', { cmm_type: '8' })
            .then((res) => {
                let result = res.data?.result?.list || [];

                if (!Array.isArray(result)) {
                    result = [result];
                }

                if (result.getParseDatas({ code: 8 })[0]) store.commit('opts/SET_SEARCHTYPE', result.getParseDatas({ code: 8 })[0].children);

                next(() => {});
            })
            .catch(($err) => {
                store
                    .dispatch('DIALOG_ERR', ['기본 속성 정보를 로드하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '속성 로드 실패', 0])
                    .then(($val) => {
                        location.reload();
                    })
                    .catch(($err) => {
                        console.log('error');
                    });
            });
    },
    created() {
        // 개인화
        const personalization = getItemLocalStorage('personalization');
        this.savePersonalization = merge(this.savePersonalization, personalization?.admin_popularity);
    },
    mounted() {
        this.fetchRegistedList();
    },
    watch: {
        savePersonalization: {
            deep: true,
            handler(val) {
                const personalization = getItemLocalStorage('personalization');
                const savePersonalization = {
                    ...personalization,
                    admin_user: {
                        ...personalization?.admin_popularity,
                        main: {
                            ...personalization?.admin_popularity?.main,
                            ...val.main,
                        },
                    },
                };
                setItemLocalStorage('personalization', savePersonalization);
            },
        },
    },
    computed: {},
    methods: {
        /**
         *  인기도 지수 사이트 목록 fetch
         *  인기도 지수 등록 중복 검사용
         */
        async fetchRegistedList() {
            const param = {
                search_type: 3,
                search_keyword: '',
                order: 'reg_date asc',
                use_yn: 'Y,N',
                page_num: 1,
                row_limit: 99999,
            };
            await API_popularitylist(this.apiUID, param).then((res) => {
                const data = structuredClone(res.data);
                this.registedList = data?.result?.list || [];
            });
        },

        async saveItem(param, isEdit) {
            this.loading = true;

            await API_popularityManage(this.apiUID, param)
                .then((res) => {
                    const { code } = res.data.result;

                    if (code == 409) {
                        // 중복 저장
                        this.$store.dispatch('NOTY_ERR_CONFIRM', [`<strong>[${param.d_site_name}]</strong>의 인기도 지수는 이미 등록되었습니다.`, [{ name: '확인' }]]);
                    } else {
                        this.$store.dispatch('NOTY_COM', `인기도 지수 ${isEdit ? '수정' : '등록'}을 성공했습니다.`);

                        if (!isEdit) {
                            // 등록 시 인기도 지수 중복 검사용 목록 호출
                            this.fetchRegistedList();
                        } else {
                            const list = String(param.seq).split(',');
                            // editItem 수정 시 list/aside 반영
                            if (list.includes(String(this.editItem.seq))) {
                                const obj = {
                                    ...this.editItem,
                                    logstd: param?.logstd || this.editItem.logstd,
                                    use_yn: param.use_yn,
                                    active: param.use_yn === 'Y',
                                };
                                this.setEditItem(obj);
                            }
                        }

                        // trigget aside input reset
                        this.$refs.aside.resetInput();

                        // trigger list searching
                        this.$refs.list.searching();
                    }
                })
                .catch(() => {
                    this.$store.dispatch('NOTY_ERR', `인기도 지수 ${isEdit ? '수정' : '등록'}을 실패했습니다.`);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        async deleteItem(item) {
            const list = String(item.seq).split(',');

            const msg = `사이트 인기도 지수 <strong>${list.length}건</strong>을 삭제하시겠습니까?`;

            this.$store
                .dispatch('DIALOG_WRN', [msg, '사이트 인기도 지수 삭제', 2])
                .then(async () => {
                    this.loading = true;

                    const param = {
                        type: 'd',
                        seq: item.seq,
                    };

                    await API_popularityManage(this.apiUID, param)
                        .then(() => {
                            this.$store.dispatch('NOTY_COM', `인기도 지수 삭제를 성공했습니다.`);

                            if (list.includes(String(this.editItem.seq))) {
                                this.setEditItem({});
                            }

                            this.fetchRegistedList();

                            // trigger list searching
                            this.$refs.list.searching();
                        })
                        .catch(() => {
                            this.$store.dispatch('NOTY_ERR', `인기도 지수 삭제를 실패했습니다.`);
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
