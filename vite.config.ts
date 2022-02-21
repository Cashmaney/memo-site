import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import inject from "@rollup/plugin-inject";
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";
// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {},
    },
    define: {
        "process.env": {},
    },
    // build: {
    //     rollupOptions: {
    //         plugins: [inject({ Buffer: ["Buffer", "Buffer"] })],
    //         // plugins: [
    //         //     inject({
    //         //         include: ["node_modules/secretjs/**"],
    //         //         modules: { Buffer: ["buffer", "Buffer"] },
    //         //     }),
    //         // ],
    //     },
    // },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: "globalThis",
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                }),
            ],
        },
    },
    plugins: [react()],
});
