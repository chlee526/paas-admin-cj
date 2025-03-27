<template>
    <div id="content">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap">
            <div class="contents">
                <div class="wrap">
                    <div class="ui_row">
                        <div class="wrap">
                            <div class="ui_col">
                                <List :searchTypeOpts="searchTypeOpts" :userGrpList="userGrpList"></List>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import List from './components/list';

import store from '@/store';
export default {
    name: 'page-admin-log',
    components: {
        List,
    },
    data() {
        return {
            searchTypeOpts: [],
            userGrpList: [],
        };
    },

    beforeRouteEnter(from, to, next) {
        store
            .dispatch('opts/ATTRS', { cmm_type: '6,9' })
            .then((res) => {
                const data = structuredClone(res.data?.result?.list);

                next((vm) => {
                    vm.searchTypeOpts = data.getParseDatas({ code: 9 })[0]?.children || [];
                    vm.userGrpList = data.getParseDatas({ code: 6 })[0]?.children || [];
                });
            })
            .catch(($err) => {
                store
                    .dispatch('DIALOG_ERR', ['제품 정보를 로드하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '속성 로드 실패', 0])
                    .then(($val) => {
                        location.reload();
                    })
                    .catch(($err) => {
                        console.log('error');
                    });
            });
    },
};
</script>
<style src="./style.scss" lang="scss" scoped />
