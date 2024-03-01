package uk.me.jeremygreen.springexperiments.fsa;

import org.junit.Test;

public final class FsaAuthorityTests {

    @Test(expected = IllegalArgumentException.class)
    public void constructor_negativeId() {
        new FsaAuthority(-1, "Ambridge");
    }

    @Test(expected = NullPointerException.class)
    public void constructor_nullName() {
        new FsaAuthority(1, null);
    }

}
