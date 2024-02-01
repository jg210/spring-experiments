import { Establishments, ratingsPercentages } from "../FSA";

describe("FSA", () => {

    describe("ratingsPercentages", () => {

        it("no establishments", () => {
            const establishements: Establishments = {
                ratingCounts : []
            };
            expect(ratingsPercentages(establishements)).toStrictEqual([]);
        });

    });

});