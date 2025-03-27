<template>
    <div ref="controller" class="controller" :class="{ 'is-register': type === 'register', 'is-exception': type === 'exception' }" :disabled="disabled" @click.stop="evtClick">
        <button class="wrap">
            <span class="title">{{ type === 'register' ? '수집 등록' : '수집 제외' }}</span>
            <span class="amount"
                ><strong>{{ parseInt(amount).addComma() }}</strong
                >개</span
            >
            <span class="arrow_icon" :class="{ 'is-register': type === 'register', 'is-exception': type === 'exception' }"></span>
        </button>
        <comp-button class="is-small deselect_btn" title="선택 취소" @click="evtClickDeselect" :disabled="!amount"><span class="text">선택 취소</span></comp-button>
    </div>
</template>

<script>
export default {
    name: 'comp-controller',
    data() {
        return {};
    },
    props: {
        type: { type: String, required: true }, // register(수집등록), exception(수집제외)
        amount: { type: Number, required: true }, // 사이트 선택 개수
        activeGrpItem: { type: Object }, // 활성화 사이트 그룹
        disabled: {},
    },
    methods: {
        /**
         * 선택 취소 클릭
         */
        evtClickDeselect() {
            this.$emit('clickDeselect');
        },

        /**
         * 컨트롤러 클릭
         */
        evtClick(e) {
            if (this.disabled) return;
            if (this.type === 'register' && this.activeGrpItem.grp === 'all') this.$emit('openPopover');
            else this.$emit('clickController');
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped></style>
