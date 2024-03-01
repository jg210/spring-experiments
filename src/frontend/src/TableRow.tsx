import { RatingPercentage } from "./FSA";

interface TableRowProps {
    ratingPercentage: RatingPercentage;
}

export const TableRow = ({ ratingPercentage }: TableRowProps) => {
    return (
        <tr>
            <td className="table-cell">{ratingPercentage.rating}</td>
            <td>
                <div className="bar-graph-container" data-testid="barGraphContainer">
                    <div className="bar-graph" data-testid="barGraph" style={{width: `${ratingPercentage.percentage}%`}}/>
                </div>
                {/* tableCell is added here not on td since don't want padding to affect barGraph. */}
                <div className="table-cell">{Math.round(ratingPercentage.percentage)}%</div>
            </td>
        </tr>
    );
};
