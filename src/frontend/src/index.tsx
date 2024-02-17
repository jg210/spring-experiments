import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { createStore } from './store';
import { Provider } from 'react-redux';
import { sentryInit } from './sentry';

sentryInit(); // crash reporting

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
    <Provider store={createStore()}>
        <App />
    </Provider>
);
