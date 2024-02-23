package uk.me.jeremygreen.springexperiments.fsa;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
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
public class JsProfilingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        final HttpServletRequest httpServletRequest = (HttpServletRequest)  request;
        final HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        // TODO Only set header for paths that really need it.
        httpServletResponse.setHeader("Document-Policy", "js-profiling");
        chain.doFilter(request, response);
    }
}
