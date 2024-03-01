package uk.me.jeremygreen.springexperiments.fsa;

import org.junit.Test;
import static org.junit.Assert.*;

public final class FsaRatingTest {

    @Test
    public void ratingName() {
        final String ratingName = "foo";
        final FsaRating fsaRating = new FsaRating(ratingName);
        assertEquals(ratingName, fsaRating.ratingName());
    }

}
