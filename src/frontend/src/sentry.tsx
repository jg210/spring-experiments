import * as Sentry from "@sentry/react";
import React from "react";

export const sentryInit = () => {
    Sentry.init({
        dsn: "https://014ba2c22321fa2808bc3d8f2b9f5fba@o282512.ingest.sentry.io/4506763201019904",
        environment: import.meta.env.MODE,
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
