package uk.me.jeremygreen.springexperiments.fsa;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record FsaRatings(List<FsaRating> ratings) {

    @JsonCreator
    public FsaRatings(
            @JsonProperty("ratings") final List<FsaRating> ratings
    ) {
        this.ratings = ratings;
    }
}
