/**
 * 외부 라이브러리 사용할때 현폴더에 파일만 등록
 * src/main.js에서 등록 후 사용
 */

const files = require.context('.', true, /\.js$/);
const modules = {};

files.keys().forEach((key) => {
    if (key === './index.js') return;
    modules[key.toLowerCase().replace(/(\.\/|\.js)/g, '')] = files(key).default;
});

export default modules;
