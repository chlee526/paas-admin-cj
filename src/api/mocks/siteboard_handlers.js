import { http, HttpResponse, delay } from 'msw';

export const site_board_handler = [
    http.post(process.env.VUE_APP_BASE_API + '/api/admin/siteboard/', async ({ request, params, cookies }) => {
        const body = await request.json(); // convert the stream to a JavaScript object
        let result = {};
        // 제휴 수집원 목록
        if (body.cmd === 'SB') {
            result = {
                total: 12,
                list: [
                    {
                        reg_date: '2024-10-25 17:39:41.0',
                        s_seq: '363',
                        use_yn: 'Y',
                        modifier: '성민석',
                        channel: '커뮤니티',
                        writer: 'fe',
                        modi_date: '2024-10-25 17:58:04.0',
                        seq: '1',
                        sb_name: '1234',
                        s_name_cj: '씽크풀',
                    },
                    {
                        reg_date: '2024-10-25 17:44:41.0',
                        s_seq: '363',
                        use_yn: 'Y',
                        modifier: 'fe',
                        channel: '커뮤니티',
                        writer: 'fe',
                        modi_date: '2024-10-25 17:44:41.0',
                        seq: '5',
                        sb_name: 'AI정보분석 > 공시분석 > 공시전체보기',
                        s_name_cj: '씽크풀',
                    },
                    {
                        reg_date: '2024-10-28 13:40:50.0',
                        s_seq: '505',
                        use_yn: 'Y',
                        modifier: 'fe3',
                        channel: '커뮤니티',
                        writer: '성민석',
                        modi_date: '2025-01-07 18:58:40.0',
                        seq: '13',
                        sb_name: '1234124',
                        s_name_cj: '모네타',
                    },
                    {
                        reg_date: '2024-10-25 17:58:12.0',
                        s_seq: '1057',
                        use_yn: 'Y',
                        modifier: '성민석',
                        channel: '커뮤니티',
                        writer: '성민석',
                        modi_date: '2024-10-25 17:58:12.0',
                        seq: '6',
                        sb_name: '1231242345',
                        s_name_cj: '아줌마닷컴',
                    },
                    {
                        reg_date: '2024-10-28 09:41:42.0',
                        s_seq: '505',
                        use_yn: 'Y',
                        modifier: 'fe',
                        channel: '커뮤니티',
                        writer: 'fe',
                        modi_date: '2024-10-28 09:41:42.0',
                        seq: '12',
                        sb_name: '1',
                        s_name_cj: '모네타',
                    },
                    {
                        reg_date: '2024-10-28 09:41:32.0',
                        s_seq: '363',
                        use_yn: 'Y',
                        modifier: 'fe',
                        channel: '커뮤니티',
                        writer: 'fe',
                        modi_date: '2024-10-28 09:41:32.0',
                        seq: '11',
                        sb_name: '1',
                        s_name_cj: '씽크풀',
                    },
                    {
                        reg_date: '2024-10-31 11:17:56.0',
                        s_seq: '3',
                        use_yn: 'Y',
                        modifier: 'fe',
                        channel: '뉴스',
                        writer: 'fe',
                        modi_date: '2024-10-31 11:17:56.0',
                        seq: '14',
                        sb_name: '네이버 뉴스',
                        s_name_cj: '한국경제',
                    },
                    {
                        reg_date: '2024-10-31 11:18:18.0',
                        s_seq: '13',
                        use_yn: 'Y',
                        modifier: 'fe',
                        channel: '뉴스',
                        writer: 'fe',
                        modi_date: '2024-10-31 11:18:18.0',
                        seq: '15',
                        sb_name: '123',
                        s_name_cj: '파이낸셜뉴스',
                    },
                    {
                        reg_date: '2024-10-31 11:18:53.0',
                        s_seq: '363',
                        use_yn: 'Y',
                        modifier: 'fe',
                        channel: '커뮤니티',
                        writer: 'fe',
                        modi_date: '2024-10-31 11:18:53.0',
                        seq: '16',
                        sb_name: 'AI정보분석 > 리포트분석 > 리포트전체보기',
                        s_name_cj: '씽크풀',
                    },
                    {
                        reg_date: '2024-10-31 11:19:01.0',
                        s_seq: '17',
                        use_yn: 'Y',
                        modifier: '윤혜인',
                        channel: '뉴스',
                        writer: 'fe',
                        modi_date: '2025-01-07 17:10:51.0',
                        seq: '17',
                        sb_name: '네이트 뉴스',
                        s_name_cj: '오마이뉴스',
                    },
                    {
                        reg_date: '2025-01-07 17:05:31.0',
                        s_seq: '17',
                        use_yn: '',
                        modifier: '윤혜인',
                        channel: '',
                        writer: '윤혜인',
                        modi_date: '2025-01-07 17:05:31.0',
                        seq: '18',
                        sb_name: '',
                        s_name_cj: '',
                    },
                    {
                        reg_date: '2025-01-07 17:06:19.0',
                        s_seq: '17',
                        use_yn: '',
                        modifier: '윤혜인',
                        channel: '',
                        writer: '윤혜인',
                        modi_date: '2025-01-07 17:06:19.0',
                        seq: '19',
                        sb_name: '',
                        s_name_cj: '',
                    },
                ],
            };

            console.log(result);
        }
        // 수집원 목록
        else if (body.cmd === 'SC') {
            result = {
                list: [
                    {
                        reg_date: '2024-10-24 20:35:34.0',
                        s_seq: '363',
                        sb_name: 'AI정보분석 > 공시분석 > 공시전체보기',
                        s_name_cj: '씽크풀',
                    },
                    {
                        reg_date: '2024-10-24 20:35:34.0',
                        s_seq: '363',
                        sb_name: 'AI정보분석 > 뉴스 > 전체보기',
                        s_name_cj: '씽크풀',
                    },
                    {
                        reg_date: '2024-10-24 20:35:34.0',
                        s_seq: '363',
                        sb_name: '토론실 > 주식종합토론',
                        s_name_cj: '씽크풀',
                    },
                    {
                        reg_date: '2024-10-24 20:35:34.0',
                        s_seq: '1089',
                        sb_name: '독자투고',
                        s_name_cj: '딴지일보',
                    },
                    {
                        reg_date: '2024-10-24 20:35:34.0',
                        s_seq: '3281',
                        sb_name: '쇼핑지식 \n뉴스 \n 자동차/레저',
                        s_name_cj: '에누리',
                    },
                ],
                total: 5,
            };
        }

        // 수집원 목록
        else if (body.cmd === 'BS') {
            result = {
                code: 200,
            };
        }
        // await delay(5000);

        return HttpResponse.json({ result: result });
    }),
];
