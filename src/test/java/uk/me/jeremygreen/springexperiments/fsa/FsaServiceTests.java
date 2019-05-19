package uk.me.jeremygreen.springexperiments.fsa;

import org.junit.Test;
import static org.junit.Assert.*;



public class FsaServiceTests {

    @Test
    public void fetchEstablishments_minusOne() throws InterruptedException {
        final FsaService fsaService = new FsaService("file:///dev/null");
        try {
            fsaService.fetchEstablishments(-1);
            fail();
        } catch (IllegalArgumentException expected) {}
    }

    @Test
    public void fetchEstablishments_integerMinValue() throws InterruptedException {
        final FsaService fsaService = new FsaService("file:///dev/null");
        try {
            fsaService.fetchEstablishments(Integer.MIN_VALUE);
            fail();
        } catch (IllegalArgumentException expected) {}
    }

}
