<template>
    <div>
        <AsideBox class="ui-loader-container" :class="{ 'is-loading': loading }">
            <template slot="title">
                <h3>
                    {{ getTitle }}
                </h3>

                <transition name="fade_posx_reverse">
                    <comp-button v-if="isEdit && getUserPermissions >= 2" class="btn_regist is-small" @click="$emit('setEditItem', {})">
                        <span class="txt">등록</span>
                    </comp-button>
                </transition>
            </template>
            <template slot="content">
                <template v-if="getUserPermissions >= 2">
                    <div>
                        <comp-input-box type="text" class="inputMedia is-xlarge is-wid100p" placeholder="매체명 입력" focusResetVisible v-model="inputItem.site_name" :autocomplete="autocompleteList"></comp-input-box>
                    </div>

                    <template v-if="isEdit">
                        <div>
                            <comp-selectbox class="is-small is-wid100p" :opts="snsList" not-selected-label="SNS 계정을 선택하세요." v-model="inputItem.sns_seq"></comp-selectbox>
                        </div>
                        <div>
                            <comp-bubble-box class="is-validation is-wid100p" :showFixed="isChanged && duplicationIndex.includes(0)" content="중복 URL 입니다." pos="L">
                                <comp-textarea class="is-small is-wid100p" :rows="3" placeholder="URL 입력" :forbiddenKeys="[13]" @blur="trimURL" v-model="inputItem.url" />
                            </comp-bubble-box>
                        </div>
                    </template>

                    <template v-else>
                        <div class="sub" @scroll="hideWarning">
                            <div v-for="(item, idx) in registList" :key="item.seq">
                                <div>
                                    <comp-selectbox class="is-small is-wid100p" :opts="snsList" not-selected-label="SNS 계정을 선택하세요." v-model="item.sns_seq"></comp-selectbox>
                                    <comp-button v-if="registList.length > 1" class="is-small" title="삭제" @click="removeSNS(idx)">
                                        <span class="icon">&#xe022;</span>
                                    </comp-button>
                                </div>
                                <comp-bubble-box class="is-validation is-wid100p" :showFixed="duplicationIndex.includes(idx)" content="중복 URL 입니다." pos="L">
                                    <comp-textarea class="is-small is-wid100p" :rows="2" placeholder="URL 입력" :forbiddenKeys="[13]" @blur="trimURL(idx)" v-model="item.url" />
                                </comp-bubble-box>
                            </div>
                        </div>

                        <div>
                            <comp-button class="is-color-black" @click="addSNS">SNS 계정 추가</comp-button>
                        </div>
                    </template>
                </template>
                <fieldset v-else>
                    <strong>매체명</strong>
                    <div>
                        <span>{{ inputItem.site_name || '-' }}</span>
                    </div>

                    <strong>SNS 계정</strong>
                    <div>
                        <span>{{ snsList.find(({ code }) => code === inputItem.sns_seq)?.name || '-' }}</span>
                    </div>

                    <strong>URL</strong>
                    <div>
                        <a style="word-break: break-all" :href="inputItem.url" target="_blank">{{ inputItem.url || '-' }}</a>
                    </div>
                </fieldset>

                <div v-if="getUserPermissions >= 2" class="btn_box">
                    <transition name="fade_posx">
                        <comp-button v-if="isEdit && getUserPermissions >= 3" class="is-large" customColor="#ff0000" title="삭제" @click="evt_remove">
                            <span class="txt">삭제</span>
                        </comp-button>
                    </transition>
                    <comp-button v-if="true" class="is-large" @click="resetInput" title="초기화">
                        <span class="txt">초기화</span>
                    </comp-button>
                    <comp-button v-if="true" class="is-color-hl is-large" @click="evt_save" :disabled="!isVaild" title="저장">
                        <span class="txt">저장</span>
                    </comp-button>
                </div>
            </template>
        </AsideBox>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';

import AsideBox from '@/components/aside_box';

