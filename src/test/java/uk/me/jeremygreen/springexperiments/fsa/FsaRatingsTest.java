package uk.me.jeremygreen.springexperiments.fsa;

import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;

public final class FsaRatingsTest {

    @Test
    public void ratings() {
        final FsaRating fsaRating1 = new FsaRating("one");
        final FsaRating fsaRating2 = new FsaRating("two");
        final FsaRatings fsaRatings = new FsaRatings(List.of(fsaRating1, fsaRating2));
        assertEquals(fsaRatings.ratings(), List.of(fsaRating1, fsaRating2));
    }

}
