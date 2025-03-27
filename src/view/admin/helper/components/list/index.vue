<template>
    <div class="ui_box">
        <div class="wrap" :class="{ 'is-view-permission': !hasAdminPermission, 'is-lnb': getUseageLNB }">
            <!-- 도움말 목록 영역 -->
            <ul v-if="hasAdminPermission" class="help-sort-list" @listUpdate="evtSortableUpdate" v-sortable="hasAdminPermission ? sortableOptions : null">
                <CompItem v-for="(helper, index) in useHelperList" :key="helper.seq" v-bind="getItemProps(helper, index)" @expandClick="evtExpandBtnClick" />
            </ul>

            <ul v-else class="help-sort-list" @listUpdate="evtSortableUpdate">
                <CompItem v-for="(helper, index) in useHelperList" :key="helper.seq" v-bind="getItemProps(helper, index)" @expandClick="evtExpandBtnClick" />
            </ul>

            <!-- 도움말 추가 -->
            <div class="footer" v-if="hasAdminPermission">
                <comp-filter-grp ref="addRootItemGrp" :getNoIconWrapPos="getPopoverPosition" :disableConfirmBtn="!addRootItemInput.trim().length" @confirm="handleAddItem" @open="openAddRootItemGrp" @close="addRootItemInput = ''">
                    <template v-slot:custom>
                        <comp-button><span class="txt">도움말 추가</span></comp-button>
                    </template>
                    <template v-slot:items>
                        <dl>
                            <dt><strong>제목</strong></dt>
                            <dd><comp-input-box ref="addRootItemInput" class="is-small" v-model="addRootItemInput" placeholder="제목 입력" @enter="evtInputEnter"></comp-input-box></dd>
                        </dl>
                    </template>
                </comp-filter-grp>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';
import { API_helperCUD } from '@shared/api/helper';

