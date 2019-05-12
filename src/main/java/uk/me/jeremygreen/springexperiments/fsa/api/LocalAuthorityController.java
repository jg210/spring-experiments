package uk.me.jeremygreen.springexperiments.fsa.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.me.jeremygreen.springexperiments.fsa.FSA;

import java.util.stream.Collectors;

@RestController
@RequestMapping(path="/api/fsa",
                produces="application/json")
public final class LocalAuthorityController {

    @GetMapping(value="localAuthority")
    public final Iterable<LocalAuthority> localAuthorities() {
        return FSA.fetchAuthorities().stream().map(fsaAuthority -> {
            return new LocalAuthority(fsaAuthority.getId(), fsaAuthority.getName());
        }).collect(Collectors.toList());
    }

}