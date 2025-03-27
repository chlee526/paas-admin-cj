# CompTopsearchAdmin

-   관리자 페이지용 Topsearch 컴포넌트

### 목차

1. [History](#history)
2. [File](#file)
3. [Useage](#useage)
4. [Props](#props)
5. [Events](#events)

---

### History

| 일자       | 버전  | 내용        |
| ---------- | ----- | ----------- |
| 2023-09-20 | 1.0.0 | README 작성 |

---

#### File

| 파일명 | 타입  | 설명     |
| ------ | ----- | -------- |
| index  | index | 컴포넌트 |

---

#### Useage

```vue
<comp-topsearch-admin :notyDisabled="" :searchInputDatas.sync="inputDatas" :searchDatas.sync="resultDatas">
  <template slot="input_forms">
      <tr>
          <th><h4>검색기간</h4></th>
          <td>
              <comp-datepicker id="issues_dp_s" :s_date.sync="inputDatas.s_date" :e_date.sync="inputDatas.e_date" range="3M" :min_date.sync="inputDatas.min_date" :max_date.sync="inputDatas.max_date" data-fixed="true" :date_grp="getDateGrp" :c_type.sync="inputDatas.dpCtype" :c_type_opts="['day', 'week', 'month']" :c_date_gap="-1"></comp-datepicker>
          </td>
      </tr>
      <tr>
          <th><h4>비교기간</h4></th>
          <td>
              <comp-datepicker
                  id="issues_dp_p"
                  :s_date.sync="inputDatas.ps_date"
                  :e_date.sync="inputDatas.pe_date"
                  range="3M"
                  :min_date.sync="inputDatas.p_min_date"
                  :max_date.sync="inputDatas.p_max_date"
                  data-fixed="true"
                  :p-date="{
                      s_date: inputDatas.s_date,
                      e_date: inputDatas.e_date,
                  }"
                  :p-date-chk.sync="inputDatas.popChk"
                  :c_type.sync="inputDatas.dpCtype"
                  :c_type_opts="['day', 'week', 'month']"></comp-datepicker>
          </td>
      </tr>
  </template>
</comp-topsearch-admin>
```

---

#### Props

| 필수 | Prop                 | 설명                                                             | 타입/값   | Default |
| :--: | :------------------- | :--------------------------------------------------------------- | --------- | ------- |
|  ✔   | **searchInputDatas** | 실시간 변경 반영되는 검색 조건                                   | `Object`  |         |
|  ✔   | **searchDatas**      | 검색버튼을 클릭한 시점의 searchInputDatas                        | `Object`  |         |
|      | **notyDisabled**     | 컴포넌트가 존재한 페이지 내 검색 중 noty화면 비 활성화 처리 여부 | `Boolean` | false   |

---
