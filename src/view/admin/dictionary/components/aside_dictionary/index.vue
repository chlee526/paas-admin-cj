<script>
import CompAside from '@/components/keyword_boilerplate/comp_aside';
export default {
    name: 'comp-aside-dictionary',
    extends: CompAside,
    data() {
        return {
            useTitle: 'attribute',
        };
    },
    props: {},
    computed: {
        // 키워드 등록 기본 설정
        getInit() {
            const init = {
                seq: '',
                name: '',
                attribute: '',
                op: 1,
                op_len_before: 0,
                op_len_after: 0,
                ts: 1,
                tsc: 1,
                use_yn: 'Y',
                active: true,
            };

            if (this.selectedGrp) {
                init['attribute'] = this.selectedGrp['attribute'];
            }

            return init;
        },
    },
    watch: {},
    created() {},
    methods: {},
};
</script>

<!-- <style lang="scss" src="./style.scss" scoped /> -->
