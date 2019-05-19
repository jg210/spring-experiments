package uk.me.jeremygreen.springexperiments.fsa;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public final class FsaAuthority {

    private final int id;
    private final String name;

    @JsonCreator
    public FsaAuthority(
            @JsonProperty("LocalAuthorityId")
            final int id,
            @JsonProperty("Name")
            final String name) {
        if (id < 0) {
            throw new IllegalArgumentException(Integer.toString(id));
        }
        if (name == null) {
            throw new NullPointerException();
        }
        this.id = id;
        this.name = name;
    }

    public final int getId() {
        return this.id;
    }

    public final String getName() {
        return this.name;
    }

}
