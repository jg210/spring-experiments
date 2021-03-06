import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';

const RATINGS_URL = "/api/fsa";

interface Establishments {
  ratingCounts: RatingCount[]
}

interface RatingCount {
    rating: string,
    count: number
}

export interface RatingPercentage {
  rating: string,
  percentage: number
}

export interface LocalAuthority {
    name: string,
    localAuthorityId: number
}

export interface LocalAuthorities {
    localAuthorities: LocalAuthority[]
}

// http://api.ratings.food.gov.uk/help
function fetchFromAPI<T>(url: string, cancelTokenSource: CancelTokenSource | null = null): Promise<T> {
    const config: AxiosRequestConfig = {
        headers: {
            'Accept': 'application/json'
        }
    };
    if (!(cancelTokenSource === null)) {
        config.cancelToken = cancelTokenSource.token;
    }
    return axios.get<T>(url, config).then(response => response.data);
}

export function fetchLocalAuthoritiesJson(): Promise<LocalAuthority[]> {
    const localAuthorities: Promise<LocalAuthorities> = fetchFromAPI(`${RATINGS_URL}/localAuthority`);
    return localAuthorities.then((x: LocalAuthorities) => { return x.localAuthorities });
}

export function fetchEstablishmentsJson(
    localAuthorityId: number,
    cancelTokenSource: CancelTokenSource): Promise<Establishments> {
    const url = `${RATINGS_URL}/localAuthority/${encodeURIComponent(localAuthorityId.toString())}`;
    return fetchFromAPI(url, cancelTokenSource);
}

export function ratingsPercentages(establishments: Establishments): RatingPercentage[] {
    const ratingCounts: RatingCount[] = establishments.ratingCounts;
    let totalCount = 0;
    ratingCounts.forEach((ratingCount: RatingCount) => { totalCount += ratingCount.count});
    return ratingCounts.map((ratingCount: RatingCount) => { 
        const rating = ratingCount.rating;
        const percentage = 100 * ratingCount.count / totalCount;
        return { rating, percentage }
    });
}
