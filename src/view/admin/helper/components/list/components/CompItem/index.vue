<template>
    <li :class="[itemClass, `is-${listItem.depth}dp`]">
        <div class="item-name-wrap">
            <div class="item-name" :class="{ 'is-open': isExpanded, 'is-selected': listItem.code === selectedItem?.code }">
                <button class="is-expand-btn" :class="{ 'is-open': isExpanded }" @click.stop="$emit('expandClick', listItem)">
                    <span v-if="listItem.children?.length" class="icon-angle-right"></span>
                </button>
                <div class="bg-wrap">
                    <div class="bg" :title="listItem.subject" @click.stop="handleSelectItem(listItem)" @mouseover="evtMouseEnter(listItem)" @mouseout="evtMouseLeave(listItem)"></div>

                    <span @click.stop="handleSelectItem(listItem)">{{ listItem.subject }}</span>

                    <div v-if="hasAdminPermission" class="rc-wrap" @mouseover="evtMouseEnter(listItem)" @mouseout="evtMouseLeave(listItem)">
                        <div :ref="`itemEditWrap_${listItem.code}`" class="itemEditWrap">
                            <comp-filter-grp v-if="listItem.depth < 3" ref="addItemGrp" pos="R" :disableConfirmBtn="!itemInput.trim().length" @confirm="handleAddItem(listItem, itemInput)" @open="openAddItemGrp(listItem)" @close="closeAddItemGrp(listItem)">
                                <template v-slot:custom>
                                    <comp-button class="is-add-btn is-icon-only is-xsmall"><span class="icon">&#xe017;</span></comp-button>
                                </template>
                                <template v-slot:items>
                                    <dl>
                                        <dt><strong>제목</strong></dt>
                                        <dd><comp-input-box id="helper_add_subject" ref="addItemInput" class="is-small" v-model="itemInput" placeholder="제목 입력" @enter="evtInputEnter(listItem)"></comp-input-box></dd>
                                    </dl>
                                </template>
                            </comp-filter-grp>

                            <!-- 아이템 삭제 -->
                            <comp-button v-if="canDelete" class="is-delete-btn is-icon-only is-xsmall" @click="evtDeleteClick(listItem)"><span class="icon">&#xe022;</span></comp-button>
                        </div>

                        <comp-switch-btn :id="`helper_use_switch_${listItem.code}`" class="is-xxsmall" :value="listItem.use_yn === 'Y' ? true : false" @click.stop="handleUseYN(listItem)" />
                    </div>
                </div>
            </div>
        </div>

        <div v-if="shouldShowChildren" class="children-list">
            <ul v-if="hasAdminPermission" :class="`help-sort-list-${this.listItem.p_code}`" @listUpdate="evtSortableUpdate" v-sortable="hasAdminPermission ? sortableOptions : null">
                <comp-item v-for="(child, index) in listItem.children" :key="child.code" v-bind="getChildProps(child, index)" @expandClick="$emit('expandClick', $event)" />
            </ul>

            <ul v-else :class="`help-sort-list-${this.listItem.p_code}`" @listUpdate="evtSortableUpdate">
                <comp-item v-for="(child, index) in listItem.children" :key="child.code" v-bind="getChildProps(child, index)" @expandClick="$emit('expandClick', $event)" />
            </ul>
        </div>
    </li>
</template>

<script>
import { uuid } from 'vue-uuid';
import { mapGetters } from 'vuex';

