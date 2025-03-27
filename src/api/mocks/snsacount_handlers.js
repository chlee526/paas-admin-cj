/**
 * SNS계정 목업 API
 */

import { http, HttpResponse, delay } from 'msw';

export const snsacount_handler = [
    http.post(process.env.VUE_APP_BASE_API + '/api/admin/sns', async ({ request, params, cookies }) => {
        const snsList = [
            { sns_seq: 1, sns_name: '네이버TV' },
            { sns_seq: 2, sns_name: '네이버뉴스언론사홈' },
            { sns_seq: 3, sns_name: '네이버포스트' },
            { sns_seq: 4, sns_name: '유튜브' },
            { sns_seq: 5, sns_name: '인스타그램' },
            { sns_seq: 6, sns_name: '트위터' },
            { sns_seq: 7, sns_name: '페이스북' },
        ];
        const body = await request.json(); // convert the stream to a JavaScript object
        let result = {};
        // SNS마스터 목록
        if (body.cmd === 'NM') {
            result = {
                list: snsList,
            };
        }
        // 매체 목록
        else if (body.cmd === 'EL') {
            result = {
                list: [],
            };
            for (let Loop1 = 1; Loop1 <= 400; ++Loop1) {
                result.list.push({ site_name: `자동완선 ${Loop1}` });
            }
        }
        // 목록
        else if (body.cmd === 'NL') {
            result = {
                list: [],
            };
            const tmpDate = new Date(2023, 0, 1);
            for (let Loop1 = 1; Loop1 <= 501; ++Loop1) {
                result.list.push({
                    seq: Loop1,
                    site_name: `site_${Loop1}`,
                    sns_seq: snsList[parseInt(Math.random() * snsList.length)].sns_seq,
                    url: `url_${Loop1}`,
                    reg_dt: tmpDate.dateToStr(),
                });
                tmpDate.setDate(tmpDate.getDate() + 1);
            }
        }
        // 추가/수정/삭제
        else if (body.cmd === 'ES') {
            result = {};
            return HttpResponse.status(500).json({ result: result });
        }
        // await delay(5000);

        return HttpResponse.json({ result: result });
    }),
];
