/* eslint-disable no-undef */

/**
 * ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * exceljs 를 이용한 엑셀 다운로드용 web worker
 *
 * [필수] 같은 경로에 exceljs.min.js 파일 필요 (script import 용)
 *
 * 개별 cell, row 별 스타일 관련 로직
 * https://github.com/exceljs/exceljs 참조
 *
 * ==================================================
 * [worker]
 * self.onmessage - 외부에서 worker로 데이터 전달 시 받아오는 구문
 * self.postmessage - web worker 내부 로직 처리 후 외부로 전달 구문
 *
 * ==================================================
 * [exceljs] - param 값 (list: array, columns: array, sheetName: string)
 *
 * 대량 데이터로 sheet에 insertRows() 메서드를 실행 할 경우 Maximun call 에러 발생으로 인하여 10000건 이상 시 데이터를 나눠서 insert 처리
 * 엑셀 기본 폼 기준 스타일링에 따라서 작성하였기 때문에 col헤더 스타일링은 고정
 *
 *
 * ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 */

if ('function' === typeof importScripts) {
    // exceljs import
    importScripts('/assets/exceljs.min.js');

    // worker.js
    self.onmessage = (event) => {
        const columns = event.data.columns == undefined ? [] : event.data.columns;

        const batchSize = event.data.list.length > 10000 ? 10000 : event.data.list.length;

        // 외부 전달 컬럼 목록
        let dobCol = [];

        // excelWorkBook 생성
        const workBook = new ExcelJS.Workbook();

        // 외부 데이터 excelWorkBook 주입
        workBook.addWorksheet(event.data.sheetName);

        // sheet 생성
        const workSheet = workBook.getWorksheet();

        // columns 설정이 없을 경우 코드값으로 col header 설정
        if (columns.length > 0) {
            workSheet.columns = columns;
            dobCol = columns;
        } else {
            let result = Object.keys(event.data.list[0]).map((key) => {
                let tmp = {};
                tmp.header = key;
                tmp.key = key;

                return tmp;
            });

            workSheet.columns = result;
            dobCol = result;
        }

        // sheet 첫번째 행(컬럼) 스타일 지정
        dobCol.forEach((item) => {
            let col = workSheet.getColumn(item.key);
            col.eachCell((cell, rowNumber) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.style.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D9D9D9' },
                };
                cell.style.font = {
                    ...cell.style.font,
                    bold: true,
                };
            });
        });

        // 대용량 json 일경우 나눠서 insertRows 실행
        if (batchSize != 10000) {
            workSheet.insertRows(2, event.data.list);
        } else {
            for (let i = 0; i < event.data.list.length; i += batchSize) {
                const batch = event.data.list.slice(i, i + batchSize);

                if (i < 2) {
                    workSheet.insertRows(2, batch);
                } else {
                    workSheet.insertRows(i, batch);
                }
            }
        }

        const dataColumns = [];

        workSheet.columns.forEach((column, index) => {
            if (workSheet.getRow(1).getCell(index + 1).value !== undefined) {
                dataColumns.push(index + 1);
            }
        });

        // 각 셀의 데이터 여부에 따라 테두리 스타일 적용
        workSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            // 첫번째 row 일경우 높이 값 수정
            // height 값 경우에는 단위
            if (rowNumber == 1) {
                row.height = 24;
            }
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (!dataColumns.includes(colNumber)) {
                    cell.border = null;
                } else {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                }
            });
        });

        // 첫번째 행(헤더 컬럼) 고정처리
        workSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'B2' }];

        // web worker 작업 완료 후 외부로 blob 형태로 전달
        workBook.xlsx.writeBuffer().then((res) => {
            const blob = new Blob([res], { type: 'application/octet-stream' });
            self.postMessage(blob);
        });
    };
}
