package uk.me.jeremygreen.springexperiments.fsa;

import org.junit.Test;

public final class FsaAuthorityTests {

    @Test
    public void constructor_negativeId() {
        try {
            new FsaAuthority(-1, "Ambridge");
        } catch (IllegalArgumentException expected) {}
    }

    @Test
    public void constructor_nullName() {
        try {
            new FsaAuthority(1, null);
        } catch (NullPointerException expected) {}
    }

}
