import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// node.js unit tests can't use relative URLs. Development and production both use
// relative URL since it's same host that runs server and front end.
export const RATINGS_URL = process.env.NODE_ENV === "test" ? "http://example.com/api/fsa" : "/api/fsa";

export const RATINGS_POLLING_INTERVAL_MS = 15 * 60 * 1000;

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

// Convert counts to percentages.
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

// http://api.ratings.food.gov.uk/help
export const fsaApi = createApi({
  reducerPath: 'fsaApi',
  baseQuery: fetchBaseQuery({ baseUrl: RATINGS_URL }),
  endpoints: (builder) => ({
    getLocalAuthorities: builder.query<LocalAuthority[], void>({
      query: () => `localAuthority`,
      transformResponse: (response: LocalAuthorities) => response.localAuthorities
    }),
    getEstablishments: builder.query<Establishments,number>({
      query: (localAuthorityId) => `localAuthority/${encodeURIComponent(localAuthorityId.toString())}`
    })
  })
});

export const { useGetLocalAuthoritiesQuery, useGetEstablishmentsQuery } = fsaApi;