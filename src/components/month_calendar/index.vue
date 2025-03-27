<template>
    <div class="month_calendar">
        <div class="year_box">
            <comp-button v-for="item in getYearList" :key="item.year" class="is-large" :class="{ 'is-active': getCurrentYear === item.year }" :disabled="item.disabled" @click="setYear(item.year)">
                <span class="txt">{{ item.year }}년</span>
            </comp-button>
        </div>
        <div class="month_box">
            <comp-button v-for="item in getMonthList" :key="item.month" :class="{ 'is-active': getCurrentMonth === item.month }" :disabled="item.disabled" @click="setMonth(item.month)">
                <span class="txt">{{ item.month.numAddZero() }}월</span>
            </comp-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'comp-month-calendar',
    data() {
        return {
            year: null,
        };
    },
    props: {
        opts: { type: Object, required: true }, // {minDate: String, maxDate: String}
        value: { type: Object, required: true }, // {s_date: String, e_date: String}
    },
    computed: {
        result: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
        getYearList() {
            const list = [];
            for (let i = 0; i < 2; i++) {
                list.push({
                    year: this.minDate.getFullYear() + i,
                    disabled: this.minDate.getFullYear() + i > this.maxDate.getFullYear(),
                });
            }
            return list;
        },

        getMonthList() {
            const list = [];

            for (let i = 0; i < 12; ++i) {
                const month = i + 1;

                if (this.minDate.getFullYear() >= this.getCurrentYear && this.minDate.getMonth() > i) {
                    list.push({ month, disabled: true });
                    continue;
                }
                if (this.maxDate.getFullYear() <= this.getCurrentYear && this.maxDate.getMonth() < i) {
                    list.push({ month, disabled: true });
                    continue;
                }
                list.push({ month, disabled: false });
            }
            return list;
        },

        minDate() {
            return this.opts?.minDate.strToDate();
        },

        maxDate() {
            return this.opts?.maxDate.strToDate();
        },

        getCurrentYear() {
            return this.result.s_date.strToDate().getFullYear();
        },

        getCurrentMonth() {
            return this.result.s_date.strToDate().getMonth() + 1;
        },
    },
    created() {
        this.year = this.getCurrentYear;
    },
    methods: {
        /**
         * 월 변경
         * @param {String} month
         */
        setMonth(month) {
            let s_date = `${this.year}-${month.numAddZero()}-01`;
            let e_date = s_date.getLastDate();

            if (s_date.strToDate() < this.minDate) {
                s_date = this.minDate.dateToStr();
                e_date = s_date.getLastDate();
            }
            if (e_date.strToDate() > this.maxDate) {
                e_date = this.maxDate.dateToStr();
            }

            this.result = { s_date, e_date };
        },

        /**
         * 연도 변경
         * @param {String} year
         */
        setYear(year) {
            this.year = year;
            let month = this.getCurrentMonth;

            if (year === this.minDate.getFullYear() && this.getCurrentMonth < this.minDate.getMonth() + 1) {
                month = this.minDate.getMonth() + 1;
            }
            if (year === this.maxDate.getFullYear() && this.getCurrentMonth > this.maxDate.getMonth() + 1) {
                month = this.maxDate.getMonth() + 1;
            }
            this.setMonth(month);
        },
    },
};
</script>
<style lang="scss" src="./style.scss" scoped></style>
