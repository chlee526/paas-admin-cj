<template>
    <div ref="grpItem" class="group_item" :class="{ 'is-active': value.isActive }" @dblclick="evtDbClick" @click="evtClick">
        <div class="wrap">
            <span class="name">{{ value.name }}</span>
            <span class="amount">{{ parseInt(value.siteAmount).addComma() }}</span>
        </div>
        <comp-filter-grp ref="editGrpItem" class="edit_grp_item" useBtns :getNoIconWrapPos="grpItemPos" confirmLabel="저장" :disableConfirmBtn="disabledSaveBtn" @confirm="evtClickSaveBtn" v-on="getRemoveEvent">
            <template v-slot:custom> </template>
            <template v-slot:items>
                <dl>
                    <dt><strong>그룹명</strong></dt>
                    <dd><comp-input-box class="is-small" ref="inputBox" v-model="editName" placeholder="그룹명 입력" @click="evtClick" style="width: 170px"></comp-input-box></dd>
                </dl>
            </template>
        </comp-filter-grp>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'comp-group-item',
    data() {
        return {
            isActiveIndex: 0,
            editName: '',
            grpItemPos: {},
            disabledSaveBtn: false,
            clickTimeout: null,
        };
    },
    props: {
        value: {},
    },
    created() {
        this.editName = this.value.name;
    },
    computed: {
        ...mapGetters(['getUserPermissions']),

        // 등록/수정 권한
        hasAdminPermission() {
            return this.getUserPermissions >= 2;
        },

        getRemoveEvent() {
            return this.getUserPermissions >= 3 ? { remove: this.evtClickDeleteBtn } : {};
        },
    },
    watch: {
        editName(val) {
            if (val === this.value.name) this.disabledSaveBtn = true;
            else this.disabledSaveBtn = false;
        },
    },
    methods: {
        /**
         * 사이트 그룹 아이템 클릭 이벤트
         */
        evtClick(e) {
            if (this.clickTimeout) {
                // 이전 클릭 타임아웃이 존재하면 더블클릭로 간주하고 클릭 이벤트 실행 막기
                clearTimeout(this.clickTimeout);
                this.clickTimeout = null;
            } else {
                this.clickTimeout = setTimeout(() => {
                    // 클릭 이벤트 실행
                    this.$emit('click', this.value.grp);
                    this.clickTimeout = null;
                }, 200);
            }
        },

        /**
         * 사이트 그룹 아이템 더블클릭 이벤트 - 팝오버 오픈
         */
        evtDbClick(e) {
            if (!this.hasAdminPermission) {
                this.$emit('click', this.value.grp);
                return;
            }
            if (this.value.grp !== 'all') this.$refs.editGrpItem?.hndl_open();
            this.getItemsWrapPos();
        },

        /**
         * 사이트 그룹 아이템 팝오버 position 설정
         */
        getItemsWrapPos() {
            const targetPos = this.$refs.grpItem?.getBoundingClientRect();
            this.grpItemPos = { top: parseInt(targetPos.top) + 'px', left: parseInt(targetPos.left) + 'px', marginLeft: -(targetPos.width - 20) + 'px' };
        },

        /**
         * 사이트 그룹 아이템 팝오버 취소 버튼 클릭 이벤트
         */
        evtClickCancelBtn() {
            this.$refs.editGrpItem?.hndl_close();
        },

        /**
         * 사이트 그룹 아이템 수정 이벤트
         */
        evtClickSaveBtn() {
            let updated = structuredClone(this.value);
            updated.name = this.editName;
            this.$emit('confirm', updated);
        },

        /**
         * 사이트 그룹 아이템 삭제 이벤트
         */
        evtClickDeleteBtn() {
            this.$store
                .dispatch('DIALOG_WRN', [`사이트 그룹 <strong>${this.value.name}</strong>에 <strong>${this.value.siteAmount}</strong>개의 사이트가 등록되어 있습니다.<br/><span style="color: red">삭제할 경우 등록된 사이트도 같이 삭제 됩니다.</span><br/>삭제 하시겠습니까?`, '그룹 삭제', 2])
                .then((res) => {
                    this.$emit('remove', this.value);
                })
                .catch((err) => {});
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped />
