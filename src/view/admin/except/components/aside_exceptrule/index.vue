<script>
import CompAsideKeyword from '@/components/keyword_boilerplate/comp_aside';

export default {
    name: 'comp-aside-exceptrule',
    extends: CompAsideKeyword,
    data() {
        return {};
    },
    props: {},
    computed: {
        // 키워드 등록 기본 설정
        getInit() {
            const init = {
                seq: '',
                keyword: '',
                name: '',
                op: 1,
                op_len_before: 0,
                op_len_after: 0,
                ts: 1,
                tsc: 1,
                use_yn: 'Y',
                active: true,
            };

            return init;
        },
    },
    watch: {},
    methods: {},
};
</script>

<!-- <style lang="scss" src="./style.scss" scoped /> -->
