package uk.me.jeremygreen.springexperiments.fsa.api;

public class RatingCount {

    private final String rating;
    private final long count;

    public RatingCount(final String rating, final long count) {
        this.rating = rating;
        this.count = count;
    }

    public String getRating() {
        return this.rating;
    }

    public long getCount() {
        return this.count;
    }
    
}
