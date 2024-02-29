package uk.me.jeremygreen.springexperiments.fsa;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.lang.NonNull;

@JsonIgnoreProperties(ignoreUnknown = true)
public record FsaRating(@NonNull String ratingName) {

    @JsonCreator
    public FsaRating(
            @JsonProperty("ratingName") final String ratingName
    ) {
        this.ratingName = ratingName;
    }

}
