/// <reference types="vitest" />
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { execSync } from 'child_process';
import { name as appName } from './package.json';

const commitHash = execSync('git rev-parse HEAD').toString().trim();
const sentryRelease = appName + '@' + commitHash;
const sentryDSN = process.env.SENTRY_DSN_SPRING_EXPERIMENTS;

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '',

    plugins: [
        react(),
        viteTsconfigPaths(),
        sentryVitePlugin({
            org: "jeremy-green",
            project: appName,
            release: {
                name: sentryRelease
            }
        })
    ],

    define: {
        __APP_NAME__: JSON.stringify(appName),
        __COMMIT_HASH__: JSON.stringify(commitHash),
        __SENTRY_DSN__: JSON.stringify(sentryDSN),
        __SENTRY_RELEASE__: JSON.stringify(sentryRelease)
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
        },
        headers: {
            "Document-Policy": "js-profiling"
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