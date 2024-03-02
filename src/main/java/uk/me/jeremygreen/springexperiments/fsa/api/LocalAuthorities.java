package uk.me.jeremygreen.springexperiments.fsa.api;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import uk.me.jeremygreen.springexperiments.fsa.FsaAuthority;

import java.util.Collection;
import java.util.List;

public final class LocalAuthorities {

    private final List<LocalAuthority> localAuthorities;

    public static LocalAuthorities createInstance(final Collection<FsaAuthority> fsaAuthorities) {
        final List<LocalAuthority> localAuthorities = fsaAuthorities.stream().map(fsaAuthority -> new LocalAuthority(
                fsaAuthority.id(),
                fsaAuthority.name())
        ).toList();
        return new LocalAuthorities(localAuthorities);
    }

    private LocalAuthorities(final List<LocalAuthority> localAuthorities) {
        this.localAuthorities = localAuthorities;
    }

    @SuppressWarnings("unused")
    @SuppressFBWarnings("EI_EXPOSE_REP") // field has immutable copy
    public List<LocalAuthority> getLocalAuthorities() {
        return this.localAuthorities;
    }

}
