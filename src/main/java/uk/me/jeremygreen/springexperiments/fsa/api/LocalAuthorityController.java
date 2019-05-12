package uk.me.jeremygreen.springexperiments.fsa.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.me.jeremygreen.springexperiments.fsa.FSA;
import uk.me.jeremygreen.springexperiments.fsa.FsaAuthorities;
import uk.me.jeremygreen.springexperiments.fsa.FsaAuthority;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path="/api/fsa",
                produces="application/json")
public final class LocalAuthorityController {

    @GetMapping(value="localAuthority")
    public final LocalAuthorities localAuthorities() {
        final FsaAuthorities fsaAuthorities = FSA.fetchAuthorities();
        final List<FsaAuthority> authorities = fsaAuthorities.getAuthorities();
        return LocalAuthorities.createInstance(authorities);
    }

    @GetMapping(value="localAuthority/{id}")
    public final Establishments localAuthorities(@PathVariable final long id) {
        return Establishments.createInstance(FSA.fetchEstablishments(id));
    }

}