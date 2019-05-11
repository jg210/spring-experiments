package uk.me.jeremygreen.springexperiments.fhs.api;

public final class LocalAuthority {

  private final int localAuthorityId;
  private final String name;

  LocalAuthority(final int localAuthorityId, final String name) {
    this.localAuthorityId = localAuthorityId;
    this.name = name;
  }

  public final int getLocalAuthorityId() {
    return this.localAuthorityId;
  }

  public final String getName() {
    return this.name;
  }

}