package uk.me.jeremygreen.springexperiments.fsa;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Lets sentry do <a href=https://docs.sentry.io/platforms/javascript/guides/react/profiling/#step-2-add-document-policy-js-profiling-header>in-browser profiling</a> (in chrome).
 * <p>
 * In development, vite.config.ts sets the header, not this Filter.
 */
@Component
@WebFilter(urlPatterns = "/*")
@SuppressWarnings("unused")
public final class JsProfilingFilter implements Filter {

    @Override
    public void doFilter(
            final ServletRequest request,
            final ServletResponse response,
            final FilterChain chain
    ) throws IOException, ServletException {
        final HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        // TODO Only set header for paths that really need it.
        httpServletResponse.setHeader("Document-Policy", "js-profiling");
        chain.doFilter(request, response);
    }
}
