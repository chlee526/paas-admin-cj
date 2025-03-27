import { http, HttpResponse, delay } from 'msw';

export const popularity_handler = [
    http.post(process.env.VUE_APP_BASE_API + '/api/admin/popularity/', async ({ request, params, cookies }) => {
        const body = await request.json(); // convert the stream to a JavaScript object
        let result = {};
        // 인기도 지수 목록
        if (body.cmd === 'PL') {
            result = {
                total: 5,
                list: [
                    {
                        k_writer: '시스템',
                        reg_date: '2024-05-20 15:12:52.000000653',
                        s_seq: 5033797,
                        d_site_name: '게임119',
                        logstd: 0,
                        use_yn: 'Y',
                        k_modifier: '윤혜인',
                        modi_date: '2025-01-07 16:33:22.000000597',
                        seq: 31581,
                    },
                    {
                        k_writer: '시스템',
                        reg_date: '2024-05-20 15:12:52.000000649',
                        s_seq: 5032987,
                        d_site_name: '뉴스룸',
                        logstd: 0,
                        use_yn: 'Y',
                        k_modifier: 'fe2',
                        modi_date: '2024-06-04 09:37:08.000000504',
                        seq: 31580,
                    },
                    {
                        k_writer: '시스템',
                        reg_date: '2024-05-20 15:12:52.000000646',
                        s_seq: 5032764,
                        d_site_name: '잇갤',
                        logstd: 0,
                        use_yn: 'Y',
                        k_modifier: 'fe2',
                        modi_date: '2024-06-04 09:37:08.000000504',
                        seq: 31579,
                    },
                    {
                        k_writer: '시스템',
                        reg_date: '2024-05-20 15:12:52.000000626',
                        s_seq: 5031804,
                        d_site_name: 'LF몰',
                        logstd: 0,
                        use_yn: 'Y',
                        k_modifier: 'fe2',
                        modi_date: '2024-06-04 09:37:08.000000504',
                        seq: 31573,
                    },
                    {
                        k_writer: '시스템',
                        reg_date: '2024-05-20 15:12:52.000000588',
                        s_seq: 5031271,
                        d_site_name: '롤수넷',
                        logstd: 0,
                        use_yn: 'Y',
                        k_modifier: 'fe2',
                        modi_date: '2024-06-04 09:37:08.000000504',
                        seq: 31562,
                    },
                ],
            };

            console.log(result);
        }
        // 인기도 지수 등록/수정/삭제
        else if (body.cmd === 'PM') {
            result = {
                code: 200,
            };
        }

        // await delay(5000);

        return HttpResponse.json({ result: result });
    }),
];
