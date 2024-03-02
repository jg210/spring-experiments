package uk.me.jeremygreen.springexperiments.fsa;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.junit.Test;

import java.util.*;

import static org.junit.Assert.*;

public final class FsaEstablishmentsTests {

    @Test(expected = NullPointerException.class)
    @SuppressFBWarnings("SEC_SIDE_EFFECT_CONSTRUCTOR")
    public void constructor_nullEstablishments() {
        new FsaEstablishments(null);
    }

    @Test
    public void getRatingCounts_empty() {
        assertEquals(Collections.emptySortedMap(), FsaEstablishments.createInstance().getRatingCounts());
    }

    @Test
    public void getRatingCounts_one() {
        final SortedMap<String,Long> ratingCountsExpected = new TreeMap<>();
        ratingCountsExpected.put("1-star", 1L);
        assertEquals(ratingCountsExpected, FsaEstablishments.createInstance("1").getRatingCounts());
    }

    @Test
    public void getRatingCounts_oneTwice() {
        final SortedMap<String,Long> ratingCountsExpected = new TreeMap<>();
        ratingCountsExpected.put("1-star", 2L);
        assertEquals(ratingCountsExpected, FsaEstablishments.createInstance("1", "1").getRatingCounts());
    }

    @Test
    public void getRatingCounts_many() {
        final SortedMap<String,Long> ratingCountsExpected = new TreeMap<>();
        ratingCountsExpected.put("1-star", 2L);
        ratingCountsExpected.put("2-star", 1L);
        ratingCountsExpected.put("Awaiting Inspection", 1L);
        ratingCountsExpected.put("Awaiting Publication", 3L);
        ratingCountsExpected.put("foo", 8L);
        assertEquals(ratingCountsExpected, FsaEstablishments.createInstance(
                "1", "1",
                "2",
                "foo", "foo", "foo", "foo", "foo", "foo", "foo", "foo",
                "AwaitingInspection",
                "AwaitingPublication", "AwaitingPublication", "AwaitingPublication").getRatingCounts());
    }

}
