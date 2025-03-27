<template>
    <div id="content">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap is-hgt100">
            <div class="contents">
                <div class="wrap">
                    <div class="site_mngr" :class="{ 'is-view-permission': !hasAdminPermission }" :style="getWrapStyle">
                        <AllSite :siteGrpList="siteGrpList" :isUpdateSite="isUpdateSite" :siteLangs="siteLangs" @updateSite="setUpdateSite" @updateLangs="getLangs" @updateActiveGrp="getActiveGrp"></AllSite>
                        <div class="bg"></div>
                        <CollectSite :activeSiteGrp="activeSiteGrp" :isUpdateSite="isUpdateSite" :siteLangs="siteLangs" @updateGrpList="getGrpList" @updateSite="setUpdateSite" @updateLangs="getLangs"></CollectSite>
                    </div>
                </div>
            </div>
            <div v-if="hasAdminPermission" class="footer">
                <p><span class="ui_icon"></span><strong>사이트 단일 선택</strong> : 클릭 <span style="padding-right: 10px" /><strong>사이트 멀티 선택</strong> : 드래그 / Ctrl + 클릭 / Shift + 클릭<span style="padding-right: 10px" /><strong>사이트그룹 수정 및 삭제</strong> : 그룹 더블 클릭</p>
            </div>
        </main>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import AllSite from './components/all_site';
import CollectSite from './components/collect_site';

export default {
    name: 'page-admin-common',
    data() {
        return {
            isUpdateSite: false,
            siteGrpList: null,
            activeSiteGrp: null,
            siteLangs: [],
        };
    },
    components: {
        AllSite,
        CollectSite,
    },
    computed: {
        ...mapGetters(['getUseageLNB', 'getUserPermissions']),

        // 등록/수정 권한
        hasAdminPermission() {
            return this.getUserPermissions >= 2;
        },

        getWrapStyle() {
            if (this.hasAdminPermission) {
                return `min-height: ${this.getUseageLNB ? 800 : 600}px ; max-height:  ${this.getUseageLNB ? 'calc(100vh - 74px)' : 'calc(100vh - 136px)'}`;
            } else {
                return `min-height: ${this.getUseageLNB ? 800 : 600}px ; max-height:  ${this.getUseageLNB ? 'calc(100vh - 40px)' : 'calc(100vh - 100px)'}`;
            }
        },
    },
    methods: {
        /**
         * 사이트 업데이트
         */
        setUpdateSite() {
            this.isUpdateSite = true;
            setTimeout(() => {
                this.isUpdateSite = false;
            }, 0);
        },

        /**
         * 사이트 언어 옵션 목록 머지
         */
        getLangs(val) {
            const opts = structuredClone(val);
            opts?.forEach((item) => {
                if (!this.siteLangs.find((item2) => item2.code === item.code)) this.siteLangs.push(item);
            });
        },

        /**
         * 사이트 그룹 목록
         */
        getGrpList(val) {
            this.siteGrpList = val;
        },

        /**
         * 활성화 사이트 그룹 업데이트
         * @param {String} val 활성화 사이트 그룹 grp코드
         */
        getActiveGrp(val) {
            this.activeSiteGrp = val;
            setTimeout(() => {
                this.activeSiteGrp = '';
            }, 0);
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
