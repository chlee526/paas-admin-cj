<template>
    <div class="ui_box">
        <div class="wrap" :class="{ 'is-lnb': getUseageLNB, 'is-view-permission': !hasAdminPermission }">
            <template v-if="Object.keys(selectedItem).length">
                <div class="container" v-if="!isEditMode">
                    <div v-if="hasAdminPermission" class="header">
                        <comp-button @click="$emit('update:isEditMode', true)">수정</comp-button>
                    </div>
                    <div class="contents">
                        <div class="subject">
                            <p>{{ selectedItem.subject || '' }}</p>
                        </div>
                        <div class="content" v-html="selectedItem.content || ''"></div>
                    </div>
                </div>
                <!-- 수정 모드 -->
                <div class="container is-edit-mode" v-else>
                    <div class="header">
                        <comp-button @click="moveToViewMode">이전으로</comp-button>
                    </div>
                    <div class="contents">
                        <div class="form">
                            <strong>사용여부</strong>
                            <div class="input">
                                <comp-switch-btn id="helper_edit_use" class="is-small" :value="formValue.use_yn === 'Y' ? true : false" @click="handleUseYn" />
                            </div>
                        </div>
                        <div class="form">
                            <strong>제목</strong>
                            <div class="input">
                                <strong v-if="selectedItem.menu_code > 0" class="title">{{ selectedItem?.subject }}</strong>
                                <comp-input-box v-else id="helper_edit_subject" v-model="formValue.subject" style="width: 600px"></comp-input-box>
                            </div>
                        </div>

                        <div class="form">
                            <strong>내용</strong>
                            <div class="input">
                                <comp-editor jodit id="helper_edit_content" v-model="formValue.content" :style="getEditorStyle" />
                            </div>
                        </div>
                    </div>
                    <div class="btn-wrap">
                        <comp-button v-if="hasDeletePermission" class="is-large" customColor="#ff0000" title="삭제" :disabled="selectedItem.menu_code > 0" @click="evtDeleteClick">
                            <span class="txt">삭제</span>
                        </comp-button>
                        <comp-button class="is-large" title="초기화" @click="updateFormValue(selectedItem)">
                            <span class="txt">초기화</span>
                        </comp-button>
                        <comp-button class="is-color-hl is-large" title="저장" @click="handleSave">
                            <span class="txt">저장</span>
                        </comp-button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
//
import { uuid } from 'vue-uuid';
import { API_helperCUD } from '@shared/api/helper';
import { mapGetters } from 'vuex';

export default {
    name: 'comp-helper-edit',
    components: {},
    data() {
        return {
            apiUID: uuid.v4(),
            formValue: {
                use_yn: true,
                subject: '',
                content: '',
            },
        };
    },
    props: {
        selectedItem: { type: Object, required: true },
        isEditMode: { type: Boolean, required: true },
        dataList: { type: Array },
    },
    computed: {
        ...mapGetters(['getUseageLNB', 'getUserPermissions']),

        hasAdminPermission() {
            return this.getUserPermissions >= 2;
        },

        hasDeletePermission() {
            return this.getUserPermissions >= 3;
        },

        getEditorStyle() {
            return this.getUseageLNB ? { minHeight: '400px', height: 'calc(100vh - 318px)' } : { minHeight: '400px', height: 'calc(100vh - 378px)' };
        },
    },
    created() {},
    watch: {
        selectedItem: {
            immediate: true,
            deep: true,
            handler(val) {
                if (Object.keys(val).length) {
                    this.updateFormValue(val);
                }
            },
        },
    },
    methods: {
        /**
         * CUD API 요청 처리 핸들러
         * @param {Object} params - API 요청 파라미터
         * @param {Object} options - 추가 옵션
         */
        async apiCUDRequest(params, options = {}) {
            try {
                await API_helperCUD(this.apiUID, params);

                if (options.onSuccess) options.onSuccess();
                this.$emit('update:isEditMode', false);
                this.$emit('updateDataList');
                this.$store.dispatch('NOTY_COM', options.successMessage || '요청이 성공했습니다.');
            } catch (error) {
                this.$store.dispatch('NOTY_ERR', options.errorMessage || '요청이 실패했습니다.');
                throw error;
            }
        },

        /**
         * 폼 데이터 업데이트
         * @param {Object} data - 업데이트할 데이터
         */
        updateFormValue(data) {
            const { subject, content, use_yn } = data;
            Object.assign(this.formValue, { subject, content, use_yn });
        },

        /**
         * 도움말 삭제
         */
        async handleDelete() {
            await this.apiCUDRequest(
                { type: 'd', seq: this.selectedItem?.seq },
                {
                    successMessage: '도움말 삭제를 성공했습니다.',
                    errorMessage: '도움말 삭제를 실패했습니다.',
                    onSuccess: () => {
                        this.$emit('update:selectedItem', {});
                    },
                },
            );
        },

        evtDeleteClick() {
            this.$store.dispatch('DIALOG_WRN', [`삭제시 하위 아이템 변경이 있을 수 있습니다.`, '삭제하시겠습니까?', 1]).then(() => {
                this.handleDelete();
            });
        },

        /**
         * 도움말 저장
         */
        async handleSave() {
            const { seq, menu_code, p_code, order } = this.selectedItem;
            const { subject, content, use_yn } = this.formValue;

            await this.apiCUDRequest(
                {
                    type: 'u',
                    subject,
                    content,
                    use_yn,
                    seq,
                    menu_code,
                    p_code,
                    order,
                },
                {
                    successMessage: '도움말 수정을 성공했습니다.',
                    errorMessage: '도움말 수정을 실패했습니다.',
                },
            );
        },

        /**
         * 사용 여부 토글
         */
        handleUseYn() {
            this.formValue.use_yn = this.formValue.use_yn === 'Y' ? 'N' : 'Y';
        },

        /**
         * 조회 모드로 이동
         */
        moveToViewMode() {
            this.$store.dispatch('DIALOG_WRN', [`변경사항이 저장되지 않을 수 있습니다.`, '', 1]).then(() => {
                this.$emit('update:isEditMode', false);
            });
        },
    },
};
</script>

<style lang="scss" src="./style.scss" scoped />
