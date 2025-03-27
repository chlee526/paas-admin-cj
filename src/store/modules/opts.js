import opts from '@shared/store/modules/opts';

import store from '@/store';

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * State
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

// 게시판 줄 갯수
opts.state.brdViewLen = [
    { name: '50개씩 보기', code: '50' },
    { name: '100개씩 보기', code: '100' },
    { name: '200개씩 보기', code: '200' },
    { name: '300개씩 보기', code: '300' },
    { name: '500개씩 보기', code: '500' },
];

// 임시 데이터 ----------------------------------
opts.state.sg_seqs = [
    { code: 1, name: '뉴스' },
    { code: 2, name: '블로그' },
    { code: 3, name: '카페' },
    { code: 4, name: '커뮤니티' },
    { code: 5, name: '트위터' },
    { code: 6, name: '유튜브' },
    { code: 7, name: '인스타그램' },
];
opts.state.op = [
    { code: 1, name: 'AND' },
    { code: 2, name: '구문' },
    { code: 3, name: '인접' },
];
opts.state.ts = [
    { code: 1, name: '제목 + 내용' },
    { code: 2, name: '제목' },
    { code: 3, name: '내용' },
];
opts.state.tsc = [
    { code: 1, name: '특수문자포함' },
    { code: 2, name: '특수문자제거' },
];
opts.state.search_type = [
    { code: 4, name: '키워드' },
    { code: 5, name: '제외키워드' },
    { code: 6, name: '작성자' },
];
opts.state.type_anal = [
    { code: 1, name: '기사' },
    { code: 2, name: 'CJ보도자료' },
];
opts.state.log_menu = [
    { code: 0, name: '관리자' },
    { code: 1, name: '대시보드' },
];

// 임시 데이터 ----------------------------------

opts.state.use_YN = [
    { code: 'Y', name: '사용' },
    { code: 'N', name: '미사용' },
];

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * Mutation
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
opts.mutations.SET_SGSEQS = function (state, val) {
    state.sg_seqs = [...val];
};

opts.mutations.SET_OP = function (state, val) {
    state.op = [...val];
};

opts.mutations.SET_TS = function (state, val) {
    state.ts = [...val];
};

opts.mutations.SET_TSC = function (state, val) {
    state.tsc = [...val];
};

opts.mutations.SET_SEARCHTYPE = function (state, val) {
    state.search_type = [...val];
};

opts.mutations.SET_TYPEANAL = function (state, val) {
    state.type_anal = [...val];
    console.log(state.type_anal);
};

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * Action
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

export default opts;
