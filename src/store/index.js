/** ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * 
 * 
 * 
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

import Vue from 'vue';
import Vuex from 'vuex';

/**
 * 공용 모듈
 * 경로: @/shared/store/...
 */
import commonStore from '@shared/store';
import commonGetters from '@shared/store/getters';
import { merge } from 'lodash';

import getters from './getters';

/**
 * 프로젝트 모듈
 * 경로: @/store/...
 * ./modules 폴더 내 파일 한번에 등록
 */
const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const value = modulesFiles(modulePath);

    modules[moduleName] = value.default;

    return modules;
}, {});

Vue.use(Vuex);

/**
 * Store Modules Merge
 */
const mergeModules = merge(commonStore, modules);
const mergeGetters = merge(commonGetters, getters);

const store = new Vuex.Store({
    modules: mergeModules,
    getters: mergeGetters,
    strict: process.env.NODE_ENV !== 'production',
});

export default store;
