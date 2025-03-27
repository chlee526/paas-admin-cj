import { shallowMount } from '@vue/test-utils';
import MyComponent from './MyComponent.vue';
import CheckBox from '@shared/ui/form/checkbox';

describe('CheckBox', () => {
    it('체크박스를 렌더링할 수 있어야 함', () => {
        const wrapper = shallowMount(CheckBox);

        // 체크박스 요소 검증
        const checkbox = wrapper.find('input[type="checkbox"]');
        expect(checkbox.exists()).toBe(true);

        // 라벨 요소 검증
        const label = wrapper.find('label');
        expect(label.exists()).toBe(true);
    });

    it('체크박스를 클릭할 수 있어야 함', () => {
        const wrapper = shallowMount(CheckBox);

        // 체크박스 클릭 이벤트 시뮬레이션
        const checkbox = wrapper.find('input[type="checkbox"]');
        checkbox.trigger('click');

        // 변경된 값 검증
        expect(checkbox.element.checked).toBe(true);
    });
});
