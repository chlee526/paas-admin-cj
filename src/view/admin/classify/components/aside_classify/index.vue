<script>
import CompAside from '@/components/keyword_boilerplate/comp_aside';
export default {
    name: 'comp-aside-dictionary',
    extends: CompAside,
    data() {
        return {
            useTitle: 'classify',
        };
    },
    computed: {
        // 키워드 등록 기본 설정
        getInit() {
            const init = {
                seq: '',
                name: '',
                classify: '',
                type_anal: this.selectedGrp?.type_anal || 1,
                op: 1,
                op_len_before: 0,
                op_len_after: 0,
                ts: 1,
                tsc: 1,
                use_yn: 'Y',
                active: true,
            };

            if (this.selectedGrp) {
                init['classify'] = this.selectedGrp['classify'];
            }

            return init;
        },
    },
};
</script>

<!-- <style lang="scss" src="./style.scss" scoped /> -->
