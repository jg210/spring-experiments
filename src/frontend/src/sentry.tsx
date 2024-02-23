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
            Sentry.browserProfilingIntegration()
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, // 100%
        // Distributed Tracing
        tracePropagationTargets: ["localhost"],
        // Session Replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        profilesSampleRate: 1.0
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
