<template>
    <router-view />
</template>

<script>
export default {
    name: 'AppMain',
    data() {
        return {
            cachedViews: [],
        };
    },
    computed: {
        key() {
            return this.$route.path;
        },
    },
};
</script>
