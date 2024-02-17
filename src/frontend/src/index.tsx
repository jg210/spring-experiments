import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { createStore } from './store';
import { Provider } from 'react-redux';
import { ErrorFallback, sentryInit } from './sentry';
import * as Sentry from "@sentry/react";

sentryInit(); // crash reporting

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
    <Sentry.ErrorBoundary fallback={ErrorFallback}>
        <Provider store={createStore()}>
            <App />
        </Provider>
    </Sentry.ErrorBoundary>
);
