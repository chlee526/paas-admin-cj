import { http, HttpResponse, delay } from 'msw';

export const log_handler = [
    // 사이트
    http.post(process.env.VUE_APP_BASE_API + '/api/admin/logdata', async ({ request, params, cookies }) => {
        const body = await request.json(); // convert the stream to a JavaScript object
        let result = {};
        // 전체 사이트 목록
        if (body.cmd === 'LS') {
            result = {
                total: 100,
                list: [
                    { seq: 1, menu: 0, user_grp: 2, ip: '59.7.77.49', dept: '', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 2, menu: 0, user_grp: 3, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 3, menu: 0, user_grp: 2, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 4, menu: 0, user_grp: 2, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 5, menu: 0, user_grp: 3, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-03-21 10:41:55' },
                    { seq: 6, menu: 0, user_grp: 2, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 7, menu: 0, user_grp: 2, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-23 10:41:55' },
                    { seq: 8, menu: 0, user_grp: 2, ip: '59.7.77.49', dept: '', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 9, menu: 1, user_grp: 3, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 10, menu: 0, user_grp: 1, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 11, menu: 1, user_grp: 2, ip: '59.7.77.49', dept: '', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 12, menu: 0, user_grp: 1, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 13, menu: 0, user_grp: 3, ip: '59.7.77.49', dept: '', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 14, menu: 0, user_grp: 1, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-20 10:41:55' },
                    { seq: 15, menu: 0, user_grp: 3, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 16, menu: 0, user_grp: 1, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-03-25 10:41:55' },
                    { seq: 17, menu: 0, user_grp: 1, ip: '59.7.77.49', dept: '', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 18, menu: 0, user_grp: 1, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 19, menu: 1, user_grp: 1, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                    { seq: 20, menu: 1, user_grp: 1, ip: '59.7.77.49', dept: '서비스 개발', m_id: 'devel', m_name: 'RSN 개발자', reg_date: '2024-04-25 10:41:55' },
                ],
            };

            console.log(result);
        }

        // await delay(1000);

        return HttpResponse.json({ result: result });
    }),
];
