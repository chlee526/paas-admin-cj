<template>
    <AsideBox>
        <template slot="title">
            <h3>사용자 그룹</h3>
            <div class="rc">
                <CompItemAddMdfy id="category_add" type="add" @itemAdd="addItem" />
            </div>
        </template>
        <template slot="content">
            <div class="category ui-loader-container" :class="{ 'is-loading': loading }">
                <comp-list class="list list_wrap">
                    <template v-if="getUserPermissions === 3" v-slot:default>
                        <CompItemAddMdfy v-for="item in item" :key="item.seq" :id="`category_mdfy_${item.code}`" class="is-draggable" :class="`item_lv_${item.use_level}`" type="mdfy" :item="item" @itemMdfy="editItem" @itemRemove="deleteItem" @itemAdd="addItem2nd"></CompItemAddMdfy>
                    </template>
                    <template v-else v-slot:default>
                        <CompItemAddMdfy v-for="item in item" :key="item.seq" :id="`category_mdfy_${item.code}`" class="is-draggable" :class="`item_lv_${item.use_level}`" type="mdfy" :item="item" @itemMdfy="editItem" @itemAdd="addItem2nd"></CompItemAddMdfy>
                    </template>
                </comp-list>
            </div>
        </template>
    </AsideBox>
</template>

<script>
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';

import CompCategory from '@/components/category';
import CompItemAddMdfy from '@/components/category/components/itemAddMdfy';
import AsideBox from '@/components/aside_box';
import { API_category } from '@/api/admin/common';

export default {
    name: 'comp-group_manage',
    extends: CompCategory,
    components: {
        AsideBox,
    },
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            inputName: '',
        };
    },
    props: {
        item: { type: Array, required: true },
    },
    computed: {
        ...mapGetters(['getUserPermissions']),
    },
    methods: {
        /**
         * 사용자 그룹 추가
         * 추가 완료 후 사용자 그룹 fetch trigger
         * cmm_type 추가, 동작 완료 후 fetchUserGrp하기 위해 category override
         * @param {Object} item
         */
        async addItem(item, code) {
            if (!item.name.trim().length) return;

            this.loading = true;

            const param = {
                type: 'i',
                level: 2,
                cmm_type: 6,
                name: item.name,
                order: 0,
            };

            if (code) param.code = code;

            await API_category(this.apiUID, param)
                .then(() => {
                    this.$store.dispatch('NOTY_COM', `그룹 추가를 성공했습니다.`);
                })
                .catch(() => {
                    this.$store.dispatch('NOTY_ERR', `그룹 추가를 실패했습니다.`);
                })
                .finally(() => {
                    this.loading = false;
                    this.$emit('fetchUserGrp');
                });
        },

        /**
         * 하위 사용자 그룹 추가
         * code 추가 위해 category override
         * @param {Object} item
         */
        addItem2nd(item) {
            this.addItem(item, item.code);
        },

        /**
         * 사용자 그룹명 수정
         * 수정 완료 후 사용자 그룹 fetch trigger
         * 동작 완료 후 fetchUserGrp하기 위해 category override
         * @param {Object} item
         */
        async editItem(item) {
            if (!item.name.trim()) return;

            this.loading = true;

            const param = {
                type: 'u',
                level: 2,
                seq: item.seq,
                name: item.name,
                color: item.color || '',
            };

            await API_category(this.apiUID, param)
                .then(() => {
                    this.$store.dispatch('NOTY_COM', `그룹 수정을 성공했습니다.`);
                })
                .catch(() => {
                    this.$store.dispatch('NOTY_ERR', `그룹 수정을 실패했습니다.`);
                })
                .finally(() => {
                    this.loading = false;
                    this.$emit('fetchUserGrp');
                });
        },

        /**
         * 사용자 그룹 삭제
         * 컨펌이후 삭제/취소 클릭시 동작 X
         * 삭제 완료 후 사용자 그룹 fetch trigger
         * 다이얼로그 멘트 변경 및 동작 완료 후 fetchUserGrp하기 위해 category override
         * @param {Object} item
         */
        deleteItem(item) {
            const msg = item?.cnt
                ? `사용자 그룹 <strong>[${item.name}]</strong>에 <strong>${item?.cnt}명</strong>의 사용자가 있습니다.<br>
            <span style="color:red">삭제할 경우 사용자도 함께 삭제 됩니다.</span><br>
            삭제하시겠습니까?`
                : `사용자 그룹 <strong>[${item.name}]</strong>을/를 삭제하시겠습니까?`;

            this.$store
                .dispatch('DIALOG_WRN', [msg, '사용자 그룹 삭제', 2])
                .then(async () => {
                    this.loading = true;
                    const param = {
                        type: 'd',
                        level: 2,
                        seq: item.seq,
                    };

                    await API_category(this.apiUID, param)
                        .then(() => {
                            this.$store.dispatch('NOTY_COM', `그룹 삭제를 성공했습니다.`);
                        })
                        .catch(() => {
                            this.$store.dispatch('NOTY_ERR', `그룹 삭제를 실패했습니다.`);
                        })
                        .finally(() => {
                            this.loading = false;
                            this.$emit('fetchUserGrp');
                        });
                })
                .catch(() => {});
        },
    },
};
</script>

<style lang="scss" src="./style.scss" scoped />
