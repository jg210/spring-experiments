package uk.me.jeremygreen.springexperiments;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.WebApplicationInitializer;
import uk.me.jeremygreen.springexperiments.fsa.JsProfilingFilter;

import java.io.IOException;

@SpringBootApplication
public class SpringExperimentsApplication implements WebApplicationInitializer {

    public static void main(final String[] args) {
        SpringApplication.run(SpringExperimentsApplication.class, args);
    }

    @Override
    public void onStartup(ServletContext servletContext) {}

}
