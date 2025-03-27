<template>
    <div class="site_item" :class="{ is_all_site: !value.gr_name }">
        <div class="seq">
            <span>{{ value.s_seq }}</span>
        </div>
        <div v-if="value.gr_name" class="grp_name">
            <span>{{ value.gr_name }}</span>
        </div>
        <div class="site_name" :class="{ include_grp_name: value.gr_name }">
            <span>{{ value.name }}</span>
        </div>
        <div class="url" :class="{ include_grp_name: value.gr_name }">
            <span class="status" :class="{ is_use: value.status == 1, is_not_use: value.status == 0 }"></span>
            <span>{{ value.url }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'comp-site-item',
    props: {
        value: {},
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
