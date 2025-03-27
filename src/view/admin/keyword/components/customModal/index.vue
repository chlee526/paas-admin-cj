<template>
    <div class="wrap">
        <section ref="modal_item" class="ui_box popup_item popup_rel_info" :class="{ 'is-loading': loading }" :style="`height: ${hgt}px`">
            <span class="bg" @click="close" :style="'height:' + hgt + 'px'"></span>
            <div class="header" :style="getStyles">
                <div class="wrap">
                    <h2>
                        <!-- 타이틀 -->
                        <strong>등록 실패 정보</strong>
                    </h2>
                    <button type="button" class="close" title="팝업 닫기" @click="close">팝업 닫기</button>
                </div>
            </div>
            <div class="wrap" :style="getStyles">
                <div class="content" :style="'max-height:' + (hgt - contentHgt) + 'px'">
                    <div class="ui_brd is-hgt-fixed is-data-v2 is-no-over brdReason">
                        <div class="wrap">
                            <table>
                                <colgroup>
                                    <col style="width: 30%" />
                                    <col style="width: 30%" />
                                    <col />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th><strong>키워드</strong></th>
                                        <th><strong>제외키워드</strong></th>
                                        <th><strong>실패사유</strong></th>
                                    </tr>
                                </thead>
                                <tbody ref="tbody" v-html="getFailLists()"></tbody>
                            </table>
                        </div>
                        <div class="footer">
                            <div class="btns">
                                <comp-button class="is-large is-color-black" @click="evt_copyClick"><span>복사</span></comp-button>
                                <comp-button class="is-large" @click="close"><span>닫기</span></comp-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import EventBus from '@shared/utils/eventBus';
export default {
    name: 'tmpl-modal-keywordCustomModal',
    data() {
        return {
            loading: false,
            contentHgt: 145,
        };
    },
    props: {
        popName: { type: String },
        searchParams: { type: Object },
        hgt: { type: Number },
        useAttrs: { default: false },
    },
    computed: {
        getStyles() {
            return `width: 800px`;
        },
    },
    mounted: function () {},
    watch: {},
    methods: {
        getFailLists(copy) {
            const result = this.searchParams.custom.failsKeywordDatas
                .map((item) => {
                    let result = '';
                    const itemName = item.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    if (item.k_seq === '') {
                        result += `<tr>`;
                        result += `<td class="is-no-over fail" rowspan="${item.exptKeywordList.length + 1}"><strong>${itemName}</strong></td>`;
                        result += `<td class="is-no-over"><span></span></td>`;
                        if (!copy) result += `<td class="is-no-over"><span>${getFailReason(item.status)}</span></td>`;
                        result += `</tr>`;
                    }
                    console.log(item);
                    if (item.exptKeywordList) {
                        result += item.exptKeywordList
                            .map((exptItem, idx) => {
                                const exptItemName = exptItem.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                                let result = `<tr>`;
                                if (!copy) {
                                    if (item.k_seq !== '') result += idx == 0 ? `<td class="is-no-over" rowspan="${item.exptKeywordList.length}"><strong>${itemName}</strong></td>` : ``;
                                }
                                // (item.k_seq === '' ? 'fail' : '')
                                else result += `<td class="is-no-over"><strong>${itemName}</strong></td>`;
                                result += `<td class="fail is-no-over"><span>${exptItemName}</span></td>`;
                                if (!copy) result += `<td class="is-no-over"><span>${getFailReason(exptItem.errStatus, item.k_seq === '')}</span></td>`;
                                result += `</tr>`;
                                return result;
                            })
                            .join('\n');
                    }
                    return result;
                })
                .join('\n');

            function getFailReason(status, itemAddFail) {
                return status == 400 ? `특수기호(' or ")포함` : status == 409 ? '중복' : itemAddFail ? '키워드 등록 실패' : '알 수 없음';
            }

            return result;
        },
        async evt_copyClick() {
            const tbody = document.createElement('tbody');
            tbody.style.position = 'absolute';
            tbody.style.top = '-9999px';
            tbody.innerHTML = this.getFailLists(true);
            document.body.appendChild(tbody);
            await tbody.innerText.copyClipBoard(true);
            document.body.removeChild(tbody);
        },
        close: function () {
            EventBus.$emit('MODAL_CLOSE', this.popName);
        },
    },
};
</script>

<style src="./style.scss" lang="scss" scoped></style>

'키워드2' '키워드4' 키워드1 '제외키워드3' 키워드1 '제외키워드4' 키워드1 '제외키워드5' 키워드3 '제외키워드3' 키워드3 '제외키워드4' 키워드3 '제외키워드5' 키워드5 '제외키워드3' 키워드5 '제외키워드4' 키워드5 '제외키워드5'
