package uk.me.jeremygreen.springexperiments.fsa.api;

import org.junit.Test;
import uk.me.jeremygreen.springexperiments.fsa.FsaEstablishments;

import java.util.*;

import static org.junit.Assert.*;

public final class EstablishmentsTests {

    @Test
    public void getRatingCounts() {
        final FsaEstablishments fsaEstablishments = FsaEstablishments.createInstance(
                "1", "1",
                "2",
                "foo", "foo", "foo", "foo", "foo", "foo", "foo", "foo",
                "AwaitingInspection",
                "AwaitingPublication", "AwaitingPublication", "AwaitingPublication");
        final Establishments establishments = Establishments.createInstance(fsaEstablishments);
        final List<RatingCount> actual = establishments.getRatingCounts();
        final SortedMap<String,Long> expected = fsaEstablishments.getRatingCounts();
        assertEquals(expected.size(), actual.size());
        final Iterator<RatingCount> actualIterator = actual.iterator();
        final Iterator<SortedMap.Entry<String,Long>> expectedIterator = expected.entrySet().iterator();
        while (expectedIterator.hasNext()) {
            final SortedMap.Entry<String,Long> expectedRatingCount = expectedIterator.next();
            final RatingCount actualRatingCount = actualIterator.next();
            assertEquals(
                    expectedRatingCount.getKey(), actualRatingCount.getRating());
            assertEquals(
                    expectedRatingCount.getValue().longValue(), actualRatingCount.getCount());
        }
        assertFalse(actualIterator.hasNext());
    }

}
