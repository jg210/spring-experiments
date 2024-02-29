package uk.me.jeremygreen.springexperiments.fsa.api;

import org.junit.Test;
import uk.me.jeremygreen.springexperiments.fsa.FsaRating;
import uk.me.jeremygreen.springexperiments.fsa.FsaRatings;

import static org.junit.Assert.*;

import java.util.List;

public class RatingsTest {

    @Test
    public final void createInstance_emptyList() {
        final FsaRatings fsaRatings = new FsaRatings(List.of());
        final Ratings ratings = Ratings.createInstance(fsaRatings);
        assertEquals(List.of(), ratings.getRatings());
    }

    @Test
    public final void createInstance_string() {
        final List<String> ratingsList = List.of("xyz");
        final FsaRatings fsaRatings = new FsaRatings(ratingsList.stream().map((rating) -> new FsaRating(rating)).toList());
        final Ratings ratings = Ratings.createInstance(fsaRatings);
        assertEquals(ratingsList, ratings.getRatings());
    }

    @Test
    public final void createInstance_0() {
        final List<String> ratingsList = List.of("0");
        final FsaRatings fsaRatings = new FsaRatings(ratingsList.stream().map((rating) -> new FsaRating(rating)).toList());
        final Ratings ratings = Ratings.createInstance(fsaRatings);
        assertEquals(List.of("0-star"), ratings.getRatings());
    }

    @Test
    public final void createInstance_strings_and_numbers() {
        final List<String> ratingsList = List.of("x", "0", "1", "2", "5", "6", "10", "09234234");
        final FsaRatings fsaRatings = new FsaRatings(ratingsList.stream().map((rating) -> new FsaRating(rating)).toList());
        final Ratings ratings = Ratings.createInstance(fsaRatings);
        assertEquals(List.of("x", "0-star", "1-star", "2-star", "5-star", "6-star", "10-star", "09234234-star"), ratings.getRatings());
    }

    @Test
    public final void createInstance_already_star_suffix() {
        final List<String> ratingsList = List.of("1-star");
        final FsaRatings fsaRatings = new FsaRatings(ratingsList.stream().map((rating) -> new FsaRating(rating)).toList());
        final Ratings ratings = Ratings.createInstance(fsaRatings);
        assertEquals(ratingsList, ratings.getRatings());
    }

}
