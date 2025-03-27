<template>
    <div id="wrap" class="appContainer" :class="[{ 'is-lnb': getUseageLNB }, { 'is-admin': getAdminMode }]">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <Function />
        <!-- <CompTesterFps v-if="getDevMode"></CompTesterFps> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getItemLocalStorage } from '@shared/utils/localStorage';
import { setPrimaryColor, setSecondaryColor, setTertiaryColor } from '@shared/utils/prototype/util.colors';
import Function from '@shared/layout/function';
import CompTesterFps from '@shared/ui/tester/fps.vue';

export default {
    name: 'App',
    components: {
        Function,
        CompTesterFps,
    },
    computed: {
        ...mapGetters(['getUseageLNB', 'getAdminMode', 'getDevMode']),
        getUseHeaderEnvSet() {
            return process.env.VUE_APP_USEAGE_HEADER_ENV_SET === 'true';
        },
    },
    created() {
        // 색상 적용
        if (this.getUseHeaderEnvSet) {
            const data = getItemLocalStorage('headerSetting');
            if (data) {
                Object.keys(data).forEach((key) => {
                    if (key !== 'useLNB') {
                        const color = data[key] ? data[key] : this.getColors(`--${key}`);
                        switch (key) {
                            case 'primary':
                                setPrimaryColor(color);
                                break;
                            case 'secondary':
                                setSecondaryColor(color);
                                break;
                            case 'tertiary':
                                setTertiaryColor(color);
                                break;
                        }
                    }
                });
            }
        }
    },
    methods: {
        getColors(propertyName) {
            return getComputedStyle(document.querySelector(':root')).getPropertyValue(propertyName);
        },
    },
};
</script>
