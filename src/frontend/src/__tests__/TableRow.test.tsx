import { escapeRegExp } from "lodash";
import { RatingPercentage } from "../FSA";
import { TableRow } from "../TableRow";
import { render, screen, within } from "@testing-library/react";

const matchWholeString = (string: string) => new RegExp("^" + escapeRegExp(string) + "$");

describe("TableRow component", () => {
    it("renders", () => {
        const ratingPercentage : RatingPercentage = {
            rating: "Supercalifragilisticexpialidocious",
            percentage: 23.123
        };
        const { container } = render(
            <table>
                <tbody>
                    <TableRow ratingPercentage={ratingPercentage}/>
                </tbody>
            </table>
        );
        const cells = screen.getAllByRole("cell");
        expect(cells.length).toBe(2);
        const [ ratingCell, percentageCell ] = cells;

        expect(ratingCell).toHaveTextContent(matchWholeString(ratingPercentage.rating));
        expect(ratingCell).toHaveClass("table-cell");

        // The value is rounded to nearest whole percentage.
        expect(percentageCell).toHaveTextContent(matchWholeString('23%'));
        const barGraphContainer = within(percentageCell).getByTestId("barGraphContainer");
        expect(barGraphContainer).toHaveClass("bar-graph-container");
        const barGraph = within(barGraphContainer).getByTestId("barGraph");
        expect(barGraph).toHaveClass("bar-graph");
        expect(barGraph).toHaveStyle({ width: `${ratingPercentage.percentage}%`});

        expect(container).toMatchSnapshot();
    });
});