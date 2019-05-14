package uk.me.jeremygreen.springexperiments.fsa;

import org.junit.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

public final class FsaEstablishmentsTests {

    public static FsaEstablishments establishments(final String... scores) {
        final List<FsaEstablishment> establishments = Arrays.stream(scores).map(
                (score) -> new FsaEstablishment(score)).collect(Collectors.toList());
        return new FsaEstablishments(Collections.unmodifiableList(establishments));
    }

    @Test
    public final void getRatingCounts_empty() {
        assertEquals(Collections.emptySortedMap(), establishments().getRatingCounts());
    }

    @Test
    public final void getRatingCounts_one() {
        final SortedMap<String,Long> ratingCountsExpected = new TreeMap<>();
        ratingCountsExpected.put("1-star", 1L);
        assertEquals(ratingCountsExpected, establishments("1").getRatingCounts());
    }

    @Test
    public final void getRatingCounts_oneTwice() {
        final SortedMap<String,Long> ratingCountsExpected = new TreeMap<>();
        ratingCountsExpected.put("1-star", 2L);
        assertEquals(ratingCountsExpected, establishments("1", "1").getRatingCounts());
    }

    @Test
    public final void getRatingCounts_many() {
        final SortedMap<String,Long> ratingCountsExpected = new TreeMap<>();
        ratingCountsExpected.put("1-star", 2L);
        ratingCountsExpected.put("2-star", 1L);
        ratingCountsExpected.put("Awaiting Inspection", 1L);
        ratingCountsExpected.put("Awaiting Publication", 3L);
        ratingCountsExpected.put("foo", 8L);
        assertEquals(ratingCountsExpected, establishments(
                "1", "1",
                "2",
                "foo", "foo", "foo", "foo", "foo", "foo", "foo", "foo",
                "AwaitingInspection",
                "AwaitingPublication", "AwaitingPublication", "AwaitingPublication").getRatingCounts());
    }

}
