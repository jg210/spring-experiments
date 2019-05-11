package uk.me.jeremygreen.springexperiments.fhs.api;

import java.util.Arrays;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path="/api/fhs",
                produces="application/json")
public final class LocalAuthorityController {

  @GetMapping(value="localAuthority")
  public final Iterable<LocalAuthority> localAuthorities() {
    // TODO fetch from http://api.ratings.food.gov.uk/Authorities/basic setting 'x-api-version': 2 and 'Accept': 'application/json' headers
    // http://api.ratings.food.gov.uk/Help/Api/GET-Authorities-basic
    return Arrays.asList(
      new LocalAuthority(1, "Foo"),
      new LocalAuthority(2, "Bar"),
      new LocalAuthority(3, "Baz")
     );
  }

}