import CompItem from './components/CompItem';
export default {
    name: 'comp-helper-list',
    data() {
        return {
            apiUID: uuid.v4(),
            useHelperList: [],
            expandList: [],
            addRootItemInput: '',
            itemInputs: {},
            isMount: false,
        };
    },
    components: {
        CompItem,
    },
    props: {
        dataList: { type: Array, required: true },
        selectedItem: { type: Object, required: true },
        isEditMode: { type: Boolean },
    },
    computed: {
        ...mapGetters(['getUseageLNB', 'getUserPermissions']),

        hasAdminPermission() {
            return this.getUserPermissions >= 2;
        },

        sortableOptions() {
            return {
                data: this.useHelperList,
                wrapClass: 'help-sort-list',
                itemClass: 'help-sort-item',
            };
        },

        getPopoverPosition() {
            return {
                bottom: '40px',
                left: '534px',
                marginLeft: '-53px',
            };
        },
    },
    created() {},
    mounted() {
        this.isMount = true;
    },
    watch: {
        dataList: {
            immediate: true,
            deep: true,
            handler(val) {
                if (val && val.length > 0) {
                    this.useHelperList = this.parsingList([...val]);

                    // 마운트시 첫번째 아이템 선택 처리
                    if (this.isMount || !Object.keys(this.selectedItem).length) {
                        this.expandList = [...new Set([...this.expandList, ...this.getFirstChildCodes(this.useHelperList[0])])];
                        this.$emit('update:selectedItem', this.findDeepestItem(this.useHelperList[0]));
                        this.isMount = false;
                    }
                }
            },
        },
    },

    methods: {
        /**
         * 도움말 아이템 props를 생성
         * @param {Object} helper - 도움말 항목
         * @param {Number} index - 항목 인덱스
         * @returns {Object} 컴포넌트 props
         */
        getItemProps(helper, index) {
            return {
                listItem: helper,
                itemClass: this.hasAdminPermission ? 'help-sort-item' : '',
                'data-index': this.hasAdminPermission ? index : undefined,
                'data-drag-group': this.hasAdminPermission ? 'help-sort-group' : undefined,
                dataList: this.useHelperList,
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
         * CUD API 요청 처리 핸들러
         * @param {String} uid - 요청 고유 ID
         * @param {Object} params - API 파라미터
         * @param {Object} options - 추가 옵션
         * @returns {Promise}
         */
        async apiCUDRequest(uid, params, options = {}) {
            try {
                const response = await API_helperCUD(uid, params);
                this.$emit('updateDataList');
                if (options.successMessage) this.$store.dispatch('NOTY_COM', options.successMessage);
                return response;
            } catch (error) {
                if (options.errorMessage) this.$store.dispatch('NOTY_ERR', options.errorMessage);
                throw error;
            }
        },

        /**
         * 도움말 사용 여부 토글
         * @param {Object} target - 대상 도움말
         */
        async handleUseYN(target) {
            const { seq, menu_code, p_code, subject, content, order, use_yn } = target;
            const params = {
                type: 'u',
                use_yn: use_yn === 'Y' ? 'N' : 'Y',
                seq,
                menu_code,
                p_code,
                subject,
                content,
                order,
            };

            await this.apiCUDRequest(this.apiUID, params, {
                successMessage: '도움말 수정을 성공했습니다.',
                errorMessage: '도움말 수정을 실패했습니다.',
            });
        },

        /**
         * 도움말 추가 핸들러
         * @param {Object} target - 상위 도움말 (없으면 루트 항목)
         * @param {String} childInput - 자식 항목 제목
         */
        async handleAddItem(target, childInput) {
            const isChildItem = target && Object.keys(target).length > 0;
            const params = {
                type: 'i',
                order: 0,
                subject: isChildItem ? childInput : this.addRootItemInput,
                p_code: isChildItem ? target.code : 0,
            };

            await this.apiCUDRequest(this.apiUID, params, {
                successMessage: '도움말 추가를 성공했습니다.',
                errorMessage: '도움말 추가를 실패했습니다.',
            });

            if (isChildItem) {
                this.evtExpandBtnClick(target, true);
            }
        },

        /**
         * 도움말 삭제 핸들러
         * @param {Object} target - 삭제할 도움말
         */
        async handleDeleteItem(target) {
            const params = {
                type: 'd',
                seq: target?.seq,
            };

            await this.apiCUDRequest(this.apiUID, params, {
                successMessage: '도움말 삭제를 성공했습니다.',
                errorMessage: '도움말 삭제를 실패했습니다.',
            });

            if (target.code === this.selectedItem?.code) {
                this.$emit('update:selectedItem', {});
            }
        },

        /**
         * 도움말 정렬 업데이트(sortable)
         * @param {Object} val - sortable 디렉토리 이벤트 반환값
         */
        async evtSortableUpdate(val) {
            const updatedData = structuredClone(val.detail.data);

            const updateUid = uuid.v4();
            const promises = updatedData.map(async (item, idx) => {
                const { seq, menu_code, p_code, subject, content, use_yn } = item;
                let params = { type: 'u', order: idx, seq, menu_code, p_code, subject, content, use_yn };

                return await API_helperCUD(updateUid + '_' + idx, params)
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            });

            let successList = [];
            let failList = [];
            await Promise.allSettled(promises)
                .then((res) => {
                    res.forEach((item) => {
                        if (item.status === 'fulfilled' && item.value?.data.result.code === 200) successList.push(item);
                        if (item.status !== 'fulfilled' || !item.value) failList.push(item);
                    });
                })
                .finally(() => {
                    if (failList.length > 0) {
                        this.$store.dispatch('DIALOG_ERR', [`데이터 정렬을 실패 했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.`, `데이터 정렬`, 0]).then(() => {
                            location.reload();
                        });
                    } else {
                        this.$emit('updateDataList');
                    }
                });
        },

        /**
         * 도움말 목록 파싱 & 정렬
         * @param {Array} list - 원본 도움말 목록
         * @returns {Array}
         */
        parsingList(list) {
            const process = (list, depth = 1) => {
                let resultList = [];

                resultList = list.map((item) => {
                    const newItem = { ...item };
                    newItem.depth = depth;

                    if (newItem.children && newItem.children.length > 0) {
                        newItem.children = process(newItem.children, newItem.depth + 1);
                    }

                    return newItem;
                });

                // order 기준으로 오름차순 정렬
                return resultList.sort((a, b) => (a.order || 0) - (b.order || 0));
            };
            const result = process(list);
            return result;
        },

        /**
         * 아이템과 그 첫번째 자식들의 모든 code 값을 수집
         * @param {Object} item - 검사할 상위 아이템
         * @param {Array} [item.children] - 자식 아이템 목록
         * @param {number} item.code - 아이템의 고유 코드
         * @returns {Array<number>} 수집된 code 값들의 배열
         */
        getFirstChildCodes(item) {
            let codes = [];

            if (item.children?.length > 0) {
                codes.push(item.code);

                // 첫 번째 하위 아이템 확인
                const firstChild = item.children[0];
                if (firstChild?.children?.length > 0) {
                    codes = [...codes, ...this.getFirstChildCodes(firstChild)];
                }
            }

            return codes;
        },

        /**
         * 아이템 선택 핸들러
         * @param {Object} target - 대상 도움말
         */
        handleSelectItem(target) {
            if (this.isEditMode) {
                if (this.selectedItem.code !== target.code) {
                    this.$store.dispatch('DIALOG_WRN', [`변경사항이 저장되지 않을 수 있습니다.`, '', 1]).then(() => {
                        this.$emit('update:selectedItem', structuredClone(target));
                    });
                }
            } else {
                this.$emit('update:selectedItem', structuredClone(target));
            }
        },

        /**
         * 아이템의 확장/축소 상태 토글
         * @param {Object} target - 토글할 대상 아이템
         * @param {boolean} [isOpen] - 강제 오픈 여부
         */
        evtExpandBtnClick(target, isOpen) {
            if (!target) return;

            /**
             * 아이템의 모든 하위 아이템의 code 수집
             * @param {Object} item - 상위 아이템
             * @param {Array} [item.children] - 하위 아이템 목록
             * @returns {Array<number>} 하위 아이템들의 code 배열
             */
            const getAllChildCodes = (item) => {
                let codes = [];

                if (item.children?.length > 0) {
                    item.children.forEach((child) => {
                        if (child.children?.length > 0) {
                            codes.push(child.code);
                            codes = [...codes, ...getAllChildCodes(child)];
                        }
                    });
                }

                return codes;
            };

            /**
             * expandList를 업데이트하여 아이템의 확장 상태를 토글
             * @param {Object} targetItem - 토글할 아이템
             * @param {boolean} [forceOpen] - 강제 오픈 여부
             */
            const updateExpandList = (targetItem, isOpen) => {
                if (this.expandList.includes(targetItem.code) && !isOpen) {
                    const codesToRemove = [targetItem.code, ...getAllChildCodes(targetItem)];
                    // 이미 확장된 상태라면 모든 관련 seq 제거
                    this.expandList = this.expandList.filter((code) => !codesToRemove.includes(code));
                } else {
                    // 클릭한 아이템의 seq 만 expandList 에 추가
                    this.expandList = [...new Set([...this.expandList, targetItem.code])];
                }

                // 아이템 추가 시 목록 갱신을 위한 처리
                if (isOpen) {
                    // 잠시 닫았다가 다시 열어서 목록 갱신
                    setTimeout(() => {
                        this.expandList = [...new Set([...this.expandList, targetItem.code])];
                    }, 30);
                }
            };

            updateExpandList(target, isOpen);
        },

        /**
         * 아이템의 가장 깊은 첫번째 하위 아이템 찾는 함수 (마운트시 첫번째 아이템 선택되게 하기 위한)
         * @param {Object} item - 검색을 시작할 상위 아이템
         * @param {Array} [item.children] - 하위 아이템 목록
         * @returns {Object} 가장 깊은 레벨의 하위 아이템
         */
        findDeepestItem(item) {
            if (item?.children && item?.children.length > 0) {
                const firstChild = item.children[0];
                return this.findDeepestItem(firstChild);
            }
            return item;
        },

        openAddRootItemGrp() {
            this.$nextTick(() => {
                if (this.$refs.addRootItemInput) this.$refs.addRootItemInput.$refs.input.focus();
            });
        },

        evtInputEnter() {
            this.handleAddItem();
            if (this.$refs.addRootItemGrp) this.$refs.addRootItemGrp.hndl_close();
        },
    },
};
</script>

<style lang="scss" src="./style.scss" scoped />
