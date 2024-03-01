package uk.me.jeremygreen.springexperiments.fsa;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.*;

@JsonIgnoreProperties(ignoreUnknown=true)
public final class FsaEstablishments {

    public static FsaEstablishments createInstance(final String... scores) {
        final List<FsaEstablishment> establishments = Arrays.stream(scores).map(FsaEstablishment::new).toList();
        return new FsaEstablishments(establishments);
    }

    private final List<FsaEstablishment> establishments;

    @JsonCreator
    public FsaEstablishments(
            @JsonProperty("establishments")
            final List<FsaEstablishment> establishments) {
        if (establishments == null) {
            throw new NullPointerException();
        }
        this.establishments = List.copyOf(establishments);
    }

    public SortedMap<String,Long> getRatingCounts() {
        final SortedMap<String,Long> ratingCounts = new TreeMap<>();
        for (final FsaEstablishment fsaEstablishment: this.establishments) {
            final String rating = fsaEstablishment.getFormattedRating();
            Long oldCount = ratingCounts.get(rating);
            if (oldCount == null) {
                oldCount = 0L;
            }
            ratingCounts.put(rating, oldCount + 1);
        }
        return Collections.unmodifiableSortedMap(ratingCounts);
    }

}
