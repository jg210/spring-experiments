package uk.me.jeremygreen.springexperiments.fsa;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.Semaphore;

public final class FsaService {

    private FsaService() {
        throw new AssertionError();
    }

    private static final String URL = "http://api.ratings.food.gov.uk";

    private static final int MAX_CONNECTIONS = 3;

    private static final Semaphore MAX_CONNECTIONS_SEMAPHORE = new Semaphore(
            MAX_CONNECTIONS,
            /*fair*/true);

    private static final HttpHeaders HEADERS = createHeaders();

    private static HttpHeaders createHeaders() {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("x-api-version", "2");
        httpHeaders.set("Accept", "application/json");
        return HttpHeaders.readOnlyHttpHeaders(httpHeaders);
    }

    private static <T> T fetchFromApi(
            final String url,
            final Class<T> responseClass) throws InterruptedException {
            return fetchFromApi(
                    url,
                    responseClass,
                    /*params*/Collections.emptyMap());
    }

    private static <T> T fetchFromApi(
            final String url,
            final Class<T> responseClass,
            final Map<String,?> params) throws InterruptedException {
        try {
            MAX_CONNECTIONS_SEMAPHORE.acquire();
            final RestTemplate restTemplate = new RestTemplate();
            final HttpEntity entity = new HttpEntity<T>(HEADERS);
            final ResponseEntity<T> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, responseClass, params);
            return response.getBody();
        } finally {
            MAX_CONNECTIONS_SEMAPHORE.release();
        }
    }

    // http://api.ratings.food.gov.uk/Help/Api/GET-Authorities-basic
    // http://api.ratings.food.gov.uk/Authorities/basic
    public static FsaAuthorities fetchAuthorities() throws InterruptedException {
        return fetchFromApi(
                URL + "/Authorities/basic",
                FsaAuthorities.class);
    }

    // http://api.ratings.food.gov.uk/Help/Api/GET-Establishments_name_address_longitude_latitude_maxDistanceLimit_businessTypeId_schemeTypeKey_ratingKey_ratingOperatorKey_localAuthorityId_countryId_sortOptionKey_pageNumber_pageSize
    public static FsaEstablishments fetchEstablishments(final long fsaAuthorityId) throws InterruptedException {
        final Map<String,Object> params = new HashMap<>();
        params.put("localAuthorityId", fsaAuthorityId);
        params.put("pageSize", 0);
        return fetchFromApi(
                URL + "/Establishments?localAuthorityId={localAuthorityId}&pageSize={pageSize}",
                FsaEstablishments.class,
                params);
    }

}
