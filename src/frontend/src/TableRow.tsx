import { RatingPercentage } from "./FSA";

interface TableRowProps {
    ratingPercentage: RatingPercentage;
}

export const TableRow = ({ ratingPercentage }: TableRowProps) => {
    return (
        <tr>
            <td className="tableCell">{ratingPercentage.rating}</td>
            <td>
                <div className="barGraph" data-testid="barGraph" style={{width: `${ratingPercentage.percentage}%`}}>
                    <div className="tableCell">{Math.round(ratingPercentage.percentage)}%</div>
                </div>
            </td>
        </tr>
    );
};
