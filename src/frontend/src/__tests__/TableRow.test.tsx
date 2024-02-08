import { escapeRegExp } from "lodash";
import { RatingPercentage } from "../FSA";
import { TableRow } from "../TableRow";
import { render, screen } from "@testing-library/react";

const matchWholeString = (string: string) => new RegExp("^" + escapeRegExp(string) + "$");

describe("TableRow component", () => {
    it("renders", () => {
        const ratingPercentage : RatingPercentage = {
            rating: "Supercalifragilisticexpialidocious",
            percentage: 23.123
        };
        render(<TableRow ratingPercentage={ratingPercentage}/>);
        const cells = screen.getAllByRole("cell");
        expect(cells.length).toBe(2);
        const [ ratingCell, percentageCell ] = cells;
        expect(ratingCell).toHaveTextContent(matchWholeString(ratingPercentage.rating));
        // The value is rounded to nearest whole percentage.
        expect(percentageCell).toHaveTextContent(matchWholeString('23%'));
    });
});