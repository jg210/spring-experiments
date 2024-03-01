package uk.me.jeremygreen.springexperiments.fsa;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

import java.util.List;

@SuppressFBWarnings("EI_EXPOSE_REP") // ratings is immutable copy.
@JsonIgnoreProperties(ignoreUnknown = true)
public record FsaRatings(List<FsaRating> ratings) {

    @JsonCreator
    public FsaRatings(
            @JsonProperty("ratings") final List<FsaRating> ratings
    ) {
        this.ratings = List.copyOf(ratings);
    }
}
