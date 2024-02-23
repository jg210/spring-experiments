import * as Sentry from "@sentry/react";
import React from "react";

export const sentryInit = () => {
    Sentry.init({
        dsn: __SENTRY_DSN__,
        environment: import.meta.env.MODE,
        release: __SENTRY_RELEASE__,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
                maskAllText: false,
                blockAllMedia: false,
            }),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, // 100%
        // Distributed Tracing
        tracePropagationTargets: ["localhost"],
        // Session Replay
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0,
    });
};

type ErrorFallbackProps = {
    error: Error,
    componentStack: string
}

export const ErrorFallback = ({error, componentStack}: ErrorFallbackProps) => {
    return (
        <React.Fragment>
            <div>{error.toString()}</div>
            <div>{componentStack}</div>
        </React.Fragment>
    );
};