export default {
    name: 'comp-aside-sns',
    components: {
        AsideBox,
    },
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            // 입력값
            inputItem: {
                seq: '',
                site_name: '',
                sns_seq: '',
                url: '',
            },
            // 초기값
            init: {
                seq: '',
                site_name: '',
                sns_seq: '',
                url: '',
            },
            // 유효성 검사
            validation: {
                site_name: false,
                sns_seq: false,
                url: false,
            },

            duplicationIndex: [],
            registList: [],
            scrollTimer: null,
        };
    },
    props: {
        // 수정 아이템
        editItem: { type: Object },
        // 자동완성 목록
        autocompleteList: { type: Array, default: new Array() },
        // SNS 마스터 목록
        snsList: { type: Array, default: new Array() },
        // 중복 확인용 dataList url
        urlList: { type: Array, default: new Array() },
    },
    computed: {
        ...mapGetters(['getUserPermissions']),
        // 컴포넌트 타이틀
        getTitle() {
            if (this.getUserPermissions >= 2) {
                return `SNS 계정 ${!this.isEdit ? '등록' : '수정'}`;
            }
            return 'SNS 계정 정보';
        },
        // 수정상태인지 확인
        isEdit() {
            return Object.keys(this.editItem).length > 0;
        },
        // 유효성 확인
        isVaild() {
            return Object.values(this.validation).every((val) => val) && this.duplicationIndex.length <= 0;
        },

        /**
         * 수정할 때 원본 값에서 변경된 사항이 있는지 여부
         */
        isChanged() {
            return ['site_name', 'sns_seq', 'url'].some((key) => {
                return this.inputItem[key] != this.editItem[key];
            });
        },
    },
    created() {
        this.addSNS();
    },
    watch: {
        editItem: {
            deep: true,
            handler(val) {
                this.resetInput();
            },
        },
        inputItem: {
            deep: true,
            handler(val) {
                this.setValidation();
            },
        },
        registList: {
            deep: true,
            handler() {
                this.setValidation();
            },
        },
    },
    methods: {
        /**
         * SNS 계정 추가에 스크롤이 동작하는 동안 잠시 warnig 끔
         * */
        hideWarning() {
            this.duplicationIndex = [];

            // Event Throttling
            clearTimeout(this.scrollTimer);
            this.scrollTimer = setTimeout(() => {
                this.checkDuplication();
            }, 50);
        },
        /**
         * 유효성 변경
         */
        setValidation() {
            // url 중복 여부 확인
            this.checkDuplication();

            // 기본 유효성
            if (!this.isEdit) {
                this.validation.site_name = this.inputItem.site_name.trim().length ? true : false;

                // 최소 한 개 이상은 입력 되어야함
                let isInput = false;

                const isValid = this.registList.every(({ sns_seq, url }) => {
                    // sns 계정 또는 url에 입력이 있을 경우 두 곳 모두에 input되어야 함
                    if (sns_seq.trim().length > 0 || url.trim().length > 0) {
                        isInput = true;
                        return sns_seq.trim().length > 0 && url.trim().length > 0;
                    } else {
                        // 완전히 빈 칸은 통과
                        return true;
                    }
                });

                this.validation.sns_seq = isInput && isValid;
                this.validation.url = isInput && isValid;
            } else {
                // validation 확인 대상 keys
                ['site_name', 'sns_seq', 'url'].forEach((key) => {
                    // 디폴트값과 비교
                    if (this.isChanged) {
                        // 빈 값 여부 확인
                        this.validation[key] = this.inputItem[key].trim().length > 0;
                    } else {
                        this.validation[key] = this.isChanged;
                    }
                });
            }
        },

        /**
         * input/유효성 초기화
         */
        resetInput() {
            if (this.isEdit) {
                const obj = {
                    seq: this.editItem.seq,
                    site_name: this.editItem.site_name,
                    sns_seq: this.editItem.sns_seq,
                    url: this.editItem.url,
                };
                this.inputItem = structuredClone(obj);
            } else {
                this.inputItem = structuredClone(this.init);
            }

            this.validation = {
                site_name: false,
                sns_seq: false,
                url: false,
            };

            this.duplicationIndex = [];

            this.registList = [{ ...this.inputItem }];

            this.setValidation();
        },

        /**
         * 저장
         */
        evt_save() {
            if (this.isEdit) {
                const param = {
                    type: this.isEdit ? 'u' : 'i',
                    ...this.inputItem,
                    sns_name: this.snsList.find((sns) => sns.code === this.inputItem.sns_seq).name,
                };

                // 수정
                this.$emit('update', param);
            } else {
                // 저장
                const filterList = this.registList
                    // sns 계정 또는 url에 입력이 있을 경우 두 곳 모두에 input되어야 함
                    .filter(({ sns_seq, url }) => sns_seq.trim().length > 0 && url.trim().length > 0)
                    .map((item) => {
                        // sns_seq로 sns_name 적용
                        item.sns_name = this.snsList.find((sns) => sns.code === item.sns_seq).name;

                        // inputItem의 site_name 덮어쓰는 오류 해결을 위해 제거
                        delete item.site_name;

                        return {
                            ...this.inputItem,
                            ...item,
                        };
                    });

                this.$emit('save', filterList);
                this.resetInput();
            }
        },

        /**
         * 삭제
         */
        evt_remove() {
            this.$emit('update', { type: 'd', ...this.inputItem });
        },

        /**
         * 등록 > 추가
         */
        addSNS() {
            this.registList.push({ ...this.inputItem, seq: String(Math.random()) });
        },

        /**
         * 등록 > 삭제
         */
        removeSNS(idx) {
            // 1개 이상 필수
            if (this.registList.length < 2) return;

            this.registList.splice(idx, 1);
        },

        /**
         * url 중복 여부 확인
         * @param {String} url
         */
        checkDuplication() {
            if (this.isEdit) {
                const trimURL = this.inputItem.url.trim().replaceAll(/\s+(?=\s)|\n+(?=\s)|\s+(?=\n)|\n+(?=\n)/g, '');
                const originURL = this.editItem.url.trim().replaceAll(/\s+(?=\s)|\n+(?=\s)|\s+(?=\n)|\n+(?=\n)/g, '');

                // 원본 URL과 다르면서 중복인 항목만 표시
                this.duplicationIndex = trimURL !== originURL && this.urlList.includes(trimURL) ? [0] : [];
            } else {
                const inputUrlList = this.registList.map(({ url }) => url).filter((url) => url);
                // 중복된 값만 urlList와 합치기
                const mergeList = [...this.urlList, ...new Set(inputUrlList.filter((url, idx) => inputUrlList.indexOf(url) !== idx))];

                this.duplicationIndex = this.registList
                    .map(({ url }, idx) => {
                        const trimURL = url.trim().replaceAll(/\s+(?=\s)|\n+(?=\s)|\s+(?=\n)|\n+(?=\n)/g, '');
                        // 중복일때만 index 값 반환
                        return mergeList.includes(trimURL) ? idx : false;
                    })
                    // index값인 항목만 array에 남기기
                    .filter((idx) => typeof idx === 'number');
            }
        },

        trimURL(idx) {
            if (this.isEdit) {
                this.inputItem.url = this.inputItem.url.trim();
            } else {
                this.registList[idx].url = this.registList[idx].url.trim();
            }
        },
    },
};
</script>

<style lang="scss" src="./style.scss" scoped />
