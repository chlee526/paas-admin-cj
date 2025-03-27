<template>
    <div class="data_item">
        <div class="header">{{ getItemYear }}</div>
        <div class="data_list">
            <div class="data_wrap" :key="idx" v-for="(item, idx) in getList">
                <div class="header">
                    <div class="data_month" :class="item.isDate && 'is_date'">
                        <div class="month_num">{{ item.month }}</div>
                        <div class="month">Month</div>
                    </div>
                    <a class="down_btn" :href="item.excel_path" download>전체 다운로드</a>
                </div>
                <comp-list class="list list_wrap">
                    <template v-slot:default>
                        <a class="list_item ui_btn is-icon-only" :key="idx" v-for="(item, idx) in item.list" :href="item.excel_path" download>
                            <span class="list_item_name">{{ item.name }}</span>
                            <span class="icon">&#xe005;</span>
                        </a>
                    </template>
                </comp-list>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'comp-download-item',
    data() {
        return {};
    },
    props: {
        item: {},
    },
    computed: {
        getItemYear() {
            return this.item.item.year;
        },
        getList() {
            this.item.item.months.map((item) => {
                item.month = item.month.replace(/(^0+)/, '');
                return item;
            });
            return this.item.item.months;
        },
    },
};
</script>

<style lang="scss" src="./style.scss" scoped />
