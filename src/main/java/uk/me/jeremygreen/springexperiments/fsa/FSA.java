package uk.me.jeremygreen.springexperiments.fsa;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import uk.me.jeremygreen.springexperiments.fsa.api.LocalAuthority;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class FSA {

    private static final String URL = "http://api.ratings.food.gov.uk";

    private static final HttpHeaders HEADERS = createHeaders();

    private static HttpHeaders createHeaders() {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("x-api-version", "2");
        httpHeaders.set("Accept", "application/json");
        return HttpHeaders.readOnlyHttpHeaders(httpHeaders);
    }

    private static <T> T fetchFromApi(final String url, Class<T> responseClass)  {
        final RestTemplate restTemplate = new RestTemplate();
        final HttpEntity entity = new HttpEntity<T>(HEADERS);
        final ResponseEntity<T> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, responseClass);
        return response.getBody();
    }

    // http://api.ratings.food.gov.uk/Help/Api/GET-Authorities-basic
    // http://api.ratings.food.gov.uk/Authorities/basic
    public static List<FsaAuthority> fetchAuthorities() {
        final FsaAuthorities fsaAuthorities = fetchFromApi(
                URL + "/Authorities/basic",
                FsaAuthorities.class);
        return Collections.unmodifiableList(fsaAuthorities.getAuthorities());
    }

//    // http://api.ratings.food.gov.uk/Help/Api/GET-Establishments_name_address_longitude_latitude_maxDistanceLimit_businessTypeId_schemeTypeKey_ratingKey_ratingOperatorKey_localAuthorityId_countryId_sortOptionKey_pageNumber_pageSize
//    export function fetchEstablishmentsJson(
//            localAuthorityId: number,
//            cancelTokenSource: CancelTokenSource): Promise<any> {
//    const url = `${RATINGS_URL}/Establishments?localAuthorityId=${encodeURIComponent(localAuthorityId.toString())}&pageSize=0`;
//        return fetchFromAPI(url, cancelTokenSource);
//    }
//
//    export function ratingsPercentages(establishmentsJson: any): RatingPercentage[] {
//    const ratingCounts = new Map<string,number>();
//        let totalCount = 0;
//        establishmentsJson.establishments.forEach((establishment: {RatingValue: string}) => {
//        const rating = formatRating(establishment.RatingValue);
//            let oldCount = ratingCounts.get(rating);
//            if (oldCount === undefined) {
//                oldCount = 0;
//            }
//            ratingCounts.set(rating, oldCount + 1);
//            totalCount++;
//        });
//    const result: RatingPercentage[] = [];
//        ratingCounts.forEach((ratingCount: number, rating: string) => {
//            result.push({
//                    rating: rating,
//                    percentage: 100 * ratingCount / totalCount
//        });
//        });
//        return _.sortBy(result, "rating");
//    }
//
//    // Convert "RatingValue" from Establishments API to human-readable String.
//    export function formatRating(ratingValue: string): string {
//        if (ratingValue === "AwaitingInspection") {
//            return "Awaiting Inspection";
//        }
//        if (ratingValue === "AwaitingPublication") {
//            return "Awaiting Publication";
//        }
//        if (/^[0-9]+$/.test(ratingValue)) {
//            return `${ratingValue}-star`;
//        }
//        return ratingValue;
//    }

}
