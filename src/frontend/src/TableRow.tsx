import { RatingPercentage } from "./FSA";

interface TableRowProps {
    ratingPercentage: RatingPercentage;
}

export const TableRow = ({ ratingPercentage }: TableRowProps) => {
    return (
        <tr>
            <td className="tableCell">{ratingPercentage.rating}</td>
            <td style={{ position: "relative" }}>
                <div className="barGraphContainer">
                    <div className="barGraph" data-testid="barGraph" style={{width: `${ratingPercentage.percentage}%`}}/>
                </div>
                {/* tableCell is added here not on td since don't want padding to affect barGraph. */}
                <div className="tableCell">{Math.round(ratingPercentage.percentage)}%</div>
            </td>
        </tr>
    );
};
