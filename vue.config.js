const path = require('path');

const { defineConfig } = require('@vue/cli-service');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = defineConfig({
    publicPath: process.env.APP_VUE_BASE_URL,
    outputDir: process.env.NODE_ENV == 'development' ? '@dist/dev' : './@dist/prod',
    transpileDependencies: true,
    lintOnSave: false,
    productionSourceMap: false, // Production 모드일 때 map파일 생성 금지

    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                    $use_lnb: "${process.env.VUE_APP_USEAGE_LNB}"; // LNB 사용여부
                `,
            },
        },
    },

    // 웹팩 설정
    chainWebpack: (config) => {
        // 차트 이미지 복사
        // config.plugin('copy').tap((args) => {
        //     args[0].patterns.push({
        //         from: '../../node_modules/amcharts3/amcharts/images',
        //         to: 'img/amcharts',
        //     });
        //     return args;
        // });

        // 배포시 public 폴더내에서 제외 파일 추가
        config.plugin('copy').tap((opts) => {
            const filesToExclude = process.env.NODE_ENV === 'production' ? ['**/mockServiceWorker.js', '**/tmp_excel.xlsx'] : ['**/tmp_excel.xlsx'];
            opts[0].patterns[0].globOptions.ignore.push(...filesToExclude);
            return opts;
        });

        // MSW 및 mocks 폴더 관련 설정
        if (process.env.NODE_ENV === 'production' || (process.env.NODE_ENV === 'development' && process.env.VUE_APP_USEAGE_MSW !== 'true')) {
            // IgnorePlugin을 사용하여 mocks 폴더 완전히 무시
            config.plugin('ignore-mocks').use(webpack.IgnorePlugin, [
                {
                    resourceRegExp: /^\.\/mocks$/,
                    contextRegExp: /src\/api$/,
                },
            ]);

            // JavaScript 파일에서 mocks 폴더 제외
            config.module
                .rule('js')
                .exclude.add(/src\/api\/mocks/)
                .end();

            // 모든 파일 타입에 대해 mocks 폴더 제외
            config.module.rule('exclude-mocks').exclude.add(path.resolve(__dirname, 'src/api/mocks')).end();
        }

        // Split Chunks 설정
        config.optimization.splitChunks({
            cacheGroups: {
                // Vue 관련
                vue: {
                    name: 'vue',
                    test: /[\\/]node_modules[\\/](vue|vuex|@vue\/)/,
                    chunks: 'initial',
                    priority: 30,
                    enforce: true,
                },
                // 기본 vendor
                vendor: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    enforce: true,
                },
                // common 분류
                common: {
                    name: 'common',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    priority: 10,
                    enforce: true,
                },
                // 기본 node_modules > common 분류`
                async: {
                    name: 'async',
                    chunks: 'async',
                    priority: 15,
                    minChunks: 2,
                    reuseExistingChunk: true,
                },
                // 설치형 외부 라이브러리
                // jquery, amchart, gsap
                vendor_library: {
                    name: 'vendor-library',
                    test: /[\\/]node_modules[\\/](jquery|jquery-ui|amcharts3|gsap)[\\/]/,
                    chunks: 'initial',
                    priority: 15,
                    enforce: true,
                },
                // App
                app: {
                    name: 'app',
                    test: /[\\/]src[\\/]/,
                    chunks: 'initial',
                    enforce: true,
                    priority: 10,
                },
                // App Shared
                app_shared: {
                    name: 'app-shared',
                    test: /[\\../]shared[\\/]/,
                    chunks: 'initial',
                    enforce: true,
                    priority: 10,
                },
                // App 외부 라이브러리 (@shared/library/)
                app_library: {
                    name: 'app-library',
                    test: /[\\../]shared[\\/]library[\\/]/,
                    chunks: 'initial',
                    enforce: true,
                    priority: 15,
                },
            },
        });

        // Bundle 결과 분석
        if (process.env.APP_VUE_ANALYSIS === 'true') {
            // @dist/reposrt.html 파일로 내릴 때
            // config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
            //     {
            //         analyzerMode: 'static',
            //         reportFilename: 'report.html',
            //     },
            // ]);

            // 로컬 서버로 바로 분석 결과 확인
            config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin);
        }

        // markdown 설정 추가
        config.module.rule('md').test(/\.md/).use('vue-loader').loader('vue-loader').end().use('vue-markdown-loader').loader('vue-markdown-loader/lib/markdown-compiler').options({
            raw: true,
        });

        // // SCSS 설정 추가
        // config.module
        //     .rule('scss')
        //     .test(/\.scss$/)
        //     .use('css-loader')
        //     .loader('css-loader')
        //     .end()
        //     .use('sass-loader')
        //     .loader('sass-loader')
        //     .options({
        //         additionalData: `
        //             $node-env: "${process.env.NODE_ENV}";
        //         `,
        //     });
    },

    // 개발 서버 설정
    devServer: {
        allowedHosts: 'all',
        host: 'fe.cjmia.devel.com',
        port: 8604,
        client: {
            overlay: false,
        },
    },
});
