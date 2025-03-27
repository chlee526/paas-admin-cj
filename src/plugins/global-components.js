/**
 * 전역 컴포넌트 등록
 */
import Vue from 'vue';
//board
import CompPaginate from '@shared/ui/board/paginate';
import CompTableSort from '@shared/ui/board/sort';
import CompTableFilter from '@shared/ui/board/filter';
//tooltip
import CompTooltip from '@shared/ui/tooltip';
//helpbox
import CompHelpboxBtn from '@shared/ui/helpbox_btn';
/*
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  Layout 시작
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
/*
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  UI - FORM 시작
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
//datepicker
import CompDatePicker from '@shared/ui/form/datepicker/';
import CompTab from '@shared/ui/form/tab/';
//button
import CompButton from '@shared/ui/form/button';
//buttonGrp
import CompButtonGrp from '@shared/ui/form/buttonGrp';
//inputbox
import CompInputBox from '@shared/ui/form/inputbox';
//textarea
import CompTextArea from '@shared/ui/form/textarea';
//selectBox
import CompSelectBox from '@shared/ui/form/selectbox';
//checkbox
import CompCheckBox from '@shared/ui/form/checkbox';
import CompCheckBoxGrp from '@shared/ui/form/checkboxGrp';
//switch
import CompSwitch from '@shared/ui/form/switch';
//radio
import CompRadio from '@shared/ui/form/radio/';
import CompRadioGrp from '@shared/ui/form/radioGrp/';
// Filter Grp
import CompFilterGrp from '@shared/ui/form/filterGrp';
// List
import CompList from '@shared/ui/form/listGrp';
// Colorpicker
import CompColorPicker from '@shared/ui/form/colorPicker';
import TreeView from '@shared/ui/tree_view';
// Editor
import CompEditor from '@shared/ui/form/editor';

/*
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  TEMPLATES 시작
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
//template > modal
import TmplModalKeywordCustom from '@/view/admin/keyword/components/customModal';
import TmplModalAuthMngr from '@/view/admin/member/components/aside_member/authModal';

Vue.component('tmpl-modal-keywordCustomModal', TmplModalKeywordCustom);
Vue.component('tmpl-modal-auth-mngr', TmplModalAuthMngr);

/*
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

  전역 등록

  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/

//board
Vue.component('comp-paginate', CompPaginate);
Vue.component('comp-table-sort', CompTableSort);
Vue.component('comp-table-filter', CompTableFilter);

//tooltip
Vue.component('comp-bubble-box', CompTooltip);

//helpbox
Vue.component('comp-helpbox-btn', CompHelpboxBtn);
/*
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  TEMPLATES 시작
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/

/*
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  UI - FORM 시작
  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/

//datepicker
Vue.component('comp-datepicker', CompDatePicker);
Vue.component('comp-tab', CompTab);

//button
Vue.component('comp-button', CompButton);

//buttonGrp
Vue.component('comp-button-grp', CompButtonGrp);

//textarea
Vue.component('comp-textarea', CompTextArea);

//inputbox
Vue.component('comp-input-box', CompInputBox);

//selectBox
Vue.component('comp-selectbox', CompSelectBox);

//checkbox
Vue.component('comp-checkbox', CompCheckBox);

Vue.component('comp-checkbox-grp', CompCheckBoxGrp);

//switch
Vue.component('comp-switch-btn', CompSwitch);

//radio
Vue.component('comp-radio', CompRadio);

Vue.component('comp-radio-grp', CompRadioGrp);

// Filter Grp
Vue.component('comp-filter-grp', CompFilterGrp);

// List
Vue.component('comp-list', CompList);

// Colorpicker
Vue.component('comp-colorpicker', CompColorPicker);

Vue.component('tree-view', TreeView);

Vue.component('comp-editor', CompEditor);
