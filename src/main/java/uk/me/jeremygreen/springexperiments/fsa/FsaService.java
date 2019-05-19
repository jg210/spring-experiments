package uk.me.jeremygreen.springexperiments.fsa;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.Semaphore;

@Service
public class FsaService {

    private static final HttpHeaders HEADERS = createHeaders();

    private static HttpHeaders createHeaders() {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("x-api-version", "2");
        httpHeaders.set("Accept", "application/json");
        return HttpHeaders.readOnlyHttpHeaders(httpHeaders);
    }

    private final String url;
    private final Semaphore maxConnectionsSemaphore;

    public FsaService() {
        this("http://api.ratings.food.gov.uk");
    }

    FsaService(final String url) {
        this(url, 3);
    }

    private FsaService(final String url, final int maxConnections) {
       this.url = url;
       this.maxConnectionsSemaphore = new Semaphore(
                maxConnections,
                /*fair*/true);
    }

    private final <T> ResponseEntity<T> fetchFromApi(
            final String url,
            final Class<T> responseClass) throws InterruptedException {
            return fetchFromApi(
                    url,
                    responseClass,
                    /*params*/Collections.emptyMap());
    }

    private final <T> ResponseEntity<T> fetchFromApi(
            final String url,
            final Class<T> responseClass,
            final Map<String,?> params) throws InterruptedException {
        try {
            this.maxConnectionsSemaphore.acquire();
            final RestTemplate restTemplate = new RestTemplate();
            final HttpEntity entity = new HttpEntity<T>(HEADERS);
            final ResponseEntity<T> responseEntity = restTemplate.exchange(
                    url, HttpMethod.GET, entity, responseClass, params);
            if (responseEntity.getStatusCode().isError()) {
                throw new RestClientException(responseEntity.toString());
            }
            return responseEntity;
        } finally {
            this.maxConnectionsSemaphore.release();
        }
    }

    // http://api.ratings.food.gov.uk/Help/Api/GET-Authorities-basic
    // http://api.ratings.food.gov.uk/Authorities/basic
    public FsaAuthorities fetchAuthorities() throws InterruptedException {
        return fetchFromApi(
                this.url + "/Authorities/basic",
                FsaAuthorities.class).getBody();
    }

    // http://api.ratings.food.gov.uk/Help/Api/GET-Establishments_name_address_longitude_latitude_maxDistanceLimit_businessTypeId_schemeTypeKey_ratingKey_ratingOperatorKey_localAuthorityId_countryId_sortOptionKey_pageNumber_pageSize
    public FsaEstablishments fetchEstablishments(final int fsaAuthorityId) throws InterruptedException {
        if (fsaAuthorityId < 0) {
            throw new IllegalArgumentException(Integer.toString(fsaAuthorityId));
        }
        final Map<String,Object> params = new HashMap<>();
        params.put("localAuthorityId", fsaAuthorityId);
        params.put("pageSize", 0); // Use maximum page size.
        final ResponseEntity<FsaEstablishments> responseEntity = fetchFromApi(
                this.url + "/Establishments?localAuthorityId={localAuthorityId}&pageSize={pageSize}",
                FsaEstablishments.class,
                params);
        if (HttpStatus.NOT_FOUND.equals(responseEntity.getStatusCode())) {
            // The underlying API returns an empty list of establishments
            // if the fsaAuthorityId is not known, not a NOT_FOUND HTTP
            // response code.
            return null;
        }
        return responseEntity.getBody();
    }

}
