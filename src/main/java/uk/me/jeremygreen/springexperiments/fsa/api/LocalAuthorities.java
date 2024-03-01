package uk.me.jeremygreen.springexperiments.fsa.api;

import uk.me.jeremygreen.springexperiments.fsa.FsaAuthority;

import java.util.List;
import java.util.stream.Collectors;

public final class LocalAuthorities {

    private final List<LocalAuthority> localAuthorities;

    public static LocalAuthorities createInstance(final List<FsaAuthority> fsaAuthorities) {
        final List<LocalAuthority> localAuthorities = fsaAuthorities.stream().map(fsaAuthority -> new LocalAuthority(
                fsaAuthority.id(),
                fsaAuthority.name())
        ).collect(Collectors.toList());
        return new LocalAuthorities(localAuthorities);
    }

    private LocalAuthorities(final List<LocalAuthority> localAuthorities) {
        this.localAuthorities = localAuthorities;
    }

    @SuppressWarnings("unused")
    public List<LocalAuthority> getLocalAuthorities() {
        return this.localAuthorities;
    }

}
