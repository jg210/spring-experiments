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
import uk.me.jeremygreen.springexperiments.fsa.FsaAuthorities;
import uk.me.jeremygreen.springexperiments.fsa.FsaAuthority;
import uk.me.jeremygreen.springexperiments.fsa.FsaEstablishments;
import uk.me.jeremygreen.springexperiments.fsa.FsaService;

import java.util.Arrays;
import java.util.Collections;
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
        final List<FsaAuthority> fsaAuthorityList = Collections.unmodifiableList(Arrays.asList(
                new FsaAuthority(1, "one"),
                new FsaAuthority(2,"two"),
                new FsaAuthority(3,"three")
        ));
        final FsaAuthorities fsaAuthorities = new FsaAuthorities(fsaAuthorityList);
        when(this.fsaService.fetchAuthorities()).thenReturn(fsaAuthorities);
        for (final String path: Arrays.asList(
                "/api/fsa/localAuthority",
                "/api/fsa/localAuthority/")) {
            this.mockMvc.perform(get(path))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(content().json("{\"localAuthorities\":[{\"localAuthorityId\":1,\"name\":\"one\"},{\"localAuthorityId\":2,\"name\":\"two\"},{\"localAuthorityId\":3,\"name\":\"three\"}]}"))
                    .andExpect(header().string("Content-Type", "application/json;charset=UTF-8"));
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
                    .andExpect(header().string("Content-Type", "application/json;charset=UTF-8"));
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
        badRequestWithAndWithoutTrailingSlash("/api/fsa/localAuthority/" + Integer.MAX_VALUE + 1);
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

}
