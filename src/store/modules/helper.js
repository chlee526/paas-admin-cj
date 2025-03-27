/**
 * 도움말
 * 모든 도움말은 해당 모듈을 통해서 관리
 * 공용: helpers > 공용
 * 컨텐츠별: helpers > 메뉴 > 섹션 > 컨텐츠 or helpers > 메뉴 > 컨텐츠
 */

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * State
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
const state = {
    helpers: {
        // 특수문자제거
        keyword_mng: {
            operator_setting: {
                tsc: '키워드에 특수문자 포함 여부를 설정합니다.<br>특수문자 제거 시 모든 특수문자가 제한됩니다.',
            },
            except_keyword: `
                <div class="ui_help">
                    <div class="wrap">
                        <ul>
                            <li>
                                <strong>검색영역</strong>
                                <ul>
                                    <li><strong>SC</strong> : 제목 + 내용</li>
                                    <li><strong>S</strong> : 제목</li>
                                    <li><strong>C</strong> : 내용</li>
                                    <li><strong>M</strong> : 메뉴명</li>
                                    <li><strong>U</strong> : URL</li>
                                </ul>
                            </li>
                            <li>
                                <strong>특수문자 포함여부</strong>
                                <ul>
                                    <li><strong>없음</strong> : 특수문자 제거</li>
                                    <li><strong>T</strong> : 특수문자 포함</li>
                                </ul>
                            </li>
                            <li>
                                <strong>종류</strong>
                                <ul>
                                    <li><strong>A</strong> : 일반</li>
                                    <li><strong>P</strong> : 구문</li>
                                    <li><strong>N</strong> : 인접</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>`,
        },
        data: {
            mng: `
                <div class="ui_help is-box-none">
                    <div class="wrap">
                        <strong class="title">도움말</strong>
                        <ul>
                            <li>
                                <strong>달력을 설정하면 날짜를 일괄 변경 가능합니다.</strong>
                            </li>
                            <li>
                                <strong>데이터 항목 위에 셀렉트 박스로 개별 달력도 설정 가능합니다.</strong>
                            </li>
                            <li>
                                <strong>다운로드하실 데이터 항목의 버튼을 누르시면 단일 다운로드가능합니다.</strong>
                            </li>
                            <li>
                                <strong>엑셀 다운로드 형식(개별, 전체)을 선택하여 다운로드 가능합니다.</strong>
                                <ul>
                                    <li>개별 다운로드 버튼 클릭 시 체크박스가 활성화되어 개별 항목이 선택 가능합니다.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>다운로드 항목마다 매달 생성되는 날짜가 상이합니다.</strong>
                            </li>
                        </ul>
                    </div>
                </div>
            `,
        },
    },
};

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * Mutation
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
const mutations = {};

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * Action
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
const actions = {};

export default {
    state,
    mutations,
    actions,
};
