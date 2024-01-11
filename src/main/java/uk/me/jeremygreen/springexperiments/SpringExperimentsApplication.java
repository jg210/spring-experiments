package uk.me.jeremygreen.springexperiments;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.WebApplicationInitializer;

@SpringBootApplication
public class SpringExperimentsApplication implements WebApplicationInitializer {

    public static void main(final String[] args) {
        SpringApplication.run(SpringExperimentsApplication.class, args);
    }

    @Override
    public void onStartup(ServletContext servletContext) {}

}
