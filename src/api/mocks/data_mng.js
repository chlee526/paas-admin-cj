/**
 * SNS계정 목업 API
 */

import { http, HttpResponse, delay } from 'msw';

export const data_mng_handler = [
    http.post(process.env.VUE_APP_BASE_API + '/api/data/mng', async ({ request, params, cookies }) => {
        const body = await request.json(); // convert the stream to a JavaScript object
        let result = {};

        // SNS마스터 목록
        if (body.cmd === 'DL') {
            result = {
                // list: [
                //     { type: 'ND', excel_date: '2023-09-29', name: '보도자료' },
                //     { type: 'MS', excel_date: '2023-10-30', name: '매체별 검색량 통계' },
                //     { type: 'MT', excel_date: '2023-11-01', name: '매체별 트래픽 통계' },
                //     { type: 'MN', excel_date: '2023-12-02', name: '매체별 SNS 계정' },
                //     { type: 'SR', excel_date: '2024-01-12', name: 'SNS 계정별 반응량' },
                // ],
                list: [
                    {
                        year: '2024',
                        months: [
                            {
                                name: '전체 다운로드_T',
                                month: '01',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                    {
                                        name: '매체별 검색량 통계_T',
                                        excel_path: '',
                                    },
                                    {
                                        name: '매체별 트래픽 통계_T',
                                        excel_path: '',
                                    },
                                    {
                                        name: '매체별 SNS 계정',
                                        excel_path: '',
                                    },
                                    {
                                        name: 'SNS 계정별 반응량_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '02',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                    {
                                        name: '매체별 검색량 통계_T',
                                        excel_path: '',
                                    },
                                    {
                                        name: '매체별 트래픽 통계_T',
                                        excel_path: '',
                                    },
                                    {
                                        name: '매체별 SNS 계정',
                                        excel_path: '',
                                    },
                                    {
                                        name: 'SNS 계정별 반응량_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '03',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '04',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '12',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        year: '2023',
                        months: [
                            {
                                name: '전체 다운로드_T',
                                month: '12',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                    {
                                        name: '매체별 검색량 통계_T',
                                        excel_path: '',
                                    },
                                    {
                                        name: '매체별 트래픽 통계_T',
                                        excel_path: '',
                                    },
                                    {
                                        name: '매체별 SNS 계정',
                                        excel_path: '',
                                    },
                                    {
                                        name: 'SNS 계정별 반응량_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                            {
                                name: '전체 다운로드_T',
                                month: '05',
                                excel_path: '',
                                list: [
                                    {
                                        name: '보도자료 데이터_T',
                                        excel_path: '',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
        }
        // 다운로드 요청
        else if (body.cmd === 'ED') {
            result.url = 'http://fe.cjmia.devel.com:8604/tmp_excel.xlsx';
            await delay(1000);
        }

        return HttpResponse.json({ result: result });
    }),
];
