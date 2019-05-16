package uk.me.jeremygreen.springexperiments.fsa.api;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.mockito.Mockito.when;

import org.mockito.MockitoAnnotations;
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

//    @Before
//    public void setup(){
//        MockitoAnnotations.initMocks(this);
//    }

// TODO FsaService is a MockitoMock, but method not mocked, so get NPE.
//    @Test
//    public void localAuthorities() throws Exception {
//        final List<FsaAuthority> fsaAuthorityList = Collections.unmodifiableList(Arrays.asList(
//                new FsaAuthority(1, "one"),
//                new FsaAuthority(2,"two"),
//                new FsaAuthority(3,"three")
//        ));
//        when(this.fsaService.fetchAuthorities()).thenReturn(new FsaAuthorities(fsaAuthorityList));
//        // TODO Check response headers too.
//        this.mockMvc.perform(get("/api/fsa/localAuthority"))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(content().json("something"));
//    }

}
