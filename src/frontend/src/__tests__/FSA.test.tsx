import {
    extractLocalAuthorities,
    formatRating,
    ratingsPercentages,
    RatingPercentage
} from '../FSA'
import _ from 'lodash';

// README.md explains how these json files were downloaded.
const AUTHORITIES_JSON = require('../../example_json/authorities.json');
const ESTABLISHMENTS_JSON = require('../../example_json/establishments_23.json');

it('extracts local authorities from json', () => {
    const localAuthorities = extractLocalAuthorities(AUTHORITIES_JSON);
    expect(localAuthorities.length).toEqual(392);
    expect(localAuthorities[7]).toEqual({
        "localAuthorityId": 132,
        "name": "Antrim and Newtownabbey"
    });
});

it('extracts unique local authority ids from json', () => {
    const localAuthorities = extractLocalAuthorities(AUTHORITIES_JSON);
    const localAuthorityIds = new Set(
        localAuthorities.map(localAuthority => localAuthority.localAuthorityId)
    );
    expect(localAuthorityIds.size).toEqual(localAuthorities.length);
});

function checkRatingPercentages(
    ratingPercentages: RatingPercentage[],
    ratingsExpected: string[],
    percentagesExpected: number[]) {
    expect(ratingsExpected.length).toEqual(percentagesExpected.length);
    const ratings = ratingPercentages.map(rating_percentage => rating_percentage.rating);
    expect(ratings).toEqual(ratingsExpected);
    const percentages = ratingPercentages.map(rating_percentage => rating_percentage.percentage);
    _.zip(percentages, percentagesExpected).forEach((pair) => {
        const percentage: number | undefined = pair[0];
        const percentageExpected: number | undefined = pair[1];
        if (percentage === undefined || percentageExpected === undefined) {
            throw new Error(`percentages: ${percentages} percentagesExpected: ${percentagesExpected}`);
        }
        expect(percentage).toBeCloseTo(percentageExpected, /*numDigits*/3);
    });
    expect(percentages.length).toEqual(percentagesExpected.length);
}

it('calculates expected percentages for local authority with no ratings', () => {
    const ratingPercentages = ratingsPercentages({
        "establishments": [
        ]
    });
    checkRatingPercentages(ratingPercentages,
        [],
        []);
});

it('calculates expected percentages for local authority with one establishment', () => {
    const ratingPercentages = ratingsPercentages({
        "establishments": [
            {
                "RatingValue": "5",
            }
        ]
    }); // Relevant part of json extracted from establishments_23.json with jq tool.
    checkRatingPercentages(ratingPercentages,
        ["5-star"],
        [100.000]);
});


it('calculates expected percentages for local authority with one rating', () => {
    const ratingPercentages = ratingsPercentages({
        "establishments": [
            {
                "RatingValue": "5",
            },
            {
                "RatingValue": "5",
            },
            {
                "RatingValue": "5",
            }
        ]
    });
    checkRatingPercentages(ratingPercentages,
        ["5-star"],
        [100.000]);
});

it('calculates expected percentages for local authority with one rating', () => {
    const ratingPercentages = ratingsPercentages({
        "establishments": [
            {
                "RatingValue": "5",
            },
            {
                "RatingValue": "3",
            },
        ]
    });
    checkRatingPercentages(ratingPercentages,
        ["3-star", "5-star"],
        [50.0, 50.0]);
});

it('calculates expected percentages for local authority id 23', () => {
    const ratingPercentages = ratingsPercentages(ESTABLISHMENTS_JSON);
    checkRatingPercentages(ratingPercentages,
        [
            "0-star",
            "1-star",
            "2-star",
            "3-star",
            "4-star",
            "5-star",
            "Awaiting Inspection",
            "Exempt"
        ],
        [
            0.220,
            1.317,
            1.976,
            8.233,
            17.563,
            63.337,
            0.659,
            6.696
        ]);
});

it('formats ratings properly', () => {
    expect(formatRating("0")).toEqual("0-star");
    expect(formatRating("1")).toEqual("1-star");
    expect(formatRating("2")).toEqual("2-star");
    expect(formatRating("3")).toEqual("3-star");
    expect(formatRating("4")).toEqual("4-star");
    expect(formatRating("5")).toEqual("5-star");
    expect(formatRating("5")).toEqual("5-star");
    expect(formatRating("foo")).toEqual("foo");
    expect(formatRating("Awaiting Inspection")).toEqual("Awaiting Inspection");
    expect(formatRating("AwaitingInspection")).toEqual("Awaiting Inspection");
    expect(formatRating("Awaiting Publication")).toEqual("Awaiting Publication");
    expect(formatRating("AwaitingPublication")).toEqual("Awaiting Publication");
    expect(formatRating("Exempt")).toEqual("Exempt");
});

export default undefined