import { http, HttpResponse, delay } from 'msw';

export const excel_data_handler = [
    http.post(process.env.VUE_APP_BASE_API + '/api/data/excel', async () => {
        let result = [];

        for (let i = 0; i < 100000; i++) {
            result.push({
                name: `2024년 반가워'용' 새해 캠페인_G-LIGHT 송출 모습/CGV CGV는 갑진년(甲辰年) 새해를 맞아 서울 전역의 대형 디지털 미디어에서 2024년 반가워'용' 새해 캠페인을 진행한다고 1일 밝혔다. CGV는 매년 삼성동 K-POP LIVE에서 새로운 해의 주인공인 십이간지 동물이 등장하는 캠페인을 진행해 시민들에게 새해의 기운을 북돋아 주고 있다. 2023년에는 거대 복(福)토끼, 2022년 흑호(黑虎) 등을 소재로 캠페인을 진행한 바 있다. 올해 캠페인은 청룡의 해를 기념해 푸른 용이 밝게 웃으며 시민들에게 새해 인사를 건네 시선을 사로잡는다. 캠페인은 1월 31일까지 송출되며 캠페인 송출 장소는 ▲삼성동 K-POP LIVE를 비롯해 강남대로에 위치한 ▲G-LIGHT ▲ GI-LIVE ▲GM-LIVE GV-LIVE 명동에서 볼 수 있는 ▲ME-LIVE & MN-LIVE, 지하철 2호선 안의 영상 미디어 ▲METRO-LIVE, 서울시 53개 역사의 100개 출입구 상단에 위치한 ▲METRO-GATE, CGV용산아이파크몰의 플래그십 ▲디지털 사이니지(FDS) 미디어 등으로 보다 확대됐다. 캠페인 관련 자세한 내용은 CGV OOH 인스타그램에서 확인 가능하다. 한편 CGV는 지난 2021년 12월, CJ 올리브네트웍스 광고사업부문과의 합병 이후 극장 인프라를 활용한 스크린 광고 외에도 OOH(옥외 광고)와 DX(Digital experience) 등 다양한 사업 영역으로 포트폴리오를 강화하고 있다. 삼성동 코엑스몰의 'S-LIVE'와 삼성동 무역센터의 'K-POP LIVE', 강남대로 'G-LIGHT', 종로 'J-LIVE', 을지로 'ME-LIVE', 'MN-LIVE' 그리고 지하철 2호선 등에서 미디어플랫폼을 운영하며 국내 옥외 미디어 시장을 선도하고 있다.`,
                // name: '이름',
                age: 20,
                job: '개발자',
                test1: 'test1',
                test2: 'test2',
                test3: 'test3',
                test4: 'test4',
                test5: 'test5',
                test6: 'test6',
                test7: 'test7',
                test8: 'test8',
                test9: 'test9',
                test10: 'test10',
                date: new Date(),
            });
        }

        return HttpResponse.json({ result: result });
    }),
];
