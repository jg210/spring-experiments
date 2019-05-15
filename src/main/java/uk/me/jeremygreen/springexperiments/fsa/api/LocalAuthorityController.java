package uk.me.jeremygreen.springexperiments.fsa.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.me.jeremygreen.springexperiments.fsa.FsaService;
import uk.me.jeremygreen.springexperiments.fsa.FsaAuthorities;
import uk.me.jeremygreen.springexperiments.fsa.FsaAuthority;

import java.util.List;

@RestController
@RequestMapping(path="/api/fsa",
                produces="application/json")
public final class LocalAuthorityController {

    private final FsaService fsaService;

    @Autowired
    LocalAuthorityController(final FsaService fsaService) {
        this.fsaService = fsaService;
    }

    @GetMapping(value="localAuthority")
    public final LocalAuthorities localAuthorities() throws InterruptedException {
        final FsaAuthorities fsaAuthorities = this.fsaService.fetchAuthorities();
        final List<FsaAuthority> authorities = fsaAuthorities.getAuthorities();
        return LocalAuthorities.createInstance(authorities);
    }

    @GetMapping(value="localAuthority/{id}")
    public final Establishments localAuthorities(@PathVariable final long id) throws InterruptedException {
        return Establishments.createInstance(this.fsaService.fetchEstablishments(id));
    }

}