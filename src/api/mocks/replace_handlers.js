import { http, HttpResponse, delay } from 'msw';

export const replace_handler = [
    // 전체 제외 키워드
    http.post(process.env.VUE_APP_BASE_API + '/api/admin/replace/', async ({ request, params, cookies }) => {
        const body = await request.json(); // convert the stream to a JavaScript object
        let result = {};

        if (body.cmd === 'RL') {
            result = {
                list: [],
            };

            for (let Loop1 = 0; Loop1 < 300; ++Loop1) {
                result.list.push({
                    reg_date: '2024-01-19 15:50:53.000000727',
                    k_writer: '황성호',
                    use_yn: 'Y',
                    find_keyword: `찾을 키워드 ${Loop1}`,
                    replace_keyword: `치환 키워드 ${Loop1}`,
                    k_modifier: '황성호',
                    modi_date: '2024-01-19 15:50:53.000000727',
                    seq: Loop1,
                });
            }
        } else if (body.cmd === 'RM') {
            return HttpResponse.status(200).json({ result: result });
        }

        return HttpResponse.json({ result: result });
    }),
];
