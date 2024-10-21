import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import svgLoader from 'vite-svg-loader';

import qiankun from 'vite-plugin-qiankun';
const useDevMode = true; // useDevMode = true 时不开启热更新

// https://vitejs.dev/config/
export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return defineConfig({
        plugins: [
            vue({
                reactivityTransform: true
            }),
            qiankun('intlLottery', { useDevMode }), // intlLottery中是子应用名，主应用注册时AppName需保持一致
            svgLoader({ svgo: false })
        ],
        base: process.env.NODE_ENV === 'production' ? '/' : '/', // 线上环境
        //base: process.env.NODE_ENV === 'production' ? 'https://czp.kcp6dzfqds.com/m/' : '/', // 正式环境
        css: {
            postcss: {
                plugins: [require('tailwindcss'), require('autoprefixer')]
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src') //设置别名
            }
        },
        server: {
            host: 'www.88888888.com', // 默认是 localhost
            port: 3718, //启动端口
            open: true, // 浏览器自动打开
            origin: 'http://www.88888888.com:3718',
            proxy: {
                '/api': {
                    target: 'https://sdia.cjoiajd89q2.com/api', // 测试站点
                    // target: 'http://g2-3.ml999888.com//api', // 测试站点
                    // target: 'https://jeroq.ml-imitest.com/api', // 正式站点
                    // target: 'http://g1-2.ml999888.com/api', // 测试站点
                    changeOrigin: true,
                    ws: true,
                    rewrite: path => path.replace(/^\/api/, '')
                }
            },
            cors: true
        },
        build: {
            outDir: 'dist', // 打包构建输出路径，默认 dist ，如果路径存在，构建之前会被删除
            minify: false, // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
            manifest: false, // 是否产出maifest.json
            sourcemap: false, // 是否产出soucemap.json
            target: 'esnext' //默认module
        }
    });
};
