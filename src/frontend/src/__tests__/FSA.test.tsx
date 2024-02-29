import { Establishments, BASE_URL, ratingsPercentages, baseUrl } from "../FSA";

describe("FSA", () => {

    describe("baseUrl()", () => {
        const unmockedProcessEnv = process.env;
        afterEach(() => {
            process.env = unmockedProcessEnv;
        });
        it("isn't relative when running unit tests", () => {
            expect(baseUrl().startsWith("http://")).toBe(true);
        });
        it("is relative when running in production", () => {
            process.env = { ...process.env };
            delete process.env.NODE_ENV;
            expect(baseUrl().startsWith("/")).toBe(true);
        });
    });

    describe("BASE_URL", () => {
        it("isn't relative when running unit tests", () => {
            expect(BASE_URL).toMatch(/^http:/);
        });
    });

    describe("ratingsPercentages", () => {
        const epochMillis: number = new Date("February 14, 2024 20:15:00").getTime();
        it("no ratings at all", () => {
            const allRatings: string[] = [];
            const establishements: Establishments = {
                epochMillis,
                ratingCounts : []
            };
            expect(ratingsPercentages(establishements, allRatings)).toStrictEqual([]);
        });
        it("no ratings but some in allRatings", () => {
            const allRatings: string[] = [ "x", "b", "q" ];
            const establishements: Establishments = {
                epochMillis,
                ratingCounts : []
            };
            expect(ratingsPercentages(establishements, allRatings)).toStrictEqual([
                { rating: "b", percentage: NaN },
                { rating: "q", percentage: NaN },
                { rating: "x", percentage: NaN }
            ]);
        });
        it("one rating not in allRatings", () => {
            const allRatings: string[] = [];
            const establishements: Establishments = {
                epochMillis,
                ratingCounts : [
                    { rating: "good", count: 14234 }
                ]
            };
            expect(ratingsPercentages(establishements, allRatings)).toStrictEqual([
                { rating: "good", percentage: 100 }
            ]);
        });
        it("one rating in allRatings", () => {
            const allRatings: string[] = ["good"];
            const establishements: Establishments = {
                epochMillis,
                ratingCounts : [
                    { rating: "good", count: 14234 }
                ]
            };
            expect(ratingsPercentages(establishements, allRatings)).toStrictEqual([
                { rating: "good", percentage: 100 }
            ]);
        });
        it("one rating but zero count", () => {
            const allRatings: string[] = ["good"];
            const establishements: Establishments = {
                epochMillis,
                ratingCounts : [
                    { rating: "good", count: 0 }
                ]
            };
            expect(ratingsPercentages(establishements, allRatings)).toStrictEqual([
                { rating: "good", percentage: NaN }
            ]);
        });
        it("two ratings", () => {
            const allRatings: string[] = ["good", "bad"];
            const establishements: Establishments = {
                epochMillis,
                ratingCounts : [
                    { rating: "good", count: 750 },
                    { rating: "bad", count: 250 }
                ]
            };
            expect(ratingsPercentages(establishements, allRatings)).toStrictEqual([
                { rating: "bad",  percentage: 25 },
                { rating: "good", percentage: 75 }
            ]);
        });
        it("two ratings both zero count", () => {
            const allRatings: string[] = ["good", "bad"];
            const establishements: Establishments = {
                epochMillis,
                ratingCounts : [
                    { rating: "good", count: 0 },
                    { rating: "bad", count: 0 }
                ]
            };
            expect(ratingsPercentages(establishements, allRatings)).toStrictEqual([
                { rating: "bad",  percentage: NaN },
                { rating: "good", percentage: NaN }
            ]);
        });
        it("two ratings one zero count", () => {
            const allRatings: string[] = ["good", "bad"];
            const establishements: Establishments = {
                epochMillis,
                ratingCounts : [
                    { rating: "good", count: 234234 },
                    { rating: "bad", count: 0 }
                ]
            };
            expect(ratingsPercentages(establishements, allRatings)).toStrictEqual([
                { rating: "bad",  percentage: 0 },
                { rating: "good", percentage: 100 }
            ]);
        });
        it("multiple ratings", () => {
            const allRatings = [ "good", "bad", "ugly"];
            const establishements: Establishments = {
                epochMillis,
                ratingCounts : [
                    { rating: "good", count: 230 },
                    { rating: "bad",  count: 500 },
                    { rating: "ugly", count: 270 }
                ]
            };
            expect(ratingsPercentages(establishements, allRatings)).toStrictEqual([
                { rating: "bad",  percentage: 50 },
                { rating: "good", percentage: 23 },
                { rating: "ugly", percentage: 27 }
            ]);
        });
    });

});