import { http, HttpResponse, delay } from 'msw';

export const member_handler = [
    // 키워드
    http.post(process.env.VUE_APP_BASE_API + '/api/admin/member', async ({ request, params, cookies }) => {
        const body = await request.json(); // convert the stream to a JavaScript object
        let result = {};
        // 사용자 목록
        if (body.cmd === 'ML') {
            result = {
                list: [
                    {
                        seq: 0,
                        user_grp: 1,
                        id: '0abc',
                        name: '가길동',
                        dept: null,
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-02',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                            {
                                code: 5,
                                permissions: 1,
                            },
                        ],
                    },
                    {
                        seq: 1,
                        user_grp: 2,
                        id: '1abc',
                        name: '홍길동',
                        dept: null,
                        rank: '대리',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-02',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 2,
                        user_grp: 3,
                        id: '2abc',
                        name: '나길동',
                        dept: '기획',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-02',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 3,
                        user_grp: 4,
                        id: '3abc',
                        name: '홍길동',
                        dept: '홍보',
                        rank: '과장',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-02',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 4,
                        user_grp: 1,
                        id: '4abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-02',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 5,
                        user_grp: 2,
                        id: '5abc',
                        name: '다길동',
                        dept: '기획',
                        rank: '대리',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 6,
                        user_grp: 3,
                        id: '6abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '차장',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 7,
                        user_grp: 4,
                        id: '7abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '대리',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 8,
                        user_grp: 4,
                        id: '8abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 9,
                        user_grp: 2,
                        id: '9abc',
                        name: '라길동',
                        dept: '기획',
                        rank: '차장',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 10,
                        user_grp: 3,
                        id: '10abc',
                        name: '홍길동',
                        dept: '홍보',
                        rank: '대리',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 11,
                        user_grp: 1,
                        id: '11abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '차장',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 12,
                        user_grp: 2,
                        id: '12abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 13,
                        user_grp: 2,
                        id: '13abc',
                        name: '홍길동',
                        dept: '기획',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 14,
                        user_grp: 1,
                        id: '14abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 15,
                        user_grp: 4,
                        id: '15abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 16,
                        user_grp: 3,
                        id: '16abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 17,
                        user_grp: 1,
                        id: '17abc',
                        name: '홍길동',
                        dept: '기획',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 18,
                        user_grp: 3,
                        id: '18abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 19,
                        user_grp: 4,
                        id: '19abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 20,
                        user_grp: 4,
                        id: '20abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 21,
                        user_grp: 4,
                        id: '21abc',
                        name: '홍길동',
                        dept: '기획',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 22,
                        user_grp: 3,
                        id: '22abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 23,
                        user_grp: 1,
                        id: '23abc',
                        name: '홍길동',
                        dept: '홍보',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 24,
                        user_grp: 1,
                        id: '24abc',
                        name: '홍길동',
                        dept: '기획',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 25,
                        user_grp: 1,
                        id: '25abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 26,
                        user_grp: 1,
                        id: '26abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 27,
                        user_grp: 1,
                        id: '27abc',
                        name: '홍길동',
                        dept: '기획',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                    {
                        seq: 28,
                        user_grp: 1,
                        id: '28abc',
                        name: '홍길동',
                        dept: '서비스개발',
                        rank: '연구원',
                        mobile: '010-0000-0000',
                        email: 'abc@def.com',
                        reg_date: '2023-01-01',
                        menu_seq: [
                            {
                                code: 0,
                                permissions: 3,
                            },
                            {
                                code: 1,
                                permissions: 3,
                            },
                            {
                                code: 2,
                                permissions: 3,
                            },
                            {
                                code: 3,
                                permissions: 3,
                            },
                            {
                                code: 4,
                                permissions: 3,
                            },
                        ],
                    },
                ],
            };

            console.log(result);
        }
        // 사용자 추가/수정/삭제
        else if (body.cmd === 'MM') {
            result = {};
        } else if (body.cmd === 'MD') {
            result = {
                duplicate: false,
            };
        }
        // await delay(5000);

        return HttpResponse.json({ result: result });
    }),
];
