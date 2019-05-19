package uk.me.jeremygreen.springexperiments.fsa;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown=true)
public class FsaAuthorities {

    private final List<FsaAuthority> authorities;

    @JsonCreator
    public FsaAuthorities(
            @JsonProperty("authorities")
            final List<FsaAuthority> authorities) {
        this.authorities = authorities;
    }

    public final List<FsaAuthority> getAuthorities() {
        return this.authorities;
    }

}
