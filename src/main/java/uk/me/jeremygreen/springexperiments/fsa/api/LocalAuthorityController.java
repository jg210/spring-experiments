package uk.me.jeremygreen.springexperiments.fsa.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.me.jeremygreen.springexperiments.fsa.*;

import java.util.List;

@RestController
@RequestMapping(path="/api/fsa",
                produces="application/json")
public final class LocalAuthorityController {

    static final int MAX_AGE_SECONDS = 600;

    private static HttpHeaders createHeaders() {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Cache-Control", "max-age=" + MAX_AGE_SECONDS);
        return HttpHeaders.readOnlyHttpHeaders(httpHeaders);
    }

    private static final HttpHeaders RESPONSE_HEADERS = createHeaders();

    private final FsaService fsaService;

    @Autowired
    LocalAuthorityController(final FsaService fsaService) {
        this.fsaService = fsaService;
    }

    @GetMapping(value="localAuthority")
    @SuppressWarnings("unused")
    public ResponseEntity<LocalAuthorities> localAuthorities() throws InterruptedException {
        final FsaAuthorities fsaAuthorities = this.fsaService.fetchAuthorities();
        final List<FsaAuthority> authorities = fsaAuthorities.authorities();
        final LocalAuthorities localAuthorities = LocalAuthorities.createInstance(authorities);
        return ResponseEntity.ok()
                .headers(RESPONSE_HEADERS)
                .body(localAuthorities);
    }

    @GetMapping(value="localAuthority/{id}")
    @SuppressWarnings("unused")
    public ResponseEntity<Establishments> localAuthority(@PathVariable final int id) throws InterruptedException {
        final FsaEstablishments fsaEstablishments = this.fsaService.fetchEstablishments(id);
        final ResponseEntity<Establishments> responseEntity;
        if (id < 0) {
            responseEntity = ResponseEntity.badRequest().build();
        } else if (fsaEstablishments == null) {
            responseEntity = ResponseEntity.notFound().headers(RESPONSE_HEADERS).build();
        } else {
            final Establishments establishments = Establishments.createInstance(fsaEstablishments);
            responseEntity = ResponseEntity.ok()
                    .headers(RESPONSE_HEADERS)
                    .body(establishments);
        }
        return responseEntity;
    }

    @GetMapping(value="ratings")
    @SuppressWarnings("unused")
    public ResponseEntity<Ratings> ratings() throws InterruptedException {
        final FsaRatings fsaRatings = this.fsaService.fetchRatings();
        final Ratings ratings = Ratings.createInstance(fsaRatings);
        return ResponseEntity.ok()
                    .headers(RESPONSE_HEADERS)
                    .body(ratings);
    }

}