package uk.me.jeremygreen.springexperiments.fsa.api;

import org.springframework.lang.NonNull;
import uk.me.jeremygreen.springexperiments.fsa.FsaRatings;

import java.util.List;

public final class Ratings {

    static Ratings createInstance(final @NonNull FsaRatings fsaRatings) {
        final List<String> ratings = fsaRatings.ratings().stream().map(fsaRating -> {
            String ratingName = fsaRating.ratingName();
            if (ratingName.matches("^[0-9]+$")) {
                ratingName += "-star";
            }
            return ratingName;
        }
        ).toList();
        return new Ratings(ratings);
    }

    private final List<String> ratings;

    Ratings(final @NonNull List<String> ratings) {
        this.ratings = ratings;
    }

    @SuppressWarnings("unused")
    public List<String> getRatings() {
        return ratings;
    }

}
