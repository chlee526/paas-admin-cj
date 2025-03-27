<template>
    <div class="top_searchs admin" ref="wrap">
        <div class="wrap">
            <div class="inner_wrap" ref="inner_wrap">
                <!-- 검색 조건 -->
                <div class="searchs" ref="searchs">
                    <div class="input_form" ref="input_form">
                        <table class="wrap" ref="input_form_wrap">
                            <slot name="input_forms"></slot>
                        </table>
                    </div>
                    <div class="btns">
                        <comp-button class="is-icon-only is-large" title="검색 조건 초기화" @click="reset"><span class="icon">&#xe020;</span></comp-button>
                        <comp-button class="btn_search is-icon-with is-before is-large is-color-black" title="검색" @click="searching" :disabled="searchInputDatas.searchDisabled"><span class="icon">&#xe007;</span><span class="txt">검색</span></comp-button>
                    </div>
                </div>
                <!-- // 검색 조건 -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'comp-topsearch-admin',
    data() {
        return {
            defaultSearchDatas: null,
            tweening: false,
            searchDisabled: false,
        };
    },
    props: {
        notyDisabled: { type: Boolean, default: false }, // true 일 경우 페이지 내 검색중 noty 화면 비활성화처리
        searchInputDatas: {},
        searchDatas: {},
    },
    mounted() {
        this.defaultSearchDatas = JSON.parse(JSON.stringify(this.searchInputDatas));
        this.searching();
    },
    methods: {
        searching() {
            this.$emit('update:searchDatas', JSON.parse(JSON.stringify(this.searchInputDatas)));

            // 전체 로딩 시작
            // if (this.notyDisabled == false) this.$store.dispatch('opts/LOAD_START');
        },
        reset() {
            this.$emit('update:searchInputDatas', JSON.parse(JSON.stringify(this.defaultSearchDatas)));
        },
    },
};
</script>
<style lang="scss" src="./style.scss" scoped></style>
