package uk.me.jeremygreen.springexperiments.fsa;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.junit.Test;

public final class FsaAuthorityTests {

    @Test(expected = IllegalArgumentException.class)
    @SuppressFBWarnings("SEC_SIDE_EFFECT_CONSTRUCTOR")
    public void constructor_negativeId() {
        new FsaAuthority(-1, "Ambridge");
    }

    @Test(expected = NullPointerException.class)
    @SuppressFBWarnings("SEC_SIDE_EFFECT_CONSTRUCTOR")
    public void constructor_nullName() {
        new FsaAuthority(1, null);
    }

}
