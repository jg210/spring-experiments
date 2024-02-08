import axios, { AxiosRequestConfig } from 'axios';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const RATINGS_URL = "/api/fsa";

export interface Establishments {
  ratingCounts: RatingCount[]
}

export interface RatingCount {
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
function fetchFromAPI<T>(url: string, abortController: AbortController): Promise<T> {
    const config: AxiosRequestConfig = {
        headers: {
            'Accept': 'application/json'
        },
        signal: abortController.signal
    };
    return axios.get<T>(url, config).then(response => response.data);
}

export function fetchEstablishmentsJson(
    localAuthorityId: number,
    abortController: AbortController): Promise<Establishments> {
    const url = `${RATINGS_URL}/localAuthority/${encodeURIComponent(localAuthorityId.toString())}`;
    return fetchFromAPI(url, abortController);
}

export function ratingsPercentages(establishments: Establishments): RatingPercentage[] {
    const ratingCounts: RatingCount[] = establishments.ratingCounts;
    let totalCount = 0;
    ratingCounts.forEach((ratingCount: RatingCount) => { totalCount += ratingCount.count});
    return ratingCounts.map((ratingCount: RatingCount) => { 
        const rating = ratingCount.rating;
        const percentage = 100 * ratingCount.count / totalCount;
        return { rating, percentage };
    });
}


export const fsaApi = createApi({
  reducerPath: 'fsaApi',
  baseQuery: fetchBaseQuery({ baseUrl: RATINGS_URL }),
  endpoints: (builder) => ({
    getLocalAuthorities: builder.query<LocalAuthority[], void>({
      query: () => `localAuthority`,
      transformResponse: (response: LocalAuthorities) => response.localAuthorities
    }),
  }),
});

export const { useGetLocalAuthoritiesQuery } = fsaApi;