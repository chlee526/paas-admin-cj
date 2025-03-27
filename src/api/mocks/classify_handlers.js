import { http, HttpResponse, delay } from 'msw';

export const classify_handlers = [
    // 키워드
    http.post(process.env.VUE_APP_BASE_API + '/api/admin/classify', async ({ request, params, cookies }) => {
        const body = await request.json(); // convert the stream to a JavaScript object
        let result = {};
        // 키워드 그룹 목록
        if (body.cmd === 'CL') {
            result = {
                list: [
                    { seq: 1, type_anal: 1, classify: '분류 1', use_yn: 'Y' },
                    { seq: 2, type_anal: 2, classify: '분류 2', use_yn: 'Y' },
                    { seq: 3, type_anal: 2, classify: '분류 3', use_yn: 'Y' },
                    { seq: 4, type_anal: 2, classify: '분류 4', use_yn: 'Y' },
                    { seq: 5, type_anal: 1, classify: '분류 5', use_yn: 'Y' },
                    { seq: 6, type_anal: 1, classify: '분류 6', use_yn: 'Y' },
                    { seq: 7, type_anal: 2, classify: '분류 7', use_yn: 'Y' },
                    { seq: 8, type_anal: 1, classify: '분류 8', use_yn: 'Y' },
                    { seq: 9, type_anal: 2, classify: '분류 9', use_yn: 'Y' },
                    { seq: 10, type_anal: 1, classify: '분류 10', use_yn: 'Y' },
                ],
            };
        }
        // 키워드 목록
        else if (body.cmd === 'DL') {
            result = {
                list: [],
                total: 50000,
            };
            for (let Loop1 = 0; Loop1 < 500; ++Loop1) {
                result.list.push({
                    seq: Loop1,
                    keyword: `키워드 ${Loop1}`,
                    classify: `분류 ${parseInt(Math.random() * 10) + 1}`,
                    type_anal: parseInt(Math.random() * 2) + 1,
                    op: parseInt(Math.random() * 3) + 1,
                    op_len_before: parseInt(Math.random() * 99) + 1,
                    op_len_after: parseInt(Math.random() * 99) + 1,
                    ts: parseInt(Math.random() * 3) + 1,
                    tsc: parseInt(Math.random() * 2) + 1,
                    use_yn: 'Y',
                    reg_date: new Date().dateToStr('-', 'YYYY-MM-DD hh:mm:ss'),
                    k_writer: '홍길동',
                    modi_date: new Date().dateToStr('-', 'YYYY-MM-DD hh:mm:ss'),
                    k_modifier: '홍길동',
                });
            }
        }
        // 기사 분류 추가/수정/삭제
        else if (body.cmd === 'CS') {
            if (body.type === 'i') {
                result = {
                    seq: Math.ceil(Math.random() * 100000) + 10,
                    type_anal: body.type_anal,
                    classify: body.classify,
                    use_yn: body.use_yn,
                };
            }
        }
        // 기사 주제 추가/수정/삭제
        else if (body.cmd === 'DM') {
            if (body.type === 'i') {
                result = {
                    seq: Math.ceil(Math.random() * 100),
                    attribute: body.attribute,
                    use_yn: body.use_yn,
                };
            }
        }

        // await delay(5000);

        return HttpResponse.json({ result: result });
    }),
];
