import Vue from 'vue';
import Router from 'vue-router';
import { fixRoutes, scrollBehaviorGetReroadChck } from '@shared/router'; // 고정 라우터

import store from '@/store';

/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * Router 등록/생성
 * 고정 라우터 목록
 * 404, 401, 로그인, 처음사용자 비밀번호 변경
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
Vue.use(Router);

// 컨텐츠 라우터(메뉴구성)
export const contentRoutes = [
    {
        seq: 11,
        name: '데이터 관리',
        url: '/view/data/',
        meta: { auth: true },
        permissions: 3,
        beforeEnter(to, from, next) {
            const sameRoute = store.getters.getRoutes.filter((route) => route.url === to.path || route.url === to.path + '/');
            const sameChildRoute = sameRoute[0].children.filter((route) => route.meta.auth);
            next(sameChildRoute[0].url);
        },
        children: [
            {
                seq: 12,
                name: '데이터 다운로드',
                url: '/view/data/mng',
                meta: { auth: true },
                permissions: 3,
            },
        ],
    },
    {
        seq: 1,
        name: '관리자',
        url: '/view/admin/',
        // redirect: '/view/admin/keyword',
        beforeEnter(to, from, next) {
            const sameRoute = store.getters.getRoutes.filter((route) => route.url === to.path || route.url === to.path + '/');
            const sameChildRoute = sameRoute[0].children.filter((route) => route.meta.auth);
            next(sameChildRoute[0].url);
        },
        meta: { auth: true },
        permissions: 3,
        children: [
            {
                seq: 9,
                name: '사용자',
                url: '/view/admin/member',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 4,
                name: '전체 제외 키워드',
                url: '/view/admin/except',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 2,
                name: '키워드 치환',
                url: '/view/admin/replace',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 3,
                name: '키워드',
                url: '/view/admin/keyword',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 5,
                name: '기사 주제 사전',
                url: '/view/admin/dictionary',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 6,
                name: '기사 분류 사전',
                url: '/view/admin/classify',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 7,
                name: '사이트',
                url: '/view/admin/site',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 8,
                name: 'SNS계정',
                url: '/view/admin/sns',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 10,
                name: '공용코드',
                url: '/view/admin/common',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 13,
                name: '인기도 지수',
                url: '/view/admin/popularity',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 14,
                name: '접속로그',
                url: '/view/admin/logdata',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 15,
                name: '사이트 검색어',
                url: '/view/admin/sitesearch',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 16,
                name: '제휴 수집원',
                url: '/view/admin/siteboard',
                meta: { auth: true },
                permissions: 3,
            },
            {
                seq: 34,
                name: '도움말',
                url: '/view/admin/helper',
                meta: { auth: true },
                permissions: 3,
            },
        ],
    },
];

// 최초 라우터 생성

// shared의 'fixRoutes'에 'contentRoutes'를 합쳐 App에서 사용할 route정보로 변환
contentRoutes.forEach(($item) => {
    let wrapComp = fixRoutes[fixRoutes.length - 1];

    if ($item.children) {
        const item = {
            path: $item.url,
            link: $item.link,
            name: $item.name,
            meta: {
                auth: $item.meta ? $item.meta.auth : process.env.NODE_ENV == 'development' ? true : false,
            },
            beforeEnter: $item.beforeEnter,
        };
        if ($item.redirect) item.redirect = $item.redirect;
        wrapComp.children.push(item);

        $item.children.forEach(($subItem) => {
            const compName = $subItem.url.replace('/view/', '');
            const item2 = {
                path: $subItem.url,
                link: $subItem.link,
                name: $subItem.name,
                component: () => import(`@/view/${compName}`),
                meta: {
                    auth: $item.meta ? $item.meta.auth : $subItem.meta ? $subItem.meta.auth : process.env.NODE_ENV == 'development' ? true : false,
                },
                beforeEnter: $subItem.beforeEnter,
            };
            wrapComp.children.push(item2);
        });
    } else {
        const compName = $item.url.replace('/view/', '');
        const item = {
            path: $item.url,
            link: $item.link,
            name: $item.name,
            component: () => import(`@/view/${compName}`),
            meta: {
                auth: $item.meta ? $item.meta.auth : process.env.NODE_ENV == 'development' ? true : false,
            },
            beforeEnter: $item.beforeEnter,
        };
        wrapComp.children.push(item);
    }
});

// 전역 Router 선언
let router = new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
        /**
         * router 새로고침 시 이동 되는 scroll 위치와 다른 route로 이동 시 이동하는 스크롤 영역 return
         * savePosition은 이전 페이지 기록을 담는 param
         * 이후에 뒤로가기 시 스크롤 이동 처리 개발 된다면 수정 예정
         */
        return scrollBehaviorGetReroadChck(savedPosition);
    },

    routes: fixRoutes,
});

export default router;
