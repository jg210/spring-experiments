/// <reference types="vitest" />
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { execSync } from 'child_process';

const commitHash = execSync('git rev-parse --short HEAD').toString();

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '',

    plugins: [
        react(),
        viteTsconfigPaths(),
        sentryVitePlugin({
            org: "jeremy-green",
            project: "spring-experiments"
        })
    ],

    define: {
        __COMMIT_HASH__: JSON.stringify(commitHash),
        __APP_NAME__: JSON.stringify(process.env.npm_package_name),
        __SENTRY_DSN__: JSON.stringify(process.env.SENTRY_DSN_SPRING_EXPERIMENTS)
    },

    server: {    
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8080'
            }
        }
    },

    test: {
        setupFiles: ['./vitest-setup.ts'],
        globals: true,
        environment: 'jsdom',
        reporters: [
            'default',
            'junit'
        ],
        outputFile: {
            junit: './junit-report.xml'
        }
    },

    build: {
        sourcemap: true
    }
});