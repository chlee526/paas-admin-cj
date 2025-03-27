import { http, HttpResponse } from 'msw';

export const common_handlers = [
    // 로그인
    http.post(process.env.VUE_APP_BASE_API + '/api/auth/login.jsp', () => {
        return new HttpResponse(null, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                Accesstoken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX25vIjoiMyIsImlzcyI6ImZlIiwic3ViIjoiZmUiLCJleHAiOjE3MDA0OTk1ODksImlhdCI6MTcwMDQ2NzE4OX0.e_w8rep-gU6yWHoDjkPKblbC0UVctAVFIbMaaz2j2Z0',
                Refreshtoken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX25vIjoiMyIsImlzcyI6ImZlIiwic3ViIjoiZmUiLCJleHAiOjE3MDA1MTAzODksImlhdCI6MTcwMDQ2NzE4OX0.6fHQeS0SRRlH05Qb_JhTrUyRoQrtn09NrrU60R92HpY',
            },
            body: JSON.stringify({ name: 'fe', auth: '1', user_no: '3' }),
        });
    }),
    // 로그아웃
    http.post(process.env.VUE_APP_BASE_API + '/api/auth/logout.jsp', () => {
        return new HttpResponse(null, {
            status: 200,
        });
    }),
    // 라우터
    http.post(process.env.VUE_APP_BASE_API + '/api/auth/route.jsp', () => {
        return HttpResponse.json({
            result: {
                route: [
                    {
                        seq: 15,
                        name: '데이터 관리',
                        url: '/view/data/',
                        attr: {
                            url: '/view/data/',
                        },
                        permissions: 3,
                        children: [
                            {
                                seq: 16,
                                name: '데이터 다운로드',
                                url: '/view/data/mng',
                                attr: {
                                    url: '/view/data/mng',
                                },
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 1,
                        name: '관리자',
                        url: '/view/admin/',
                        attr: {
                            color: '',
                            url: '/view/admin/',
                        },
                        permissions: 3,
                        children: [
                            {
                                seq: 3,
                                name: '키워드',
                                url: '/view/admin/keyword',
                                attr: {
                                    color: '',
                                    url: '/view/admin/keyword',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 5,
                                name: '기사 주제 사전',
                                url: '/view/admin/dictionary',
                                attr: {
                                    color: '',
                                    url: '/view/admin/dictionary',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 6,
                                name: '기사 분류 사전',
                                url: '/view/admin/classify',
                                attr: {
                                    color: '',
                                    url: '/view/admin/classify',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 2,
                                name: '키워드 치환',
                                url: '/view/admin/replace',
                                attr: {
                                    color: '',
                                    url: '/view/admin/replace',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 4,
                                name: '전체 제외 키워드',
                                url: '/view/admin/except',
                                attr: {
                                    color: '',
                                    url: '/view/admin/except',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 7,
                                name: '사이트',
                                url: '/view/admin/site',
                                attr: {
                                    color: '',
                                    url: '/view/admin/site',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 13,
                                name: '사이트 검색어',
                                url: '/view/admin/sitesearch',
                                attr: {
                                    color: '',
                                    url: '/view/admin/sitesearch',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 14,
                                name: '제휴 수집원',
                                url: '/view/admin/siteboard',
                                attr: {
                                    color: '',
                                    url: '/view/admin/siteboard',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 8,
                                name: 'SNS계정',
                                url: '/view/admin/sns',
                                attr: {
                                    color: '',
                                    url: '/view/admin/sns',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 11,
                                name: '인기도 지수',
                                url: '/view/admin/popularity',
                                attr: {
                                    color: '',
                                    url: '/view/admin/popularity',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 9,
                                name: '사용자',
                                url: '/view/admin/member',
                                attr: {
                                    color: '',
                                    url: '/view/admin/member',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 12,
                                name: '접속로그',
                                url: '/view/admin/logdata',
                                attr: {
                                    color: '',
                                    url: '/view/admin/logdata',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 10,
                                name: '공용코드',
                                url: '/view/admin/common',
                                attr: {
                                    color: '',
                                    url: '/view/admin/common',
                                },
                                permissions: 3,
                            },
                            {
                                seq: 34,
                                name: '도움말',
                                url: '/view/admin/helper',
                                attr: {
                                    color: '',
                                    url: '/view/admin/helper',
                                },
                                permissions: 3,
                            },
                        ],
                    },
                ],
                user: {
                    id: 'fe',
                    name: 'fe',
                    auth: '2',
                    user_no: '3',
                },
            },
        });
    }),
    // 공용코드
    http.post(process.env.VUE_APP_BASE_API + '/api/admin/common', async ({ request, params, cookies }) => {
        const body = await request.json();
        let result = {};
        // 공용코드
        if (body.cmd === 'CG') {
            result = {
                list: [
                    {
                        cmm_type: 0,
                        seq: 169,
                        code: 0,
                        name: '메뉴',
                        level: '1',
                        attr: null,
                        children: [
                            {
                                cmm_type: 0,
                                seq: 170,
                                code: 1,
                                name: '관리자',
                                level: '2',
                                attr: null,
                                children: [
                                    {
                                        cmm_type: 0,
                                        seq: 171,
                                        code: 2,
                                        name: '키워드 치환',
                                        level: '2',
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 185,
                                        code: 3,
                                        name: '키워드',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/keyword',
                                        },
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 172,
                                        code: 4,
                                        name: '전체 제외 키워드',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/except',
                                        },
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 173,
                                        code: 5,
                                        name: '기사 주제 사전',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/dictionary',
                                        },
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 174,
                                        code: 6,
                                        name: '기사 분류 사전',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/classify',
                                        },
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 175,
                                        code: 7,
                                        name: '사이트',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/site',
                                        },
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 176,
                                        code: 8,
                                        name: 'SNS계정',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/sns',
                                        },
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 177,
                                        code: 9,
                                        name: '사용자',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/member',
                                        },
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 178,
                                        code: 10,
                                        name: '공용코드',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/common',
                                        },
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 179,
                                        code: 11,
                                        name: '인기도 지수',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/popularity',
                                        },
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 180,
                                        code: 12,
                                        name: '접속로그',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/logdata',
                                        },
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 181,
                                        code: 13,
                                        name: '사이트 검색어',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/sitesearch',
                                        },
                                    },
                                    {
                                        cmm_type: 0,
                                        seq: 182,
                                        code: 14,
                                        name: '제휴 수집원',
                                        level: '2',
                                        attr: {
                                            url: '/view/admin/siteboard',
                                        },
                                    },
                                ],
                            },
                            {
                                cmm_type: 0,
                                seq: 183,
                                code: 15,
                                name: '데이터 관리',
                                level: '2',
                                attr: {
                                    url: '/view/data/',
                                },
                                children: [
                                    {
                                        cmm_type: 0,
                                        seq: 184,
                                        code: 16,
                                        name: '데이터 다운로드',
                                        level: '2',
                                        attr: {
                                            url: '/view/data/mng',
                                        },
                                    },
                                ],
                            },
                            {
                                cmm_type: 0,
                                seq: 186,
                                code: 17,
                                name: 'test',
                                level: '2',
                                attr: null,
                                children: [
                                    {
                                        cmm_type: 0,
                                        seq: 187,
                                        code: 18,
                                        name: 'test2',
                                        level: '2',
                                        attr: {
                                            color: '',
                                            url: 'test',
                                        },
                                    },
                                ],
                            },
                            {
                                cmm_type: 0,
                                seq: 188,
                                code: 19,
                                name: 'test11',
                                level: '2',
                                attr: {
                                    color: '',
                                    url: 'rksk22',
                                },
                            },
                            {
                                cmm_type: 0,
                                seq: 189,
                                code: 20,
                                name: '테스트',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 0,
                                seq: 192,
                                code: 23,
                                name: '아이템',
                                level: '2',
                                attr: {
                                    color: '',
                                    url: '유알엘',
                                },
                            },
                        ],
                    },
                    {
                        cmm_type: 1,
                        seq: 1,
                        code: 0,
                        name: '채널',
                        level: '1',

                        children: [
                            {
                                cmm_type: 1,
                                seq: 2,
                                code: 1,
                                name: '뉴스',
                                level: '2',
                            },
                            {
                                cmm_type: 1,
                                seq: 25,
                                code: 2,
                                name: '포털',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 1,
                                seq: 3,
                                code: 3,
                                name: '블로그',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 1,
                                seq: 4,
                                code: 4,
                                name: '카페',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 1,
                                seq: 5,
                                code: 5,
                                name: '커뮤니티',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 1,
                                seq: 6,
                                code: 6,
                                name: '트위터',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 1,
                                seq: 8,
                                code: 8,
                                name: '인스타그램',
                                level: '2',
                                attr: null,
                            },
                        ],
                    },
                    {
                        cmm_type: 2,
                        seq: 9,
                        code: 0,
                        name: '필터링조건',
                        level: '1',
                        attr: null,
                        children: [
                            {
                                cmm_type: 2,
                                seq: 10,
                                code: 1,
                                name: '제목 + 내용',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 2,
                                seq: 11,
                                code: 2,
                                name: '제목',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 2,
                                seq: 12,
                                code: 3,
                                name: '내용',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 2,
                                seq: 24,
                                code: 4,
                                name: '메뉴명',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 2,
                                seq: 145,
                                code: 5,
                                name: 'URL',
                                level: '2',
                                attr: null,
                            },
                        ],
                    },
                    {
                        cmm_type: 3,
                        seq: 13,
                        code: 0,
                        name: '특수문자검색조건',
                        level: '1',
                        attr: null,
                        children: [
                            {
                                cmm_type: 3,
                                seq: 14,
                                code: 1,
                                name: '특수문자포함',
                                level: '2',
                                attr: {
                                    color: '#FB2626',
                                },
                            },
                            {
                                cmm_type: 3,
                                seq: 15,
                                code: 2,
                                name: '특수문자제거',
                                level: '2',
                                attr: null,
                            },
                        ],
                    },
                    {
                        cmm_type: 4,
                        seq: 16,
                        code: 0,
                        name: '키워드필터옵션',
                        level: '1',
                        attr: null,
                        children: [
                            {
                                cmm_type: 4,
                                seq: 17,
                                code: 1,
                                name: '일반',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 4,
                                seq: 18,
                                code: 2,
                                name: '구문',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 4,
                                seq: 19,
                                code: 3,
                                name: '인접',
                                level: '2',
                                attr: null,
                            },
                        ],
                    },
                    {
                        cmm_type: 5,
                        seq: 20,
                        code: 0,
                        name: '검색조건',
                        level: '1',
                        attr: null,
                        children: [
                            {
                                cmm_type: 5,
                                seq: 21,
                                code: 1,
                                name: '키워드',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 5,
                                seq: 22,
                                code: 2,
                                name: '제외키워드',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 5,
                                seq: 23,
                                code: 3,
                                name: '작성자',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 5,
                                seq: 146,
                                code: 4,
                                name: '수정자',
                                level: '2',
                                attr: null,
                            },
                        ],
                    },
                    {
                        cmm_type: 6,
                        seq: 26,
                        code: 0,
                        name: '사용자그룹',
                        level: '1',
                        attr: null,
                        children: [
                            {
                                cmm_type: 6,
                                seq: 27,
                                code: 1,
                                name: '기본그룹',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 6,
                                seq: 28,
                                code: 2,
                                name: '개발',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 6,
                                seq: 29,
                                code: 3,
                                name: '관리자',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 6,
                                seq: 168,
                                code: 4,
                                name: '테스트1',
                                level: '2',
                                attr: null,
                            },
                        ],
                    },
                    {
                        cmm_type: 7,
                        seq: 35,
                        code: 0,
                        name: '분석대상',
                        level: '1',
                        attr: null,
                        children: [
                            {
                                cmm_type: 7,
                                seq: 36,
                                code: 1,
                                name: '기사',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 7,
                                seq: 37,
                                code: 2,
                                name: 'CJ보도자료',
                                level: '2',
                                attr: null,
                            },
                        ],
                    },
                    {
                        cmm_type: 8,
                        seq: 152,
                        code: 0,
                        name: '검색조건(인기도지수)',
                        level: '1',
                        attr: null,
                        children: [
                            {
                                cmm_type: 8,
                                seq: 153,
                                code: 1,
                                name: '작성자',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 8,
                                seq: 154,
                                code: 2,
                                name: '수정자',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 8,
                                seq: 155,
                                code: 3,
                                name: '사이트번호',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 8,
                                seq: 156,
                                code: 4,
                                name: '사이트명',
                                level: '2',
                                attr: null,
                            },
                        ],
                    },
                    {
                        cmm_type: 9,
                        seq: 157,
                        code: 0,
                        name: '검색조건(로그정보)',
                        level: '1',
                        attr: null,
                        children: [
                            {
                                cmm_type: 9,
                                seq: 159,
                                code: 1,
                                name: '부서명',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 9,
                                seq: 160,
                                code: 2,
                                name: '사용자아이디',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 9,
                                seq: 161,
                                code: 3,
                                name: '사용자이름',
                                level: '2',
                                attr: null,
                            },
                        ],
                    },
                    {
                        cmm_type: 10,
                        seq: 162,
                        code: 0,
                        name: '검색조건(매체별검색어)',
                        level: '1',
                        attr: null,
                        children: [
                            {
                                cmm_type: 10,
                                seq: 163,
                                code: 1,
                                name: '매체명',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 10,
                                seq: 164,
                                code: 2,
                                name: '검색어',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 10,
                                seq: 165,
                                code: 3,
                                name: '매체번호',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 10,
                                seq: 166,
                                code: 4,
                                name: '작성자',
                                level: '2',
                                attr: null,
                            },
                            {
                                cmm_type: 10,
                                seq: 167,
                                code: 5,
                                name: '수정자',
                                level: '2',
                                attr: null,
                            },
                        ],
                    },
                ],
            };
        }
        return HttpResponse.json({ result: result });
    }),
];
