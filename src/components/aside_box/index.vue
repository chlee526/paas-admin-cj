<template>
    <div class="ui_box" :class="{ 'is-edit': edit }">
        <div class="header">
            <div class="wrap">
                <slot name="title"></slot>
                <div v-if="useFold" class="rc_wrap">
                    <button class="ui_btn is-icon-only" @click="isFold = !isFold">
                        <span class="icon" v-if="isFold">&#xe010;</span>
                        <span class="icon" v-else>&#xe009;</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="content" :class="{ 'is-fold': isFold }">
            <span v-if="useFold && isFold">확장해서 사용 가능</span>
            <slot name="content" v-else></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'comp-aside-box',
    data() {
        return {
            isFold: false,
        };
    },
    props: {
        edit: { type: Boolean, default: false },
        useFold: { type: Boolean, default: false }, //상하 접기 기능 활성화 여부
    },
    computed: {},

    methods: {},
};
</script>

<style lang="scss" src="./style.scss" scoped />