export default {
    name: 'comp-item',
    components: {},
    data() {
        return {
            apiUID: uuid.v4(),
            isUse: this.listItem.use_yn === 'Y' ? true : false,
            itemInput: '',
        };
    },
    props: {
        listItem: { type: Object, required: true },
        itemClass: { type: String, default: '' },
        dataList: { type: Array, default: null },
        expandList: { type: Array },
        selectedItem: { type: Object, required: true },

        handleSelectItem: {
            type: Function,
            default: () => {},
        },
        handleAddItem: {
            type: Function,
            default: () => {},
        },
        evtSortableUpdate: {
            type: Function,
            default: () => {},
        },
        handleUseYN: {
            type: Function,
            default: () => {},
        },
        handleDeleteItem: {
            type: Function,
            default: () => {},
        },
    },
    computed: {
        ...mapGetters(['getUserPermissions']),

        isExpanded() {
            return this.expandList.includes(this.listItem.code);
        },

        shouldShowChildren() {
            return this.listItem.children?.length > 0 && this.isExpanded;
        },

        hasAdminPermission() {
            return this.getUserPermissions >= 2;
        },

        canDelete() {
            return this.getUserPermissions >= 3 && this.listItem.menu_code === 0;
        },

        sortableOptions() {
            return {
                data: this.listItem.children,
                wrapClass: `help-sort-list-${this.listItem.p_code}`,
                itemClass: `help-sort-item-${this.listItem.p_code}`,
            };
        },
    },

    methods: {
        /**
         * 자식 컴포넌트의 props 생성
         * @param {Object} child - 자식 아이템 데이터
         * @param {number} index - 자식 아이템 인덱스
         * @returns {Object} 자식 컴포넌트 props
         */
        getChildProps(child, index) {
            return {
                listItem: child,
                itemClass: this.hasAdminPermission ? `help-sort-item-${this.listItem.p_code}` : '',
                'data-index': this.hasAdminPermission ? index : undefined,
                'data-drag-group': this.hasAdminPermission ? `help-sort-group-${this.listItem.p_code}` : undefined,
                dataList: this.dataList,
                selectedItem: this.selectedItem,
                expandList: this.expandList,
                handleSelectItem: this.handleSelectItem,
                handleAddItem: this.handleAddItem,
                handleDeleteItem: this.handleDeleteItem,
                handleUseYN: this.handleUseYN,
                evtSortableUpdate: this.evtSortableUpdate,
            };
        },

        /**
         * 아이템 추가/삭제 버튼 토글 클래스
         * @param {Object} target - 대상 아이템
         * @param {string} className - 토글할 클래스명
         * @param {boolean} [add=true] - 추가 여부
         */
        toggleClass(target, className, add = true) {
            const editWrap = this.$refs[`itemEditWrap_${target.code}`];
            if (editWrap) {
                editWrap.classList[add ? 'add' : 'remove'](className);
            }
        },

        /**
         * 마우스 진입 이벤트
         */
        evtMouseEnter(target) {
            this.toggleClass(target, 'is-show');
        },

        /**
         * 마우스 이탈 이벤트 처리
         */
        evtMouseLeave(target) {
            const editWrap = this.$refs[`itemEditWrap_${target.code}`];
            if (editWrap && !editWrap.classList.contains('is-modal-open')) {
                this.toggleClass(target, 'is-show', false);
            }
        },

        /**
         * 인풋박스 엔터 이벤트
         */
        evtInputEnter(target) {
            this.handleAddItem(target, this.itemInput);
            this.$refs.addItemGrp?.hndl_close();
        },

        /**
         * 삭제 버튼 클릭 이벤트
         */
        evtDeleteClick(target) {
            this.$store.dispatch('DIALOG_WRN', [`삭제시 하위 아이템 변경이 있을 수 있습니다.`, '삭제하시겠습니까?', 1]).then(() => {
                this.handleDeleteItem(target);
            });
        },

        openAddItemGrp(target) {
            this.toggleClass(target, 'is-modal-open');
            this.$nextTick(() => {
                this.$refs.addItemInput?.$refs.input?.focus();
            });
        },

        closeAddItemGrp(target) {
            this.itemInput = '';
            this.toggleClass(target, 'is-modal-open', false);
            this.toggleClass(target, 'is-show', false);
        },
    },
};
</script>

<style lang="scss" src="../../style.scss" scoped />
