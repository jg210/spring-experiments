package uk.me.jeremygreen.springexperiments.fsa.api;

import uk.me.jeremygreen.springexperiments.fsa.FsaEstablishments;

import java.util.ArrayList;
import java.util.List;
import java.util.SortedMap;

public final class Establishments {

    public static Establishments createInstance(final FsaEstablishments fsaEstablishments) {
        final long epochMillis = System.currentTimeMillis();
        return createInstance(epochMillis, fsaEstablishments);
    }

    static Establishments createInstance(
            final long epochMillis,
            final FsaEstablishments fsaEstablishments) {
        final SortedMap<String,Long> ratingCountMap = fsaEstablishments.getRatingCounts();
        final List<RatingCount> ratingCounts = new ArrayList<>(ratingCountMap.size());
        for (SortedMap.Entry<String,Long> entry: ratingCountMap.entrySet()) {
            ratingCounts.add(new RatingCount(entry.getKey(), entry.getValue()));
        }
        return new Establishments(epochMillis, ratingCounts);
    }

    final long epochMillis;
    final List<RatingCount> ratingCounts;

    private Establishments(
            final long epochMillis,
            final List<RatingCount> ratingCounts
    ) {
        this.epochMillis = epochMillis;
        this.ratingCounts = ratingCounts;
    }

    public long getEpochMillis() { return this.epochMillis; }

    public List<RatingCount> getRatingCounts() {
        return this.ratingCounts;
    }

}
