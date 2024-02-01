import { Establishments, ratingsPercentages } from "../FSA";

describe("FSA", () => {

    describe("ratingsPercentages", () => {
        it("no ratings", () => {
            const establishements: Establishments = {
                ratingCounts : []
            };
            expect(ratingsPercentages(establishements)).toStrictEqual([]);
        });
        it("one rating", () => {
            const establishements: Establishments = {
                ratingCounts : [
                    { rating: "good", count: 14234 }
                ]
            };
            expect(ratingsPercentages(establishements)).toStrictEqual([
                { rating: "good", percentage: 100 }
            ]);
        });
        it("one rating but zero count", () => {
            const establishements: Establishments = {
                ratingCounts : [
                    { rating: "good", count: 0 }
                ]
            };
            expect(ratingsPercentages(establishements)).toStrictEqual([
                { rating: "good", percentage: NaN }
            ]);
        });
        it("two ratings", () => {
            const establishements: Establishments = {
                ratingCounts : [
                    { rating: "good", count: 750 },
                    { rating: "bad", count: 250 }
                ]
            };
            expect(ratingsPercentages(establishements)).toStrictEqual([
                { rating: "good", percentage: 75 },
                { rating: "bad",  percentage: 25 }
            ]);
        });
        it("two ratings both zero count", () => {
            const establishements: Establishments = {
                ratingCounts : [
                    { rating: "good", count: 0 },
                    { rating: "bad", count: 0 }
                ]
            };
            expect(ratingsPercentages(establishements)).toStrictEqual([
                { rating: "good", percentage: NaN },
                { rating: "bad",  percentage: NaN }
            ]);
        });
        it("two ratings one zero count", () => {
            const establishements: Establishments = {
                ratingCounts : [
                    { rating: "good", count: 234234 },
                    { rating: "bad", count: 0 }
                ]
            };
            expect(ratingsPercentages(establishements)).toStrictEqual([
                { rating: "good", percentage: 100 },
                { rating: "bad",  percentage: 0 }
            ]);
        });
        it("multiple ratings", () => {
            const establishements: Establishments = {
                ratingCounts : [
                    { rating: "good", count: 230 },
                    { rating: "bad",  count: 500 },
                    { rating: "ugly", count: 270 }
                ]
            };
            expect(ratingsPercentages(establishements)).toStrictEqual([
                { rating: "good", percentage: 23 },
                { rating: "bad",  percentage: 50 },
                { rating: "ugly", percentage: 27 }
            ]);
        });
    });

});