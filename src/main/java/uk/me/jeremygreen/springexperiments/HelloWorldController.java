package uk.me.jeremygreen.springexperiments;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public final class HelloWorldController {

    @GetMapping("/")
    public final String helloWorld() {
        return "helloworld";
    }

}