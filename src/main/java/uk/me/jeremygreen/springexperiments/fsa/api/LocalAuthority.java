package uk.me.jeremygreen.springexperiments.fsa.api;

public final class LocalAuthority {

  private final int localAuthorityId;
  private final String name;

  LocalAuthority(final int localAuthorityId, final String name) {
    this.localAuthorityId = localAuthorityId;
    this.name = name;
  }

  @SuppressWarnings("unused")
  public int getLocalAuthorityId() {
    return this.localAuthorityId;
  }

  @SuppressWarnings("unused")
  public String getName() {
    return this.name;
  }

  @Override
  public int hashCode() {
    return this.localAuthorityId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o instanceof LocalAuthority that) {
      return localAuthorityId == that.localAuthorityId;
    }
    return false;
  }

  @Override
  public String toString() {
    return this.name + "(" + this.localAuthorityId + ")";
  }

}