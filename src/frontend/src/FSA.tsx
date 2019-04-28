import axios, { CancelTokenSource, AxiosRequestConfig, AxiosResponse } from 'axios';

import _ from 'lodash';

const RATINGS_URL = "http://api.ratings.food.gov.uk";

export interface RatingPercentage {
    rating: string,
    percentage: number
}

export interface LocalAuthority {
    name: string,
    localAuthorityId: number
}

// http://api.ratings.food.gov.uk/help
function fetchFromAPI(url: string, cancelTokenSource: CancelTokenSource | null = null): Promise<AxiosResponse<any>> {
    const config: AxiosRequestConfig = {
        headers: {
            'Accept': 'application/json',
            'x-api-version': 2
        }
    };
    if (!(cancelTokenSource === null)) {
        config.cancelToken = cancelTokenSource.token;
    }
    return axios.get(url, config).then(response => response.data);
}

// http://api.ratings.food.gov.uk/Help/Api/GET-Authorities-basic
export function fetchLocalAuthoritiesJson(): Promise<AxiosResponse<any>> {
    return fetchFromAPI(`${RATINGS_URL}/Authorities/basic`);
}

// http://api.ratings.food.gov.uk/Help/Api/GET-Establishments_name_address_longitude_latitude_maxDistanceLimit_businessTypeId_schemeTypeKey_ratingKey_ratingOperatorKey_localAuthorityId_countryId_sortOptionKey_pageNumber_pageSize
export function fetchEstablishmentsJson(
    localAuthorityId: number,
    cancelTokenSource: CancelTokenSource): Promise<AxiosResponse<any>> {
    const url = `${RATINGS_URL}/Establishments?localAuthorityId=${encodeURIComponent(localAuthorityId.toString())}&pageSize=0`;
    return fetchFromAPI(url, cancelTokenSource);
}

export function extractLocalAuthorities(json: any): LocalAuthority[] {
    return json.authorities.map((authority: {Name: string, LocalAuthorityId: number}) => ({
        name: authority.Name,
        localAuthorityId: authority.LocalAuthorityId
    }));
}

export function ratingsPercentages(establishmentsJson: any): RatingPercentage[] {
    const ratingCounts = new Map<string,number>();
    let totalCount = 0;
    establishmentsJson.establishments.forEach((establishment: {RatingValue: string}) => {
        const rating = formatRating(establishment.RatingValue);
        let oldCount = ratingCounts.get(rating);
        if (oldCount === undefined) {
            oldCount = 0;
        }
        ratingCounts.set(rating, oldCount + 1);
        totalCount++;
    });
    const result: RatingPercentage[] = [];
    ratingCounts.forEach((ratingCount: number, rating: string) => {
        result.push({
             rating: rating,
             percentage: 100 * ratingCount / totalCount
        });
    });
    return _.sortBy(result, "rating");
}

// Convert "RatingValue" from Establishments API to human-readable String.
export function formatRating(ratingValue: string): string {
    if (ratingValue === "AwaitingInspection") {
        return "Awaiting Inspection";
    }
    if (ratingValue === "AwaitingPublication") {
        return "Awaiting Publication";
    }
    if (/^[0-9]+$/.test(ratingValue)) {
        return `${ratingValue}-star`;
    }
    return ratingValue;
}