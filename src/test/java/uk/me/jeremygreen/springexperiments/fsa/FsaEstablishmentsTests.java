package uk.me.jeremygreen.springexperiments.fsa;

import org.junit.Test;

import java.util.*;

import static org.junit.Assert.*;

public final class FsaEstablishmentsTests {

    @Test
    public final void getRatingCounts_empty() {
        assertEquals(Collections.emptySortedMap(), FsaEstablishments.createInstance().getRatingCounts());
    }

    @Test
    public final void getRatingCounts_one() {
        final SortedMap<String,Long> ratingCountsExpected = new TreeMap<>();
        ratingCountsExpected.put("1-star", 1L);
        assertEquals(ratingCountsExpected, FsaEstablishments.createInstance().getRatingCounts());
    }

    @Test
    public final void getRatingCounts_oneTwice() {
        final SortedMap<String,Long> ratingCountsExpected = new TreeMap<>();
        ratingCountsExpected.put("1-star", 2L);
        assertEquals(ratingCountsExpected, FsaEstablishments.createInstance("1", "1").getRatingCounts());
    }

    @Test
    public final void getRatingCounts_many() {
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
