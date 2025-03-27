<template>
    <div class="wrap">
        <section ref="modal_item" class="ui_box popup_item popup_authMngr" :class="{ 'is-loading': loading }" :style="`height: ${hgt}px`">
            <span class="bg" @click="close" :style="'height:' + hgt + 'px'"></span>
            <div class="header" :style="getStyles">
                <div class="wrap">
                    <h2>
                        <!-- 타이틀 -->
                        <strong>사용자 권한 설정</strong>
                    </h2>
                    <button type="button" class="close" title="팝업 닫기" @click="close">팝업 닫기</button>
                </div>
            </div>
            <div class="wrap" :style="getStyles">
                <div class="content" :style="'max-height:' + (hgt - contentHgt) + 'px'">
                    <button class="ui_btn is-large" @click="clickAllAuth">
                        <span>전체 권한 허용</span>
                    </button>
                    <div class="wrap" :style="'max-height:' + (hgt - contentHgt - 90) + 'px'">
                        <div v-for="depth1 in permissionList" :key="depth1.code">
                            <div class="depth1">
                                <div class="item" :class="{ unselected: !isDepth1Selected(depth1) }">
                                    <strong>{{ depth1.name }}</strong>
                                    <div v-if="isHasChildren(depth1)" class="permission_box">
                                        <button v-for="{ code, name, title } in getPermissionOptions" :key="`permission_${code}`" class="ui_btn" :title="title" @click="changePermission(depth1, code, 1)">
                                            <span>{{ name }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="depth2">
                                <!-- children이 없을 때 -->
                                <div v-if="!isHasChildren(depth1)" class="item" :class="{ unselected: depth1.permissions === null }" :key="`depth2_${depth1.code}`">
                                    <strong>-</strong>
                                    <div class="permission_box">
                                        <button v-for="{ code, name, title } in getPermissionOptions" :key="`permission2_${code}`" class="ui_btn" :class="{ 'is-selected': depth1.permissions >= code }" :title="title" @click="changePermission(depth1, code)">
                                            <span>{{ name }}</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- children이 있을 때 -->
                                <div v-for="depth2 in depth1.children" class="item" :class="{ unselected: depth2.permissions === null }" :key="`depth2_${depth2.code}`">
                                    <strong>{{ depth2.name }}</strong>
                                    <div class="permission_box">
                                        <button v-for="{ code, name, title } in getPermissionOptions" :key="`permission2_${code}`" class="ui_btn" :class="{ 'is-selected': depth2.permissions >= code }" :title="title" @click="changePermission(depth2, code)">
                                            <span>{{ name }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <div class="btns">
                        <comp-button class="is-xlarge" @click="resetPermissions"><span>초기화</span></comp-button>
                        <comp-button class="is-xlarge is-color-black" @click="evt_save" :disabled="!isValidate"><span>저장</span></comp-button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import EventBus from '@shared/utils/eventBus';
import { mapGetters } from 'vuex';
import { isEqual } from 'lodash';

export default {
    name: 'tmpl-modal-auth-mngr',
    data() {
        return {
            loading: false,
            contentHgt: 300,
            permissionList: [],
        };
    },
    props: {
        popName: { type: String },
        searchParams: { type: Object },
        hgt: { type: Number },
    },
    computed: {
        ...mapGetters(['getRoutes']),
        getStyles() {
            return `width: 1000px`;
        },
        getUserAuth() {
            return this.searchParams.userAuths;
        },
        getDefaultPermissionList() {
            const userAuthMap = new Map(this.getUserAuth.map((item) => [item.code, item.permissions]));

            return this.getRoutes.map((item) => {
                const route = {
                    code: item.seq,
                    name: item.name,
                    permissions: userAuthMap.get(item.seq) || null,
                };

                if (item.children) {
                    route.children = item.children.map(({ seq: code, name }) => ({ code, name, permissions: userAuthMap.get(code) || null }));
                }

                return route;
            });
        },
        getPermissionOptions() {
            return [
                { code: 1, name: '1', title: '조회' },
                { code: 2, name: '2', title: '조회, 등록, 수정' },
                { code: 3, name: '3', title: '조회, 등록, 수정, 삭제' },
            ];
        },
        isValidate() {
            return !isEqual(this.getDefaultPermissionList, this.permissionList);
        },
    },
    created() {
        // 권한 초기 값 설정
        this.resetPermissions();
    },
    watch: {},
    methods: {
        /**
         * depth1의 자식에 권한이 없으면 false 반환
         */
        isDepth1Selected(item) {
            if (item.children) {
                return item.children.some((child) => child.permissions);
            } else {
                return item.permissions > 0;
            }
        },
        /**
         * children 유무 Boolean
         */
        isHasChildren(item) {
            return item.children;
        },

        resetPermissions() {
            this.permissionList = [...this.getDefaultPermissionList];
        },

        /**
         * 권한 변경 click Event
         *
         * @param {Object} item - 권한을 변경할 항목
         * @param {number} permissions - 설정할 권한 값
         * @param {number} [depth = 2] - 권한 변경 깊이 (1: depth1, 2: 하위 포함)
         * @returns {void}
         */
        changePermission(item, permissions, depth = 2) {
            let changedItem;

            if (depth !== 1 && item.permissions === permissions) {
                // 현재 항목의 기존 권한과 새 권한이 같은 경우 null로 초기화
                changedItem = this.setAllPermissions([item], null)[0];
            } else {
                changedItem = this.setAllPermissions([item], permissions)[0];
            }

            if (depth === 1) {
                // dept1 버튼에서 변경 시 depth1 permissions을 3으로 고정
                changedItem = { ...changedItem, permissions: 3 };
            }

            // permissionList 업데이트
            this.permissionList = this.updateAuthsList(this.permissionList, changedItem);
        },

        /**
         * 권한 목록 업데이트
         * 중첩된 배열 구조에서 특정 항목의 권한을 재귀적으로 업데이트
         *
         * @param {Array} originalList - 원본 권한 목록 배열(permissionList)
         * @param {Object} updatedItem - 업데이트할 항목
         * @returns {Array} 업데이트된 권한 목록 배열
         */
        updateAuthsList(originalList, updatedItem) {
            return originalList.map((item) => {
                // 코드가 일치하는 항목이면 업데이트된 항목으로 대체
                if (item.code === updatedItem.code) {
                    return updatedItem;
                }

                // 자식 항목이 있다면 재귀적으로 탐색
                if (item.children && item.children.length) {
                    const obj = {
                        ...item,
                        children: this.updateAuthsList(item.children, updatedItem),
                    };

                    // children에 permissions이 하나라도 있으면 3, 없으면 null
                    return {
                        ...obj,
                        permissions: this.isDepth1Selected(obj) ? 3 : null,
                    };
                }

                // 일치하는 항목 없으면 원본 그대로 반환
                return item;
            });
        },
        clickAllAuth() {
            this.permissionList = this.setAllPermissions(this.permissionList);
        },

        /**
         * 권한 일괄 설정
         * 중첩된 배열 구조의 모든 항목에 권한 설정
         *
         * @param {Array} array - 권한을 설정할 배열
         * @param {number|null} [permissions = 3] - 설정할 권한 값 (null일 경우 권한 초기화)
         * @returns {Array} 권한이 설정된 배열
         */
        setAllPermissions(array, permissions = 3) {
            return array.map((item) => {
                // 현재 항목에 새로운 권한 적용
                const obj = { ...item, permissions };

                // 자식 항목이 있다면 재귀적으로 권한 설정
                if (item.children && item.children.length) {
                    obj.children = this.setAllPermissions(obj.children, permissions);
                }

                return obj;
            });
        },
        evt_save() {
            if (!this.isValidate) return;

            function flattenArray(arr) {
                const result = [];

                // 배열 순회
                function traverse(items) {
                    for (const item of items) {
                        // 현재 아이템을 result에 추가
                        result.push({
                            code: item.code,
                            permissions: item.permissions,
                        });

                        // 자식 항목이 있다면 재귀적으로 처리
                        if (item.children && item.children.length) {
                            traverse(item.children);
                        }
                    }
                }

                traverse(arr);

                return result;
            }

            const menu_seq = flattenArray(this.permissionList).filter(({ permissions }) => permissions);

            EventBus.$emit('MODAL_CLOSE', this.popName, { menu_seq });
        },
        close: function () {
            EventBus.$emit('MODAL_CLOSE', this.popName);
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped></style>
