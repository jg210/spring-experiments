package uk.me.jeremygreen.springexperiments.fsa.api;

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

  @Override
  public final int hashCode() {
    return this.localAuthorityId;
  }

  @Override
  public final boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof LocalAuthority)) {
      return false;
    }
    final LocalAuthority that = (LocalAuthority) o;
    return localAuthorityId == that.localAuthorityId;
  }

  @Override
  public final String toString() {
    return this.name + "(" + this.localAuthorityId + ")";
  }

}