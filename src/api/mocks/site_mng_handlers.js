import { http, HttpResponse, delay } from 'msw';

export const site_mng_handler = [
    // 사이트
    http.post(process.env.VUE_APP_BASE_API + '/api/admin/site', async ({ request, params, cookies }) => {
        const body = await request.json(); // convert the stream to a JavaScript object
        let result = {};
        // 전체 사이트 목록
        if (body.cmd === 'SA') {
            result = {
                list: [
                    { s_seq: '4', name: '동아일보', lang: 'KOR', url: 'https://www.donga.com', status: 1 },
                    { s_seq: '15', name: '대한민국정부', lang: 'KOR', url: 'http://www.korea.go.kr', status: 0 },
                    { s_seq: '27', name: '가스신문', lang: 'ENG', url: 'http://www.gasnews.com', status: 1 },
                    { s_seq: '28', name: '강원도민일보', lang: 'KOR', url: 'http://www.kado.net', status: 1 },
                    { s_seq: '29', name: '강원일보', lang: 'KOR', url: 'https://www.kwnews.co.kr', status: 1 },
                    { s_seq: '32', name: '대전일보', lang: 'ENG', url: 'http://www.daejonilbo.com', status: 1 },
                    { s_seq: '33', name: '무등일보', lang: 'KOR', url: 'http://www.honam.co.kr', status: 1 },
                    { s_seq: '34', name: '매일신문', lang: 'KOR', url: 'http://news.imaeil.com', status: 1 },
                    { s_seq: '36', name: '제주일보', lang: 'KOR', url: 'http://www.jejunews.com', status: 1 },
                    { s_seq: '61', name: '국토교통부', lang: 'KOR', url: 'http://www.molit.go.kr', status: 1 },
                    { s_seq: '62', name: '경기도청', lang: 'KOR', url: 'https://www.gg.go.kr', status: 1 },
                    { s_seq: '63', name: '경기도의회', lang: 'GLB', url: 'http://www.ggc.go.kr', status: 1 },
                    { s_seq: '66', name: '경남신문', lang: 'KOR', url: 'http://www.knnews.co.kr', status: 1 },
                    { s_seq: '68', name: '경남일보', lang: 'KOR', url: 'http://www.gnnews.co.kr', status: 1 },
                    { s_seq: '69', name: '경상일보', lang: 'KOR', url: 'http://www.ksilbo.co.kr', status: 1 },
                    { s_seq: '70', name: '경실련_경제정의실천시민연합', lang: 'KOR', url: 'http://www.ccej.or.kr', status: 1 },
                    { s_seq: '73', name: '사이버경찰청', lang: 'KOR', url: 'https://www.police.go.kr', status: 1 },
                    { s_seq: '75', name: '전국공공노동조합연맹', lang: 'KOR', url: 'http://public.inochong.org', status: 1 },
                    { s_seq: '76', name: '환경법률센터', lang: 'KOR', url: 'http://www.ecolaw.or.kr', status: 1 },
                    { s_seq: '77', name: '공정거래위원회', lang: 'KOR', url: 'https://www.ftc.go.kr', status: 1 },
                    { s_seq: '79', name: '광주은행', lang: 'KOR', url: 'http://www.kjbank.com', status: 1 },
                    { s_seq: '81', name: '교보증권', lang: 'KOR', url: 'http://www.iprovest.com', status: 1 },
                    { s_seq: '82', name: '교수신문', lang: 'KOR', url: 'http://www.kyosu.net', status: 1 },
                    { s_seq: '86', name: '국가보훈처', lang: 'KOR', url: 'https://www.mpva.go.kr', status: 1 },
                    { s_seq: '87', name: '국가정보원', lang: 'KOR', url: 'https://www.nis.go.kr:4016/main.do', status: 1 },
                    { s_seq: '89', name: '국무조정실 국무총리비서실', lang: 'KOR', url: 'https://www.opm.go.kr', status: 1 },
                    { s_seq: '90', name: '국민권익위원회', lang: 'KOR', url: 'https://www.acrc.go.kr', status: 1 },
                    { s_seq: '92', name: '대한민국_국방부', lang: 'KOR', url: 'https://www.mnd.go.kr', status: 1 },
                    { s_seq: '93', name: '국세청', lang: 'KOR', url: 'https://www.nts.go.kr', status: 1 },
                    { s_seq: '96', name: '국제금융센터', lang: 'KOR', url: 'https://www.kcif.or.kr', status: 1 },
                    { s_seq: '98', name: '신한금융투자', lang: 'KOR', url: 'http://www.shinhaninvest.com', status: 1 },
                    { s_seq: '99', name: '규제개혁위원회', lang: 'KOR', url: 'https://www.better.go.kr', status: 1 },
                    { s_seq: '101', name: '예스코', lang: 'KOR', url: 'https://www.lsyesco.com', status: 0 },
                    { s_seq: '103', name: '금융감독원', lang: 'KOR', url: 'http://www.fss.or.kr', status: 1 },
                    { s_seq: '104', name: '금융결제원', lang: 'KOR', url: 'http://www.kftc.or.kr', status: 1 },
                    { s_seq: '112', name: '기독교환경운동연대', lang: 'KOR', url: 'http://www.greenchrist.org', status: 1 },
                    { s_seq: '114', name: '기술신용보증기금', lang: 'KOR', url: 'http://www.kibo.or.kr', status: 1 },
                    { s_seq: '115', name: '기업은행', lang: 'KOR', url: 'http://www.ibk.co.kr', status: 1 },
                    { s_seq: '116', name: '기탄교육', lang: 'KOR', url: 'https://www.gitan.co.kr', status: 1 },
                    { s_seq: '121', name: '넥스테이션', lang: 'KOR', url: 'http://www.nextation.co.kr', status: 0 },
                    { s_seq: '125', name: '해외건설종합서비스', lang: 'KOR', url: 'http://www.icak.or.kr', status: 1 },
                    { s_seq: '127', name: '노사정위원회', lang: 'KOR', url: 'https://www.eslc.go.kr', status: 1 },
                    { s_seq: '128', name: '녹색소비자연대전국협의회', lang: 'KOR', url: 'http://www.gcn.or.kr', status: 1 },
                    { s_seq: '129', name: '녹색연합', lang: 'KOR', url: 'http://www.greenkorea.org', status: 1 },
                    { s_seq: '132', name: '농수축산신문', lang: 'KOR', url: 'http://www.aflnews.co.kr', status: 1 },
                    { s_seq: '133', name: '농촌진흥청', lang: 'KOR', url: 'https://www.rda.go.kr', status: 1 },
                    { s_seq: '136', name: 'NH농협', lang: 'KOR', url: 'http://www.nonghyup.com', status: 1 },
                    { s_seq: '138', name: '법제처', lang: 'KOR', url: 'https://www.moleg.go.kr', status: 1 },
                    { s_seq: '142', name: '대검찰청', lang: 'KOR', url: 'https://www.spo.go.kr', status: 1 },
                    { s_seq: '146', name: '대림산업석유화학사업부노동조합', lang: 'KOR', url: 'http://daelim.nodong.org', status: 1 },
                    { s_seq: '147', name: '대성산업가스노동조합', lang: 'KOR', url: 'http://www.sansonojo.or.kr', status: 0 },
                    { s_seq: '148', name: '대신투자증권', lang: 'KOR', url: 'http://www.daishin.co.kr', status: 1 },
                    { s_seq: '150', name: '대우조선노동조합', lang: 'KOR', url: 'http://www.dswu.or.kr', status: 1 },
                    { s_seq: '152', name: '아주캐피탈', lang: 'KOR', url: 'http://www.ajucapital.co.kr', status: 1 },
                    { s_seq: '156', name: '대한골관절종양학회', lang: 'KOR', url: 'https://kmsts.org/', status: 1 },
                    { s_seq: '157', name: '대한안면통증구강내과학회', lang: 'KOR', url: 'http://www.kaom.org', status: 1 },
                    { s_seq: '158', name: '대한내과학회', lang: 'KOR', url: 'http://www.kaim.or.kr', status: 1 },
                    { s_seq: '159', name: '대한당뇨병학회', lang: 'KOR', url: 'http://www.diabetes.or.kr', status: 0 },
                    { s_seq: '160', name: '대한마취학회', lang: 'KOR', url: 'http://www.anesthesia.or.kr', status: 0 },
                    { s_seq: '162', name: '대한민국국회', lang: 'KOR', url: 'https://www.assembly.go.kr', status: 1 },
                    { s_seq: '163', name: '에듀왕', lang: 'KOR', url: 'https://www.eduwang.com', status: 1 },
                    { s_seq: '184', name: '대한영상의학회', lang: 'KOR', url: 'http://www.radiology.or.kr', status: 0 },
                    { s_seq: '186', name: '대한법률구조공단', lang: 'KOR', url: 'http://www.klac.or.kr', status: 1 },
                    { s_seq: '187', name: '대한병원협회', lang: 'KOR', url: 'http://www.kha.or.kr', status: 1 },
                    { s_seq: '188', name: '대한산부인과학회', lang: 'KOR', url: 'http://www.ksog.org', status: 0 },
                    { s_seq: '189', name: '대한생리학회', lang: 'KOR', url: 'http://koreaphysiology.org', status: 1 },
                    { s_seq: '191', name: '손해보험협회', lang: 'KOR', url: 'https://www.knia.or.kr', status: 1 },
                    { s_seq: '192', name: '대한송유관공사', lang: 'KOR', url: 'http://www.dopco.co.kr', status: 1 },
                    { s_seq: '193', name: '대한심장학회', lang: 'KOR', url: 'http://www.circulation.or.kr', status: 1 },
                    { s_seq: '196', name: '대한안과학회', lang: 'KOR', url: 'http://www.ophthalmology.org', status: 0 },
                    { s_seq: '197', name: '대한한돈협회', lang: 'KOR', url: 'http://www.koreapork.or.kr', status: 1 },
                    { s_seq: '199', name: '대한의학유전학회', lang: 'KOR', url: 'http://www.ksmg.or.kr', status: 1 },
                    { s_seq: '200', name: '대한이식학회', lang: 'KOR', url: 'http://www.ksot.org', status: 0 },
                    { s_seq: '202', name: '대한병리학회', lang: 'KOR', url: 'http://www.pathology.or.kr', status: 0 },
                    { s_seq: '203', name: '대한정형외과학회', lang: 'KOR', url: 'https://www.koa.or.kr', status: 1 },
                    { s_seq: '204', name: '한국여성소비자연합', lang: 'KOR', url: 'http://www.jubuclub.or.kr', status: 1 },
                    { s_seq: '205', name: '대한주산의학회', lang: 'KOR', url: 'http://www.perinatol.or.kr', status: 1 },
                    { s_seq: '206', name: '대한치과의사협회', lang: 'KOR', url: 'https://www.kda.or.kr', status: 1 },
                    { s_seq: '215', name: '데일리메디', lang: 'KOR', url: 'http://www.dailymedi.com', status: 1 },
                    { s_seq: '216', name: '데일리팜', lang: 'KOR', url: 'http://www.dailypharm.com', status: 1 },
                ],
            };

            console.log(result);
        }
        // 수집 사이트 목록
        else if (body.cmd === 'SL') {
            result = {
                list: [
                    { s_seq: '1', grp: '1', gr_name: '뉴스', name: '조선일보', lang: 'KOR', url: 'https://www.chosun.com', status: '1' },
                    { s_seq: '3', grp: '1', gr_name: '뉴스', name: '한국경제', lang: 'KOR', url: 'https://www.hankyung.com', status: '1' },
                    { s_seq: '8', grp: '1', gr_name: '뉴스', name: '세계일보', lang: 'KOR', url: 'https://www.segye.com', status: '1' },
                    { s_seq: '9', grp: '1', gr_name: '뉴스', name: '한겨레신문', lang: 'KOR', url: 'https://www.hani.co.kr', status: '1' },
                    { s_seq: '10', grp: '1', gr_name: '뉴스', name: '한국일보', lang: 'KOR', url: 'http://www.hankookilbo.com', status: '1' },
                    { s_seq: '11', grp: '1', gr_name: '뉴스', name: '서울경제', lang: 'KOR', url: 'https://www.sedaily.com', status: '1' },
                    { s_seq: '12', grp: '1', gr_name: '뉴스', name: '헤럴드경제', lang: 'KOR', url: 'http://biz.heraldcorp.com', status: '1' },
                    { s_seq: '13', grp: '1', gr_name: '뉴스', name: '파이낸셜뉴스', lang: 'KOR', url: 'https://www.fnnews.com', status: '1' },
                    { s_seq: '17', grp: '1', gr_name: '뉴스', name: '오마이뉴스', lang: 'KOR', url: 'https://www.ohmynews.com', status: '1' },
                    { s_seq: '18', grp: '1', gr_name: '뉴스', name: '디지털타임스', lang: 'KOR', url: 'https://www.dt.co.kr', status: '1' },
                    { s_seq: '19', grp: '1', gr_name: '뉴스', name: '쿠키뉴스', lang: 'KOR', url: 'https://www.kukinews.com', status: '1' },
                    { s_seq: '20', grp: '2', gr_name: '포탈', name: '문화일보', lang: 'KOR', url: 'http://www.munhwa.com', status: '1' },
                    { s_seq: '21', grp: '2', gr_name: '포탈', name: '연합뉴스', lang: 'KOR', url: 'https://www.yna.co.kr', status: '1' },
                    { s_seq: '23', grp: '1', gr_name: '뉴스', name: '내일신문', lang: 'KOR', url: 'http://www.naeil.com', status: '1' },
                    { s_seq: '24', grp: '1', gr_name: '뉴스', name: '스포츠서울', lang: 'KOR', url: 'http://www.sportsseoul.com', status: '1' },
                    { s_seq: '35', grp: '1', gr_name: '뉴스', name: '인천일보', lang: 'KOR', url: 'http://www.incheonilbo.com', status: '1' },
                    { s_seq: '37', grp: '1', gr_name: '뉴스', name: '조세일보', lang: 'KOR', url: 'http://www.joseilbo.com', status: '1' },
                    { s_seq: '72', grp: '1', gr_name: '뉴스', name: '경인일보', lang: 'KOR', url: 'http://www.kyeongin.com', status: '1' },
                    { s_seq: '74', grp: '1', gr_name: '뉴스', name: '경향신문', lang: 'KOR', url: 'https://www.khan.co.kr', status: '1' },
                    { s_seq: '88', grp: '1', gr_name: '뉴스', name: '질병관리청', lang: 'KOR', url: 'https://www.kdca.go.kr', status: '1' },
                    { s_seq: '131', grp: '1', gr_name: '뉴스', name: '농민신문', lang: 'KOR', url: 'https://www.nongmin.com', status: '1' },
                    { s_seq: '161', grp: '1', gr_name: '뉴스', name: '서울신문', lang: 'KOR', url: 'https://www.seoul.co.kr', status: '1' },
                    { s_seq: '233', grp: '1', gr_name: '뉴스', name: '머니투데이', lang: 'KOR', url: 'https://www.mt.co.kr', status: '1' },
                    { s_seq: '275', grp: '1', gr_name: '뉴스', name: '베타뉴스', lang: 'KOR', url: 'http://www.betanews.net', status: '1' },
                    { s_seq: '346', grp: '1', gr_name: '뉴스', name: '스포츠조선', lang: 'KOR', url: 'https://sports.chosun.com', status: '1' },
                    { s_seq: '352', grp: '1', gr_name: '뉴스', name: '시사저널', lang: 'KOR', url: 'http://www.sisajournal.com', status: '1' },
                    { s_seq: '391', grp: '1', gr_name: '뉴스', name: '여성신문', lang: 'KOR', url: 'http://www.womennews.co.kr', status: '1' },
                    { s_seq: '398', grp: '1', gr_name: '뉴스', name: '한국경제TV', lang: 'KOR', url: 'https://www.wowtv.co.kr', status: '1' },
                    { s_seq: '408', grp: '1', gr_name: '뉴스', name: '월간조선', lang: 'KOR', url: 'https://monthly.chosun.com', status: '1' },
                    { s_seq: '409', grp: '1', gr_name: '뉴스', name: '월간중앙', lang: 'KOR', url: 'http://jmagazine.joins.com/monthly', status: '1' },
                    { s_seq: '415', grp: '1', gr_name: '뉴스', name: '이데일리', lang: 'KOR', url: 'http://www.edaily.co.kr', status: '1' },
                    { s_seq: '457', grp: '1', gr_name: '뉴스', name: '스포츠한국', lang: 'KOR', url: 'https://sports.hankooki.com', status: '1' },
                    { s_seq: '474', grp: '1', gr_name: '뉴스', name: '주간조선', lang: 'KOR', url: 'http://weekly.chosun.com', status: '1' },
                    { s_seq: '509', grp: '1', gr_name: '뉴스', name: '프레시안', lang: 'KOR', url: 'http://www.pressian.com', status: '1' },
                    { s_seq: '518', grp: '1', gr_name: '뉴스', name: '한겨레21', lang: 'KOR', url: 'http://h21.hani.co.kr', status: '1' },
                    { s_seq: '521', grp: '1', gr_name: '뉴스', name: '한국세정신문', lang: 'KOR', url: 'http://www.taxtimes.co.kr', status: '1' },
                    { s_seq: '597', grp: '1', gr_name: '뉴스', name: '환경일보', lang: 'KOR', url: 'http://www.hkbs.co.kr', status: '1' },
                    { s_seq: '608', grp: '1', gr_name: '뉴스', name: '아이뉴스24', lang: 'KOR', url: 'http://www.inews24.com', status: '1' },
                    { s_seq: '631', grp: '1', gr_name: '뉴스', name: 'MBN', lang: 'KOR', url: 'https://www.mbn.co.kr', status: '1' },
                    { s_seq: '648', grp: '1', gr_name: '뉴스', name: 'YTN', lang: 'KOR', url: 'https://www.ytn.co.kr', status: '1' },
                    { s_seq: '652', grp: '1', gr_name: '뉴스', name: '시사뉴스', lang: 'KOR', url: 'http://www.sisa-news.com', status: '1' },
                    { s_seq: '654', grp: '1', gr_name: '뉴스', name: '경기신문', lang: 'KOR', url: 'http://www.kgnews.co.kr', status: '1' },
                    { s_seq: '784', grp: '1', gr_name: '뉴스', name: '부산일보', lang: 'KOR', url: 'https://www.busan.com', status: '1' },
                    { s_seq: '791', grp: '1', gr_name: '뉴스', name: '영남신문', lang: 'KOR', url: 'http://www.yeongnam.com', status: '1' },
                    { s_seq: '811', grp: '1', gr_name: '뉴스', name: '국제신문', lang: 'KOR', url: 'http://www.kookje.co.kr', status: '1' },
                    { s_seq: '869', grp: '1', gr_name: '뉴스', name: '중부일보', lang: 'KOR', url: 'http://www.joongboo.com', status: '1' },
                    { s_seq: '873', grp: '1', gr_name: '뉴스', name: '주간한국', lang: 'KOR', url: 'https://weekly.hankooki.com', status: '1' },
                    { s_seq: '881', grp: '1', gr_name: '뉴스', name: '미디어오늘', lang: 'KOR', url: 'http://www.mediatoday.co.kr', status: '1' },
                    { s_seq: '912', grp: '1', gr_name: '뉴스', name: '일요시사', lang: 'KOR', url: 'http://www.ilyosisa.co.kr', status: '1' },
                    { s_seq: '1052', grp: '1', gr_name: '뉴스', name: '매경이코노미', lang: 'KOR', url: 'https://www.mk.co.kr/economy', status: '1' },
                ],
            };
            console.log(result);
        }
        // 사이트 추가/삭제
        else if (body.cmd === 'SM') {
            result = {};
        }
        // 사이트 그룹 목록
        else if (body.cmd === 'GL') {
            result = {
                list: [
                    { grp: '1', name: '뉴스' },
                    { grp: '2', name: '포탈' },
                    { grp: '3', name: '블로그' },
                    { grp: '4', name: '카페' },
                    { grp: '5', name: '커뮤니티' },
                    { grp: '6', name: '트위터' },
                    { grp: '8', name: '인스타그램' },
                    { grp: '9', name: '유튜브' },
                    { grp: '37', name: '테스트사이트그룹5' },
                    // { grp: '38', name: '테스트사이트그룹5' },
                    // { grp: '39', name: '테스트사이트그룹5' },
                    // { grp: '40', name: '테스트사이트그룹5' },
                    // { grp: '41', name: '테스트사이트그룹5' },
                ],
            };
            console.log(result);
        }
        // 사이트 그룹 추가/수정/삭제
        else if (body.cmd === 'GM') {
            result = {};
        }
        // await delay(5000);

        return HttpResponse.json({ result: result });
    }),
];
