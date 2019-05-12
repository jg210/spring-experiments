package uk.me.jeremygreen.springexperiments.fsa;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@JsonIgnoreProperties(ignoreUnknown=true)
public final class FsaEstablishment {

    private static final Pattern STAR_RATING_PATTERN = Pattern.compile("^[0-9]+$");

    private final String ratingValue;

    @JsonCreator
    public FsaEstablishment(
            @JsonProperty("RatingValue")
            final String ratingValue) {
        this.ratingValue = ratingValue;
    }

    // Convert "RatingValue" from FSA Establishments API to human-readable String.
    public final String getFormattedRating() {
        if (this.ratingValue.equals("AwaitingInspection")) {
            return "Awaiting Inspection";
        }
        if (this.ratingValue.equals("AwaitingPublication")) {
            return "Awaiting Publication";
        }
        final Matcher matcher = STAR_RATING_PATTERN.matcher(ratingValue);
        if (matcher.matches()) {
            return matcher.group() + "-star";
        }
        return this.ratingValue;
    }

}
