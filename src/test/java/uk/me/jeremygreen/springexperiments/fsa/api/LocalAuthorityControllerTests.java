package uk.me.jeremygreen.springexperiments.fsa.api;

import org.junit.Test;
import org.junit.runner.RunWith;
import static org.junit.Assert.*;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import uk.me.jeremygreen.springexperiments.fsa.*;

import java.util.Arrays;
import java.util.List;

@RunWith(SpringRunner.class)
@WebMvcTest(LocalAuthorityController.class)
public class LocalAuthorityControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FsaService fsaService;

    @Test
    public void localAuthorities() throws Exception {
        final List<FsaAuthority> fsaAuthorityList = List.of(
                new FsaAuthority(1, "one"),
                new FsaAuthority(2, "two"),
                new FsaAuthority(3, "three")
        );
        final FsaAuthorities fsaAuthorities = new FsaAuthorities(fsaAuthorityList);
        when(this.fsaService.fetchAuthorities()).thenReturn(fsaAuthorities);
        for (final String path: Arrays.asList(
                "/api/fsa/localAuthority",
                "/api/fsa/localAuthority/")) {
            this.mockMvc.perform(get(path))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(content().json("{\"localAuthorities\":[{\"localAuthorityId\":1,\"name\":\"one\"},{\"localAuthorityId\":2,\"name\":\"two\"},{\"localAuthorityId\":3,\"name\":\"three\"}]}"))
                    .andExpect(header().string("Content-Type", "application/json"))
                    .andExpect(header().string("Cache-Control", "max-age=" + LocalAuthorityController.MAX_AGE_SECONDS));
        }
    }

    @Test
    public void localAuthority() throws Exception {
        final FsaEstablishments fsaEstablishments = FsaEstablishments.createInstance(
                "1", "1", "1",
                "2", "2",
                "3"
        );
        when(this.fsaService.fetchEstablishments(anyInt())).thenReturn(fsaEstablishments);
        for (final String path: Arrays.asList(
                "/api/fsa/localAuthority/1",
                "/api/fsa/localAuthority/1/")) {
            this.mockMvc.perform(get(path))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(content().json("{\"ratingCounts\":[{\"rating\":\"1-star\",\"count\":3},{\"rating\":\"2-star\",\"count\":2},{\"rating\":\"3-star\",\"count\":1}]}"))
                    .andExpect(header().string("Content-Type", "application/json"))
                    .andExpect(header().string("Cache-Control", "max-age=" + LocalAuthorityController.MAX_AGE_SECONDS));
        }
    }

    @Test
    public void localAuthority_nonNumericId() throws Exception {
        badRequestWithAndWithoutTrailingSlash("/api/fsa/localAuthority/foo");
    }

    @Test
    public void localAuthority_minusOneId() throws Exception {
        badRequestWithAndWithoutTrailingSlash("/api/fsa/localAuthority/-1");
    }

    @Test
    public void localAuthority_integerMinValueId() throws Exception {
        badRequestWithAndWithoutTrailingSlash("/api/fsa/localAuthority/" + Integer.MIN_VALUE);
    }

    @Test
    public void localAuthority_tooLargeId() throws Exception {
        final long tooLargeId = Integer.MAX_VALUE + 1L;
        badRequestWithAndWithoutTrailingSlash("/api/fsa/localAuthority/" + tooLargeId);
    }

    final void badRequestWithAndWithoutTrailingSlash(final String path) throws Exception {
        assertFalse(path, path.endsWith("/"));
        badRequest(path, path + "/");
    }


    final void badRequest(final String... paths) throws Exception {
        for (final String path: paths) {
            this.mockMvc.perform(get(path))
                    .andDo(print())
                    .andExpect(status().isBadRequest());
        }
    }

    @Test
    public void localAuthority_nonExistentId() throws Exception {
        when(this.fsaService.fetchEstablishments(anyInt())).thenReturn(null);
        for (final String path: Arrays.asList(
                "/api/fsa/localAuthority/1234567",
                "/api/fsa/localAuthority/1234567/")) {
            // In reality the underlying API returns an empty list, not a
            // 204 response code.
            this.mockMvc.perform(get(path))
                    .andDo(print())
                    .andExpect(status().isNotFound());
        }
    }

    @Test
    public void localAuthority_hashCodeAndEquality() {
        final int id1 = 123;
        final int id2 = 456;
        final LocalAuthority la1a = new LocalAuthority(id1, "one");
        final LocalAuthority la1b = new LocalAuthority(id1, "one");
        final LocalAuthority la2 = new LocalAuthority(id2, "two");
        assertEquals(la1a.hashCode(), la1b.hashCode());
        assertEquals(la1a.toString(), id1, la1a.hashCode());
        assertEquals(la1b.toString(), id1, la1b.hashCode());
        assertEquals(la2.toString(), id2, la2.hashCode());
        assertEquals(la1a, la1b);
        for (final LocalAuthority localAuthority : Arrays.asList(la1a, la1b, la2)) {
            //noinspection EqualsWithItself
            assertEquals(localAuthority, localAuthority);
            assertNotEquals(localAuthority, null);
            assertNotEquals(localAuthority, new Object());
        }
        assertNotEquals(la1a, la2);
        assertNotEquals(la1b, la2);
    }

    @Test
    public void ratings() throws Exception {
        final List<FsaRating> fsaRatingsList = List.of(
                new FsaRating("one"),
                new FsaRating("two"),
                new FsaRating("three")
        );
        final FsaRatings fsaRatings = new FsaRatings(fsaRatingsList);
        when(this.fsaService.fetchRatings()).thenReturn(fsaRatings);
        for (final String path: Arrays.asList(
                "/api/fsa/ratings",
                "/api/fsa/ratings/")) {
            this.mockMvc.perform(get(path))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(content().json("{\"ratings\":[\"one\",\"two\",\"three\"]}"))
                    .andExpect(header().string("Content-Type", "application/json"))
                    .andExpect(header().string("Cache-Control", "max-age=" + LocalAuthorityController.MAX_AGE_SECONDS));
        }
    }

}
