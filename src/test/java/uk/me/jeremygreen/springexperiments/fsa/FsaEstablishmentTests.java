package uk.me.jeremygreen.springexperiments.fsa;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;


@SuppressFBWarnings("CE_CLASS_ENVY")
public class FsaEstablishmentTests {

    @Test(expected = NullPointerException.class)
    @SuppressFBWarnings("SEC_SIDE_EFFECT_CONSTRUCTOR")
    public void constructor_nullRating() {
        new FsaEstablishment(null);
    }

    @Test
    public void formattedRating() {
        assertEquals(
                "1-star",
                new FsaEstablishment("1").getFormattedRating());
        assertEquals(
                "2-star",
                new FsaEstablishment("2").getFormattedRating());
        assertEquals(
                "3-star",
                new FsaEstablishment("3").getFormattedRating());
        assertEquals(
                "4-star",
                new FsaEstablishment("4").getFormattedRating());
        assertEquals(
                "5-star",
                new FsaEstablishment("5").getFormattedRating());
        assertEquals(
                "654321-star",
                new FsaEstablishment("654321").getFormattedRating());
        for (final String rating : Arrays.asList("abc", "foo", "", "with space")) {
            assertEquals(
                    rating,
                    new FsaEstablishment(rating).getFormattedRating());
        }
        assertEquals(
                "Awaiting Inspection",
                new FsaEstablishment("AwaitingInspection").getFormattedRating());
        assertEquals(
                "Awaiting Publication",
                new FsaEstablishment("AwaitingPublication").getFormattedRating());
    }

}
